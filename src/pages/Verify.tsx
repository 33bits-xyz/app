import React, { useState } from "react";
import { Anchor, Button, Hourglass, TextInput } from "react95";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import axios from "axios";
import moment from 'moment';
import { verify } from "@noble/ed25519";

import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import { Noir } from '@noir-lang/noir_js';

import circuit from './../../circuits/target/main.json';
import Link33bits from "../components/Link_33bits";


export const HUMAN_DATE_TIME_FORMAT = 'MMM Do YYYY, h:mm a';


interface MessageProof {
  proof: number[];
  publicInputs: number[][];
}

interface Message {
  farcaster_hash: string | null;
  id: string;
  proof: MessageProof;
  text: string;
  timestamp: string;
  version: number;
}


export function Verify() {
  const [query, setQuery] = useState<string>("");
  const [message, setMessage] = useState<Message | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingText, setLoadingText] = useState<string | null>(null);

  const extractFarcasterHash = (text: string): string | null => {
    // Regular expression to match a Farcaster hash
    // It looks for '0x' followed by a sequence of hexadecimal characters
    const regex = /0x[a-fA-F0-9]+/;
  
    // Search for the pattern in the text
    const match = text.match(regex);
  
    // If a match is found, return it; otherwise return null
    return match ? match[0] : null;
  };
  
  const fetch = async (): Promise<any> => {
    const farcaster_hash = extractFarcasterHash(query);

    setLoadingText('Retrieving cast information...');

    await axios.get(`${import.meta.env.VITE_API_BASE_URL}/farcaster/farcaster_hash/${farcaster_hash}`)
      .then(async ({ data }) => {
        setLoadingText('Verifying the proof...');
    
        // Verify proof
        // @ts-ignore
        const backend = new BarretenbergBackend(circuit);
        // @ts-ignore
        const noir = new Noir(circuit, backend);
    
        await backend.instantiate();
        await backend['api'].acirInitProvingKey(
          backend['acirComposer'],
          backend['acirUncompressedBytecode']
        );
    
        // @ts-ignore/
        const verification = await noir.verifyFinalProof(data.proof);
    
        if (verification) {
          setMessage(data);
        } else {
          setError('Failed to verify this zk proof.');
        }  
      }).catch((e) => {
        setError('This cast is not from the @33bits feed. Please provide a valid cast link.');
      });
  }

  return (
    <Container fluid>
      <Row className="pb-3">
        <Col>
          <p>
            Verify if a cast on the {<Link33bits />} feed was posted by an eligible account.
          </p>
        </Col>
      </Row>

      <Row className="text-center pb-2">
        <Col xs={12} sm={9} lg={9} className="pb-2">
          <TextInput
            rows={4}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            placeholder="Enter cast url"
            fullWidth
          />
        </Col>

        <Col xs={12} sm={3} lg={3}>
          <Button
            fullWidth
            disabled={loadingText !== null || extractFarcasterHash(query) === null}
            onClick={() => {
              setMessage(null);
              setError(null);
              setLoadingText(null);

              fetch()
                .then(() => {
                  
                })
                .catch((e) => {
                  console.log(e);
                  setError(`Verification failed: ${e.response.data.message}`);
                })
                .finally(() => {
                  setLoadingText(null);
                })
            }}
          >Verify</Button>
        </Col>
      </Row>


      {
        error != null && (
          <Row className="">
            <Col className="pt-2">
              <p className="text-danger">Status: {error}</p>
            </Col>
          </Row>
        )
      }

      {
        loadingText != null && (
          <Row className="text-center">
            <Col className="pt-2">
              <div className="mt-3 mb-3 d-flex align-items-center justify-content-center w-100">
                <Hourglass size={32} style={{ margin: 10 }} />

                <p>{ loadingText }</p>
              </div>
            </Col>
          </Row>
        )
      }

      {
        message != null && (
          <>
            <Row className="pt-2">
              <Col>
                <p className="text-success">Status: the zk proof is valid!</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <p style={{ wordBreak: 'break-all' }}>Text: "{ message.text }"</p> 
              </Col>
            </Row>
            <Row>
              <Col>
                <p>Timestamp: {message.timestamp} ({ moment(message.timestamp).format(HUMAN_DATE_TIME_FORMAT) })</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <p style={{ wordBreak: 'break-all' }}>Proof: { JSON.stringify(message.proof) }</p>
              </Col>
            </Row>
          </>
        )
      }
    </Container>
  );
}