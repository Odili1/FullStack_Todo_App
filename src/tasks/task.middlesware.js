const joi = require('joi');

exports.validateAddTask = async (req, res, next) => {
    try {
        const Schema = joi.object({
            task: joi.string().required().messages({
                "string.empty": "No tasks inputed"
            }),
        });

        await Schema.validateAsync(req.body, {abortEarly: true})

        next()
    } catch (error) {
        console.log('loacls.tasks', res.locals.tasks || []);
        res.render('dashboard', {tasks: null, message: error.message})
    }
}
