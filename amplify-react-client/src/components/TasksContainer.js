import React, { Component, useState, useEffect } from 'react';
import { API, Auth, getBearerToken } from '../auth';
const TasksContainer = ({api}) => {
    const [bearerToken, setBearerToken] = useState(null);
    const [tasks, setTasks] = useState([]);
    useEffect(() => {
        async function getToken() {
            try {
              const token = await getBearerToken();
              setBearerToken(token);
            } catch (e) {
              setBearerToken(null);
            }
        }
        getToken();
    });

    const taskTRs = tasks.map(t => (
        <tr>
            <td>{ t['taskId']['S'] }</td>
            <td>{ t['description']['S']}</td>
            <td>{ t['priority']['N']}</td>
            <td>{ t['dueDate']['S']}</td>
            <td>{ t['completed']['BOOL']}</td>
        </tr>

    ));

    return (
        <>
           <div>
               <h3>Load Tasks</h3>
                <button className="mui-btn mui-btn--primary" onClick={ () => {
                    async function loadTasks() {
                        const loadedTasks = await API.get('taskManagerNodeServerless', '/tasks', {
                            headers: { Authorization: bearerToken }
                        });
                        console.dir(loadedTasks);
                        setTasks(loadedTasks.tasks);
                    }
                    loadTasks();
                }}>Serverless</button>
                <button className="mui-btn mui-btn--primary" onClick={ () => {
                    async function loadTasks() {
                        const loadedTasks = await API.get('taskManagerNodeSam', '/tasks', {
                            headers: { Authorization: bearerToken }
                        });
                        console.dir(loadedTasks);
                        setTasks(loadedTasks);
                    }
                    loadTasks();
                }}>AWS SAM</button>
                <button className="mui-btn mui-btn--primary" onClick={ () => {
                    async function loadTasks() {
                        const loadedTasks = await API.get('taskManagerArchitect', '/tasks', {
                            headers: { Authorization: bearerToken }
                        });
                        console.dir(loadedTasks);
                        setTasks(loadedTasks);
                    }
                    loadTasks();
                }}>Architect (different data model)...</button>
            </div>

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
        </>
    )
}

export default TasksContainer;