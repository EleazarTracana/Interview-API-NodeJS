module.exports = function(app,db){
   const controller_users   = require('../controllers/CANDIDATES')(db),
         controllerResult   = require('../controllers/RESULTS')(db),
         responses          = require('../Modulos/constantes'),
         auth               = require('../base_de_datos/Autenticar')(db);
 
    
  app.get('/allCandidates',async (req,res) => {
      try{
          await auth.token(req)
          var users = await controller_users.searchAll()
          res.send(users);
      }catch (e){
         console.log(e)
        res.send(responses.invalid);
      }
    });
   app.get('/searchCandidate', async (req,res) =>{
      try{
         await auth.token(req)
         var user = await controller_users.searchOne(req.query.id)
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
       var candidate = await controller_users.searchOne(req.body._id)
       if(!candidate){
             await controller_users.addCandidate(req.body)
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
   app.post("/candidate/edit",async(req,res)=>{
      try{
         await auth.token(req);
         var result = controller_users.updateCandidate(req.body.candidate);
         res.status(200).send(responses.candidate_edited);
      }catch(e){
         res.status(403).send(responses.invalid)
      }
   });

   app.post('/candidate/next_question',async(req,res)=>{
      try{
         await auth.token(req)
         var candidate = JSON.parse(req.body.candidate),
             question  = (req.body.question != null) ? JSON.parse(req.body.question) : null,
             pool_id   = req.body.pool_id,
             continuar = req.body.continuar,
             result  =  await controllerResult.Interview(candidate,question,pool_id,continuar);
         
         res.status(200).send(result)
      }catch(e){
         console.log(e);
         res.send(responses.genericError)
      }
   });
   app.delete('/deleteCandidate',async(req,res)=>{
    try{
      await auth.token(req)
      var result;
      var user = await controller_users.searchOne(req.body.id)
      if(user){
         result = await controller_users.deleteCandidate(req.body.id);
      }else{
         result = responses.candidateNoFound;  
      }
      res.send(result);
   }catch{
      res.status(403).send(responses.invalid);
    }
   });
   app.post('/updateResults',async(req, res) =>{
      try{
        await auth.token(req)
        var result = await controllerResult.update_results(req.body.candidate, req.body.question)
        
        res.send(responses.resultAdded);
      }catch{
       res.status(403).send(responses.invalid);
      }
     });
}