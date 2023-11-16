import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Route,
  Routes
} from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { Button, Monitor, Tab, TabBody, Tabs, Window, WindowContent, WindowHeader } from 'react95';

import Main from './pages/Main';
import FAQ from './pages/FAQ';
import Settings from './pages/Settings';


export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const maintenance = import.meta.env.VITE_MAINTENANCE_MODE;

  return (
    <Container fluid>
      <Row className='pt-5 pb-5 justify-content-md-center'>
        <Col xs={12} lg={4}>
          <Window className='window' style={{ width: '100%' }}>
            <WindowHeader>
              <span>33bits.exe</span>
            </WindowHeader>

            <WindowContent>
              {
                maintenance && (
                  <div className='text-center'>
                    <Monitor backgroundStyles={{ background: 'blue' }} ></Monitor>
                    <p className='mt-5'>
                      33bits is currently under maintenance, come back later.
                    </p>
                  </div>
                )
              }

              {
                !maintenance && (
                  <>
                    <Tabs value={location.pathname.replace('/', '')} onChange={(page) => navigate(page)}>
                      <Tab value={''}>Cast</Tab>
                      <Tab value={'settings'}>Settings</Tab>
                      <Tab value={'faq'}>FAQ</Tab>
                    </Tabs>
      
                    <TabBody>
                      <Routes>
                        <Route path='/' element={ <Main /> }></Route>
                        <Route path='/settings' element={ <Settings /> }></Route>
                        <Route path='/faq' element={ <FAQ /> }></Route>
                      </Routes>
                    </TabBody>
                  </>
                )
              }
            </WindowContent>
          </Window>
        </Col>
      </Row>
    </Container>
  );
};