const express = require("express");
const userRoutes = require("./users/user.routes");
const db = require("./config/database");
require("dotenv").config();

const path = require('path')

// Intialize App
const app = express();

// Connect to Database
db.connectDB();

// Express Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

// Template Engine
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views"));
console.log(__dirname);


// Routes Rendering
app.get('/', (req, res) => {
    const user = res.locals.user;
    console.log(user);
    res.render('home', {user: (res.locals.user || null), message: null})
    // res.render('home', {user: null, status: 401, message: 'Login or Signup to access your dashboard'})
})

app.get('/login', (req, res) =>{
    res.render('login', {user: (res.locals.user || null), message: null})
})

app.get('/signup', (req, res) => {
    res.render('signup', {user: (res.locals.user || null), message: null})
})






// Route Handlers
app.use("/user", userRoutes);




// catch Errors
app.use("*", (req, res) => {
    console.log('nothing');
  res.status(404).render("404", {user: (res.locals.user || null)})
});

// Port
const port = process.env.PORT;

// Server
app.listen(port, () => {
  console.log(`App started on port ${port}`);
});
