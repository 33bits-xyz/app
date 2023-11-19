import React, { useState } from "react";
import { Anchor, Button, Hourglass, ProgressBar, TextInput } from "react95";
import { get_public_key } from "../utils/keygen";
import { Buffer } from "buffer"; 
import './inputs.css';

import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import { Noir } from '@noir-lang/noir_js';

import circuit from './../../circuits/target/main.json';

import axios from "axios";
import { stringToHexArray } from "../utils/string";
import { useDispatch } from "react-redux";
// import { addMessageUuid } from "../redux/authSlice";


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
  const [response, setResponse] = useState<boolean | null>(null);
  const [proofGenerationWarningVisible, setProofGenerationWarningVisible] = useState<boolean>(true);

  const dispatch = useDispatch();

  const cast = async (): Promise<any> => {
    setLoadingMessage('Fetching Farcaster FIDs tree...');

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
      message: stringToHexArray(message),
    };

    console.log('input');
    console.log(input);

    console.log('generating proof');

    setLoadingMessage('Hold on, generating the zk proof…');

    const proof = await noir.generateFinalProof(input);
    console.log(proof);

    // const timestamp = Buffer.from(proof.publicInputs[0]).toString('hex');
    // const note_root = Buffer.from(proof.publicInputs[1]).toString('hex');
    // console.log('timestamp');
    // console.log(timestamp);
    // console.log('note root');
    // console.log(note_root);

    // setLoadingMessage('Verifying the proof...');

    // console.log('verifying proof');
    // const verification = await noir.verifyFinalProof(proof);

    // if (!verification) {
    //   throw new Error('Proof verification failed');
    // }

    // const proof_string = JSON.stringify({
    //   proof: Array.from(proof.proof),
    //   publicInputs: proof.publicInputs.map(i => Array.from(i))
    // });

    setLoadingMessage('Verifying the zk proof and sending your cast. Please keep this tab open.');

    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/farcaster/cast`, {
      proof: Array.from(proof.proof),
      publicInputs: proof.publicInputs.map(i => Array.from(i))
    });

    console.log(response);

    // dispatch(addMessageUuid(response.data.uuid));
  };

  return (
    <>
      {/* <p>Hello, {userFid}</p> */}

      <div className="textarea-container">
        <TextInput
          id="textArea"
          multiline
          rows={6}
          value={message}
          disabled={loading}
          onChange={(e) => {
            setMessage(e.target.value.slice(0, MAX_LENGTH));
          }}
          placeholder="What's on your mind?"
          fullWidth
        />

        <div id="counter" className={message.length >= MAX_LENGTH * 0.9 ? 'counter text-danger' : 'counter'}>
          { message.length } / { MAX_LENGTH }
        </div>
      </div>

      <div className="mt-3 mb-3 d-flex align-items-center justify-content-center w-100">
        {
          loading === false && (
            <Button
              disabled={loading || message.length === 0 || message.length >= MAX_LENGTH}
              onClick={() => {
                setLoading(true);
                setResponse(null);
                setProofGenerationWarningVisible(false);
    
                cast()
                  .then(() => {
                    setResponse(true);
                    setMessage("");
                  })
                  .catch((e) => {
                    console.log('error');
                    console.log(e);
                    setResponse(false);
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
              <Hourglass size={32} style={{ margin: 10 }} />

              <p>{ loadingMessage }</p>
            </div>
          </>
        )
      }

      {
        response === true &&
        (
          <p>Your cast was published successfully. View it on <Anchor target="_blank" href="https://warpcast.com/potekhin">@33bits</Anchor>.</p>
        )
      }

      {
        response === false &&
        (
          <p>Something went wrong. Please, try casting again.</p>
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