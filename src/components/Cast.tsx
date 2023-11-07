import React, { useState } from "react";
import { Button, TextInput } from "react95";
import { get_public_key } from "../utils/keygen";
import { sha256 } from '@noble/hashes/sha256';
import { Buffer } from "buffer"; 

import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import { Noir } from '@noir-lang/noir_js';

import circuit from './../../circuits/target/main.json';

import { etc } from "@noble/ed25519";
import { ethers } from "ethers";
import { fetchStorageProof, uint8ArrayToHexArray } from "../utils/storageProof";


export default function Cast({
  userFid
}: {
  userFid: number
}) {
  const [message, setMessage] = useState<string>("Test cast");
  const [loading, setLoading] = useState<boolean>(false);

  const provider = new ethers.providers.JsonRpcProvider(import.meta.env.VITE_RPC);
  const blockNumber = ethers.BigNumber.from('14194126');
  const storageKey = '0xbbc70db1b6c7afd11e79c0fb0051300458f1a3acb8ee9789d9b6b26c61ad9bc7'; // Replace with actual storage key
  const accountAddress = '0xb47e3cd837dDF8e4c57f05d70ab865de6e193bbb'; // Replace with actual account address
  const maxDepth = 8; // Specify your maximum depth
  
  const cast = async () => {
    // @ts-ignore
    const backend = new BarretenbergBackend(circuit);
    // @ts-ignore
    const noir = new Noir(circuit, backend);

    const [storageRoot, trieProof] = await fetchStorageProof(provider, blockNumber, accountAddress, storageKey, maxDepth);

    console.log(`storage_root=[${uint8ArrayToHexArray(Uint8Array.from(Buffer.from(storageRoot)))}]`);
    console.log(trieProof.toTomlString('storage_proof'));

    const input = {
      storage_proof: {
        key: Array.from(trieProof.key),
        proof: Array.from(trieProof.proof),
        depth: trieProof.depth,
        value: Array.from(trieProof.value)
      },
      storage_root: Array.from(storageRoot)
    };

    console.log('generating proof');
    const proof = await noir.generateFinalProof(input);

    console.log('proof generated');
    console.log(proof);
  };

  return (
    <>
      <p>Hello, {userFid}</p>

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
        <Button
          disabled={loading}
          onClick={() => {
            setLoading(true);

            cast()
              .finally(() => {
                setLoading(false);
              })
          }}
          primary
          size="lg"
        >✨ Cast ✨</Button>
      </div>
    </>
  );
}