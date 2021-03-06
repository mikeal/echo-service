const url = require('url')
const qs = require('querystring')
const cors = require('../lib/cors')

module.exports = async (req, res) => {
  let parsed = url.parse(req.url)
  if (!parsed.query) return res.end()
  let params = qs.parse(parsed.query)
  if (params.statusCode) res.statusCode = params.statusCode
  if (params.headers) {
    let headers = params.headers.split(',')
    for (let header of headers) {
      let [key, value] = header.split(':')
      res.setHeader(key, value)
    }
  }
  if (params.cors) cors(res)

  if (params.base64) res.end(Buffer.from(params.base64, 'base64'))
  else if (params.body) res.end(params.body)
  else res.end()
}
