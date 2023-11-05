import React, { useEffect } from "react";
import QRCode from 'qrcode.react';

import { Buffer } from "buffer"; 
import axios from "axios";

import * as ed from '@noble/ed25519';
import { sha512 } from '@noble/hashes/sha512'
import { generate_signature } from "../utils/keygen";
import Loader from "../components/Loader";
ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m))


enum Status {
  LOADING,
  READY_TO_LOGIN,
  READY_TO_CAST,
  ERROR
}

enum SignedKeyState {
  PENDING = 'pending',
  APPROVED = 'approved',
  COMPLETED = 'completed',
}

interface SignedKeyRequestResponse {
  deeplinkUrl: string;
  key: string;
  requestFid: number;
  state: SignedKeyState;
  token: string;
}

interface SignedKeyRequest {
  key: string;
  requestFid: number;
  deadline: number;
  signature: string;
}


export default function Cast() {
  const [status, setStatus] = React.useState<Status>(Status.LOADING);
  const privKey = ed.utils.randomPrivateKey();
  const pubKey = ed.getPublicKey(privKey);
  const pubKeyHex = '0x' + Buffer.from(pubKey).toString('hex');

  useEffect(() => {
    const setup = async () => {
      const { signature, deadline } = await generate_signature(pubKeyHex);

      const request = {
        key: pubKeyHex,
        requestFid: import.meta.env.VITE_FARCASTER_APP_FID,
        deadline,
        signature
      } as SignedKeyRequest;

      const { data } = await axios.post('https://api.warpcast.com/v2/signed-key-requests', request);

      const response: SignedKeyRequestResponse = data.result.signedKeyRequest;

      console.log(response);
    };

    setup();
  }, []);

  if (status === Status.LOADING) {
    return <Loader/>;
  }

  return (
    <>
      <Loader/>
      {/* <p>Welcome to 33bits community!</p>
      <QRCode className="mt-3 mb-3" value={'https://yandex.com/'} />
      <p>To start casting login with your Warpcast account.</p> */}
    </>
  );
}