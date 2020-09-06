var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var config = require('config');
var bodyParser = require('body-parser');

//middleware
var isLoggedIn = require('./middleware/isLoggedIn');
var isAdmin = require('./middleware/admin');

//routes
var indexRouter = require('./routes/index');
var itemRouter = require('./routes/item');
var userRouter = require('./routes/user');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var authRouter = require('./routes/auth');
var signupformRouter = require('./routes/signup');
var viewRouter = require('./routes/view');
mongoose.connect('mongodb://localhost/retail', {useNewUrlParser: true,useUnifiedTopology:true})
      .then(()=>console.log('Connection to MongoDB is Successfull'))
      .catch((err)=>console.log(err.message));

var app = express();
app.set('port', process.env.PORT || 3000);


//loading the PrivateKey
if(!config.get('jwtPrivateKey'))
{
  console.error('Error loading the private Key..please define the key');
  process.exit();
}


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(isLoggedIn);
app.use(isAdmin);

app.use('/', indexRouter);
app.use('/item', itemRouter);
app.use('/user',userRouter);
app.use('/login',loginRouter);
app.use('/logout',logoutRouter);
app.use('/auth',authRouter);
app.use('/signup',signupformRouter);
app.use('/view',viewRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
