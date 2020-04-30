// learn more about HTTP functions here: https://arc.codes/primitives/http
exports.handler = async function http (req) {
  console.log("************************* WE ARE IN OPTIONS ON INDEX *************");
  // handle CORS preflight thanks to Clint Hill's post on Architect's Slack
  // all requests fall back to the index if not mapped, so this is a PERFECT
  // place to handle the OPTIONS call for any CORS method!
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Headers': 'X-Forwarded-For,Content-Type,Authorization',
      'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE'
    },
    body: JSON.stringify({ multitude: true })
  };
}