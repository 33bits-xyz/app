import {
  AuthActionTypes,
  SET_PRIVATE_KEY,
  SET_SIGNED_KEY_RESPONSE,
  SET_USER_FID
} from './actions';

export interface AuthState {
  privateKey: string | null;
  signedKeyResponse: SignedKeyRequestResponse | null;
  userFid: number | null;
}

const initialState: AuthState = {
  privateKey: null,
  signedKeyResponse: null,
  userFid: null,
};

function rootReducer(state: AuthState = initialState, action: AuthActionTypes): AuthState {
  switch (action.type) {
    case SET_PRIVATE_KEY:
      return {
        ...state,
        privateKey: action.payload,
      };
    case SET_SIGNED_KEY_RESPONSE:
      return {
        ...state,
        signedKeyResponse: action.payload,
      };
    case SET_USER_FID:
      return {
        ...state,
        userFid: action.payload,
      };
    default:
      return state;
  }
}

export default rootReducer;
