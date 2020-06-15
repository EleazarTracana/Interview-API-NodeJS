//Librerias 
const controllerPools    = require('../controllers/POOLS');
const responses          = require('../Modulos/constantes');
const auth               = require('../base_de_datos/Autenticar');
 
module.exports = function(app){
    
  app.get('/technologies/dropdown',async (req,res) => {
    try{
        await auth.token(req)
        var tecnologies = await controllerPools.technologies_dropdown_list()
        res.send(tecnologies);
    }catch{
      res.send(responses.invalid);
    }
  });
  app.post('/pools/addQuestion',async (req,res) => {
    try{
        await auth.token(req);
        var pools = await controllerPools.poolAddQuestion(req.body.poolId, req.body.question);
        res.send(pools);
    }catch{
      res.send(responses.invalid);
    }
  });
  app.post('/pools/deleteQuestion',async (req,res) => {
    try{
        await auth.token(req);
        var pools = await controllerPools.poolDeleteQuestion(req.body.poolId, req.body.questionId);
        res.send(pools);
    }catch{
      res.send(responses.invalid);
    }
  });
  app.post('/pools/updateQuestion',async (req,res) => {
    try{
        await auth.token(req);
        var pools = await controllerPools.poolUpdateQuestion(req.body.poolId, req.body.question);
        res.send(pools);
    }catch{
      res.send(responses.invalid);
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
      res.status(403).send(responses.invalid);
    }
  });
}