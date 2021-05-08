(async () => {
  'use strict'
  console.log('[loaded] main.js is loaded')
  console.log('[kintone object]', kintone)

  kintone.events.on('app.record.index.show', function(event) {
    console.log('[Fired] app.record.index.show: レコード一覧画面の表示後イベント')
    console.log('https://developer.cybozu.io/hc/ja/articles/201941964#step1')
  })

  kintone.events.on('app.record.detail.show', async function(event) {
    console.log('[Fired] app.record.detail.show: レコード詳細画面の表示後イベント')
    console.log('https://developer.cybozu.io/hc/ja/articles/201941974#step1')
    console.log(`[info] 表示しているRecordのID=[${kintone.app.record.getId()}]`)

    // Label Name
    const obj_label = {
      _LABEL_NAME: 'Lookup_LabelMaster',
      _DATE: 'Date',
      _CONTENT_TODAY: 'Today_Text_area',
      _CONTENT_NEXT: 'Tomorrow_Text_area',
      _COMMENT: 'Comment_Text_area'
    }
    let tableHTML = '<tbody><thead><tr>'
    Object.keys(obj_label).forEach( key => {
      tableHTML += `<th>${obj_label[key]}</th>`
    })
    tableHTML += '</tr></thead></tbody>'

    const tableElem = document.createElement('table')
    tableElem.setAttribute('id', 'table')
    tableElem.setAttribute('border', '1')
    tableElem.style.setProperty('textAlign', 'center')
    tableElem.style.setProperty('padding', '10px')
    tableElem.insertAdjacentHTML('afterbegin', tableHTML)
    kintone.app.record.getSpaceElement('tableSpace').appendChild(tableElem)


    // 日報アプリのサブテーブルオブジェクトを取得
    const dailyReportAppRecord = event.record
    //const tableRows = dailyReportAppRecord[_LABEL_NAME]
    console.log('[event.records]', dailyReportAppRecord)

    // APP_ID=1(ラベル)のレコードを取得する
    const APP_ID = 1
    const paramForGet = {
      'app': APP_ID
    }

    try {
      const _LABEL_MASTER_REFER_COLUMN_NAME = 'Labelマスタ'
      const resp = await kintone.api(kintone.api.url('/k/v1/records', true), 'GET', paramForGet)

      // [kintone のテーブルのデータを別アプリから参照しよう – cybozu developer network]
      // https://bit.ly/33pME7p
      // show contents in same app
      const labelMasterReferRecords = resp.records
      if (labelMasterReferRecords.length === 0) {
        throw new Error('ERROR')
      }

      const tableRows = labelMasterReferRecords
      const tableRef = document.getElementById('table')
      tableRows.forEach((row) => {
        const tableRow = tableRef.insertRow(-1)
        Object.keys(obj_label).forEach( key => {
          tableRow.insertCell(-1).appendChild(document.createTextNode(row[obj_label[key]].value))
        })
      })

    } catch (err) {
      console.log('ERROR', err)
      return event
    }
    return event
  })

})()
