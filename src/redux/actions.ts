// Action Types
export const SET_PRIVATE_KEY = 'SET_PRIVATE_KEY';
export const SET_SIGNED_KEY_RESPONSE = 'SET_SIGNED_KEY_RESPONSE';
export const SET_USER_FID = 'SET_USER_FID';
export const ADD_MESSAGE_UUID = 'ADD_MESSAGE_UUID';

// Action Interfaces
interface SetPrivateKeyAction {
  type: typeof SET_PRIVATE_KEY;
  payload: string;
}

interface SetSignedKeyResponseAction {
  type: typeof SET_SIGNED_KEY_RESPONSE;
  payload: SignedKeyRequestResponse;
}

interface SetUserFidAction {
  type: typeof SET_USER_FID;
  payload: number;
}

interface AddMessageUuidAction {
  type: typeof ADD_MESSAGE_UUID;
  payload: string;
}

export type AuthActionTypes = SetPrivateKeyAction | SetSignedKeyResponseAction | SetUserFidAction | AddMessageUuidAction;

// Action Creators
export const setPrivateKey = (privateKey: string): SetPrivateKeyAction => ({
  type: SET_PRIVATE_KEY,
  payload: privateKey,
});

export const setSignedKeyResponse = (response: SignedKeyRequestResponse): SetSignedKeyResponseAction => ({
  type: SET_SIGNED_KEY_RESPONSE,
  payload: response,
});

export const setUserFid = (userFid: number): SetUserFidAction => ({
  type: SET_USER_FID,
  payload: userFid,
});

export const addMessageUuid = (uuid: string): AddMessageUuidAction => ({
  type: ADD_MESSAGE_UUID,
  payload: uuid,
});