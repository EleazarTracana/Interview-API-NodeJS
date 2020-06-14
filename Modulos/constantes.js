
const message    = require('./models.js').message;

module.exports = {

    invalid:          new message(true, "403", 'Invalid token'),
    genericError:     new message(true, "500", 'An error has ocurred'),
    candidateNoFound: new message(true, "404", 'Candidate not found'),
    candidate_edited: new message(false, "200", 'el candidato ha sido editado correctamente'),
    candidateExist:   new message(true, "403", 'Candidate cannot by added. Already Exist'),
    paramNotFound:    new message(true, "404", 'Param not found'),
    candidateAdded:   new message(false,"200", 'Your candidate has been added successfully'),
    resultAdded:      new message(false,"200", 'Your result has been added successfully'),
    userNotFound:     new message(true, "404", 'Usuario no encontrado'),
    incorrect:        new message(true, "403", 'Usuario/Contrasena Invalida'),
    validated(token){
        return new message(false,"200",token)
    }
}