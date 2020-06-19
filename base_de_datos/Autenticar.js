const responses     = require('../Modulos/constantes');
const jwt           = require('jsonwebtoken');
const config        = require('../config');


module.exports = (db) => {
  var client = require('../base_de_datos/Cliente')(db),
      module = {}
    module.createtoken = () => {
        var secure = module.Random(0,999999);
        var token  = jwt.sign({Seguridad:secure},config.secret)
        return token;
    };
    module.validate = async (_username,password) =>{ 
        var users_db = client.users();
            user     = await users_db.findOne({username: _username}),
            result;
        if(user == null){
              result = responses.userNotFound
        }else{
           if(user.password == password){
             user.token = module.createtoken();
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