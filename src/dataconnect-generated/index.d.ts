import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

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

interface AddNewPropertyRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddNewPropertyVariables): MutationRef<AddNewPropertyData, AddNewPropertyVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddNewPropertyVariables): MutationRef<AddNewPropertyData, AddNewPropertyVariables>;
  operationName: string;
}
export const addNewPropertyRef: AddNewPropertyRef;

export function addNewProperty(vars: AddNewPropertyVariables): MutationPromise<AddNewPropertyData, AddNewPropertyVariables>;
export function addNewProperty(dc: DataConnect, vars: AddNewPropertyVariables): MutationPromise<AddNewPropertyData, AddNewPropertyVariables>;

interface GetPropertiesForCurrentUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetPropertiesForCurrentUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetPropertiesForCurrentUserData, undefined>;
  operationName: string;
}
export const getPropertiesForCurrentUserRef: GetPropertiesForCurrentUserRef;

export function getPropertiesForCurrentUser(): QueryPromise<GetPropertiesForCurrentUserData, undefined>;
export function getPropertiesForCurrentUser(dc: DataConnect): QueryPromise<GetPropertiesForCurrentUserData, undefined>;

interface UpdateIsFavoriteRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateIsFavoriteVariables): MutationRef<UpdateIsFavoriteData, UpdateIsFavoriteVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateIsFavoriteVariables): MutationRef<UpdateIsFavoriteData, UpdateIsFavoriteVariables>;
  operationName: string;
}
export const updateIsFavoriteRef: UpdateIsFavoriteRef;

export function updateIsFavorite(vars: UpdateIsFavoriteVariables): MutationPromise<UpdateIsFavoriteData, UpdateIsFavoriteVariables>;
export function updateIsFavorite(dc: DataConnect, vars: UpdateIsFavoriteVariables): MutationPromise<UpdateIsFavoriteData, UpdateIsFavoriteVariables>;

interface DeletePropertyRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeletePropertyVariables): MutationRef<DeletePropertyData, DeletePropertyVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeletePropertyVariables): MutationRef<DeletePropertyData, DeletePropertyVariables>;
  operationName: string;
}
export const deletePropertyRef: DeletePropertyRef;

export function deleteProperty(vars: DeletePropertyVariables): MutationPromise<DeletePropertyData, DeletePropertyVariables>;
export function deleteProperty(dc: DataConnect, vars: DeletePropertyVariables): MutationPromise<DeletePropertyData, DeletePropertyVariables>;

