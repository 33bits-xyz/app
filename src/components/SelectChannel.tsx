import React, { useEffect } from "react";

import { Grid, Row, Col } from 'react-flexbox-grid';
import { Button, Monitor, Tab, TabBody, Tabs, Window, WindowContent, WindowHeader } from 'react95';


export default function SelectChannel() {
  return (
    <Window className='window' style={{
      width: '100%',
      position: 'absolute',
      top: '50px',
      left: '10px',
      zIndex: 2
    }} >
      <WindowHeader>
        <span>Select channel</span>
      </WindowHeader>

      <WindowContent>
        <div>
          Select channel
        </div>
      </WindowContent>
    </Window>
  );
}