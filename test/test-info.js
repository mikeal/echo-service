const handler = require('../src/info')
const http = require('http')
const bent = require('bent')
const { test } = require('tap')
const { promisify } = require('util')

const httpTest = (str, fn) => {
  test(str, async t => {
    let server = http.createServer(handler)
    await promisify(cb => server.listen(3000, cb))()
    await fn(t)
    await promisify(cb => server.close(cb))()
  })
}

const headers = {
  accept: 'application/json',
  host: 'localhost:3000',
  connection: 'close'
}

httpTest('basic get', async t => {
  let get = bent('json', 'http://localhost:3000')
  let info = await get('')
  t.same(info, { method: 'GET', url: '/', headers })
})

httpTest('basic put', async t => {
  let buffer = Buffer.from('asdiofjasodfas98dfua9sdjf9as8jfd')
  let put = bent('PUT', 'json', 'http://localhost:3000')
  let info = await put('', buffer)
  t.same(info, {
    method: 'PUT',
    url: '/',
    base64: buffer.toString('base64'),
    headers: Object.assign(
      { 'content-length': buffer.length.toString() }, headers
    )
  })
})
