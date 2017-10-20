var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');
var filePath = __dirname + '/views/';
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.static('js'));
app.use(express.static('build'));



app.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});




app.get("/",function(req,res){
  res.sendFile(filePath + 'cover.html');
});

app.get("/about",function(req,res){
  res.sendFile(filePath + "about.html");
});
app.get("/json",function(req,res){
  res.sendFile(filePath + "jsonTest.html");
});


app.get("/contact",function(req,res){
  res.sendFile(filePath + "contact.html");
});


app.get("/testmap",function(req,res){
  res.sendFile(filePath + "testmap.html");
});

app.get("/map",function(req,res){
  res.sendFile(filePath + "map.html");
});

app.use("/",router);



app.listen(PORT,function(){
});
