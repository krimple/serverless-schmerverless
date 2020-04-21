import React, { useState, useEffect } from 'react';
import { getTasks } from '../tasks-api';
import NewTaskForm from "./NewTaskForm";
import { Appbar, Container, Row, Column, Divider } from 'muicss/react';

const TasksContainer = ({api}) => {
    async function loadTasks() {
        try {
            const tasks = await getTasks('taskManagerNodeServerless');
            setTasks(tasks);
        } catch (e) {
            console.error(e);
            alert('fetch of tasks failed');
        }
    }
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        (async () => {
            await loadTasks();
        })();
    }, []);

    const taskTRs = tasks ? tasks.map(t => (
        <tr>
            <td>{ t['taskId']['S'] }</td>
            <td>{ t['taskOwner']['S']}</td>
            <td>{ t['description']['S']}</td>
            <td>{ t['priority']['N']}</td>
            <td>{ t['dueDate']['S']}</td>
            <td>{ t['completed']['BOOL']}</td>
        </tr>

    )) : [];

    return (
        <Row>
           { tasks &&
               <div>
               <table className="mui-table">
                   <thead>
                     <tr>
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
               </div>
           }
           <div>
               <NewTaskForm onCreateComplete={
                   () => {
                       loadTasks();
                   }
               } />
           </div>
        </Row>
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