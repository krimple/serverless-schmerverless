const AWS = require('aws-sdk');
const uuidv4 = require('uuid').v4;
const { validateTask } = require('./validator');

// TODO - externalize
AWS.config.update({ region: 'us-east-1'});

const dynamoDB = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
const TASKS_TABLE_NAME = process.env['SHARED_TASKS_TABLE_NAME'];

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': 'X-Forwarded-For,Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
    };

    const task = event.body.task || {};
    const errors = validateTask(event.body.task);
    if (errors) {
        return {
           'statusCode': 422,
            'body': JSON.stringify({
                'errors': JSON.stringify(errors)
            })
        }
    }

    let response;
    try {
        const params = {
            TableName: TASKS_TABLE_NAME,
            Item: {
                'taskOwner': { 'S': task.taskOwner },
                'taskId': { 'S': uuidv4() },
                'priority': { 'N': task.priority.toString() },
                'description': { 'S': task.description },
                'dueDate': { 'S': task.dueDate },
                'complete': { 'BOOL': false }
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

