var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//adding new lines for mysqlapi
var cors = require('cors');
var app = express();

//for mysqlapi
app.use(cors());
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

const task = require('./routes/route_task')
const tag = require('./routes/route_tag')


app.use('/task',task)
app.use('/tag',tag)
// app.use('/frame/photo', photo)

process.env.TYPE = 'PROD'

const PORT = process.env.PORT || 8080
app.listen(PORT,()=>{
  console.log(`Listening to PORT: ${PORT}`)
})
module.exports = app;
