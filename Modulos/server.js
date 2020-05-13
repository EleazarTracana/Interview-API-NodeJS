
const bodyParser = require("body-parser");

var express = require('express'),
    app = express(),
    port = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.listen(port);

console.log('Ha iniciado el servidor de la api en '+port);
require('../routes/candidatesRoutes')(app);
require('../routes/ManageRoutes')(app);
require('../routes/poolsRoutes')(app);


