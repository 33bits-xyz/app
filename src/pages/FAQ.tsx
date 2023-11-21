import React from "react";
import { Anchor, ScrollView, Separator } from "react95";
import Link33bits from "../components/Link_33bits";


export default function FAQ() {
    return (
        <div>
            <p>- What is 33bits?</p>
            <br/>
            <p>
                33bits is an experiment in using privacy as a tool to provoke conversations and uncover truths.
                ZK prove that your Farcaster FID is ≤10001 and cast on {<Link33bits/>} feed without disclosing your account.
            </p>

            <Separator className="my-3" />

            <p>- Who can post on 33bits? </p>
            <br />
            <p>
                Eligibility for posting on 33bits is exclusive to Farcaster accounts with FID ≤ 10001.
            </p>

            <Separator className="my-3"/>

            <p>- Why does it take time to cast?</p>
            <br />
            <p>
                Generating and verifying zk proofs is a complex task.
                It demands complex computations and significant memory usage.
                For more technical details, please refer to our { <Anchor href="https://github.com/33bits-xyz/app" target="_blank">Github repo</Anchor> }.
            </p>

            <Separator className="my-3" />
            <p>- What is proof verification?</p>
            <br />
            <p>
                Every cast on the {<Link33bits/>} feed is paired with a zero-knowledge (zk) proof.
                Anyone can verify zk proofs to confirm that the cast was posted by an eligible author: they have a valid Farcaster account and their FID is ≤ 10001.
                This verification process is seamlessly conducted directly in your browser.
            </p>

            <Separator className="my-3" />
            <p>- What does 33bits mean?</p>
            <br />
            <p>
                The name '33bits' is referencing Arvind Narayanan's concept <Anchor href="https://33bits.wordpress.com/about/" target="_blank">“33 Bits of Entropy”</Anchor>, which claims that de-anonymizing an individual is possible using just 33 bits of information.
                This concept is also mentioned by Balaji Srinivasan in his talk, <Anchor href="https://www.youtube.com/watch?v=Dur918GqDIw&t=119s" target="_blank">'The Pseudonymous Economy'</Anchor>.
            </p>

            <Separator className="my-3" />
            <p>Built by <Anchor href="https://warpcast.com/fastfourier.eth" target="_blank">@fastfourtier</Anchor> and <Anchor target="_blank" href="https://warpcast.com/kugusha.eth">@kugusha</Anchor>, inspired by the OGs <Anchor href="https://www.heyanon.xyz/" target="_blank">@heyanon</Anchor> and <Anchor href="https://sismo.io" target="_blank">sismo.io</Anchor>.</p>
            <p>The code is <Anchor href="https://github.com/33bits-xyz" target="_blank">open source</Anchor>.</p>
        </div>
    );
}