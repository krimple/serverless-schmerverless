import { Task } from '../../models/task';
import { addTask, getTasks } from '../../tasks-api';
import {  Dispatch } from "redux";

export interface TasksApiState {
  tasks: Task[];
  callPending: boolean,
  apiPrefix: string
}

export const initialState: TasksApiState = {
  tasks: [],
  callPending: false,
  apiPrefix: 'serverless'
};

export enum TaskActionTypes {
  TASK_ACTION_FETCH_ALL_REQUEST= 'TASK_ACTION_FETCH_ALL',
  TASK_ACTION_CREATE_TASK_PENDING = 'TASK_ACTION_CREATE_TASK_PENDING',
  TASK_ACTION_CREATE_TASK_SUCCESS = 'TASK_ACTION_CREATE_TASK_SUCCESS',
  TASK_ACTION_CREATE_TASK_FAIL = 'TASK_ACTION_CREATE_TASK_FAIL',
  TASK_ACTION_FETCH_TASKS_REQUEST = 'TASK_ACTION_FETCH_TASKS_PENDING',
  TASK_ACTION_FETCH_TASKS_PENDING = 'TASK_ACTION_FETCH_TASKS_PENDING',
  TASK_ACTION_FETCH_TASKS_SUCCESS = 'TASK_ACTION_FETCH_TASKS_SUCCESS',
  TASK_ACTION_FETCH_TASKS_FAIL = 'TASK_ACTION_FETCH_TASKS_FAIL'
}

export interface TaskActions {
  type: TaskActionTypes,
  // TODO - get better at this
  payload: any
}

export default function tasksReducer(
  state: TasksApiState = initialState, action: TaskActions) {
  switch (action.type) {
    case TaskActionTypes.TASK_ACTION_FETCH_ALL_REQUEST:
      return {...state};
    case TaskActionTypes.TASK_ACTION_CREATE_TASK_PENDING:
      return {...state, callPending: true};
    case TaskActionTypes.TASK_ACTION_CREATE_TASK_SUCCESS:
      return {...state, callPending: false, tasks: action.payload.tasks};

      default:
      return state;
  }
}

export function loadTasksActionCreator() {
  // @ts-ignore
  return async (dispatch, getState) => {
    dispatch({
      type: TaskActionTypes.TASK_ACTION_FETCH_TASKS_PENDING
    });
    try {
      const apiPrefix = getState().tasksApi.apiPrefix;
      const tasks: Task[] = await getTasks(apiPrefix);

      dispatch({
        type: TaskActionTypes.TASK_ACTION_FETCH_TASKS_SUCCESS.valueOf(),
        payload: {
          tasks: tasks
        }
      });
    } catch (e) {
      console.error(e);
      dispatch({
        type: TaskActionTypes.TASK_ACTION_FETCH_TASKS_FAIL.valueOf(),
        error: e
      });
    }
  }
}

export function addTaskActionCreator(task: Task) {
  return async (dispatch: Dispatch, getState: () => TasksApiState) => {
   try {
     const apiPrefix = getState().apiPrefix;
     await addTask(apiPrefix, task);
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
