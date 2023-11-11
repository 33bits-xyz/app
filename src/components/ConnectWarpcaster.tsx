import React, { useEffect } from "react";


import QRCodeSVG from "qrcode.react";
import { Anchor } from "react95";
import { poll_signed_key_request } from "../utils/warpcast";
import { setUserFid } from "../redux/authSlice";
import { useDispatch } from "react-redux";


const POLLING_INTERVAL_MS = 2000;


export default function ConnectWarpcaster({
  signedKeyResponse
} : {
  signedKeyResponse: SignedKeyRequestResponse
}) {
  const dispatch = useDispatch();

  // Poll signed key response
  useEffect(() => {
    const interval = setInterval(async () => {
      const data = await poll_signed_key_request(signedKeyResponse.token);

      if (data.userFid !== undefined) {
        dispatch(setUserFid(data.userFid));
        clearInterval(interval);
      }
    }, POLLING_INTERVAL_MS);
  }, [signedKeyResponse]);

  return (
    <>
      <p>
        Welcome to <Anchor href="https://warpcaster.com/33bits" target="_blank">33bits</Anchor> community! 
        Sign in with Warpcaster to start. 
      </p>
      <div className="mt-3 mb-3 d-flex align-items-center justify-content-center w-100">
        <QRCodeSVG value={signedKeyResponse.deeplinkUrl} />
      </div>

      <p>
      Your login details are used only to verify your identity and are not sent anywhere.
      </p>
    </>
  );
}