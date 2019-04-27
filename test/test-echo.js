const echo = require('../src/echo')
const http = require('http')
const bent = require('bent')
const qs = require('querystring')
const { test } = require('tap')
const { promisify } = require('util')

const httpTest = (str, fn) => {
  test(str, async t => {
    let server = http.createServer(echo)
    await promisify(cb => server.listen(3000, cb))()
    await fn(t)
    await promisify(cb => server.close(cb))()
  })
}

httpTest('no params', async t => {
  let get = bent('string', 'http://localhost:3000')
  let empty = await get('')
  t.same(empty, '')
})

httpTest('basic get', async t => {
  let get = bent('string', 'http://localhost:3000')
  let res = await get('?body=test')
  t.same(res, 'test')
})

httpTest('500', async t => {
  let get = bent(500, 'http://localhost:3000')
  await get('?statusCode=500')
})

httpTest('headers', async t => {
  let get = bent('http://localhost:3000')
  let resp = await get('?' + qs.stringify({ headers: 'x-test-header:blah,x-test-header2:blah2' }))
  t.same(resp.headers['x-test-header'], 'blah')
  t.same(resp.headers['x-test-header2'], 'blah2')
})

httpTest('cors', async t => {
  let get = bent('OPTIONS', 'http://localhost:3000')
  let resp = await get('?cors=true')
  t.same(resp.headers['access-control-allow-origin'], '*')
  t.same(resp.headers['access-control-allow-methods'], 'DELETE, PUT, GET, POST')
  t.same(resp.headers['access-control-allow-headers'], 'Origin, X-Requested-With, Content-Type, Accept')
})

httpTest('base64', async t => {
  let buffer = Buffer.from('asdasdfalsdkjflksajdfioj232')
  let get = bent('buffer', 'http://localhost:3000')
  let buffer2 = await get(`?base64=${buffer.toString('base64')}`)
  t.same(buffer2, buffer)
})
