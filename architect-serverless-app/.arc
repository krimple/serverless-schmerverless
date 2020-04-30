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

# I do not like the shadow options uri and
# related extra code to mount
# but this is probably something that can
# be factored out into a pragma like @cors
@http
get /
options /tasks/:taskOwner
options /tasks/:taskOwner/:taskId
get /tasks/:taskOwner
get /tasks/:taskOwner/:taskId
post /tasks/:taskOwner
put /tasks/:taskOwner/:taskId

@tables
# tasks
#   taskOwner *String
#   taskId **String

