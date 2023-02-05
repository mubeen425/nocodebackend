var express = require('express');
var path = require('path');
const mongoose = require('mongoose');
var config = require('./config');
var bodyParser = require('body-parser');
var path = require('path')
require('dotenv/config');

var fs = require('fs');

var app = express();
const cors = require('cors');
const USersRouter = require('./Routes/UsersRouter');
const CollectionRouter = require('./Routes/CollectionRouter');
const NftRouter = require('./Routes/NftRouter')
const saleRouter = require('./Routes/SaleRouter')
app.use(cors({origin:"*"}));

// const url = config.mongoUrl;
const url = process.env.mongo_uri
const connect = mongoose.connect("mongodb://0.0.0.0:27017/",  {useNewUrlParser: true});

connect.then((db) => {
  console.log('connected Correctly');
}, (err) => { console.log(err) });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('./assets'));
app.set('view engine', 'jade');
// app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use(express.static(path.join(__dirname, 'public')));

app.use('/user',USersRouter);
app.use('/collection',CollectionRouter)
app.use('/nft', NftRouter);
app.use('/sale', saleRouter);
// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });
app.listen(8082||process.env.PORT, function() {
    console.log("I'm listening at %s, on port %s");
  });

module.exports = app;