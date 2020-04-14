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

    return (
        <>
            <div>
              <button onClick={ () => {
                  async function loadTasks() {
                    const loadedTasks = await API.get('taskManagerSam', '/tasks', {
                        headers: { Authorization: bearerToken }
                    });
                    console.dir(loadedTasks);
                    setTasks(loadedTasks);
                  }
                  loadTasks();
              }}>Load tasks SAM...</button>
            </div>
            <div>
                <button onClick={ () => {
                    async function loadTasks() {
                        const loadedTasks = await API.get('taskManagerServerless', '/tasks', {
                            headers: { Authorization: bearerToken }
                        });
                        console.dir(loadedTasks);
                        setTasks(loadedTasks);
                    }
                    loadTasks();
                }}>Load tasks Serverless...</button>
            </div>
            <div>
                <button onClick={ () => {
                    async function loadTasks() {
                        const loadedTasks = await API.get('taskManagerNodeServerless', '/tasks', {
                            headers: { Authorization: bearerToken }
                        });
                        console.dir(loadedTasks);
                        setTasks(loadedTasks);
                    }
                    loadTasks();
                }}>Load tasks Serverless NodeJS...</button>
            </div>
            <div>
                <button onClick={ () => {
                    async function loadTasks() {
                        const loadedTasks = await API.get('taskManagerArchitect', '/tasks', {
                            headers: { Authorization: bearerToken }
                        });
                        console.dir(loadedTasks);
                        setTasks(loadedTasks);
                    }
                    loadTasks();
                }}>Load tasks Architect (different data model)...</button>
            </div>
            <div>
                <button onClick={ () => {
                    async function loadTasks() {
                        const loadedTasks = await API.get('taskManagerNodeSam', '/tasks', {
                            headers: { Authorization: bearerToken }
                        });
                        console.dir(loadedTasks);
                        setTasks(loadedTasks);
                    }
                    loadTasks();
                }}>Load tasks NodeJS SAM</button>
            </div>
            { tasks && (<pre>{JSON.stringify(tasks, undefined, 2)}</pre>) }
        </>
    )
}

export default TasksContainer;