import { AddNewPropertyData, AddNewPropertyVariables, GetPropertiesForCurrentUserData, UpdateIsFavoriteData, UpdateIsFavoriteVariables, DeletePropertyData, DeletePropertyVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useAddNewProperty(options?: useDataConnectMutationOptions<AddNewPropertyData, FirebaseError, AddNewPropertyVariables>): UseDataConnectMutationResult<AddNewPropertyData, AddNewPropertyVariables>;
export function useAddNewProperty(dc: DataConnect, options?: useDataConnectMutationOptions<AddNewPropertyData, FirebaseError, AddNewPropertyVariables>): UseDataConnectMutationResult<AddNewPropertyData, AddNewPropertyVariables>;

export function useGetPropertiesForCurrentUser(options?: useDataConnectQueryOptions<GetPropertiesForCurrentUserData>): UseDataConnectQueryResult<GetPropertiesForCurrentUserData, undefined>;
export function useGetPropertiesForCurrentUser(dc: DataConnect, options?: useDataConnectQueryOptions<GetPropertiesForCurrentUserData>): UseDataConnectQueryResult<GetPropertiesForCurrentUserData, undefined>;

export function useUpdateIsFavorite(options?: useDataConnectMutationOptions<UpdateIsFavoriteData, FirebaseError, UpdateIsFavoriteVariables>): UseDataConnectMutationResult<UpdateIsFavoriteData, UpdateIsFavoriteVariables>;
export function useUpdateIsFavorite(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateIsFavoriteData, FirebaseError, UpdateIsFavoriteVariables>): UseDataConnectMutationResult<UpdateIsFavoriteData, UpdateIsFavoriteVariables>;

export function useDeleteProperty(options?: useDataConnectMutationOptions<DeletePropertyData, FirebaseError, DeletePropertyVariables>): UseDataConnectMutationResult<DeletePropertyData, DeletePropertyVariables>;
export function useDeleteProperty(dc: DataConnect, options?: useDataConnectMutationOptions<DeletePropertyData, FirebaseError, DeletePropertyVariables>): UseDataConnectMutationResult<DeletePropertyData, DeletePropertyVariables>;
