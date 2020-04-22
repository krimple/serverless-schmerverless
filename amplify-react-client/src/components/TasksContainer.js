import React, { useState, useEffect } from 'react';
import { getTasks } from '../tasks-api';
import NewTaskForm from "./NewTaskForm";
import { Appbar, Container, Row, Col, Divider } from 'muicss/react';

const TasksContainer = ({api}) => {
    const [tasks, setTasks] = useState([]);

    async function loadTasks() {
        try {
            const tasks = await getTasks('taskManagerNodeServerless');
            setTasks(tasks);
        } catch (e) {
            console.error(e);
            alert('fetch of tasks failed');
        }
    }

    useEffect(() => {
        (async () => {
            await loadTasks();
        })();
    }, []);

    const taskTRs = tasks.map((t,idx) => (
        <tr key={t['taskId']['S']}>
            <td>{t['taskId']['S']}</td>
            <td>{t['description']['S']}</td>
            <td>{t['priority']['N']}</td>
            <td>{t['dueDate']['S']}</td>
            <td>{t['completed']['BOOL']}</td>
        </tr>
    ));

    return (
      <Container fluid={true}>
        <Row>
          <Col md="4">
            <NewTaskForm onCreateComplete={
              () => {
                loadTasks();
              }
            } />
          </Col>
          <Divider/>
          <Col md="8">
            { tasks &&
              <table className="mui-table">
                <thead>
                  <tr>
                    <th>ID</th>
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
          </Col>
      </Row>
   </Container>
  )
}

export default TasksContainer;


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
