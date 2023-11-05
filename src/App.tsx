import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Route,
  Routes
} from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { Tab, TabBody, Tabs, Window, WindowContent, WindowHeader } from 'react95';

import Cast from './pages/Cast';
import FAQ from './pages/FAQ';
import About from './pages/About';


export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Container fluid>
      <Row className='pt-5 pb-5 justify-content-md-center'>
        <Col xs={12} lg={6}>
          <Window className='window' style={{ width: '100%' }}>
            <WindowHeader>
              <span>33bits.exe</span>
            </WindowHeader>

            <WindowContent>
              <Tabs value={location.pathname.replace('/', '')} onChange={(page) => navigate(page)}>
                <Tab value={''}>Cast</Tab>
                <Tab value={'faq'}>FAQ</Tab>
                <Tab value={'about'}>About</Tab>
              </Tabs>

              <TabBody>
                <Routes>
                  <Route path='/' element={ <Cast /> }></Route>
                  <Route path='/faq' element={ <FAQ /> }></Route>
                  <Route path='/about' element={ <About /> }></Route>
                </Routes>
              </TabBody>
            </WindowContent>
          </Window>
        </Col>
      </Row>
    </Container>
  );
};