const router = require('express').Router();
const service = require('./user.service')
const middleware = require('./user.middlewares');
const auth = require('./../auth/globalAuth');
const taskRoute = require('./../tasks/task.routes')
const cookieParser = require('cookie-parser');


router.use(cookieParser())

// Route Handlers
router.post('/signup', middleware.validateSignup, async (req, res) => {
    const {username, email, password} = req.body
    const response = await service.CreateUser({username, email, password});

    if (response.code == 400){
        res.redirect('/404')
    }else if(response.code == 409){
        res.render('signup', {message: response.message})
    } else {
        res.cookie('jwt', response.token);

        res.redirect('/user/dashboard')
    }

});

router.post('/login', middleware.validateLogin, async (req, res) => {
    const {username, password} = req.body
    console.log(req.body);
    const response = await service.Login({username, password});

    if (response.code == 404){
        res.render('login', {user: null, message: response.message})
    }else if(response.code == 422){
        res.render('login', {user: null, message: response.message})
    } else if (response.code == 401) {
        res.render('login', {user: null, message: response.message})
    }
    else {
        res.cookie('jwt', response.token);
        console.log('success');
        res.redirect('/user/dashboard')
    }
});



// Protected Route 
router.use(auth.cookieAuth)


router.get('/dashboard', (req, res) => {
    // const {username, _id: id} = res.locals.user
    // console.log(res.locals.user);
    res.redirect('/user/dashboard/tasks')
})

console.log('before task');
router.use('/dashboard/tasks', taskRoute)
router.use('/dashboaard/tasks/create', taskRoute)

router.get('/logout', (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/')
})


module.exports = router;