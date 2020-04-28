const AWS = require('aws-sdk');
const uuidv4 = require('uuid').v4;
const { validateUpdateTask } = require('./validator');
const awsXRay = require('aws-xray-sdk');
const awsSdk = awsXRay.captureAWS(require('aws-sdk'));

// TODO - externalize
AWS.config.update({ region: 'us-east-1'});

const dynamoDB = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
const TASKS_TABLE_NAME = process.env['SHARED_TASKS_TABLE_NAME'];

exports.handler = async (event, context) => {
    console.log('Event', JSON.stringify(event));
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
    const errors = validateUpdateTask(task);
    // if we fail validation, return a 400 error to the client
    if (errors) {
      console.error(errors);
      return({
        isBase64Encoded: false,
        statusCode: 400,
        headers: headers,
        body: JSON.stringify(errors)
      });
    }

    // respond with validation error

    const expressionAttributeValues = {
        ':priority': {'N': task.priority ? task.priority.toString() : '1'},
        ':description': {'S': task.description},
        ':dueDate': {'S': task.dueDate},
        ':completed': {'BOOL': task.completed}
    };

    // only add completed date expression if the date is sent
    if (task.completedDate) {
        expressionAttributeValues[':completedDate'] = { 'S': task.completedDate };
    }

    let updateExpression = `
              SET priority = :priority,
                  description = :description,
                  dueDate = :dueDate,
                  completed = :completed
    `;

    // only add completed date update statement part if sent
    if (task.completedDate) {
        updateExpression += ', completedDate = :completedDate';
    }

    let response;
    try {
        const params = {
            TableName: TASKS_TABLE_NAME,
            Key: {
                'taskOwner': { 'S': event.pathParameters.taskOwner },
                'taskId': { 'S': event.pathParameters.taskId }
            },
            // TODO - complete this
            UpdateExpression:   updateExpression,
            ExpressionAttributeValues: expressionAttributeValues
        };

        const result = await dynamoDB.updateItem(params).promise();

        // NOTE - could also return updated REST value but we'll re-fetch the
        // entire set of tasks anyway
        return({
          isBase64Encoded: false,
          statusCode: 204,
          headers: headers,
          body: '{"result": "NO CONTENT"}'
        });
    // update fails
    } catch (err) {
        console.log(err);
        return({
          isBase64Encoded: false,
          statusCode: 500,
          headers: headers,
          body: JSON.stringify(err)
        });
    }
};

