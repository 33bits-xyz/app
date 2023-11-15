import axios from "axios";


export const generate_signed_key_request = async (
  key: string,
  deadline: number,
  signature: string,
  fid: number
) => {
  const request = {
    key,
    requestFid: fid,
    deadline,
    signature
  } as SignedKeyRequest;

  const { data } = await axios.post('https://api.warpcast.com/v2/signed-key-requests', request);

  const response: SignedKeyRequestResponse = data.result.signedKeyRequest;

  return response;
}

export const poll_signed_key_request = async (
  token: string,
) => {
  const { data } = await axios.get(
    `https://api.warpcast.com/v2/signed-key-request`,
    {
      params: {
        token
      }
    }
  );

  return data.result.signedKeyRequest as SignedKeyRequestResponse;
}