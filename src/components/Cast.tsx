import React, { useState } from "react";
import { Anchor, Button, Hourglass, ProgressBar, TextInput } from "react95";
import { get_public_key } from "../utils/keygen";
import { Buffer } from "buffer"; 

import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import { Noir } from '@noir-lang/noir_js';

import circuit from './../../circuits/target/main.json';

import axios from "axios";
import { stringToHexArray } from "../utils/string";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


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
  const [message, setMessage] = useState<string>("Test cast");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [response, setResponse] = useState<boolean | null>(null);

  const cast = async (): Promise<any> => {
    setLoadingMessage('Fetching Farcaster tree...');

    // @ts-ignore
    const backend = new BarretenbergBackend(circuit);
    // @ts-ignore
    const noir = new Noir(circuit, backend);

    const publicKey = await get_public_key(privateKey);

    console.log('casting');
    console.log('private key');
    console.log(privateKey);
    console.log('public key');
    console.log(publicKey);

    const {
      data: tree
    } = await axios('https://33bits.xyz/api');

    // Search for public key in members
    // TODO: not found yet
    const nodeIndex = tree.members.findIndex((x: any) => x.element.key === publicKey);

    if (nodeIndex === -1) {
      console.log('not found, sleeping');
      await sleep(5000);

      return cast();
    }

    const node = tree.members[nodeIndex];

    const messageBytes = Array.from(stringToPaddedByteArray(message));

    console.log('message bytes');
    console.log(messageBytes);

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

    setLoadingMessage('Generating proof...');

    const proof = await noir.generateFinalProof(input);
    console.log(proof);

    setLoadingMessage('Verifying proof...');

    console.log('verifying proof');
    const verification = await noir.verifyFinalProof(proof);

    if (!verification) {
      throw new Error('Proof verification failed');
    }
  };

  return (
    <>
      {/* <p>Hello, {userFid}</p> */}

      <TextInput
        multiline
        rows={4}
        value={message}
        disabled={loading}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="What's on your mind?"
        fullWidth
      />

      <div className="mt-3 mb-3 d-flex align-items-center justify-content-center w-100">
        {
          loading === false && (
            <Button
              disabled={loading || message.length === 0}
              onClick={() => {
                setLoading(true);
                setResponse(null);
    
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
            <p>Successfully published! Your message will appear in <Anchor href="https://warpcast.com/33bits">@33bits</Anchor> soon.</p>
          )
        }

        {
          response === false &&
          (
            <p>Something went wrong. Please, try again later or contact our support</p>
          )
        }
    </>
  );
}