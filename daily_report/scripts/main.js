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

    // 日報アプリのサブテーブルオブジェクトを取得
    const dailyReportAppRecord = event.record
    console.log('[event.records]', dailyReportAppRecord)

    // APP_ID=2(ラベル)のレコードを取得する
    const APP_ID = 2
    const paramForGet = {
      'app': APP_ID
    }
    try {
      const resp = await kintone.api(kintone.api.url('/k/v1/records', true), 'GET', paramForGet)
      console.log('[ラベルのレコード]', resp)
    } catch (err) {
      console.log(err)
    }
  })

})()
