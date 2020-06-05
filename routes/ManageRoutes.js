//Librerias 
const auth               = require('../base_de_datos/Autenticar');
const param              = require('../controllers/MANAGE.js');
const constantes         = require('../Modulos/constantes.js')
 
module.exports = function(app){
    
  app.post('/Login', async (req,res)=>{
       var resultado = await auth.validate(req.body.name,req.body.password);
       res.send(resultado);
  });
  app.get('/param',async (req,res) => {
     try{ 
       await auth.token(req);
       var params = await param.GetAll();
       res.status(200).send(params);
      }catch(e){
        res.send(constantes.invalid);
      }
    });
   app.post('/validate',async (req,res) => {
      try{ 
        await auth.token(req);
        var newtoken = await auth.verifyTokenUser(req.body.user,req.body.token);
        res.send(newtoken);
       }catch(e){
         console.log(e);
         res.send(constantes.invalid);
       }
     }),
     app.post('/createtoken',async (req,res) => {
      try{ 
        await auth.token(req);
        var mytoken = await auth.createTokenUser(req.body);
        var json = { 

          token:mytoken.toString(),
          user:req.body,
          expired:false
        }
        res.json(json);
       }catch(e){
         console.log(e);
         res.send(constantes.invalid);
       }
     });
    }

