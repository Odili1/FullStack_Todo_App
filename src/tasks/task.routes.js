const router = require('express').Router();
const taskService = require('./task.service');
const middleware = require('./task.middlesware');
const taskModel = require('../models/task.model')
// const cookieParser = require('cookie-parser');


// router.use(cookieParser())


console.log('Task Entry');
// Onload
router.get('/', async(req, res) => {
    const query = req.query;
    const user = res.locals.user || null
    const response = await taskService.getTasks(user, query);
    
    if (response.code == 404) {
        console.log(user);
        res.render('dashboard', {
            user: user, 
            allTasks: response.allTasks, 
            completedTasks: response.completedTasks,
            pendingTasks: response.pendingTasks, 
            message: response.message
        })

    } else if (response.code == 409) {
        console.log('Task route' , res.locals.user);
        res.redirect('/404')
    } else {
        console.log('tasks', {allTasks: response.allTasks, 
            completedTasks: response.completedTasks,
            pendingTasks: response.pendingTasks, });
        res.render('dashboard', {
            user: response.user, 
            allTasks: response.allTasks.length ? response.allTasks : null, 
            completedTasks: response.completedTasks.length ? response.completedTasks : null,
            pendingTasks: response.pendingTasks.length ? response.pendingTasks : null, 
            message: response.message
        })
    }
});

// Add/Create Router
router.post('/create', middleware.validateAddTask, async (req, res) => {
    const {task} = req.body;
    const user = res.locals.user
    
    const response = await taskService.createTasks({task, user});
    
    if (response.code == 409) {
        console.log('This request method', req.method);
        res.render('404', {message: response.message})
    }else if (response.code == 422){
        console.log('This is the task', task);
        res.render('dashboard', {tasks: response.newTask, message: response.message});
    } else if (response.code == 201){
        console.log('created', task);
        res.redirect('/user/dashboard/tasks');
    }

});



// router.get('/completed', async (req, res) => {
//     try {
//         const completedTodos = await taskModel.find({status: 'Completed'})

//         if (!completedTodos){
//             res.render('dashboard' )
//         }
//     } catch (error) {
//         res.render('404', {message: 'Something went wrong on our side'})
//     }
// })



// router.get('/pending')


// Update Route
router.post('/update/:id', async(req, res) => {
    const id = req.params.id;
    const user = res.locals.user;
    const {task, status} = req.body
    console.log(req.body);
    const response = await taskService.updateTask({id, task, status, user});

    if (response.code == 409) {
        res.render('404', {message: response.message})
    }else if (response.code == (406 || 422)){
        console.log('could not update', res.locals.tasks);
        res.render('dashboard', {tasks: res.locals.tasks, message: response.message});
    } else if (response.code == 204){
        res.redirect('/user/dashboard')
    }
});


// Delete Route
router.post('/delete/:id', async(req, res) => {
    const id = req.params.id;
    const user = res.locals.user;
    console.log('req', id);

    const response = await taskService.deleteTask({id, user});

    if (response.code == 409) {
        res.render('404', {message: response.message})
    }else if (response.code == 422){
        res.render('dashboard', {message: 'Could not Delete Task'});
    }
    else if (response.code == 406){
        res.render('dashboard', {message: 'Could not Delete Task'});
    } else if (response.code == 200){
        res.redirect('/user/dashboard')
    }
})

module.exports = router