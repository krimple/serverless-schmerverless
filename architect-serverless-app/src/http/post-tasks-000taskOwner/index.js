let uuid = require('uuid');
let { http, tables } = require('@architect/functions')

// The async wrapper will handle JSON transformation and body parsing
exports.handler = http.async(handler);

async function handler(request) {
  let data = await tables();

  try {
    const newTask = await data.tasks.put({
      taskId: uuid.v4(),
      taskOwner: 'Ken Rimple',
      description: 'Why is it so?',
      priority: 3,
      completed: false,
      dueDate: new Date().toISOString()
    });
    // all three props are required here
    return {
      status: 200,
      type: 'application/json',
      body: { task: newTask }
    }
  }
  catch (e) {
    console.log('it failed...');
    console.error(e);
    throw e;
  }
}


