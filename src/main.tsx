import { Buffer } from 'buffer';
window.Buffer = Buffer;

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

import { Provider } from 'react-redux';
import store from './redux/store';

import 'react-flexbox-grid/dist/react-flexbox-grid.css';
import './styles/App.css';
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
  .window-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .close-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    margin-left: -1px;
    margin-top: -1px;
    transform: rotateZ(45deg);
    position: relative;
    &:before,
    &:after {
      content: '';
      position: absolute;
      background: ${({ theme }) => theme.materialText};
    }
    &:before {
      height: 100%;
      width: 3px;
      left: 50%;
      transform: translateX(-50%);
    }
    &:after {
      height: 3px;
      width: 100%;
      left: 0px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
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
