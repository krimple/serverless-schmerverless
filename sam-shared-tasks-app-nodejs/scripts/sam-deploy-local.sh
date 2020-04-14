#!/bin/sh

scriptdir="${0%/*}"
SHARED_TASKS_TABLE_ARN=`echo $(${scriptdir}/stack-id-local cognito-stack-dev SharedTasksTableArn)`
IAM_USER_ROLE=`echo $(${scriptdir}/stack-id-local cognito-stack-dev IamUserRole)`
sam local start-api --parameter-overrides 'SharedTasksTableArn=$SHARED_TASKS_TABLE_ARN TaskManagerRoleName=$IAM_USER_ROLE'
