import React, { useEffect } from "react";

import Loader from "../components/Loader";

import { useSelector, useDispatch } from 'react-redux';
import { setPrivateKey, setSignedKeyResponse } from '../redux/authSlice';
import { RootState } from '../redux/store';
import { generate_private_key, get_public_key } from "../utils/keygen";
import { generate_signed_key_request } from "../utils/warpcast";

import ConnectWarpcaster from "../components/ConnectWarpcaster";
import Cast from "../components/Cast";
import axios from "axios";


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
      const publicKey = await get_public_key(privateKey);

      console.log('preparing signed response');
      console.log('private key');
      console.log(privateKey);
      console.log('public key');
      console.log(publicKey);

      const {
        data: {
          signature,
          deadline,
          fid
        }
      } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/sign`, {
        public_key: publicKey
      });

      console.log(signature);
      console.log(deadline);
      console.log(fid);

      const response = await generate_signed_key_request(
        publicKey,
        deadline,
        signature,
        fid
      );

      dispatch(setSignedKeyResponse(response));
    };

    setupSignedKeyResponse(); 
  }, [privateKey]);

  if (privateKey === null || signedKeyResponse === null) {
    return <Loader/>;
  }

  if (userFid === null) {
    return <ConnectWarpcaster signedKeyResponse={signedKeyResponse} />
  }

  return (
    <Cast privateKey={privateKey} userFid={userFid} />
  );
}