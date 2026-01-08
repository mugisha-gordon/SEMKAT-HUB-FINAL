const { validateAdminArgs } = require('firebase-admin/data-connect');

const connectorConfig = {
  connector: 'example',
  serviceId: 'semkat-hub',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

function addNewProperty(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeMutation('AddNewProperty', inputVars, inputOpts);
}
exports.addNewProperty = addNewProperty;

function getPropertiesForCurrentUser(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrOptions, options, undefined);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('GetPropertiesForCurrentUser', undefined, inputOpts);
}
exports.getPropertiesForCurrentUser = getPropertiesForCurrentUser;

function updateIsFavorite(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeMutation('UpdateIsFavorite', inputVars, inputOpts);
}
exports.updateIsFavorite = updateIsFavorite;

function deleteProperty(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeMutation('DeleteProperty', inputVars, inputOpts);
}
exports.deleteProperty = deleteProperty;

