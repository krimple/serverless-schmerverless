import { API, getBearerToken, getUser } from './auth';

export async function addTask(apiName, task) {
    try {
        const user = await getUser();
        const userName = user['username'];
        console.log(`****** USER IS ${JSON.stringify(user)}`);
        const token = await getBearerToken();
        return await API.post('taskManagerNodeServerless', '/tasks', {
            headers: {Authorization: token},
            body: {
                task: {
                    taskOwner: userName,
                    description: task.description,
                    priority: task.priority,
                    dueDate: task.dueDate

                }
            }
        });
    } catch (e) {
        console.log('failed', e);
        throw e;
    }
}

export async function getTasks(apiName) {
    try {
        const user = await getUser();
        const userName = user['username'];
        const token = await getBearerToken();
        const response = await API.get(apiName, '/tasks', {
            headers: { Authorization: token },
            queryStringParameters: {
                taskOwner: userName
            }
        });
        return response.tasks;
    } catch (e) {
        console.log('failed', e);
        throw e;
    }
}
