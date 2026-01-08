import { ConnectorConfig, DataConnect, OperationOptions, ExecuteOperationResponse } from 'firebase-admin/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;


export interface AddNewPropertyData {
  property_insert: Property_Key;
}

export interface AddNewPropertyVariables {
  address: string;
  bathrooms?: number | null;
  bedrooms?: number | null;
  description?: string | null;
  isFavorite?: boolean | null;
  price?: Int64String | null;
  squareFootage?: number | null;
  status: string;
  yearBuilt?: number | null;
}

export interface Agent_Key {
  id: UUIDString;
  __typename?: 'Agent_Key';
}

export interface DeletePropertyData {
  property_delete?: Property_Key | null;
}

export interface DeletePropertyVariables {
  id: UUIDString;
}

export interface GetPropertiesForCurrentUserData {
  properties: ({
    id: UUIDString;
    address: string;
    bathrooms?: number | null;
    bedrooms?: number | null;
    description?: string | null;
    isFavorite?: boolean | null;
    price?: Int64String | null;
    squareFootage?: number | null;
    status: string;
    yearBuilt?: number | null;
  } & Property_Key)[];
}

export interface Interaction_Key {
  id: UUIDString;
  __typename?: 'Interaction_Key';
}

export interface Note_Key {
  id: UUIDString;
  __typename?: 'Note_Key';
}

export interface Property_Key {
  id: UUIDString;
  __typename?: 'Property_Key';
}

export interface UpdateIsFavoriteData {
  property_update?: Property_Key | null;
}

export interface UpdateIsFavoriteVariables {
  id: UUIDString;
  isFavorite?: boolean | null;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

/** Generated Node Admin SDK operation action function for the 'AddNewProperty' Mutation. Allow users to execute without passing in DataConnect. */
export function addNewProperty(dc: DataConnect, vars: AddNewPropertyVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<AddNewPropertyData>>;
/** Generated Node Admin SDK operation action function for the 'AddNewProperty' Mutation. Allow users to pass in custom DataConnect instances. */
export function addNewProperty(vars: AddNewPropertyVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<AddNewPropertyData>>;

/** Generated Node Admin SDK operation action function for the 'GetPropertiesForCurrentUser' Query. Allow users to execute without passing in DataConnect. */
export function getPropertiesForCurrentUser(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<GetPropertiesForCurrentUserData>>;
/** Generated Node Admin SDK operation action function for the 'GetPropertiesForCurrentUser' Query. Allow users to pass in custom DataConnect instances. */
export function getPropertiesForCurrentUser(options?: OperationOptions): Promise<ExecuteOperationResponse<GetPropertiesForCurrentUserData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateIsFavorite' Mutation. Allow users to execute without passing in DataConnect. */
export function updateIsFavorite(dc: DataConnect, vars: UpdateIsFavoriteVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateIsFavoriteData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateIsFavorite' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateIsFavorite(vars: UpdateIsFavoriteVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateIsFavoriteData>>;

/** Generated Node Admin SDK operation action function for the 'DeleteProperty' Mutation. Allow users to execute without passing in DataConnect. */
export function deleteProperty(dc: DataConnect, vars: DeletePropertyVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeletePropertyData>>;
/** Generated Node Admin SDK operation action function for the 'DeleteProperty' Mutation. Allow users to pass in custom DataConnect instances. */
export function deleteProperty(vars: DeletePropertyVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<DeletePropertyData>>;

