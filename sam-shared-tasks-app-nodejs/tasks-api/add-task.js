// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');

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
    let response;
    try {
        const params = {
            TableName: TASKS_TABLE_NAME,
            Item: {
                'taskOwner': { 'S': 'KenRimple' },
                'taskId': { 'S': uuidv4() },
                'priority': { 'N': '5' },
                'description': { 'S': 'But is it user friendly?' },
                'dueDate': { 'S': new Date().toISOString() },
                'complete': { 'BOOL': false }
            }
        };

        const result = await dynamoDB.putItem(params).promise();

        response = {
            'statusCode': 201,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Headers': 'X-Forwarded-For,Content-Type,Authorization',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            },
            'body': 'CREATED'
        };
    } catch (err) {
        console.log(err);
        return err;
    }

    return response;
};

