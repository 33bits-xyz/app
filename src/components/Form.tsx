import React, { ReactNode, useEffect, useState } from "react";
import { Anchor, Button, Checkbox, Hourglass, ProgressBar, TextInput } from "react95";
import { get_public_key } from "../utils/keygen";
import { Buffer } from "buffer"; 
import './../styles/inputs.css';

import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import { Noir } from '@noir-lang/noir_js';

import circuit from '../../circuits/v1/target/main.json';

import axios from "axios";
import { stringToHexArray } from "../utils/string";
import SelectChannel from "./SelectChannel";
import { MAX_MESSAGE_LENGTH, sleep } from "../utils/common";


export enum CastMode {
  Reply = 'reply',
  Cast = 'cast',
}


export default function Form({
  userFid,
  privateKey,
  mode
}: {
  userFid: number,
  privateKey: string,
  mode: CastMode
}) {
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [replyLink, setReplyLink] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [proofGenerationWarningVisible, setProofGenerationWarningVisible] = useState<boolean>(true);
  const [selectChannelModalVisible, setSelectChannelModalVisible] = useState<boolean>(false);
  const [channel, setChannel] = useState<Channel | null>(null);
  const [successMessage, setSuccessMessage] = useState<ReactNode>("");

  const cast = async (): Promise<any> => {
    setLoadingMessage('Fetching Farcaster FIDs tree...');

    let reply_cast_id = '';

    // Fetch reply farcaster hash if provided
    if (replyLink.length > 0) {
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

    setLoadingMessage('Hold on, generating the zk proof…');

    const proof = await noir.generateFinalProof(input);

    setLoadingMessage('Verifying the zk proof and sending your cast. Please keep this tab open.');

    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/farcaster/cast`, {  
      proof: Array.from(proof.proof),
      publicInputs: proof.publicInputs.map(i => Array.from(i)),
      channel: channel === null ? null : channel.channel.id,
    });
  };

  return (
    <>
      <div style={{ display: selectChannelModalVisible ? 'block' : 'none' }}>
        <SelectChannel
          onClose={() => {
            setSelectChannelModalVisible(false);
          }}
          onChoose={(channel) => {
            setChannel(channel);
            setSelectChannelModalVisible(false);
          }}
        />
      </div>

      <div className="textarea-container mb-3">
        <TextInput
          id="textArea"
          multiline
          rows={8}
          value={message}
          disabled={loading}
          onChange={(e) => {
            setMessage(e.target.value.slice(0, MAX_MESSAGE_LENGTH));
          }}
          placeholder="What's on your mind? Your cast will be published through 33bits account."
          fullWidth
        />

        <div id="counter" className={message.length >= MAX_MESSAGE_LENGTH * 0.9 ? 'counter text-danger' : 'counter'}>
          { message.length } / { MAX_MESSAGE_LENGTH }
        </div>
      </div>

      {
        mode === CastMode.Reply && (
          <TextInput
            disabled={loading}
            value={replyLink}
            onChange={(e) => {
              setReplyLink(e.target.value);
            }}
            className="mb-3"
            placeholder="Paste the link to the cast"
          />
        )
      }

      {
        mode === CastMode.Cast && (
          <Button onClick={() => {
            if (channel === null) {
              setSelectChannelModalVisible(true);
            } else {
              setChannel(null);
            }
          }}>
            { channel === null ? 'Select channel' : `${channel.channel.name} ❌`}
          </Button>
        )
      }

      <div className="mt-3 mb-3 d-flex align-items-center justify-content-center w-100">
        {
          (
            <Button
              disabled={
                loading ||
                message.length === 0 ||
                (mode === CastMode.Reply && replyLink.length === 0)
              }
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

                    if (channel !== null) {
                      setSuccessMessage(
                        <>
                          Your cast was published successfully. View it on{" "}
                          <Anchor target="_blank" href={`https://warpcast.com/~/channel/${channel.channel.id}`}>
                            {channel.channel.name}
                          </Anchor> channel.
                        </>
                      );
                    } else {
                      setSuccessMessage(
                        <>
                          Your cast was published successfully. View it on{" "}
                          <Anchor target="_blank" href="https://warpcast.com/33bits">
                            @33bits
                          </Anchor>.
                        </>
                      );
                    }
                    
                    setChannel(null);
                  })
                  .catch((e) => {
                    console.log(e);

                    if (axios.isAxiosError(e)) {
                      setError(e.response?.data?.message);
                    } else {
                      setError(e.message);
                    }
                  })
                  .finally(() => {
                    setLoading(false);
                  })
              }}
              primary
              size="lg"
            >{ mode === CastMode.Cast ? '✨ Cast ✨' : '✨ Reply ✨' }</Button>
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
          <p>{ successMessage }</p>
        )
      }

      {
        error !== null &&
        (
          <>
            <p style={{ wordBreak: 'break-all' }} className="text-danger">{ error }</p>
          </>
        )
      }
    </>
  );
}