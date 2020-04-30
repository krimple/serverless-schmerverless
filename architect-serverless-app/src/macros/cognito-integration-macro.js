module.exports = function cognitoSecurityPluginMacro(arc, cloudformation, stage) {
    Object.keys(cloudformation.Resources).forEach(key => {
        const config = cloudformation.Resources[key];
        if (config.Type === 'AWS::Serverless::Function') {
            config['Properties']['Environment']['Variables']['TASKS_TABLE_NAME'] =
              { 'Fn::ImportValue': 'cognito-stack-dev-SharedTasksTableName' };
        }
    });

    configureAPIGateway(cloudformation);
    addGlobals(cloudformation);
    // todo - externalize to build script -> nodejs env var to here in general
    addExportedTableToPolicy(cloudformation, 'cognito-stack-dev-SharedTasksTableName');
    debugger;
    return cloudformation;
}

function configureAPIGateway(cloudformation) {
    Object.keys(cloudformation.Resources).forEach(key => {
       const resource =  cloudformation.Resources[key];
       if (resource.Type === 'AWS::Serverless::Api') {
           let existingCors = resource.Properties.Cors || {};
           resource.Properties.Cors = {
               ...existingCors,
               // todo - externalize to proper CORS settings
               AllowMethods: "'GET,PUT,POST,DELETE,OPTIONS'",
               AllowHeaders: "'X-Forwarded-For,Content-Type,Authorization'",
               AllowOrigin: "'http://localhost:3000'",
               MaxAge: 600
           }
           if (resource.Properties.Auth) {
               throw new Error('I am not ready for merging this...');
           }
           resource.Properties.Auth = {
               DefaultAuthorizer: 'Authorizer',
               Authorizers: {
                   Authorizer: {
                       UserPoolArn: {
                           'Fn::ImportValue': 'cognito-stack-dev-UserPoolArn'
                       }
                   }
               },
               AddDefaultAuthorizerToCorsPreflight: false
           }
       }

    });
}

function addGlobals(cloudformation) {
    if (!cloudformation.Globals) {
        cloudformation.Globals = {};
    }

    if (!cloudformation.Globals.Function) {
        cloudformation.Globals.Function = {};
    }

    if (!cloudformation.Globals.Function.Environment) {
        cloudformation.Globals.Function.Environment = {};
    }

    if (!cloudformation.Globals.Function.Environment.Variables) {
        cloudformation.Globals.Function.Environment.Variables = {}
    }

    cloudformation
        .Globals
        .Function
        .Environment
        .Variables['SHARED_TASKS_TABLE_NAME'] =
        { 'Fn::ImportValue': 'cognito-stack-dev-SharedTasksTableName' };

    return cloudformation;
}

function addExportedTableToPolicy(cloudformation, exportedTableName) {
    // TODO Ken is lazy
    if (!cloudformation.Resources.Role.Properties.Policies) {
        throw new Error('I don\'t have any policies');
    }
    const policy = cloudformation.Resources.Role.Properties.Policies.find(p => p.PolicyName === 'ArcDynamoPolicy')

    debugger;
    // TODO verify this, may be borked without tables
    if (!policy
        || !policy.PolicyDocument
        || !policy.PolicyDocument.Statement
        || policy.PolicyDocument.Statement.length === 0
        || !policy.PolicyDocument.Statement[0].Resource) {
        throw new Error('I can\'t find a Dynamo policy with a single statement. Maybe I should create if no tables in .arc');
    }

    // whatevs... now I can do my thing, adding the table name to my config
    policy.PolicyDocument.Statement[0].Resource.push({
        'Fn::Sub': [
            'arn:aws:dynamodb:${AWS::Region}:${AWS::AccountId}:table/${tablename}',
            {
                "tablename": {
                    'Fn::ImportValue': exportedTableName
                }
            }
        ]
    });
}
