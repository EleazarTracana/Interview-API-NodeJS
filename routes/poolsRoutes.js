const controller_pools   = require('../controllers/POOLS');
const controller_params  = require('../controllers/MANAGE');
const responses          = require('../Modulos/constantes');
const auth               = require('../base_de_datos/Autenticar');
const { response } = require('express');
 
module.exports = function(app){
    
  app.get('/technologies/dropdown',async (req,res) => {
    try{
        await auth.token(req)
        var tecnologies = await controller_pools.technologies_dropdown_list()
        res.send(tecnologies);
    }catch{
      res.send(responses.invalid);
    }
  });
  app.get('/pools/questions/dropdown',async(req,res)=>{
    try{
      await auth.token(req);
      var dropdown = await controller_params.question_difficulty_dropdown();
      res.send(dropdown)
    }catch(e){
      res.send(responses.invalid);
    }
  });
  app.post('/pools/add', async(req,res)=>{
    try{
      await auth.token(req);
      let found  = await controller_pools.poolTwoParams(req.body.name,req.body.technology),
          result = responses.pool_added;
      if(!found)
        await controller_pools.pool_add(req.body);
      else
        result  = responses.pool_founded;
      res.send(result);
    }catch(e){
      res.send(responses.invalid);
    }
  });
  app.post('/pools/question/add',async (req,res) => {
    try{
        await auth.token(req);
        let question = JSON.parse(req.body.question);
        let pool_id  = req.body.poolId;
        await controller_pools.poolAddQuestion(pool_id,question);
        res.send(responses.add_question_result);
    }catch (e){
      res.send(responses.invalid);
    }
  });
  app.post('/pools/deleteQuestion',async (req,res) => {
    try{
        await auth.token(req);
        var pools = await controller_pools.poolDeleteQuestion(req.body.poolId, req.body.questionId);
        res.send(pools);
    }catch{
      res.send(responses.invalid);
    }
  });
  app.post('/pools/updateQuestion',async (req,res) => {
    try{
        await auth.token(req);
        var pools = await controller_pools.poolUpdateQuestion(req.body.poolId, req.body.question);
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
        pools = await controller_pools.poolTwoParams(name,tech);
      }else if(tech != null && name == null){
        pools = await controller_pools.poolsBytechnology(tech);
      }else if(tech == null && name !=null){
        pools = await controller_pools.poolByName(name);
      }else{
        pools = await controller_pools.poolsAll();
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