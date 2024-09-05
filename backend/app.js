const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middlewares/error')
const passport = require('passport');
require('./utils/googleAuth');
const session = require('express-session');

//importing routes
const Auth = require('./routes/auth')
const superAdmin = require('./routes/superAdmin')
const drivingSchool = require('./routes/drivingSchool')
const course = require('./routes/course')
const vehicle = require('./routes/vehicle')
const service = require('./routes/service')
const chat = require('./routes/chat')
const message = require('./routes/message')
const instructor = require('./routes/instructor')
const learner = require('./routes/learner')
const common = require('./routes/common')

const app = express();
app.use(express.json());

let BASE_URL = `http://localhost:3000`;
if (process.env.NODE_ENV === "production") {
    BASE_URL = process.env.FRONTEND_URL;
}

const corsOptions = {
    origin: BASE_URL,
    credentials: true,
};

//google auth
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());


app.use(cors(corsOptions));
app.use(cookieParser());

// For storing images into uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', Auth)
app.use('/api', superAdmin)
app.use('/api', drivingSchool)
app.use('/api', course)
app.use('/api', vehicle)
app.use('/api', service)
app.use('/api', chat)
app.use('/api', message)
app.use('/api', instructor)
app.use('/api', learner)
app.use('/api', common)


app.use(errorMiddleware)

app.get('/', (req, res) => {
    res.send('<a href="api/auth/google">Login with Google</a>');
  });


module.exports = app;
