import React from "react";
import { Anchor } from "react95";


export default function About() {
    return (
        <p>
            <p>Made by <Anchor href="https://warpcast.com/fastfourier.eth">@fastfourtier</Anchor> and <Anchor href="https://warpcast.com/kugusha.eth">@kugusha</Anchor>.</p>
            <p>Code is open source, feel free to use - <Anchor>Github</Anchor></p>
            <p className="pt-5">WAGMI</p>
        </p>
    );
}