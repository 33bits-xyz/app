import React from "react";
import { Button, Separator } from "react95";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


export default function Settings() {
  return (
    <>
      <Button fullWidth onClick={() => {
        localStorage.clear();
        window.location.reload();
      }}>Reset ⚠️</Button>
    </>
  );
}