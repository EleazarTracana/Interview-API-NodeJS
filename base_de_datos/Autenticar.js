const responses = require('../Modulos/APIconstantes');
const jwt           = require('jsonwebtoken');
const config        = require('../config');

module.exports = {
    createtoken: function create(){
        var secure = this.Random(0,999999);
        var token  = jwt.sign({Seguridad:secure},config.secret)
        return token;
    },
    validate: async function validate(name,password){
        var result;
        if(name == "root" && password == "#Eyx1421P"){
          result = responses.validated(this.createtoken());
        }else{
          result = responses.incorrect()
        }
        return result;
    },
    token:  async (req) => {
      try{
      var token = req.headers['authorization'];
      if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
      }
      if (token) {
       resultado = await jwt.verify(token, config.secret)
       console.log("token verificado:" + resultado)
       return resultado;
      }
    }catch (e){
      throw e;
    }
    },
    Random: function random(low, high) {
        return Math.random() * (high - low) + low
      }
}