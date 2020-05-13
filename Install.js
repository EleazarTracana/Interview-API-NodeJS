var Service = require('node-windows').Service;

var svc = new Service({
  name:'Interview',
  description: 'RESTFULL API',
  script: 'C:\\Users\\eleaz\\Desktop\\InterviewAPI\\MI_API\\Modulos\\server.js'
});

svc.on('install',function(){
  svc.start();
});

svc.install();