import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import Auth from "./components/Authentication/Auth";
import { GoogleOAuthProvider } from '@react-oauth/google';
const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
    <GoogleOAuthProvider clientId="416586594491-8rn1g2rccddt8ko637b2uq38k221catk.apps.googleusercontent.com">
        <BrowserRouter basename={baseUrl}>
            <Auth>
                <App/>
            </Auth>
    
        </BrowserRouter>
    </GoogleOAuthProvider>);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();