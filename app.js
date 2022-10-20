const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const session = require("express-session");
const MongoStore = require("connect-mongo")
const passport = require("passport");
const methodOverride = require('method-override');

const connectDB = require('./config/db');
const {
    default: mongoose
} = require("mongoose");

//config
dotenv.config({
    path: './config/config.env'
});

//passport config
require('./config/passport')(passport);

connectDB();
const app = express();

//helpers

app.locals.editIcon = function (storyUser, loggedUser, storyId, floating = true) {
    if (storyUser._id.toString() == loggedUser._id.toString()) {
        if (floating) {
            return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab blue"><i class="small material-icons">edit</i></a>`
        } else {
            return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit"></i></a>`
        }
    } else {
        return ""
    }
}
//method override
app.use(methodOverride('_method'))
// app.use(methodOverride(function (req, res) {
//     if (req.body && typeof req.body === 'object' && '_method' in req.body) {
//         // look in urlencoded POST bodies and delete it
//         let method = req.body._method
//         delete req.body._method
//         return method
//     }
// }));

//ejs and bodyparser
app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());
app.use(express.static("public"));
app.set('view engine', 'ejs');

//sessions
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: "mongodb://localhost:27017/storyDB"
    })
}));
//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//global variable
app.use(function (req, res, next) {
    res.locals.user = req.user || null
    next()
})
//routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'));

app.listen(3000, function () {
    console.log("Server is running on port 3000.");
});