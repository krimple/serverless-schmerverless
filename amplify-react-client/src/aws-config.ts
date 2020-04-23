const config = {
  Auth: {
    region: "us-east-1",
    userPoolId: "us-east-1_8k4qrMJ6D",
    userPoolWebClientId: "7u498300jbl93mjpte1sl43mbd",
    authenticationFlowType: 'USER_PASSWORD_AUTH'
  },
  API: {
    Cors: {
      AllowMethods: "'OPTIONS,POST,GET,HEAD,PUT,DELETE'",
      AllowHeaders: "'Content-Type'",
      AllowOrigin: "'http://localhost:3000/'"
    },
    endpoints: [
      {
        name: 'taskManagerSam',
        endpoint: 'https://4kb96b67q7.execute-api.us-east-1.amazonaws.com/dev'
      },
      {
        name: 'taskManagerServerless',
        endpoint: 'https://v1pllkzuof.execute-api.us-east-1.amazonaws.com/dev'
      },
      {
        name: 'taskManagerNodeSam',
        endpoint: 'https://fxkap7z67c.execute-api.us-east-1.amazonaws.com/dev'
      },
      {
        name: 'taskManagerNodeServerless',
        endpoint: 'https://czaosiorh7.execute-api.us-east-1.amazonaws.com/dev'
      }
    ]
  }
};

export default config;

