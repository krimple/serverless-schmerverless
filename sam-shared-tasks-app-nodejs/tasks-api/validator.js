const Joi = require('@hapi/joi');

const schema = Joi.object({
    taskOwner: Joi.string().min(1).max(80).required(),
    description: Joi.string().min(1).max(1024).required(),
    priority: Joi.number().min(1).max(5).required(),
    dueDate: Joi.date().iso().required()
});

exports.validateTask = function validateTask(task) {
    const { error, value } = schema.validate(task);
    return error || undefined;
}