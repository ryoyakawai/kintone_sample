"use strict";
const credential = require("./credential.js");

(async () => {
  console.log("[Credential] ", credential)
  const subdomain = "0iqzuo0vezpp"
  const idpw_base64 = Buffer.from(`${credential.id}:${credential.pw}`).toString('base64')

  //
  const fetch = require('node-fetch')
  const api_endpoint = `https://${subdomain}.cybozu.com/k/v1/records.json?app=1`
  const header_params = {
    'X-Cybozu-Authorization': `${idpw_base64}`,
    'Authorization': `Basic ${idpw_base64}`
  }
  const _header_params = {
    'X-Cybozu-API-Token' : 'UtKTwRZ6uZRGkJrGEYEpm9TYAsfsQft0nKaf8tkA'
  }

  console.log(`[API Endpoint] ${api_endpoint}`)
  console.log('[Request Headers]', header_params)
  const options = {
    method: 'GET',
    headers: header_params
  }
  const res_json = await fetch(api_endpoint, options)
    .then(res => {
      return res.json()
    })
  console.log('[All Response]', res_json)
  console.log('[records]', res_json.records)
})()
