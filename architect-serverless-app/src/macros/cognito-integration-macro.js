module.exports = function cognitoSecurityPluginMacro(arc, cloudformation, stage) {
	console.log('*********** I AM IN YOUR FACE ***********');
    const api = cloudformation.Resources.ArchitectServerlessApp;
    console.log(cloudformation.Resources);
    console.dir(api.Properties.DefinitionBody.paths['/tasks']);
    debugger;
  return cloudformation;
}
