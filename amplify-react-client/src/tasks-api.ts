import { API, getBearerToken, getUser } from './auth';
import { Task } from './models/task';

export async function addTask(apiName: string, task: Task) {
    try {
        const user = await getUser();
        const userName = user['username'];
        const token = await getBearerToken();
        return await API.post(apiName, '/tasks', {
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

export async function getTasks(apiName:string):Promise<Task[]> {
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

        // NOTE - the data coming back from DynamoDB is not typed,
        // it's a bag of properties. So we're doing a domain mapping process
        // here.
        return response.tasks.map((t: any) => ({
           taskId: t['taskId']['S'],
           taskOwner: t['taskOwner']['S'],
           description: t['description']['S'],
           priority: t['priority']['N'],
           dueDate: t['dueDate']['S'],
           completed: t['completed']['BOOL']
        }));
    } catch (e) {
        console.log('failed', e);
        throw e;
    }
}
