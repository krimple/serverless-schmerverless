import { Task } from '../../models/task';
import { addTask, getTasks } from '../../tasks-api';
import {  Dispatch } from "redux";

export interface TasksApiState {
  tasks: Task[];
  callPending: boolean,
  error?: string,
  api: string
}

export const initialState: TasksApiState = {
  tasks: [],
  callPending: false,
  error: undefined,
  api: 'serverless'
};

export enum TaskActionTypes {
  TASK_ACTION_CREATE_TASK_PENDING = 'TASK_ACTION_CREATE_TASK_PENDING',
  TASK_ACTION_CREATE_TASK_SUCCESS = 'TASK_ACTION_CREATE_TASK_SUCCESS',
  TASK_ACTION_CREATE_TASK_FAIL = 'TASK_ACTION_CREATE_TASK_FAIL',
  TASK_ACTION_FETCH_TASKS_REQUEST = 'TASK_ACTION_FETCH_TASKS_PENDING',
  TASK_ACTION_FETCH_TASKS_PENDING = 'TASK_ACTION_FETCH_TASKS_PENDING',
  TASK_ACTION_FETCH_TASKS_SUCCESS = 'TASK_ACTION_FETCH_TASKS_SUCCESS',
  TASK_ACTION_FETCH_TASKS_FAIL = 'TASK_ACTION_FETCH_TASKS_FAIL',
  TASK_ACTION_SWITCH_API = 'TASK_ACTION_SWITCH_API'
}

export interface TaskActions {
  type: TaskActionTypes,
  // TODO - get better at this
  payload: any
}

export default function tasksReducer(
  state: TasksApiState = initialState, action: TaskActions) {
  switch (action.type) {
    case TaskActionTypes.TASK_ACTION_FETCH_TASKS_REQUEST:
      return {...state};
    case TaskActionTypes.TASK_ACTION_CREATE_TASK_PENDING:
      return {...state, callPending: true};
    case TaskActionTypes.TASK_ACTION_FETCH_TASKS_PENDING:
      return {...state, callPending: true, error: undefined, tasks: []};
    case TaskActionTypes.TASK_ACTION_FETCH_TASKS_SUCCESS:
      return {...state, callPending: false, error: undefined, tasks: action.payload.tasks};
    case TaskActionTypes.TASK_ACTION_FETCH_TASKS_FAIL:
      return {...state, callPending: false, tasks: [], error: action.payload.error};
    case TaskActionTypes.TASK_ACTION_SWITCH_API:
      return { ...state, api: action.payload.api}
    default:
      return state;
  }
}

export const loadTasksActionCreator = () => {
  // @ts-ignore
  return async (dispatch, getState) => {
    dispatch({
      type: TaskActionTypes.TASK_ACTION_FETCH_TASKS_PENDING
    });
    try {
      const apiPrefix = getState().tasksApi.api;
      const tasks: Task[] = await getTasks(apiPrefix);

      return dispatch({
        type: TaskActionTypes.TASK_ACTION_FETCH_TASKS_SUCCESS,
        payload: {
          tasks: tasks
        }
      });
    } catch (e) {
      console.error(e);
      dispatch({
        type: TaskActionTypes.TASK_ACTION_FETCH_TASKS_FAIL,
        payload: {
          error: e
        }
      });
    }
  }
}

export function addTaskActionCreator(task: Task) {
  return async (dispatch: Dispatch, getState: () => any) => {
   try {

     const api = getState().tasksApi.api;
     await addTask(api, task);
     return dispatch({
       type: TaskActionTypes.TASK_ACTION_CREATE_TASK_SUCCESS
     })
   } catch (e) {
     console.error(e);
     return dispatch({
       type: TaskActionTypes.TASK_ACTION_CREATE_TASK_FAIL,
       error: e
     })
   }
  };
}

export function switchApiActionCreator(api: string) {
  return async (dispatch: Dispatch, getState: () => any) => {

    // first, reset the API
    dispatch({
      type: TaskActionTypes.TASK_ACTION_SWITCH_API,
      payload: {
        api
      }
    });
    // next, load the state again
    dispatch(loadTasksActionCreator());
  };
}

