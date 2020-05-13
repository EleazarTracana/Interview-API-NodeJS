//Librerias 
const auth               = require('../base_de_datos/Autenticar');
 
module.exports = function(app){
    
  app.post('/Login', async (req,res)=>{
       var resultado = await auth.validate(req.body.name,req.body.password)
       res.send(resultado);
  })
}