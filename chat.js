var mc = require('mongodb').MongoClient;
var url ="mongodb://localhost:27017/mongochat4";
var exp = require('express');
var http = require('http');
var socket = require('socket.io');

var app = exp();
var server = http.createServer(app);
var io = socket(server);

console.log("Server Running at Port 9090");
server.listen(9090);

//console.log("SERVER RUNNING AT PORT : 8080");
server.listen(9090);

app.use(exp.static('\public'));

io.on('connection',function(socket)
{

    console.log('made socket connection', socket.id);


    socket.on('chat', function(data)
  	{
    io.sockets.emit('chat', data);
    });

    socket.on('typing', function(data)
	  {
        socket.broadcast.emit('typing', data);
     });
	 
	socket.on('display',function(data)
	{
		io.sockets.emit('display',data);
	});

});





app.get('/', function (req, res)
{
   res.sendFile( __dirname + "/" + "login.html" );
});


app.get('/log',function(req,ress)
{
  mc.connect(url,function(err,db)
  {
  var dbo = db.db("mongochat4");
  var myob = { name:req.query.name , age:req.query.age, pass:req.query.pass, cpass:req.query.cpass };

  if(myob.cpass == myob.pass)
  {

  dbo.collection("dcet").insert(myob,function(err,res)
  {
	  if(err) throw err;
	  console.log(" No. of records Inserted are :" + res.insertedCount);
	  ress.redirect("indexchat.html");
	  db.close();
  });

  }
  else
  {
	  console.log("Password Does not Match");
	  ress.send("Password Does not Match");
  }
 });

});


app.get('/in',function(req,res)
{

// res.sendFile( __dirname + "/" + "userlogin.html" );

  mc.connect(url,function(err,db)
{
  var dbo = db.db("mongochat4");
  var myob = { name:req.query.name, pass:req.query.pass };

   var query = {name : myob.name};
   dbo.collection("dcet").find(query).toArray(function(err,result)
   {
	  if(err) throw err;
	  else
	 {
		if(result.length >0)
			 {
				 if( result[0].pass == myob.pass)
				 {
					res.redirect("indexchat.html");

				 }
				 else
				 {
					 res.send("USER AND PASSWORD DOES NOT MATCHED");
				 }
			}
			 else
			 {
				 res.send("USER DOES NOT EXIST !!!!!");
			 }
	}
	console.log( result);

	});
});

});
