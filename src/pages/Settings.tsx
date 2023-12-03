import React, { useEffect } from "react";
import { Anchor, Button, GroupBox, Separator } from "react95";

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import Loader from "../components/Loader";
import axios from "axios";
import { extractData } from "../utils/proof";


type Message = {
  text: string;
  cast_hash: string;
}


export default function Settings() {
  // const message_ids = useSelector((state: RootState) => state.auth.messages);
  // const [messages, setMessages] = React.useState<Message[] | null>(null);

  // useEffect(() => {
  //   const fetch_messages = async () => {
  //     if (!message_ids) return;

  //     const messages = await Promise.all(message_ids.map(async (message_id: string) => {
  //       const response = await axios.get(`https://snaphost.nyc3.digitaloceanspaces.com/public/33bits/${message_id}.json`);

  //       const inputs = extractData(response.data.proof.publicInputs);

  //       return {
  //         text: inputs.message,
  //         cast_hash: response.data.cast_hash
  //       }
  //     }));

  //     setMessages(messages);
  //   };

  //   fetch_messages();
  // }, [message_ids]);

  // if (messages === null && message_ids !== undefined && message_ids.length > 0) {
  //   return <Loader />;
  // }

  return (
    <>
      {/* {
        messages && messages.length > 0 && (
          <GroupBox label='Your casts'>
            <li>
              {
                messages.map((message: Message, i) => {
                  return (
                    <>
                      <li key={i} className="my-2">
                        <Anchor href={`https://warpcast.com/potekhin/${message.cast_hash}`} target="_blank">
                          { message.text.length > 50 ? message.text.slice(0, 50) + '...' : message.text }
                        </Anchor>
                      </li>
                    </>
                  );
                })
              }
            </li>
          </GroupBox>
        )
      } */}
      <div>
        <p>Signing out will require you to authenticate again in the future.</p>

        <Button className="my-2" fullWidth onClick={() => {
          localStorage.clear();
          window.location.reload();
        }}>Sign out ⚠️</Button>
      </div>
    </>
  );
}