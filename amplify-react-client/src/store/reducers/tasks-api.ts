import { API, getBearerToken, getUser } from '../../auth';
import { Task } from '../../models/task';

export async function addTask(apiName: string, task: Task) {
    try {
        const user = await getUser();
        const userName = user['username'];
        const token = await getBearerToken();
        return await API.post(apiName, `/tasks/${encodeURI(userName)}`, {
            headers: {Authorization: token},
            body: {
                task: {
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
export async function updateSingleTask(apiName: string, task: Task) {
    try {
        const user = await getUser();
        const userName = user['username'];
        const token = await getBearerToken();
        // split out the taskId - the payload doesn't want it but the URI expects it
        const { taskId, ...taskRest } = task;
        return await API.put(apiName, `/tasks/${encodeURI(userName)}/${taskId}`, {
            headers: {Authorization: token},
            body: {
                task: taskRest
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
        const response = await API.get(apiName, `/tasks/${encodeURI(userName)}`, {
            headers: { Authorization: token }
        });

        if (apiName === 'architect') {
            // 'tis easy, it returns the data as regular properties
            return response.tasks;
        } else {
            // TODO - fix the responses to be good little pieces of data like
            // architect returns...
            // The API I used for the Serverless and SAM returns Dynamo results
            // perhaps we could switch to the one like used by Architect - higher level
            // APIs.

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
        }
    } catch (e) {
        console.log('failed', e);
        throw e;
    }
}

export async function getSingleTask(apiName:string, taskId: string):Promise<Task> {
    try {
        const user = await getUser();
        const userName = user['username'];
        const token = await getBearerToken();
        const response = await API.get(apiName, `/tasks/${encodeURI(userName)}/${taskId}`, {
            headers: { Authorization: token },
        });

        // NOTE - the data coming back from DynamoDB is not typed,
        // it's a bag of properties. So we're doing a domain mapping process
        // here.
        return {
            taskId: taskId,
            taskOwner: userName,
            description: response.task['description']['S'],
            priority: response.task['priority']['N'],
            dueDate: response.task['dueDate']['S'],
            completed: response.task['completed']['BOOL'],
            completedDate: response.task['completedDate'] ? response.task['completedDate']['S'] : ''
        }
    } catch (e) {
        console.log('failed', e);
        throw e;
    }
}
