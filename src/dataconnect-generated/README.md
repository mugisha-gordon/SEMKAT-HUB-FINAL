# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetPropertiesForCurrentUser*](#getpropertiesforcurrentuser)
- [**Mutations**](#mutations)
  - [*AddNewProperty*](#addnewproperty)
  - [*UpdateIsFavorite*](#updateisfavorite)
  - [*DeleteProperty*](#deleteproperty)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetPropertiesForCurrentUser
You can execute the `GetPropertiesForCurrentUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getPropertiesForCurrentUser(): QueryPromise<GetPropertiesForCurrentUserData, undefined>;

interface GetPropertiesForCurrentUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetPropertiesForCurrentUserData, undefined>;
}
export const getPropertiesForCurrentUserRef: GetPropertiesForCurrentUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPropertiesForCurrentUser(dc: DataConnect): QueryPromise<GetPropertiesForCurrentUserData, undefined>;

interface GetPropertiesForCurrentUserRef {
  ...
  (dc: DataConnect): QueryRef<GetPropertiesForCurrentUserData, undefined>;
}
export const getPropertiesForCurrentUserRef: GetPropertiesForCurrentUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPropertiesForCurrentUserRef:
```typescript
const name = getPropertiesForCurrentUserRef.operationName;
console.log(name);
```

### Variables
The `GetPropertiesForCurrentUser` query has no variables.
### Return Type
Recall that executing the `GetPropertiesForCurrentUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPropertiesForCurrentUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetPropertiesForCurrentUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPropertiesForCurrentUser } from '@dataconnect/generated';


// Call the `getPropertiesForCurrentUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPropertiesForCurrentUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPropertiesForCurrentUser(dataConnect);

console.log(data.properties);

// Or, you can use the `Promise` API.
getPropertiesForCurrentUser().then((response) => {
  const data = response.data;
  console.log(data.properties);
});
```

### Using `GetPropertiesForCurrentUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPropertiesForCurrentUserRef } from '@dataconnect/generated';


// Call the `getPropertiesForCurrentUserRef()` function to get a reference to the query.
const ref = getPropertiesForCurrentUserRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPropertiesForCurrentUserRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.properties);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.properties);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## AddNewProperty
You can execute the `AddNewProperty` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
addNewProperty(vars: AddNewPropertyVariables): MutationPromise<AddNewPropertyData, AddNewPropertyVariables>;

interface AddNewPropertyRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddNewPropertyVariables): MutationRef<AddNewPropertyData, AddNewPropertyVariables>;
}
export const addNewPropertyRef: AddNewPropertyRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addNewProperty(dc: DataConnect, vars: AddNewPropertyVariables): MutationPromise<AddNewPropertyData, AddNewPropertyVariables>;

interface AddNewPropertyRef {
  ...
  (dc: DataConnect, vars: AddNewPropertyVariables): MutationRef<AddNewPropertyData, AddNewPropertyVariables>;
}
export const addNewPropertyRef: AddNewPropertyRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addNewPropertyRef:
```typescript
const name = addNewPropertyRef.operationName;
console.log(name);
```

### Variables
The `AddNewProperty` mutation requires an argument of type `AddNewPropertyVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `AddNewProperty` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddNewPropertyData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddNewPropertyData {
  property_insert: Property_Key;
}
```
### Using `AddNewProperty`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addNewProperty, AddNewPropertyVariables } from '@dataconnect/generated';

// The `AddNewProperty` mutation requires an argument of type `AddNewPropertyVariables`:
const addNewPropertyVars: AddNewPropertyVariables = {
  address: ..., 
  bathrooms: ..., // optional
  bedrooms: ..., // optional
  description: ..., // optional
  isFavorite: ..., // optional
  price: ..., // optional
  squareFootage: ..., // optional
  status: ..., 
  yearBuilt: ..., // optional
};

// Call the `addNewProperty()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addNewProperty(addNewPropertyVars);
// Variables can be defined inline as well.
const { data } = await addNewProperty({ address: ..., bathrooms: ..., bedrooms: ..., description: ..., isFavorite: ..., price: ..., squareFootage: ..., status: ..., yearBuilt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addNewProperty(dataConnect, addNewPropertyVars);

console.log(data.property_insert);

// Or, you can use the `Promise` API.
addNewProperty(addNewPropertyVars).then((response) => {
  const data = response.data;
  console.log(data.property_insert);
});
```

### Using `AddNewProperty`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addNewPropertyRef, AddNewPropertyVariables } from '@dataconnect/generated';

// The `AddNewProperty` mutation requires an argument of type `AddNewPropertyVariables`:
const addNewPropertyVars: AddNewPropertyVariables = {
  address: ..., 
  bathrooms: ..., // optional
  bedrooms: ..., // optional
  description: ..., // optional
  isFavorite: ..., // optional
  price: ..., // optional
  squareFootage: ..., // optional
  status: ..., 
  yearBuilt: ..., // optional
};

// Call the `addNewPropertyRef()` function to get a reference to the mutation.
const ref = addNewPropertyRef(addNewPropertyVars);
// Variables can be defined inline as well.
const ref = addNewPropertyRef({ address: ..., bathrooms: ..., bedrooms: ..., description: ..., isFavorite: ..., price: ..., squareFootage: ..., status: ..., yearBuilt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addNewPropertyRef(dataConnect, addNewPropertyVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.property_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.property_insert);
});
```

## UpdateIsFavorite
You can execute the `UpdateIsFavorite` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateIsFavorite(vars: UpdateIsFavoriteVariables): MutationPromise<UpdateIsFavoriteData, UpdateIsFavoriteVariables>;

interface UpdateIsFavoriteRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateIsFavoriteVariables): MutationRef<UpdateIsFavoriteData, UpdateIsFavoriteVariables>;
}
export const updateIsFavoriteRef: UpdateIsFavoriteRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateIsFavorite(dc: DataConnect, vars: UpdateIsFavoriteVariables): MutationPromise<UpdateIsFavoriteData, UpdateIsFavoriteVariables>;

