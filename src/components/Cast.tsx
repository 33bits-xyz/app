import React, { useState } from "react";
import { Button, TextInput } from "react95";
import { get_public_key } from "../utils/keygen";

import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import { Noir } from '@noir-lang/noir_js';

import circuit from './../../circuits/target/main.json';


export default function Cast({
  privateKey,
  userFid
}: {
  privateKey: string,
  userFid: number
}) {
  const publicKey = get_public_key(privateKey);

  const [message, setMessage] = useState<string>("Test cast");


  const cast = async () => {
    // @ts-ignore
    const backend = new BarretenbergBackend(circuit);
    // @ts-ignore
    const noir = new Noir(circuit, backend);

    const input = {
      fid: 10,
      private_key: privateKey
    };

    console.log('generating proof');
    // Sign message with private key
    const proof = await noir.generateFinalProof(input);

    console.log('proof generated');
    console.log(proof);
  };

  return (
    <>
      <p>Hello, {userFid}</p>
      <p className="mb-5">Signer public key {publicKey}</p>

      <TextInput multiline rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="What's on your mind?" fullWidth />

      <div className="mt-3 mb-3 d-flex align-items-center justify-content-center w-100">
        <Button onClick={() => cast()} primary size="lg">✨ Cast ✨</Button>
      </div>
    </>
  );
}