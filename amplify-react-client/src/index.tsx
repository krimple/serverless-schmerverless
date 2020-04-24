import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createHashHistory } from 'history'
import {storeFactory} from "./store";

const history = createHashHistory({
  hashType: 'slash'
});

const store = storeFactory();

ReactDOM.render(
  <React.StrictMode>
    <App history={history} store={store} />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
