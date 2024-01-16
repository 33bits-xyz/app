import { Buffer } from "buffer"; 

import * as ed from '@noble/ed25519';
import { sha512 } from '@noble/hashes/sha512'
import { generate_signed_key_request } from "./warpcast";
import axios from "axios";
ed.etc.sha512Sync = (...m) => sha512(ed.etc.concatBytes(...m))


export const to_hex = (bytes: Uint8Array) => {
  return '0x' + Buffer.from(bytes).toString('hex');
};

export const from_hex = (hex: string) => {
  return Uint8Array.from(Buffer.from(hex.slice(2), 'hex'));
};

export const generate_private_key = () => {
  // Generate 30 random bytes
  const randomBuffer = window.crypto.getRandomValues(new Uint8Array(30));

  // Convert to hex string
  let hexString = Array.from(randomBuffer, byte => byte.toString(16).padStart(2, '0')).join('');

  // Pad with zeros to make the length 64 characters (32 bytes)
  hexString = hexString.padStart(64, '0');

  return `0x${hexString}`;
};

export const get_public_key = async (private_key: string) => {
  // @ts-ignore -- no types
  const circomlibjs = await import('circomlibjs');
  const mimc = await circomlibjs.buildMimc7();
  
  const hash = mimc.multiHash([private_key]);
  const hex = mimc.F.toString(hash, 16);

  return `0x${hex.padStart(64, '0')}`;
};

export const setupSignedKeyResponse = async (
  privateKey: string
) => {
  const publicKey = await get_public_key(privateKey);

  const {
    data: {
      signature,
      deadline,
      fid
    }
  } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/farcaster/sign_public_key`, {
    public_key: publicKey
  });

  return generate_signed_key_request(
    publicKey,
    deadline,
    signature,
    fid
  );
};
