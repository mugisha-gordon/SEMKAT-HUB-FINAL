import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'semkat-hub',
  location: 'us-east4'
};

export const addNewPropertyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddNewProperty', inputVars);
}
addNewPropertyRef.operationName = 'AddNewProperty';

export function addNewProperty(dcOrVars, vars) {
  return executeMutation(addNewPropertyRef(dcOrVars, vars));
}

export const getPropertiesForCurrentUserRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPropertiesForCurrentUser');
}
getPropertiesForCurrentUserRef.operationName = 'GetPropertiesForCurrentUser';

export function getPropertiesForCurrentUser(dc) {
  return executeQuery(getPropertiesForCurrentUserRef(dc));
}

export const updateIsFavoriteRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateIsFavorite', inputVars);
}
updateIsFavoriteRef.operationName = 'UpdateIsFavorite';

export function updateIsFavorite(dcOrVars, vars) {
  return executeMutation(updateIsFavoriteRef(dcOrVars, vars));
}

export const deletePropertyRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteProperty', inputVars);
}
deletePropertyRef.operationName = 'DeleteProperty';

export function deleteProperty(dcOrVars, vars) {
  return executeMutation(deletePropertyRef(dcOrVars, vars));
}

