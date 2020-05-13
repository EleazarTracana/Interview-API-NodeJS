const clc = require('cli-color');
//Constantes de la api
module.exports = {
    invalid: function(){
        var mensaje = 
        {
            error: true,
            codigo: 403,
            mensaje: 'invalid token'
           }
        return mensaje; 
    },
    genericError: function(){
        var mensaje = 
        {
            error: true,
            codigo: 500,
            mensaje: 'an error has ocurred'

        }
        return mensaje; 
    },
    candidateNoFound: function(){
        var mensaje = 
        {
            error: true,
            codigo: 404,
            mensaje: 'candidate not found'
           }
        return mensaje; 
    },
    candidateExist: function(){
        var mensaje = 
        {
            error: true,
            codigo: 500,
            mensaje: 'candidate cannot by added. Already Exist'
        }
       return mensaje;
    },
    candidateAdded: function(){
        var mensaje = 
        {
            error: false,
            codigo: 200,
            mensaje: 'your candidate has been added successfully'
           }
        return mensaje; 
    },
    UsuarioNoEncontrado: function(){
        var mensaje =  {

            error: true,
            codigo: 404,
            mensaje: 'El usuario no se encuentra resgistrado en la base'
       }
       return mensaje;
    },
    incorrect: function(){
        var mensaje =  {
            error: true,
            codigo: 403,
            mensaje: 'user/password incorrect'
       }
       return mensaje
    },
    validated: function(token){
        var mensaje ={
            error:false,
            condigo:200,
            mensaje: 'your token has been created!',
            token: token
        }
        return mensaje
    },
}