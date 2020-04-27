let { tables } = require('@architect/functions')

// learn more about HTTP functions here: https://arc.codes/primitives/http
exports.handler = async function handler(request) {
    const tableName = process.env['SHARED_TASKS_TABLE_NAME'];
    console.log(`Table name is ${tableName}`);
    let data = await tables();
    try {
        let response = await data[tableName].query({
            KeyConditionExpression: 'taskOwner = :taskOwner',
            ExpressionAttributeValues: {
                ':taskOwner': 'KenRimple'
            }
        });
        console.log('Things worked, returning data...');
        return {
            // not statusCode
            statusCode: 200,
            body: JSON.stringify({
                // don't JSON stringify the results
                tasks: response.Items
            })
        }
    }
    catch (e) {
        console.log('it failed...');
        console.error(e);
        throw e;
    }
}

