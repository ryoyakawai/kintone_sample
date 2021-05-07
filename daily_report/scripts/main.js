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
      _LABEL_NAME: 'Label',
      _DATE: 'Date',
      _CONTENT_TODAY: '今日やったこと',
      _CONTENT_NEXT: '明日やること',
      _COMMENT: '所感'
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

    // APP_ID=2(ラベル)のレコードを取得する
    const APP_ID = 2
    const paramForGet = {
      'app': APP_ID
    }
    try {
      const _LABEL_MASTER_REFER_COLUMN_NAME = 'Labelマスタ'
      const resp = await kintone.api(kintone.api.url('/k/v1/records', true), 'GET', paramForGet)
      console.log('[ラベルのレコード]', resp)

      /*
      // [DOES NOT WORK]
      // https://developer.cybozu.io/hc/ja/articles/900001314606-kintone-%E3%81%AE%E3%83%86%E3%83%BC%E3%83%96%E3%83%AB%E3%81%AE%E3%83%87%E3%83%BC%E3%82%BF%E3%82%92%E5%88%A5%E3%82%A2%E3%83%97%E3%83%AA%E3%81%8B%E3%82%89%E5%8F%82%E7%85%A7%E3%81%97%E3%82%88%E3%81%86
      const labelMasterReferRecords = resp.records
      if (labelMasterReferRecords.length === 0) {
        throw new Error('ERROR')
      }
      console.log(labelMasterReferRecords[0])
      console.log(labelMasterReferRecords[0]['日報のラベルマスタ'])

      const tableRows = labelMasterReferRecords[0].value
      const tableRef = document.getElementById('table')
      tableRows.forEach((row) => {
        const tableRow = tableRef.insertRow(-1)
        Object.keys(obj_label).forEach( key => {
          tableRow.insertCell(-1).appendChild(document.createTextNode(row.value[key].value))
        })
      })
      */
    } catch (err) {
      console.log('ERROR', err)
      return event
    }
    return event
  })

})()
