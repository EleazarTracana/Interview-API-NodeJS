module.exports = function(app,db){
   const controller_users   = require('../controllers/CANDIDATES')(db),
         controller_result  = require('../controllers/RESULTS')(db),
         controller_manage  = require('../controllers/MANAGE')(db),
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
   app.post('/candidate/finishInterview',async (req,res) => {
      try{
         await auth.token(req)
         var result = controller_result.finish_interview(req.body.DNI,req.body.Interviewer);
         res.send(result)
      }catch(e){
         res.send(responses.invalid)
      }
   });
   app.post('/candidate/add', async (req,res) =>{
    try{
       await auth.token(req)
       var result_callback;
       var candidate = await controller_users.searchOne(req.body._id)
       if(!candidate){
             await controller_users.addCandidate(req.body)
             await controller_result.create_default_results(req.body._id,req.body.technology);
             result_callback = responses.candidateAdded;
       }else{
         result_callback = responses.candidateExist;  
       }
       res.send(result_callback);
    }catch{
      res.status(403).send(responses.invalid);
     }
   });
   app.get("/results/all",async(req,res)=>{
      try{
         await auth.token(req)
             var results = await controller_result.get_all_results();
             res.send(results);
      }catch(e){
         res.send(responses.invalid)
      }
   });
   app.get("/candidate/results",async(req,res)=>{
      try{
         await auth.token(req)
         var dni = req.query.DNI,
             result_candidate = await controller_result.get_candidate_results(dni),
             full_score     = 0;
             result_candidate.results.forEach(question => full_score += question.score)
             result_candidate.full_score = full_score;
             result_candidate.count = result_candidate.results.length;
             result_candidate.QRCODE = await controller_manage.generate_qrcode(dni);
             res.send(result_candidate);
      }catch(e){
         res.send(responses.invalid)
      }
   });
   app.post("/candidate/edit",async(req,res)=>{
      try{
         await auth.token(req);
         var result = controller_users.updateCandidate(req.body);
         res.status(200).send(responses.candidate_edited);
      }catch(e){
         res.status(403).send(responses.invalid)
      }
   });
   app.post('/candidate/next_question',async(req,res)=>{
      try{
         await auth.token(req)
         let isContinue = req.body.continuar;
         var candidate = JSON.parse(req.body.candidate),
             question  = (req.body.question != null) ? JSON.parse(req.body.question) : null,
             pool_id   = req.body.pool_id,
             result  =  await controller_result.Interview(candidate,question,pool_id,isContinue);
         
         res.status(200).send(result)
      }catch(e){
         console.log(e);
         res.send(responses.genericError)
      }
   });
   app.delete('/candidate/delete',async(req,res)=>{
    try{
      await auth.token(req)
      await controller_users.deleteCandidate(req.body);
      await controller_result.delete_results(req.body)
      res.send(responses.candidateDelete);
   }catch{
      res.status(403).send(responses.invalid);
    }
   });
   app.post('/updateResults',async(req, res) =>{
      try{
        await auth.token(req)
        var result = await controller_result.update_results(req.body.candidate, req.body.question)
        
        res.send(responses.resultAdded);
      }catch{
       res.status(403).send(responses.invalid);
      }
     });
}