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
  app.get('/pools', async (req,res) =>{
    try{

      await auth.token(req)
      var tech = req.query.technology,
      name = req.query.name,
      pools,
      array = [];

      if(tech != null && name != null){
        pools = await controllerPools.poolTwoParams(name,tech);
      }else if(tech != null && name == null){
        pools = await controllerPools.poolsBytechnology(tech);
      }else if(tech == null && name !=null){
        pools = await controllerPools.poolByName(name);
      }else{
        pools = await controllerPools.poolsAll();
      }
      if(pools instanceof Array){
        res.status(200).send(pools)
      }else{
        array.push(pools)
        res.send(array);
      }
    }catch{
      res.status(403).send(responses.invalid());
    }
  });
}