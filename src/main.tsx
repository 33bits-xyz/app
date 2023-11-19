import { Buffer } from 'buffer';
window.Buffer = Buffer;

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

import { Provider } from 'react-redux';
import store from './redux/store';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import '@react95/icons/icons.css';

import { createGlobalStyle, ThemeProvider } from 'styled-components';
import styled from 'styled-components';

/* Pick a theme of your choice */
import original from 'react95/dist/themes/original';
import { styleReset } from 'react95';

/* Original Windows95 font (optional) */
import ms_sans_serif from 'react95/dist/fonts/ms_sans_serif.woff2';
import ms_sans_serif_bold from 'react95/dist/fonts/ms_sans_serif_bold.woff2';
import {
  BrowserRouter as Router,
} from 'react-router-dom';


const GlobalStyles = createGlobalStyle`
  ${styleReset}
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif}') format('woff2');
    font-weight: 400;
    font-style: normal
  }
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif_bold}') format('woff2');
    font-weight: bold;
    font-style: normal
  }
  body, input, select, textarea {
    font-family: 'ms_sans_serif';
  }
`;


const Wrapper = styled.div`
  background: ${({ theme }) => theme.desktopBackground};
  min-height: 100vh;
  a:visited { color: LinkText; }
`;


ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <>
    <GlobalStyles />
    <ThemeProvider theme={original}>
      <Wrapper>
        <Router>
          <Provider store={store}>
            <App />
          </Provider>
        </Router>
      </Wrapper>
    </ThemeProvider>
  </>
  // </React.StrictMode>,
)
