
const bodyParser = require("body-parser");
const MongoClient  = require('mongodb').MongoClient;
const url          = "mongodb+srv://EleazarTracana:5q7f7EFKpyz1GuqC@cluster0-mvhqd.mongodb.net/test?retryWrites=true&w=majority";
  
MongoClient.connect(url, (err,client) => {
   
    var express = require('express'),
        db      = client.db('INTERVIEW'),
    app = express(),
    port = 3000;

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.listen(port);

    console.log('Ha iniciado el servidor de la api en '+port);
    require('../routes/candidatesRoutes')(app,db);
    require('../routes/ManageRoutes')(app,db);
    require('../routes/poolsRoutes')(app,db);
    require('../routes/usersRoutes')(app,db);
});


