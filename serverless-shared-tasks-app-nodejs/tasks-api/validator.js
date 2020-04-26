const Joi = require('@hapi/joi');

const createSchema = Joi.object({
    taskOwner: Joi.string().min(1).max(80).required(),
    description: Joi.string().min(1).max(1024).required(),
    priority: Joi.number().min(1).max(5).required(),
    dueDate: Joi.date().iso().required()
});

const updateSchema = Joi.object({
    description: Joi.string().min(1).max(1024).required(),
    priority: Joi.number().min(1).max(5).required(),
    dueDate: Joi.date().iso().required(),
    completed: Joi.bool().required(),
    completedDate: Joi.date().iso()
});

exports.validateCreateTask = function validateTask(task) {
    const { error, value } = createSchema.validate(task);
    return error || undefined;
}

exports.validateUpdateTask = function validateTask(task) {
    const { error, value } = updateSchema.validate(task);
    return error || undefined;
}