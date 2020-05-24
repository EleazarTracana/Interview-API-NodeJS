var service = require('node-windows').Service;

try{
  var svc = new service({
    name:'Interview',
    description: 'RESTFULL API',
    script: 'C:\\INTERVIEWAPI\\Modulos\\server.js'
  });
  
  svc.on('install',function(){
    svc.start();
  });
  
  svc.install();

}catch( e){
console.log(e)
}
