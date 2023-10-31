const objectHash = require('object-hash');
const taskModel = require('./../models/task.model');
require('dotenv').config

exports.getTasks = async(user, query) => {
    try {
        // Get All Tasks
        const allTasks = (await taskModel.find({user_id: user._id}).collation({locale: 'en', strength: 2}).sort({status: 1}));

        // Filter Completed Tasks
        const completedTasks = allTasks.filter((task) => task.status === 'Completed');

        // Filter Pending Tasks
        const pendingTasks = allTasks.filter((task) => task.status === 'Pending');

        if (allTasks.length == 0) {
            return {
                code: 404,
                message: 'No tasks for today yet',
                allTasks: null,
                pendingTasks: null,
                completedTasks: null,
                user,
            }
        }

        if (!user) {
            return {
                code: 404,
                message: 'unauthorized',
                allTasks: false,
                user: null
            }
        }



        if (allTasks.length != 0) {

            return {
                code: 200,
                message: null,
                allTasks,
                pendingTasks,
                completedTasks,
                user
            }
        }
    } catch (error) {
        console.log(error);
        return {
            code: 409,
            message: 'Something went wrong. Click here to go home'
        }
    }

};


exports.createTasks = async({task, user}) => {
    try {
        if (!task) {
            return {
                code: 422,
                message: 'Input a task',
                newTask: null
            }
        }

        
        const newTask = await taskModel.create({
            task: task,
            user_id: user._id
        })
        
        console.log('create Task by', user);
        return {
            code: 201,
            message: 'Task created',
            newTask,
            user
        }
    } catch (error) {
        console.log(error);
        return {
            code: 409,
            message: 'Something went wrong while creating. Go back to your dashboard',
            error
        }
    }
}

exports.updateTask = async({id, task, status, user}) => {
    try {
        if (!task) {
            return {
                code: 422,
                message: 'Input a task'
            }
        }


        const updatedTask = await taskModel.findByIdAndUpdate(id, {
            task: task,
            status: status,
            user_id: user
        })

        console.log('task to update', updatedTask);

        if (!updatedTask){
            return {
                code: 406,
                message: 'Could not update task',
            }
        }

        return {
            code: 204,
            message: 'Task updated Succefully',
            updatedTask: [updatedTask],
            user
        }
    } catch (error) {
        return {
            code: 409,
            message: 'Something went wrong while creating. Go back to your dashboard'
        }
    }
};


exports.deleteTask = async({id, user}) => {
    try {
        if (!id) {
            return {
                code: 422,
                message: 'Click on a task to delete'
            }
        }

        const deletedTask = await taskModel.findByIdAndDelete(id);

        console.log(deletedTask);
        if (!deletedTask){
            return {
                code: 406,
                message: 'Task could not delete',
            }
        }

        const newList = await taskModel.find({user_id: user._id});
        return {
            code: 200,
            message: 'Task deleted successfully',
            newList,
            user
        }
    } catch (error) {
        return {
            code: 409,
            message: 'Something went wrong while creating. Go back to your dashboard'
        }
    }
}