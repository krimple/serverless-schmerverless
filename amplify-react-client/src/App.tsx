import React, { useEffect } from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
  Link
} from 'react-router-dom';
import './App.css';

import '@aws-amplify/ui/dist/style.css';
import { withAuthenticator } from 'aws-amplify-react';
import { Hub } from 'aws-amplify';
import { Appbar  } from 'muicss/react';
import TasksContainer from './components/TasksContainer';
import NewTaskForm from "./components/NewTaskForm";

function App() {
  useEffect(() => {
    console.log('Running effect');
    Hub.listen('auth', ({ payload: { event, data } }) => {
      switch (event) {
        case 'signIn':
          console.log('sign in', event, data);
          break;
        case 'signOut':
          console.log('sign out', event, data);
          break;
        default:
          console.log('unknown event', event, data);
          break;
      }
      return null;
    });
  });

  return (
    <Router>
      <Appbar>
        <h1>Cloud Tasks</h1>
      </Appbar>
      <div className="main-menu">
        <Link to="/tasks">Tasks</Link> |
        <Link to="/tasks/new">Add a task...</Link>
      </div>
      <Switch>
        <Redirect path="/" exact={true} to="/tasks" />
        <Route path="/tasks" exact={true}>
          <TasksContainer />
        </Route>
        <Route path="/tasks/new">
          <NewTaskForm />
        </Route>
      </Switch>
    </Router>
  );
}

// ensures the authentication context is provided
export default withAuthenticator(App, true);