import {createStore, compose, applyMiddleware, Store} from 'redux';
import ReduxThunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerMiddleware} from 'connected-react-router';
import createRootReducer from './reducers/root-reducer';


// @ts-ignore
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export function storeFactory(): Store {
  const history = createHashHistory();
  return createStore(
    createRootReducer(history),
    {},
    composeEnhancers(
      applyMiddleware(
        routerMiddleware(history),
        ReduxThunk
      )
    ));
}