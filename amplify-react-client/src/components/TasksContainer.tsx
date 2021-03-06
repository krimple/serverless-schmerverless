import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadTasksActionCreator} from "../store/reducers/tasks-reducer";
import { Container } from 'muicss/react';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { Task } from '../models/task';

const TasksContainer = (props: any) => {
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(loadTasksActionCreator());
  }, [dispatch]);
  const tasks: Task[] = props.tasks;

  const taskTRs = tasks ? tasks.map((t: Task) => (
    <tr key={ t.taskId }>
      <td><Link to={'/tasks/' + t.taskId}>{ t.taskId }</Link></td>
      <td>{ t.taskOwner }</td>
      <td>{ t.description }</td>
      <td>{ t.priority }</td>
      <td>{ t.dueDate }</td>
      <td>{ t.completed ? 'YES' : 'NO' }</td>
    </tr>
  )) : [];

  return (
    <Container>
      { tasks &&
      <table className="table table-bordered table-striped">
          <thead>
          <tr key="thead">
              <th>ID</th>
              <th>Owner</th>
              <th>Description</th>
              <th>Priority</th>
              <th>Due Date</th>
              <th>Complete</th>
          </tr>
          </thead>
          <tbody>
          { taskTRs }
          </tbody>
      </table>
      }
    </Container>
  )
}

function mapStateToProps(reduxState: any) {
  return {
    tasks: reduxState.tasksApi.tasks || []
  }
}
export default connect(mapStateToProps)(TasksContainer);


/*
                   <button className="mui-btn mui-btn--primary" onClick={() => {
                       async function loadTasks() {
                           const loadedTasks = await API.get('taskManagerArchitect', '/tasks', {
                               headers: {Authorization: bearerToken}
                           });
                           console.dir(loadedTasks);
                           setTasks(loadedTasks);
                       }

                       loadTasks();
                   }}>Architect (different data model)...</button>
 */