const AWS = require('aws-sdk');
const uuidv4 = require('uuid').v4;
const { validateCreateTask } = require('./validator');
const awsXRay = require('aws-xray-sdk');
const awsSdk = awsXRay.captureAWS(require('aws-sdk'));

// TODO - externalize
AWS.config.update({ region: 'us-east-1'});

const dynamoDB = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
const TASKS_TABLE_NAME = process.env['SHARED_TASKS_TABLE_NAME'];

exports.handler = async (event, context, callback) => {
    const headers = {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': 'X-Forwarded-For,Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
    };

    // this is here to properly debug the payload coming in.
    // because each bugfix is a deploy cycle to test the API Gateway
    // by default, I had to get very long-form in debugging my silly
    // errors
    const bodyText = event.body;
    const parsedBody = JSON.parse(bodyText);
    const task = parsedBody.task;
    // TODO - authenticate based on the current user, this is not validated
    // but failing to have a user in the path makes it 404
    const errors = validateCreateTask(task);

    if (errors) {
      console.error(errors);
      callback(null, {
        'statusCode': 400,
         'headers': headers,
         'body': {
            'errors': JSON.stringify(errors)
         }
      });
      return;
    }

    let response;
    try {
        const params = {
            TableName: TASKS_TABLE_NAME,
            Item: {
                'taskOwner': { S: event.pathParameters.taskOwner },
                'taskId': { 'S': uuidv4() },
                'priority': { 'N': task.priority ? task.priority.toString() : '1' },
                'description': { 'S': task.description },
                'dueDate': { 'S': task.dueDate },
                'completed': { 'BOOL': false }
            }
        };

        const result = await dynamoDB.putItem(params).promise();

        response = {
          'statusCode': 201,
          'headers': headers,
          'body': '{"result": "CREATED"}'
        };
        callback(null, response);
    } catch (err) {
         response = {
          'statusCode': 500,
          'headers': headers,
          'body': JSON.stringify(err)
        };       
        callback(null, response);
    }
};

