const Joi = require('@hapi/joi');

const createSchema = Joi.object({
    description: Joi.string().min(1).max(1024).required(),
    priority: Joi.number().min(1).max(5).required(),
    dueDate: Joi.date().required()
});

const updateSchema = Joi.object({
    description: Joi.string().min(1).max(1024).required(),
    priority: Joi.number().min(1).max(5).required(),
    dueDate: Joi.date().required(),
    completed: Joi.bool().required(),
    completedDate: Joi.date()
});

exports.validateCreateTask = function validateTask(task) {
    const { error, value } = createSchema.validate(task, { abortEarly: false });
    return error ? 
      error.details.map(d => ( { path: d.path.join('.'), message: d.message }))
      :
      undefined;
}

exports.validateUpdateTask = function validateTask(task) {
    const { error, value } = updateSchema.validate(task, { abortEarly: false });
    return error ?
      error.details.map(d => ( { path: d.path.join('.'), message: d.message }))
      :
      undefined;
}