const router = require('express').Router();
const taskService = require('./task.service');

// Onload
router.get('/', async(req, res) => {
    console.log('Task route' , res.locals.user);
    const query = req.query;
    const user = res.locals.user

    const response = await taskService.getTasks(user, query);

    if (response.code == 404) {
        res.render('dashboard', {message: response.message})
    } else if (response.code == 409) {
        res.redirect('/404', {message: response.message})
    } else {
        console.log(response.tasks);
        // res.render('dashboard', {name: response.user.username, tasks: response.tasks})
        res.end('response')
    }
});

// Add/Create Router
router.post('/', async (req, res) => {
    const {task} = req.body;
    const user = res.locals.user

    const response = taskService.createTasks({task, user});

    if (response.code == 409) {
        res.render('404', {message: response.message})
    }else if (422){
        res.render('dashboard', 'No Task Inputed');
    } else if (response.code == 201){
        res.render('dashboard', {tasks: response.newTask, message: response.message})
    }

});

// Update Route
router.post('/:id', (req, res) => {
    const id = req.params;
    const user = res.locals.user;
    const {task, status} = req.body

    const response = taskService.updateTask({id, task, status, user});

    if (response.code == 409) {
        res.render('404', {message: response.message})
    }else if (406){
        res.render('dashboard', {message: 'Could not Update Task'});
    } else if (response.code == 204){
        res.render('dashboard', {tasks: response.updatedTask, message: response.message})
    }
})

module.exports = router