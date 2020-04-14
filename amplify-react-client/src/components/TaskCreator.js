import React, { useEffect, useState } from 'react';
import { API, Auth, getBearerToken } from '../auth';
import NewTaskForm from './NewTaskForm';

const TaskCreator = ({api}) => {
    const [bearerToken, setBearerToken] = useState(null);
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
            <NewTaskForm />
          <div>
            { bearerToken &&
                <>
                    <button onClick={async () => {
                        API.post('taskManagerSam', '/tasks', {
                            headers: { Authorization: bearerToken},
                            body: {
                                task: "get things done",
                                priority: 3,
                                dueDate: new Date().toISOString()
                            }
                        })
                    }}>Create a task SAM!</button>
                </>
            }
          </div>
          <div>
                { bearerToken &&
                <>
                    <button onClick={async () => {
                        API.post('taskManagerServerless', '/tasks', {
                            headers: { Authorization: bearerToken },
                            body: {
                                task: "get things done",
                                priority: 3,
                                dueDate: new Date().toISOString()
                            }
                        })
                    }}>Create a task Serverless!</button>
                </>
                }
          </div>
            <div>
                { bearerToken &&
                <>
                    <button onClick={async () => {
                        API.post('taskManagerNodeServerless', '/tasks', {
                            headers: { Authorization: bearerToken },
                            body: {
                                task: "get things done",
                                priority: 3,
                                dueDate: new Date().toISOString()
                            }
                        })
                    }}>Create a task Serverless Node!</button>
                </>
                }
            </div>

            <div>
                { bearerToken &&
                <>
                    <button onClick={async () => {
                        API.post('taskManagerNodeSam', '/tasks', {
                            headers: { Authorization: bearerToken },
                            body: {
                                task: "get things done",
                                priority: 3,
                                dueDate: new Date().toISOString()
                            }
                        })
                    }}>Create a task SAM (NodeJS)!</button>
                </>
                }
            </div>
        </>
    );
}

export default TaskCreator;