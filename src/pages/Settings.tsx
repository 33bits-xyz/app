import React, { useEffect } from "react";
import { Anchor, Button, GroupBox, Separator } from "react95";


export default function Settings() {
  return (
    <>
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