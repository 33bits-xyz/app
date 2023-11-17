import React, { useState } from "react";
import { Button, TextInput } from "react95";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import axios from "axios";
import moment from 'moment';
import { verify } from "@noble/ed25519";

import { BarretenbergBackend } from '@noir-lang/backend_barretenberg';
import { Noir } from '@noir-lang/noir_js';

import circuit from './../../circuits/target/main.json';


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
  const [error, setError] = useState<string | null>(null); // [error, setError
  const [loading, setLoading] = useState<boolean>(false);
  const [verifying, setVerifying] = useState<boolean>(false);
  const [verified, setVerified] = useState<boolean | null>(null);
  const [message, setMessage] = useState<Message | null>(null);

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

    try {
      const {
        data
      } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/farcaster/farcaster_hash/${farcaster_hash}`);  

      setMessage(data)
    } catch (e) {
      setError('Cast not found');
    }
  }

  const verify = async (): Promise<boolean> => {
    // @ts-ignore
    const backend = new BarretenbergBackend(circuit);
    // @ts-ignore
    const noir = new Noir(circuit, backend);
    
    await backend.instantiate();
    await backend['api'].acirInitProvingKey(
      backend['acirComposer'],
      backend['acirUncompressedBytecode']
    );

    // @ts-ignore
    return noir.verifyFinalProof(message?.proof);
  }

  return (
    <Container fluid>
      <Row className="text-center pb-2">
        <Col xs={12} sm={9} lg={9} className="pb-2">
          <TextInput
            rows={4}
            value={query}
            onChange={(e) => {
              console.log(extractFarcasterHash(e.target.value));
              setQuery(e.target.value);
            }}
            placeholder="Enter cast url"
            fullWidth
          />
        </Col>

        <Col xs={12} sm={3} lg={3}>
          <Button
            fullWidth
            disabled={loading || extractFarcasterHash(query) === null}
            onClick={() => {
              setLoading(true);
              setError(null);
              setMessage(null);

              fetch()
                .then(() => {

                })
                .catch((e) => {
                  console.log('error');
                  console.log(e);
                })
                .finally(() => {
                  setLoading(false);
                })
            }}
          >Verify</Button>
        </Col>
      </Row>


      {
        error != null && (
          <Row className="text-center">
            <Col className="pt-2">
              <p className="text-danger">{error}</p>
            </Col>
          </Row>
        )
      }

      {
        message != null && (
          <>
            <Row className="pt-2">
              <Col>
                <p>Text: "{ message.text }"</p> 
              </Col>
            </Row>
            <Row>
              <Col>
                <p>Time: { moment(message.timestamp).format(HUMAN_DATE_TIME_FORMAT) }</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <p style={{ wordBreak: 'break-all' }}>Proof: { JSON.stringify(message.proof) }</p>
              </Col>
            </Row>

            {
              verified != null && (
                <Row>
                  <Col>
                    <p 
                      className={verified ? 'text-success' : 'text-danger'}
                    >{ verified ? 'Proof is verified' : 'Failed to verify proof' }</p>
                  </Col>
                </Row>
              )
            }

            <Row className="text-center pt-3">
              <Col>
                <Button
                  disabled={verifying}
                  onClick={(e) => {
                    setVerifying(true);

                    verify()
                      .then((verification: boolean) => {
                        console.log(verification);
                        setVerified(verification);
                      })
                      .catch()
                      .finally(() => {
                        setVerifying(false);
                      });
                }}>{ verifying ? 'Verifying...' : 'Verify ZK proof' }</Button>
              </Col>
            </Row>
          </>
        )
      }
    </Container>
  );
}