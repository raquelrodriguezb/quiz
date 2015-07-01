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

app.use(partials());

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015'));
app.use(session());

app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// logout por tiempo  
app.use(function(req, res, next) {

  if (req.session && req.session.tiempo){

      if (new Date().getTime() - req.session.tiempo>120000)
      {
        delete req.session.user;
      }
  }
  if (req.session.user){
          //si hay session actualiza el tiempo de activiad
         req.session.tiempo=new Date().getTime();
  }else{
     if (req.session.tiempo>0){
          //este es el caso de logout por tiempo ponemos  a 0 sin borrar,para avisar al usuario
          req.session.tiempo=0;
           // este caso es no hay usuario, ya mostramos el mensaje logout por tiempo de session 
     }else{
      // este caso no hay usuario logado y ya avisamos al usuario  
      // borramos tiempo para que el mensaje solo lo muestre una vez
          delete req.session.tiempo;
     }
  }
 
 next();
});
// Helpers dinamicos:
app.use(function(req, res, next) {

  // si no existe lo inicializa
  if (!req.session.redir) {
    req.session.redir = '/';
  }

  // guardar path en session.redir para despues de login
  if (!req.path.match(/\/login|\/logout|\/user/)) {
    req.session.redir = req.path;
  }
  
  // Hacer visible req.session en las vistas
  res.locals.session = req.session;
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
            errors:[]
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
        errors:[]

    });
});


module.exports = app;
