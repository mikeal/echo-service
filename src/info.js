const cors = require('../lib/cors')

const body = res => new Promise((resolve, reject) => {
  let buffers = []
  res.on('data', chunk => buffers.push(chunk))
  res.on('error', reject)
  res.on('end', () => resolve(Buffer.concat(buffers)))
})

module.exports = async (req, res) => {
  let buffer = await body(req)
  let info = {
    method: req.method,
    url: req.url,
    headers: req.headers
  }
  if (buffer.length) {
    info.base64 = buffer.toString('base64')
  }
  cors(res)
  res.setHeader('content-type', 'application/json')
  res.end(JSON.stringify(info))
}
