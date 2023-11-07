import React, { useEffect } from "react";

import Loader from "../components/Loader";

import { useSelector, useDispatch } from 'react-redux';
import { setPrivateKey, setSignedKeyResponse } from '../redux/authSlice';
import { RootState } from '../redux/store';
import { generate_private_key, generate_signature, get_public_key } from "../utils/keygen";
import { generate_signed_key_request } from "../utils/warpcast";

import ConnectWarpcaster from "../components/ConnectWarpcaster";
import Publish from "../components/Cast";


export default function Main() {
  const dispatch = useDispatch();
  const privateKey = useSelector((state: RootState) => state.auth.privateKey);
  const signedKeyResponse = useSelector((state: RootState) => state.auth.signedKeyResponse);
  const userFid = useSelector((state: RootState) => state.auth.userFid);
  
  if (privateKey === null) {
    dispatch(setPrivateKey(generate_private_key()));
  }

  useEffect(() => {
    if (signedKeyResponse !== null || privateKey === null) return;

    const setupSignedKeyResponse = async () => {
      const publicKey = get_public_key(privateKey);

      const { signature, deadline } = await generate_signature(publicKey);

      const response = await generate_signed_key_request(publicKey, deadline, signature);

      dispatch(setSignedKeyResponse(response));
    };

    setupSignedKeyResponse(); 
  }, [privateKey]);

  // if (privateKey === null || signedKeyResponse === null) {
  //   return <Loader/>;
  // }

  // if (userFid === null) {
  //   return <ConnectWarpcaster signedKeyResponse={signedKeyResponse} />
  // }

  return (
    <Publish userFid={123} />
  );
}