import React from 'react';
import { Link, Redirect, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import './App.css';
import { Navbar, Container } from 'react-bootstrap';
import { ConnectedRouter } from 'connected-react-router';
import '@aws-amplify/ui/dist/style.css';
import { Authenticator } from 'aws-amplify-react';
import TasksContainer from './components/TasksContainer';
import NewTaskForm from './components/NewTaskForm';
import { switchApiActionCreator } from "./store/reducers/tasks-reducer";
import UpdateTaskForm from "./components/UpdateTaskForm";
import Theme from './Amplify-UI-Theme-Sample';

// @ts-ignore
function App({ history, store }) {
  return (
    <Container>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Navbar bg='light' expand='lg'>
            <Navbar.Brand href="#/">Serverless Tasks</Navbar.Brand>
            <Navbar.Collapse id="basic-navbar-nav">
              <Link to="/tasks">Tasks</Link> |
            <Link to="/tasks/new">Add a task...</Link>
              <select onChange={(e) => {
                console.log(e.target.value);
                store.dispatch(switchApiActionCreator(e.target.value));
              }}>
                <option defaultChecked={true} value='serverless'>Serverless Framework</option>
                <option value='sam'>AWS SAM</option>
              </select>
              <Authenticator theme={Theme} />
            </Navbar.Collapse>
          </Navbar>
          <Switch>
            <Redirect path="/" exact={true} to="/tasks" />
            <Route path="/tasks" exact={true}>
              <TasksContainer />
            </Route>
            <Route path="/tasks/new">
              <NewTaskForm />
            </Route>
            <Route path="/tasks/:id">
              <UpdateTaskForm />
            </Route>
          </Switch>
        </ConnectedRouter>
      </Provider>
    </Container>
  );
}

// ensures the authentication context is provided
export default App;