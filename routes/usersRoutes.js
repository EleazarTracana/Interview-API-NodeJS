//Librerias 
const controllerUsers    = require('../controllers/USERS');
const responses          = require('../Modulos/APIconstantes');
const auth               = require('../base_de_datos/Autenticar');
 
module.exports = function(app){
    
  app.get('/allUsers',async (req,res) => {
      try{
          await auth.token(req)
          var users = await controllerUsers.searchAll()
          res.send(users);
      }catch (e){
        res.send(responses.invalid());
      }
    });
   app.get('/searchUser', async (req,res) =>{
      try{
         await auth.token(req)
         var user = await controllerUsers.searchOne(req.query.username)
         if(user === 'undefined' || user == null){
            res.send(responses.candidateNoFound())
           }else{
            res.send(user);
           }
      }catch (e){
        res.send(JSON.stringify(responses.invalid().toString()));
       }
   });
   app.post('/addUser', async (req,res) =>{
    try{
       await auth.token(req)
       var result;
       var user = await controllerUsers.searchOne(req.body.username)
       if(user == null || user === 'undefined'){
          var added = await controllerUsers.addUser(req.body)
          if(added){
            result = responses.candidateAdded();
          }else{
            result = responses.genericError();
          }
       }else{
          result = responses.candidateExist();  
       }
       res.send(result);
    }catch{
      res.send(responses.invalid());
     }
   });
   app.delete('/deleteUser',async(req,res)=>{
    try{
      await auth.token(req)
      var result;
      var user = await controllerUsers.searchOne(req.body.username)
      if(user){
         result = await controllerUsers.deleteUser(req.body.id);
      }else{
         result = responses.candidateNoFound();  
      }
      res.send(result);
   }catch{
     res.send(responses.invalid());
    }
   });
}