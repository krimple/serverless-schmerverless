module.exports = function cognitoSecurityPluginMacro(arc, cloudformation, stage) {
    const api = cloudformation.Resources.ArchitectServerlessApp;
    console.dir(api.Properties.DefinitionBody.paths['/tasks']);

  return cloudformation;
}
