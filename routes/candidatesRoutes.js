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
         console.log(e)
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
       if(candidate == null){
             await controllerUsers.addCandidate(req.body)
             await controllerResult.create_default_results(req.body._id,req.body.tecnology);
             result_callback = responses.candidateAdded;
       }else{
         result_callback = responses.candidateExist;  
       }
       res.send(result_callback);
    }catch(e){
       console.log(e)
      res.status(403).send(responses.invalid);
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