exports.generateCorsHeaders = function() {
    return {
        'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Allow-Headers': 'X-Forwarded-For,Content-Type,Authorization',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
    };
}