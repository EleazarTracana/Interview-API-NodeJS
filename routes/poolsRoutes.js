//Librerias 
const controllerPools    = require('../controllers/POOLS');
const responses          = require('../Modulos/APIconstantes');
const auth               = require('../base_de_datos/Autenticar');
 
module.exports = function(app){
    
  app.get('/tecnologies',async (req,res) => {
    try{
        await auth.token(req)
        var tecnologies = await controllerPools.tecnologies()
        res.send(tecnologies);
    }catch{
      res.send(responses.invalid());
    }
  });
  app.get('/poolsByTechnology/:technology', async (req,res) =>{
    try{
      await auth.token(req)
      var pools = await controllerPools.poolsBytechnology(req.params.technology);
      return pools;
    }catch{
      res.send(responses.invalid());
    }
  });
  app.get('/poolsByName/:name', async (req,res) =>{
    try{
      await auth.token(req)
      var pools = await controllerPools.poolByName(req.params.name);
      return pools;
    }catch{
      res.send(responses.invalid());
    }
  });
  app.get('/poolsByTwo/:name/:technology', async(req,res)=>{
    try{
      await auth.token(req)
      var pool = await controllerPools.poolTwoParams(req.params.name,req.params.technology);
      return pool;
    }catch{
       res.send(responses.invalid());
    }
  })

}