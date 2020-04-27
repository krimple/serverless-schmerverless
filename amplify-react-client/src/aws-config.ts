/*
Injected in .env for local dev, see .dev-sample for a sample (.env is not checked in)
Must be set up in the environment of the deployed web application at runtime somehow
 */
const config = {
  Auth: {
    region: process.env['REACT_APP_AWS_REGION'],
    userPoolId: process.env['REACT_APP_COGNITO_POOL_ID'],
    userPoolWebClientId: process.env['REACT_APP_COGNITO_CLIENT_ID'],
    authenticationFlowType: 'USER_PASSWORD_AUTH'
  },
  API: {
    Cors: {
      AllowMethods: "'OPTIONS,POST,GET,HEAD,PUT,DELETE'",
      AllowHeaders: "'Content-Type'",
      AllowOrigin: `'${process.env['REACT_APP_CORS_ORIGIN']}/'`
    },
    endpoints: [
      {
        name: 'sam',
        endpoint: process.env['REACT_APP_SAM_ENDPOINT_PREFIX']
      },
      {
        name: 'serverless',
        endpoint: process.env['REACT_APP_SERVERLESS_ENDPOINT_PREFIX']
      },
      {
        name: 'architect',
        endpoint: process.env['REACT_APP_ARCHITECT_ENDPOINT_PREFIX']
      }
    ]
  }
};

export default config;

