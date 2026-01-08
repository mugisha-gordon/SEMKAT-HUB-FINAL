const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'semkat-hub',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const addNewPropertyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddNewProperty', inputVars);
}
addNewPropertyRef.operationName = 'AddNewProperty';
exports.addNewPropertyRef = addNewPropertyRef;

exports.addNewProperty = function addNewProperty(dcOrVars, vars) {
  return executeMutation(addNewPropertyRef(dcOrVars, vars));
};

const getPropertiesForCurrentUserRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPropertiesForCurrentUser');
}
getPropertiesForCurrentUserRef.operationName = 'GetPropertiesForCurrentUser';
exports.getPropertiesForCurrentUserRef = getPropertiesForCurrentUserRef;

exports.getPropertiesForCurrentUser = function getPropertiesForCurrentUser(dc) {
  return executeQuery(getPropertiesForCurrentUserRef(dc));
};

const updateIsFavoriteRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateIsFavorite', inputVars);
}
updateIsFavoriteRef.operationName = 'UpdateIsFavorite';
exports.updateIsFavoriteRef = updateIsFavoriteRef;

exports.updateIsFavorite = function updateIsFavorite(dcOrVars, vars) {
  return executeMutation(updateIsFavoriteRef(dcOrVars, vars));
};

const deletePropertyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteProperty', inputVars);
}
deletePropertyRef.operationName = 'DeleteProperty';
exports.deletePropertyRef = deletePropertyRef;

exports.deleteProperty = function deleteProperty(dcOrVars, vars) {
  return executeMutation(deletePropertyRef(dcOrVars, vars));
};
