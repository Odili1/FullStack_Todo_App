const router = require('express').Router();
const taskService = require('./task.service');
console.log('Task Entry');
// Onload
router.get('/', async(req, res) => {
    // console.log('Task route' , res.locals.user);
    const query = req.query;
    const user = res.locals.user || null
    const response = await taskService.getTasks(user, query);
    
    if (response.code == 404) {
        console.log(user);
        res.render('dashboard', {user: user, tasks: response.tasks, message: response.message})
    } else if (response.code == 409) {
        res.redirect('/404')
    } else {
        console.log(response.tasks);
        res.render('dashboard', {user: response.user, tasks: response.tasks, message: response.message})
        // res.end('response')
    }
});

// Add/Create Router
router.post('/create', async (req, res) => {
    const {task} = req.body;
    const user = res.locals.user
    
    const response = await taskService.createTasks({task, user});
    
    if (response.code == 409) {
        console.log('This request method', req.method);
        res.render('404', {message: response.message})
    }else if (response.code == 422){
        console.log('This is the task', task);
        res.render('dashboard');
    } else if (response.code == 201){
        console.log('created', task);
        res.redirect('/user/dashboard/tasks');
    }

});

// Update Route
router.post('/:id', async(req, res) => {
    const id = req.params.id;
    const user = res.locals.user;
    const {task, status} = req.body
    console.log(req.body);
    const response = await taskService.updateTask({id, task, status, user});

    if (response.code == 409) {
        res.render('404', {message: response.message})
    }else if (response.code == 406){
        console.log('could not update');
        res.render('dashboard', {tasks: response.updatedTask, message: 'Could not Update Task'});
    } else if (response.code == 204){
        res.redirect('/user/dashboard')
    }
});


// Delete Route
router.post('/:id', async(req, res) => {
    const id = req.params;
    const user = res.locals.user;

    const response = await taskService.deleteTask({id, user});

    if (response.code == 409) {
        res.render('404', {message: response.message})
    }else if (response.code == 422){
        res.render('dashboard', {message: 'Could not Update Task'});
    }
    else if (response.code == 406){
        res.render('dashboard', {message: 'Could not Update Task'});
    } else if (response.code == 200){
        res.render('dashboard', {user: response.user, tasks: response.newList, message: response.message})
    }
})

module.exports = router