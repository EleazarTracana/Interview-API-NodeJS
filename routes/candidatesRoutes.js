//Librerias 
const controllerUsers    = require('../controllers/CANDIDATES');
const controllerResult   = require('../controllers/RESULTS');
const responses          = require('../Modulos/constantes');
const auth               = require('../base_de_datos/Autenticar');
 
module.exports = function(app){
    
  app.get('/allCandidates',async (req,res) => {
      try{
          await auth.token(req)
          var users = await controllerUsers.searchAll()
          res.send(users);
      }catch (e){
        res.send(responses.invalid);
      }
    });
   app.get('/searchCandidate', async (req,res) =>{
      try{
         await auth.token(req)
         var user = await controllerUsers.searchOne(req.query.id)
         if(!user){
          res.send(responses.candidateNoFound)
         }else{
          res.send(user);
         }
      }catch{
         res.status(403).send(responses.invalid);
       }
   });
   app.post('/candidate/add', async (req,res) =>{
    try{
       await auth.token(req)
       var result_callback;
       var candidate = await controllerUsers.searchOne(req.body._id)
       if(!candidate){
             await controllerUsers.addCandidate(req.body)
             await controllerResult.create_default_results(req.body._id,req.body.technology);
             result_callback = responses.candidateAdded;
       }else{
         result_callback = responses.candidateExist;  
       }
       res.send(result_callback);
    }catch{
      res.status(403).send(responses.invalid);
     }
   });
   app.post('/candidate/next_question',async(req,res)=>{
      try{
         await auth.token(req)
         console.log('body' + req.body)

         var candidate = req.body.candidate,
             question  = req.body.question,
             pool_id   = req.body.pool_id,
             result  =  await controllerResult.update_candidate_results(candidate,question,pool_id);
             
         res.status(200).send(result)
      }catch(e){
         res.send(responses.genericError)
      }
   });
   app.delete('/deleteCandidate',async(req,res)=>{
    try{
      await auth.token(req)
      var result;
      var user = await controllerUsers.searchOne(req.body.id)
      if(user){
         result = await controllerUsers.deleteCandidate(req.body.id);
      }else{
         result = responses.candidateNoFound;  
      }
      res.send(result);
   }catch{
      res.status(403).send(responses.invalid);
    }
   });
   app.post('/updateCandidate',async(req, res) =>{
    try{
      await auth.token(req)
      var result;
      var user = await controllerUsers.searchOne(req.body.id)
      if(user){
         result = await controllerUsers.updateCandidate(req.body);
      }else{
         result = responses.candidateNoFound;  
      }
      res.send(result);
    }catch{
     res.status(403).send(responses.invalid);
    }
   });
}