import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import tasksReducer from './tasks-reducer';

// todo - get right type for history
export default (history: any) => combineReducers({
  router: connectRouter(history),
  tasksApi: tasksReducer
});
