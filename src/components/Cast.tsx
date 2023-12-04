import React, { useEffect, useState } from "react";
import { Anchor, Button, Checkbox, Hourglass, ProgressBar, TextInput } from "react95";
import { get_public_key } from "../utils/keygen";
import { Buffer } from "buffer"; 
import './inputs.css';

import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import { Noir } from '@noir-lang/noir_js';

import circuit from './../../circuits/v1/target/main.json';

import axios from "axios";
import { stringToHexArray } from "../utils/string";


const MAX_LENGTH = 320;


function stringToPaddedByteArray(input: string): Uint8Array {
  // Convert the string to an array of bytes
  const encoder = new TextEncoder();
  const byteArray = encoder.encode(input);

  // Create a new Uint8Array of size 256
  const paddedArray = new Uint8Array(256);

  // Copy the original bytes into the new array
  paddedArray.set(byteArray);

  // Return the padded array
  return paddedArray;
}

const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}


export default function Cast({
  userFid,
  privateKey
}: {
  userFid: number,
  privateKey: string
}) {
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [isReply, setIsReply] = useState<boolean>(false);
  const [replyLink, setReplyLink] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [proofGenerationWarningVisible, setProofGenerationWarningVisible] = useState<boolean>(true);

  const cast = async (): Promise<any> => {
    setLoadingMessage('Fetching Farcaster FIDs tree...');

    let reply_cast_id = '';

    // Fetch reply farcaster hash if provided
    if (isReply && replyLink.length > 0) {
      const replyLinkBase64 = Buffer.from(replyLink).toString('base64');

      try {
        const {
          data
        } = await axios(`${import.meta.env.VITE_API_BASE_URL}/farcaster/warpcast/${replyLinkBase64}`);  

        reply_cast_id = data.cast_id;
      } catch (e) {
        throw new Error(`Could not find a cast with the provided link. Please, try again.`);
      }
    }

    // Check FID is whitelisted
    const {
      data: {
        whitelist
      }
    } = await axios(`${import.meta.env.VITE_API_BASE_URL}/farcaster/whitelist`);

    if (userFid > 10001 && !whitelist.includes(userFid)) {
      throw new Error(`It appears that your FID (Farcaster ID) is greater than 10001. Unfortunately, the first version of 33bits is only accessible to accounts with an FID of 10001 or lower.`);
    }

    // @ts-ignore
    const backend = new BarretenbergBackend(circuit);
    // @ts-ignore
    const noir = new Noir(circuit, backend);

    const publicKey = await get_public_key(privateKey);

    const {
      data: tree
    } = await axios(`${import.meta.env.VITE_API_BASE_URL}/farcaster/tree`);

    // Search for public key
    const nodeIndex = tree.elements.findIndex((x: any) => x.key === publicKey);

    if (nodeIndex === -1) {
      console.log('not found, sleeping');
      await sleep(5000);

      return cast();
    }

    const node = tree.elements[nodeIndex];

    const input = {
      fid: userFid,
      public_key_preimage: privateKey,
      public_key: publicKey,
      note_root: tree.root,
      index: nodeIndex,
      note_hash_path: node.path,
      timestamp: Math.floor(Date.now() / 1000),
      message: stringToHexArray(message, 16),
      reply: stringToHexArray(reply_cast_id, 4),
    };

    console.log('input');
    console.log(input);

    console.log('generating proof');

    setLoadingMessage('Hold on, generating the zk proof…');

    const proof = await noir.generateFinalProof(input);
    console.log(proof);

    setLoadingMessage('Verifying the zk proof and sending your cast. Please keep this tab open.');

    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/farcaster/cast`, {
      proof: Array.from(proof.proof),
      publicInputs: proof.publicInputs.map(i => Array.from(i))
    });

    console.log(response);
  };

  return (
    <>    
      <div className="textarea-container">
        <TextInput
          id="textArea"
          multiline
          rows={8}
          value={message}
          disabled={loading}
          onChange={(e) => {
            setMessage(e.target.value.slice(0, MAX_LENGTH));
          }}
          placeholder="What's on your mind? Your cast will be published through 33bits account."
          fullWidth
        />

        <div id="counter" className={message.length >= MAX_LENGTH * 0.9 ? 'counter text-danger' : 'counter'}>
          { message.length } / { MAX_LENGTH }
        </div>
      </div>

      {/* <Checkbox
        className="my-3"
        name='shipping'
        value='shipping'
        label='Reply to a cast'
        disabled={loading}
        onChange={(e) => {
          setIsReply(e.target.checked);
        }}
      />

      <TextInput
        disabled={!isReply || loading}
        value={replyLink}
        onChange={(e) => {
          setReplyLink(e.target.value);
        }}
        className="mb-3"
        placeholder="Paste link to a cast"
      /> */}

      <div className="mt-3 mb-3 d-flex align-items-center justify-content-center w-100">
        {
          loading === false && (
            <Button
              disabled={loading || message.length === 0 || (isReply && replyLink.length === 0)}
              onClick={() => {
                setLoading(true);
                setSuccess(false);
                setError(null);
                setProofGenerationWarningVisible(false);
    
                cast()
                  .then(() => {
                    setSuccess(true);
                    setMessage("");
                    setReplyLink("");
                  })
                  .catch((e) => {
                    setError(e.message);
                  })
                  .finally(() => {
                    setLoading(false);
                  })
              }}
              primary
              size="lg"
            >✨ Cast ✨</Button>
          )
        }
      </div>

      {
        proofGenerationWarningVisible && (
          <p>
            * It will take a few minutes to generate and verify the proof.
          </p>
        )
      }

      {
        loading === true && (
          <>
            <div className="mt-3 mb-3 d-flex align-items-center justify-content-center w-100">
              <div>
                <Hourglass size={32} style={{ margin: 10 }} />
              </div>
              <div>
                <p>{ loadingMessage }</p>
              </div>
            </div>
          </>
        )
      }

      {
        success === true &&
        (
          <p>Your cast was published successfully. View it on <Anchor target="_blank" href="https://warpcast.com/33bits">@33bits</Anchor>.</p>
        )
      }

      {
        error !== null &&
        (
          <>
            {/* <p>Something went wrong. Please, try casting again.</p> */}
            <p style={{ wordBreak: 'break-all' }} className="text-danger">{ error }</p>
          </>
        )
      }

      {/* {
        userFid > 10000 && 
        (
          <p>Currently only first 10k Farcaster users are allowed to cast. Stay in touch, we'll remove the whitelist soon!</p>
        )
      } */}
    </>
  );
}