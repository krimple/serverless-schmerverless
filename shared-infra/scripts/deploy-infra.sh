aws cloudformation deploy \
   --stack-name cognito-stack-dev \
   --capabilities CAPABILITY_IAM \
   --region us-east-1 --template-file infra.yaml
