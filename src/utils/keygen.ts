import { mnemonicToAccount } from "viem/accounts";
import { Buffer } from "buffer"; 

import * as ed from '@noble/ed25519';
import { sha512 } from '@noble/hashes/sha512'
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


export const generate_signature = async function (public_key: string) {
    // DO NOT CHANGE ANY VALUES IN THIS CONSTANT
    const SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN = {
      name: 'Farcaster SignedKeyRequestValidator',
      version: '1',
      chainId: 10,
      verifyingContract:
        '0x00000000fc700472606ed4fa22623acf62c60553' as `0x${string}`,
    };
  
    // DO NOT CHANGE ANY VALUES IN THIS CONSTANT
    const SIGNED_KEY_REQUEST_TYPE = [
      { name: 'requestFid', type: 'uint256' },
      { name: 'key', type: 'bytes' },
      { name: 'deadline', type: 'uint256' },
    ];
  
    const account = mnemonicToAccount(import.meta.env.VITE_FARCASTER_APP_MNEMONIC);
  
    // Generates an expiration date for the signature
    // e.g. 1693927665
    const deadline = Math.floor(Date.now() / 1000) + 86400; // signature is valid for 1 day from now
    // You should pass the same value generated here into the POST /signer/signed-key Neynar API
  
    // Generates the signature
    const signature = await account.signTypedData({
      domain: SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN,
      types: {
        SignedKeyRequest: SIGNED_KEY_REQUEST_TYPE,
      },
      primaryType: 'SignedKeyRequest',
      message: {
        requestFid: BigInt(import.meta.env.VITE_FARCASTER_APP_FID),
        key: public_key,
        deadline: BigInt(deadline),
      },
    });
  
    // Logging the deadline and signature to be used in the POST /signer/signed-key Neynar API
    return { deadline, signature };
  };
  