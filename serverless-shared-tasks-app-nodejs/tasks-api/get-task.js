const AWS = require('aws-sdk');
const awsXRay = require('aws-xray-sdk');
const awsSdk = awsXRay.captureAWS(require('aws-sdk'));

// TODO - externalize
AWS.config.update({ region: 'us-east-1'});

const dynamoDB = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
const TASKS_TABLE_NAME = process.env['SHARED_TASKS_TABLE_NAME'];

exports.handler = async (event, context) => {
    console.log('Event', JSON.stringify(event));
    let response;
    try {
        const params = {
            Key: {
                taskOwner: {S: event.pathParameters.taskOwner},
                taskId: {S: event.pathParameters.taskId}
            },
            TableName: TASKS_TABLE_NAME,
            ProjectionExpression: 'taskOwner, taskId, description, dueDate, priority, completed, completedDate'
        };

        const result = await dynamoDB.getItem(params).promise();
        console.log(`result: ${JSON.stringify(result)}`);

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
                task: result['Item']
            })
        };
    } catch (err) {
        console.log(err);
        return err;
    }

    return response;
};
