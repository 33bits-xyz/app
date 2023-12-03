import React, { useEffect } from "react";


import QRCodeSVG from "qrcode.react";
import { Anchor } from "react95";
import { poll_signed_key_request } from "../utils/warpcast";
import { setUserFid } from "../redux/authSlice";
import { useDispatch } from "react-redux";
import { Col, Grid, Row } from "react-flexbox-grid";


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
    <Grid fluid>
      <Row>
        <Col>
          <p>
            Hey! 33bits is currently exclusive to Farcaster accounts with FID ≤ 10001. Sign in with your Farcaster account to get started. Click on QR code or scan it with your mobile device.
          </p>
        </Col>
      </Row>

      <Row className="py-3 d-flex justify-content-center">
        <Col>
          <a
            href={signedKeyResponse.deeplinkUrl}
            style={{
              WebkitTouchCallout: "none",
              WebkitUserSelect: "none",
              KhtmlUserSelect: "none",
              MozUserSelect: "none",
              msUserSelect: "none",
              userSelect: "none"
            }}
          >
            <QRCodeSVG value={signedKeyResponse.deeplinkUrl} />
          </a>
        </Col>
      </Row>

      <Row>
        <Col>
          <p>
            Your FID is not stored or sent anywhere. It is only used for generating zero-knowledge proofs.
          </p>
        </Col>
      </Row>
    </Grid>
  );
}