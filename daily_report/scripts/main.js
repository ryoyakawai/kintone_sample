(async () => {
  'use strict'
  console.log('[loaded] main.js is loaded')
  console.log('[kintone object]', kintone)
  const _APP_ID_ = 1

  const fetchRecords = async (params = {}) => {
    if (Object.keys(params).length < 1
        || typeof params.app_id == 'undefined') {
      throw new Error(`[Params is invalid] ${JSON.stringify(params)}`)
    }
    const paramForGet = {
      'app': params.app_id
    }
    return await kintone.api(kintone.api.url('/k/v1/records', true), 'GET', paramForGet)
  }

  kintone.events.on('app.record.index.show', function(event) {
    console.log('[Fired] app.record.index.show: レコード一覧画面の表示後イベント')
    console.log('https://developer.cybozu.io/hc/ja/articles/201941964#step1')
  })

  kintone.events.on('app.record.create.show', async function(event) {
    console.log('[Fired] app.record.create.show: レコード追加画面の表示後イベント')
    console.log('https://developer.cybozu.io/hc/ja/articles/201941984#step1')

    const fetch_params = { app_id: _APP_ID_ }
    const resp = await fetchRecords(fetch_params)
    console.log(resp.records)
    let latest_item = {
      id: 0,
      idx : null
    }
    for(let i=0; i<resp.records.length; i++) {
      const item = resp.records[i]
      if (Number(item['$id'].value) > latest_item.id) {
        latest_item = {
          id: Number(item['$id'].value),
          idx: i
        }
      }
    }
    console.log(`[info] 最も新しいRecord id=[${latest_item.id}] idx=[${latest_item.idx}]`)

    const append_area = kintone.app.record.getSpaceElement('feedback_previous')
    console.log(resp.records[latest_item.idx])
    const content = resp.records[latest_item.idx]
    const insertHTML = `<div class="record_create_show_task_yesterday"><p class="record_create_show_task_yesterday_title narrow_margin">昨日実施した内容</p><p class="narrow_margin">${content.Today_Text_area.value}</p></div>`
                      + `<div class="record_create_show_task_today"><p class="record_create_show_task_today_title narrow_margin">今日予定してた内容</p><p class="narrow_margin">${content.Tomorrow_Text_area.value}</p></div>`
    append_area.insertAdjacentHTML('beforeend', insertHTML)
  })

  kintone.events.on('app.record.detail.show', async function(event) {
    console.log('[Fired] app.record.detail.show: レコード詳細画面の表示後イベント')
    console.log('https://developer.cybozu.io/hc/ja/articles/201941974#step1')
    console.log(`[info] 表示しているRecordのID=[${kintone.app.record.getId()}]`)

    // remove Blanl space
    kintone.app.record.getSpaceElement('feedback_previous').parentNode.style.setProperty("display", "none")

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

    try {
      const _LABEL_MASTER_REFER_COLUMN_NAME = 'Labelマスタ'
      // _APP_ID_=1(ラベル)のレコードを取得する
      const fetch_params = { app_id: _APP_ID_ }
      const resp = await fetchRecords(fetch_params)

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
