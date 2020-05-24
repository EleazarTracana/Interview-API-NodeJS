const responses = require('../Modulos/APIconstantes');
const jwt           = require('jsonwebtoken');
const config        = require('../config');

module.exports = {
    createtoken: function create(){
        var secure = this.Random(0,999999);
        var token  = jwt.sign({Seguridad:secure},config.secret)
        return token;
    },
    createTokenUser: function usertoken(user){
      console.log(user.toString())
      var token = jwt.sign({Seguridad: user},config.secret,{
        expiresIn: '15m',
      });
      return token;
    },
    verifyTokenUser: async function verifytoken(user,token){
      var newToken = { 
        token:token,
        user:user,
        expired:true
      }
      var verified = await jwt.verify(token, config.secret);
      if(verified){
         newToken = { 
          token:this.createTokenUser(user),
          user:user,
          expired:false
        }
      }
      return newToken;
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