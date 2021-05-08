"use strict";
const credential = require("./credential.js");
/*
 * // prepare credential.js as below before exec
 * module.exports = {
 *   id: 'xxx_id_xxx@example.com',
 *   pw: 'xxx_password_xxx',
 *   subdomain: 'xxx_subdomain_xxx'
 * }
 */

(async () => {
  console.log("[Credential] ", credential)
  const subdomain = `${credential.subdomain}`
  const idpw_base64 = Buffer.from(`${credential.id}:${credential.pw}`).toString('base64')
  const app_no = 1

  //
  const fetch = require('node-fetch')
  const api_endpoint = `https://${subdomain}.cybozu.com/k/v1/records.json?app=${app_no}`
  const header_params = {
    'X-Cybozu-Authorization': `${idpw_base64}`,
    'Authorization': `Basic ${idpw_base64}`
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
