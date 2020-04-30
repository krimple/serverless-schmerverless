// learn more about HTTP functions here: https://arc.codes/primitives/http
function generateCorsHeaders() {
  return {
    'content-type': 'application/json',
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': 'X-Forwarded-For,Content-Type,Authorization',
    'Access-Control-Allow-Methods': 'OPTIONS,POST,PUT,GET'
  };
}

exports.handler = async function (req) {
  return {
    headers: {
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0',
      'content-type': 'text/html; charset=utf8',
      ...generateCorsHeaders()
    },
    body: `{ "status": "OK"}`
  }
}