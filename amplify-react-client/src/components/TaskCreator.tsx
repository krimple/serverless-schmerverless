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
                        API.post('taskManagerNodeServerless', '/tasks', {
                            headers: { Authorization: bearerToken },
                            body: {
                                task: {
                                    taskOwner: "Ken Rimple",
                                    description: "get things done",
                                    priority: 3,
                                    dueDate: new Date().toISOString()
                                }
                            }
                        })
                    }}>Create a new task via Serverless Node!</button>
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
                                task: {
                                    description: "get things done",
                                    priority: 3,
                                    dueDate: new Date().toISOString()
                                }
                            }
                        })
                    }}>Create a task via AWS SAM (NodeJS)!</button>
                </>
                }
            </div>
        </>
    );
}

export default TaskCreator;

