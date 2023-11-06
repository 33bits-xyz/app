import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the type for the slice state
interface AuthState {
  privateKey: string | null;
  signedKeyResponse: SignedKeyRequestResponse | null;
  userFid: number | null;
}

// Define the initial state using that type
const initialState: AuthState = {
  privateKey: null,
  signedKeyResponse: null,
  userFid: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setPrivateKey(state, action: PayloadAction<string>) {
      state.privateKey = action.payload;
    },
    setSignedKeyResponse(state, action: PayloadAction<SignedKeyRequestResponse>) {
      state.signedKeyResponse = action.payload;
    },
    setUserFid(state, action: PayloadAction<number>) {
      state.userFid = action.payload;
    },
  },
});

export const { setPrivateKey, setSignedKeyResponse, setUserFid } = authSlice.actions;
export default authSlice.reducer;
