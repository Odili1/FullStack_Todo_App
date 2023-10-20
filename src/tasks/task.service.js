const taskModel = require('./../models/task.model');


exports.getTasks = (user, query) => {
    try {

        const tasks = taskModel.find({user_id: user._id});

        if (!tasks) {
            return {
                code: 404,
                message: 'No Tasks For Today Yet'
            }
        }

        if (query.status == 'pending'){
            tasks = tasks.filter((task) => task.status == 'pending');
        }

        if (query.status == 'completed') {
            tasks = tasks.filter((task) => task.status == 'completed');
        }

        return {
            code: 200,
            tasks,
            user
        }
    } catch (error) {
        return {
            code: 409,
            message: 'Something went wrong. Click here to go home'
        }
    }

};


exports.createTasks = ({task, user}) => {
    try {
        if (!task) {
            return {
                code: 422,
                message: 'Input a task'
            }
        }
    
        const newTask = taskModel.create({
            task: task,
            user_id: user._id
        })
    
        return {
            code: 201,
            message: 'Task created',
            newTask
        }
    } catch (error) {
        return {
            code: 409,
            message: 'Something went wrong while creating. Go back to your dashboard'
        }
    }
}

exports.updateTask = ({id, task, status, user}) => {
    try {
        if (!task) {
            return {
                code: 422,
                message: 'Input a task'
            }
        }

        if (status == 'pending'){
            status = 'completed'
        }

        const updatedTask = taskModel.findByIdAndUpdate(id, {
            task: task,
            status: status,
            user_id: user
        })

        if (!updatedTask){
            return {
                code: 406,
                message: 'Could not update task',
            }
        }

        return {
            code: 204,
            message: 'Task updated Succefully',
            updatedTask
        }
    } catch (error) {
        return {
            code: 409,
            message: 'Something went wrong while creating. Go back to your dashboard'
        }
    }
}