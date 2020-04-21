import React, { useEffect } from 'react';
import '@aws-amplify/ui/dist/style.css';
import { withAuthenticator } from 'aws-amplify-react';
import { Hub } from 'aws-amplify';
import TasksContainer from './components/TasksContainer';
import TaskCreator from "./components/TaskCreator";
import { Auth, API, Amplify } from './auth';
import { Appbar, Button, Container } from 'muicss/react';


function App() {
  window.props = { Auth, API, Amplify };
  let initialized = false;
  useEffect(() => {
    initialized = true;
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

  let currentUser = 'unauthenticated';

  if (initialized) { 
      Auth.currentSession().getIdToken().getJwtToken().then((user) => {
      currentUser = JSON.stringify(user);
    }).catch(() => console.log('Not signed in'))
  }

  return (
    <div>
        <Appbar><h1>The AMAZING Serverless Client</h1></Appbar>
        <Container>
            <TasksContainer />
        </Container>
    </div>
  );
}

// ensures the authentication context is provided
export default withAuthenticator(App, true);
