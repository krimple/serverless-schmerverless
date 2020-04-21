const AWS = require('aws-sdk');
const uuidv4 = require('uuid').v4;
const { validateTask } = require('./validator');
const awsXRay = require('aws-xray-sdk');
const awsSdk = awsXRay.captureAWS(require('aws-sdk'));

// TODO - externalize
AWS.config.update({ region: 'us-east-1'});

const dynamoDB = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
const TASKS_TABLE_NAME = process.env['SHARED_TASKS_TABLE_NAME'];

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': 'X-Forwarded-For,Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
    };

    // this is here to properly debug the payload coming in.
    // because each bugfix is a deploy cycle to test the API Gateway
    // by default, I had to get very long-form in debugging my silly
    // errors
    console.log('event', JSON.stringify(event));
    const bodyText = event.body;
    console.log('body', bodyText);
    const parsedBody = JSON.parse(bodyText);
    console.log('parsed body', parsedBody);
    const task = parsedBody.task;
    console.log('task', task);
    const errors = validateTask(task);
    if (errors) {
        console.error(errors);
        return {
           'statusCode': 422,
            'body': {
                'errors': errors
            }
        };
    }

    let response;
    try {
        const params = {
            TableName: TASKS_TABLE_NAME,
            Item: {
                'taskOwner': { 'S': task.taskOwner },
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
          'body': 'CREATED'
        };
    } catch (err) {
        console.log(err);
        return err;
    }

    return response;
};

