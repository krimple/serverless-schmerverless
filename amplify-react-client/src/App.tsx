import React from 'react';
import {Link, Redirect, Route, Switch} from 'react-router-dom';
import {Provider} from 'react-redux';
import './App.css';
import {ConnectedRouter} from 'connected-react-router';
import '@aws-amplify/ui/dist/style.css';
import {withAuthenticator} from 'aws-amplify-react';
import {Appbar} from 'muicss/react';
import TasksContainer from './components/TasksContainer';
import NewTaskForm from './components/NewTaskForm';
import {switchApiActionCreator} from "./store/reducers/tasks-reducer";

// @ts-ignore
function App({history, store}) {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Appbar>
          <h1>Cloud Tasks</h1>
        </Appbar>
        <div className="main-menu">
          <Link to="/tasks">Tasks</Link> |
          <Link to="/tasks/new">Add a task...</Link>
        </div>
        <span>API: </span>
        <select onChange={(e) => {
          console.log(e.target.value);
          store.dispatch(switchApiActionCreator(e.target.value));
        }}>
          <option defaultChecked={true} value='serverless'>Serverless Framework</option>
          <option value='sam'>AWS SAM</option>
        </select>
        <Switch>
          <Redirect path="/" exact={true} to="/tasks" />
          <Route path="/tasks" exact={true}>
            <TasksContainer />
          </Route>
          <Route path="/tasks/new">
            <NewTaskForm />
          </Route>
        </Switch>
      </ConnectedRouter>
    </Provider>

  );
}

// ensures the authentication context is provided
export default withAuthenticator(App, true);