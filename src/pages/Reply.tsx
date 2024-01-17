import React, { useEffect } from "react";

import Loader from "../components/Loader";

import { useSelector, useDispatch } from 'react-redux';
import { setPrivateKey, setSignedKeyResponse } from '../redux/authSlice';
import { RootState } from '../redux/store';
import { generate_private_key, setupSignedKeyResponse } from "../utils/keygen";

import ConnectWarpcaster from "../components/ConnectWarpcaster";
import Form, { CastMode } from "../components/Form";


export default function Reply() {
  const dispatch = useDispatch();

  const privateKey = useSelector((state: RootState) => state.auth.privateKey);
  const signedKeyResponse = useSelector((state: RootState) => state.auth.signedKeyResponse);
  const userFid = useSelector((state: RootState) => state.auth.userFid);
  
  if (privateKey === null) {
    dispatch(setPrivateKey(generate_private_key()));
  }

  useEffect(() => {
    if (signedKeyResponse !== null || privateKey === null) return;

    setupSignedKeyResponse(privateKey).then((response) => {
      dispatch(setSignedKeyResponse(response));
    }); 
  }, [privateKey]);

  if (privateKey === null || signedKeyResponse === null) {
    return <Loader/>;
  }

  if (userFid === null) {
    return <ConnectWarpcaster signedKeyResponse={signedKeyResponse} />
  }

  return (
    <Form
      privateKey={privateKey}
      userFid={userFid}
      mode={CastMode.Reply}
    />
  );
}