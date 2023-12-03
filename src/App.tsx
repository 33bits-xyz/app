import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { Button, Monitor, Tab, TabBody, Tabs, Window, WindowContent, WindowHeader } from 'react95';

import Main from './pages/Main';
import FAQ from './pages/FAQ';
import Settings from './pages/Settings';
import { Verify } from './pages/Verify';

import { Grid, Row, Col } from 'react-flexbox-grid';


export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const maintenance = import.meta.env.VITE_MAINTENANCE_MODE;
  const activeTab = location.pathname.replace('/', '');

  return (
    <Grid fluid>
      <Row className='pt-5'>
        <Col
          xs={12}
          xsOffset={0}
          sm={8}
          smOffset={2}
          lg={4}
          lgOffset={4}
          md={8}
          mdOffset={2}
        >
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
                    <Tabs value={activeTab} onChange={(page) => navigate('/' + page)}>
                      <Tab value={''}>Cast</Tab>
                      <Tab value={'settings'}>Settings</Tab>
                      <Tab value={'verify'}>Verify</Tab>
                      <Tab value={'faq'}>FAQ</Tab>
                    </Tabs>
      
                    <TabBody>
                      <div style={{ display: activeTab === '' ? 'block' : 'none' }}>
                        <Main />
                      </div>
                      <div style={{ display: activeTab === 'settings' ? 'block' : 'none' }}>
                        <Settings />
                      </div>
                      <div style={{ display: activeTab === 'verify' ? 'block' : 'none' }}>
                        <Verify />
                      </div>
                      <div style={{ display: activeTab === 'faq' ? 'block' : 'none' }}>
                        <FAQ />
                      </div>
                    </TabBody>
                  </>
                )
              }
            </WindowContent>
          </Window>
        </Col>
      </Row>
    </Grid>
  );
};