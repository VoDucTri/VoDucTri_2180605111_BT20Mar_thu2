var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var ResHandler = require('./utils/ResHandler');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var rolesRouter = require('./routes/roles');
var authRouter = require('./routes/auth');
var productsRouter = require('./routes/products');
var categoriesRouter = require('./routes/categories');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/roles', rolesRouter);
app.use('/auth', authRouter);
app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/C5', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', function(){
    console.log("Connected to MongoDB");
});

mongoose.connection.on('error', function(err){
    console.error("MongoDB connection error:", err);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    ResHandler.CreateErrorRes(res, err.status || 500, err);
});

module.exports = app;