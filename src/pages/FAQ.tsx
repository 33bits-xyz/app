import React from "react";
import { Separator } from "react95";


export default function FAQ() {
    return (
        <div>
            <p>- What is 33bits?</p>
            <br/>
            <p>
                33bits is an MVP for pseudo-anonymous posting on Farcaster, 
                using an 'early' fid as a basic reputation signal. 
                This app is designed to encourage open dialogue in the pursuit of truth. 
                Its utility is dual-edged: it can either cultivate meaningful conversations or descend into toxicity. 
                The choice is ours.
            </p>

            <Separator className="my-3" />

            <p>- Who can post on 33bits? </p>
            <br />
            <p>
                Eligibility for posting on 33bits is exclusive to Farcaster accounts with fid ≤ 10001.
            </p>
        </div>
    );
}