const AWS = require('aws-sdk');
const awsXRay = require('aws-xray-sdk');
const awsSdk = awsXRay.captureAWS(require('aws-sdk'));

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
    console.log('Event', JSON.stringify(event));
    let response;
    try {
        const params = {
            ExpressionAttributeValues: {
                ':o': {S: event.queryStringParameters.taskOwner}
            },
            TableName: TASKS_TABLE_NAME,
            KeyConditionExpression: 'taskOwner = :o',
            ProjectionExpression: 'taskOwner, taskId, description, dueDate, priority, completed'
        };

        const result = await dynamoDB.query(params).promise();

        response = {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Headers': 'X-Forwarded-For,Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': JSON.stringify({
                // payload: Items (array), Count, ScannedCount
                tasks: result['Items']
            })
        };
    } catch (err) {
        console.log(err);
        return err;
    }

    return response;
};
