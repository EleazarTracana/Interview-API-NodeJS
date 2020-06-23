module.exports = function(app,db){

   const controller_users    = require('../controllers/USERS')(db),
         responses           = require('../Modulos/constantes'),
         auth                = require('../base_de_datos/Autenticar')(db);
    
  app.get('/user/all',async (req,res) => {
      try{
          await auth.token(req);
          await auth.permissions("user_list",req);
          var users = await controller_users.searchAll()
          res.send(users);
      }catch (e){
         res.status(403).send(responses.invalid);
      }
    });
   app.get('/user/search', async (req,res) =>{
      try{
         await auth.token(req)
         var user = await controller_users.searchOne(req.query.username)
         if(user === 'undefined' || user == null){
            res.send(responses.candidateNoFound)
           }else{
            res.send(user);
           }
      }catch (e){
        res.send(JSON.stringify(responses.invalid.toString()));
       }
   });
   app.post('/user/add', async (req,res) =>{
    try{
       await auth.token(req)
       await auth.permissions("user_add",req);
       var result;
       var user = await controller_users.searchOne(req.body.username);
       if(user == null){
          var added = await controller_users.addUser(req.body)
          if(added){
            result = responses.addUser;
          }else{
            result = responses.genericError;
          }
       }else{
          result = responses.userExist;  
       }
       res.send(result);
    }catch  (e){
      res.status(403).send(responses.invalid);
     }
   });
   app.post('/user/update',async(req,res) => {
      try{
         await auth.token(req)
         await auth.permissions("editUser",req);
         var user = JSON.parse(req.body.user)
         await controller_users.user_update(user,req.body.password)
         res.send(responses.user_update);
      }catch(e){
         res.status(403).send(responses.invalid);
      }
   });
   app.delete('/user/delete',async(req,res)=>{
    try{
      await auth.token(req)
      var result;
      var user = await controller_users.searchOne(req.body.username)
      if(user){
         result = await controller_users.deleteUser(req.body.id);
      }else{
         result = responses.candidateNoFound;  
      }
      res.send(result);
   }catch{
     res.send(responses.invalid);
    }
   });
}