interface UpdateIsFavoriteRef {
  ...
  (dc: DataConnect, vars: UpdateIsFavoriteVariables): MutationRef<UpdateIsFavoriteData, UpdateIsFavoriteVariables>;
}
export const updateIsFavoriteRef: UpdateIsFavoriteRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateIsFavoriteRef:
```typescript
const name = updateIsFavoriteRef.operationName;
console.log(name);
```

### Variables
The `UpdateIsFavorite` mutation requires an argument of type `UpdateIsFavoriteVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateIsFavoriteVariables {
  id: UUIDString;
  isFavorite?: boolean | null;
}
```
### Return Type
Recall that executing the `UpdateIsFavorite` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateIsFavoriteData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateIsFavoriteData {
  property_update?: Property_Key | null;
}
```
### Using `UpdateIsFavorite`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateIsFavorite, UpdateIsFavoriteVariables } from '@dataconnect/generated';

// The `UpdateIsFavorite` mutation requires an argument of type `UpdateIsFavoriteVariables`:
const updateIsFavoriteVars: UpdateIsFavoriteVariables = {
  id: ..., 
  isFavorite: ..., // optional
};

// Call the `updateIsFavorite()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateIsFavorite(updateIsFavoriteVars);
// Variables can be defined inline as well.
const { data } = await updateIsFavorite({ id: ..., isFavorite: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateIsFavorite(dataConnect, updateIsFavoriteVars);

console.log(data.property_update);

// Or, you can use the `Promise` API.
updateIsFavorite(updateIsFavoriteVars).then((response) => {
  const data = response.data;
  console.log(data.property_update);
});
```

### Using `UpdateIsFavorite`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateIsFavoriteRef, UpdateIsFavoriteVariables } from '@dataconnect/generated';

// The `UpdateIsFavorite` mutation requires an argument of type `UpdateIsFavoriteVariables`:
const updateIsFavoriteVars: UpdateIsFavoriteVariables = {
  id: ..., 
  isFavorite: ..., // optional
};

// Call the `updateIsFavoriteRef()` function to get a reference to the mutation.
const ref = updateIsFavoriteRef(updateIsFavoriteVars);
// Variables can be defined inline as well.
const ref = updateIsFavoriteRef({ id: ..., isFavorite: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateIsFavoriteRef(dataConnect, updateIsFavoriteVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.property_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.property_update);
});
```

## DeleteProperty
You can execute the `DeleteProperty` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteProperty(vars: DeletePropertyVariables): MutationPromise<DeletePropertyData, DeletePropertyVariables>;

interface DeletePropertyRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeletePropertyVariables): MutationRef<DeletePropertyData, DeletePropertyVariables>;
}
export const deletePropertyRef: DeletePropertyRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteProperty(dc: DataConnect, vars: DeletePropertyVariables): MutationPromise<DeletePropertyData, DeletePropertyVariables>;

interface DeletePropertyRef {
  ...
  (dc: DataConnect, vars: DeletePropertyVariables): MutationRef<DeletePropertyData, DeletePropertyVariables>;
}
export const deletePropertyRef: DeletePropertyRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deletePropertyRef:
```typescript
const name = deletePropertyRef.operationName;
console.log(name);
```

### Variables
The `DeleteProperty` mutation requires an argument of type `DeletePropertyVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeletePropertyVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteProperty` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeletePropertyData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeletePropertyData {
  property_delete?: Property_Key | null;
}
```
### Using `DeleteProperty`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteProperty, DeletePropertyVariables } from '@dataconnect/generated';

// The `DeleteProperty` mutation requires an argument of type `DeletePropertyVariables`:
const deletePropertyVars: DeletePropertyVariables = {
  id: ..., 
};

// Call the `deleteProperty()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteProperty(deletePropertyVars);
// Variables can be defined inline as well.
const { data } = await deleteProperty({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteProperty(dataConnect, deletePropertyVars);

console.log(data.property_delete);

// Or, you can use the `Promise` API.
deleteProperty(deletePropertyVars).then((response) => {
  const data = response.data;
  console.log(data.property_delete);
});
```

### Using `DeleteProperty`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deletePropertyRef, DeletePropertyVariables } from '@dataconnect/generated';

// The `DeleteProperty` mutation requires an argument of type `DeletePropertyVariables`:
const deletePropertyVars: DeletePropertyVariables = {
  id: ..., 
};

// Call the `deletePropertyRef()` function to get a reference to the mutation.
const ref = deletePropertyRef(deletePropertyVars);
// Variables can be defined inline as well.
const ref = deletePropertyRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deletePropertyRef(dataConnect, deletePropertyVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.property_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.property_delete);
});
```

