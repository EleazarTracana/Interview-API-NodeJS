const auth               = require('../base_de_datos/Autenticar'),
     constantes         = require('../Modulos/constantes.js');
 
module.exports = function(app,db){
  const controller         = require('../controllers/MANAGE.js')(db);
    
  app.post('/login', async (req,res)=>{
       var resultado = await auth.validate(req.body.username,req.body.password);
       res.send(resultado);
  });
  app.post('/email/credentials', async(req,res) => {
    try{
        await auth.token(req);
        let sender = await controller.sendEmail_credentials(req.body.email,req.body.username,req.body.password);
        res.send(sender)
      }catch(error){
        res.send(error)
      }
  });
  app.get('/param/google-places-key',async(req,res)=>{
    try{
      await auth.token(req);
      let api_value = await controller.google_places_key();
      res.status(200).send(api_value);
    }catch(e){
      res.status(403).send(constantes.invalid);
    }
  });
  app.get('/permissions/all',async (req,res) => {
      try{
        await auth.token(req);
        let names = await controller.all_permissions();
        res.send(names)
      }catch(e){
        res.send(constantes.invalid);
      }
        
  });
}

