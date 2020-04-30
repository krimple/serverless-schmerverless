let { tables } = require('@architect/functions')

function generateCorsHeaders() {
    return {
        'content-type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': 'X-Forwarded-For,Content-Type,Authorization',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,PUT,GET'
    };
}

// learn more about HTTP functions here: https://arc.codes/primitives/http
exports.handler = async function handler(request) {
    const tableName = process.env['SHARED_TASKS_TABLE_NAME'];
    console.log(`Table name is ${tableName}`);
    try {
        let data = await tables();

        // don't forget to chain .promise() or you'll just get the AWS
        // dynamo Event Request object
        let response = await data._doc.query({
            TableName: tableName,
            KeyConditionExpression: 'taskOwner = :taskOwner',
            ExpressionAttributeValues: {
                ':taskOwner': request.pathParameters.taskOwner
            }
        }).promise();
        return {
            statusCode: 200,
            headers: generateCorsHeaders(),
            body: JSON.stringify({
                tasks: response.Items
            })
        }
    }
    catch (e) {
        console.error(e);
        return {
            statusCode: 400,
            headers: generateCorsHeaders(),
            body: {
                message: JSON.stringify(e.toString())
            }
        }
    }
}

