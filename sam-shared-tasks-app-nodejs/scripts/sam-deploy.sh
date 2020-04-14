#!/bin/sh

rm -rf .aws-sam
scriptdir="${0%/*}"
USER_POOL_ARN=`echo $(${scriptdir}/stack-id cognito-stack-dev UserPoolArn)`
SHARED_TASKS_TABLE_NAME=`echo $(${scriptdir}/stack-id cognito-stack-dev SharedTasksTableName)`
SHARED_TASKS_TABLE_ARN=`echo $(${scriptdir}/stack-id cognito-stack-dev SharedTasksTableArn)`
sam build 
sam deploy --stack-name tasks-nodejs-app --force-upload \
--parameter-overrides \
  UserPoolArn=$USER_POOL_ARN \
  SharedTasksTableName=$SHARED_TASKS_TABLE_NAME \
  SharedTasksTableArn=$SHARED_TASKS_TABLE_ARN
