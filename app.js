var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(partials());

// Helpers dinamicos
app.use(function(req, res, next) {
    // Guardar path en sesion.redir para volver donde se encontrase
    // el usuario tras hacer login o logout
    if (!req.path.match(/\/login|\/logout/)) {
        req.session.redir = req.path;
    }
    // Hacer visible req.session en las vistas
    res.locals.session = req.session;
    next();
});

// Autologout
app.use(function(req, res, next) {
    // Comprobamos si hay usuario logado para comenzar la gestion del autologout
    if (req.session.user) {
        var dateNow = new Date();
        var timeNow = dateNow.getTime();
        // Sacamos la diferencia en minutos entre el momento del ultimo acceso y ahora
        var lastAccessDiffMinutes = (timeNow - req.session.ultimoAcceso) * 1.6667 * Math.pow(10, -5);
        if (lastAccessDiffMinutes > 2) {
            // Han pasado mas de 2 minutos. Destruimos sesion
            delete req.session.user;
            delete req.session.ultimoAcceso;
            req.session.errors = [{"message": 'Ha expirado la sesión. Vuelva a logarse, por favor. '}];
            res.redirect('/login');
        } else {
            // No han pasado mas de 2 minutos. Actualizamos momento del ultimo acceso
            req.session.ultimoAcceso = timeNow;
        }
    }
    next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
