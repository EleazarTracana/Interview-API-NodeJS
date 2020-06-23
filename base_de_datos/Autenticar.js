const responses     = require('../Modulos/constantes');
const jwt           = require('jsonwebtoken');
const config        = require('../config');
const { black } = require('cli-color');


module.exports = (db) => {
  var client = require('../base_de_datos/Cliente')(db),
      module = {};
    module.createtoken = () => {
        var secure = module.Random(0,999999);
        var token  = jwt.sign({Seguridad:secure},config.secret)
        return token;
    };
    module.check_blacklist = async (req) => {
        var token = req.headers['authorization'],
            params_db  = client.params(),
            param      = await params_db.findOne({parameter_name: "TOKEN_BLACKLIST"}),
            blacklist  = param.parameter_value;

            blacklist.forEach(element => {
              if(token  == element)
                throw Error("Invalid Token")
            });            
    };
    module.insert_blacklist = async (req) =>{
      var token = req.headers['authorization'],
          params_db  = client.params();
          await params_db.updateOne({parameter_name:"TOKEN_BLACKLIST"},
                                         {$addToSet: {parameter_value: token }});
    };
    module.check_function = async (functionName,permiso) => {
      var permissions_db   = client.permisos(),
          user_permissions = await permissions_db.findOne({name: permiso}),
          user_function    =  user_permissions.functions.filter(e => e.name == functionName);
          return (user_function[0] == null) ? false : user_function[0].allow;
    }
    module.permissions    = async (functionName,req) => {
          var user_db   = client.users(),
              userid    = parseInt(req.headers['userid']),
              user      = await user_db.findOne({_id:userid})
          await module.check_blacklist(req);
          var checked = await module.check_function(functionName,user.name_permissions);
          if(!checked){
              await module.insert_blacklist(req);
              throw Error("Permissions has been revoke");
          }
    };
    module.validate = async (_username,password) =>{ 
        var users_db = client.users(),
            user     = await users_db.findOne({username: _username}),
            permissions_db = client.permisos(),
            result;
        if(user == null){
              result = responses.userNotFound
        }else{
           if(user.password == password){
             user.token = module.createtoken();
             var permiso = await permissions_db.findOne({name: user.name_permissions});
                 user.permissions = permiso;
             result = user;
           }else{
             result = responses.incorrect;
           }
        }
        return result;
    };
    module.token = async (req) => {
      var token = req.headers['authorization'];
      if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
      }
      if (token) {
       resultado = await jwt.verify(token, config.secret)
       return resultado;
      }
    };
    module.Random = (low, high) => {
        return Math.random() * (high - low) + low
    }
    return module;
}