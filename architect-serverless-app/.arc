@app
architect-serverless-app

@description
Architect version of Dynamo Lambdas demo app

@macros
cognito-integration-macro

@aws
region us-east-1
profile default
runtime nodejs12.x

@http
get /
get /tasks
post /tasks

@tables
tasks
  taskOwner *String
  taskId **String

