
const message    = require('./models.js').message;

module.exports = {

    invalid:          new message(true, "403", 'Invalid token'),
    genericError:     new message(true, "500", 'An error has ocurred'),
    candidateNoFound: new message(true, "404", 'Candidate not found'),
    candidate_edited: new message(false, "200", 'el candidato ha sido editado correctamente'),
    candidateExist:   new message(true, "403", 'el candidato no pudo darse de alta, ya existe'),
    paramNotFound:    new message(true, "404", 'Param not found'),
    candidateAdded:   new message(false,"200", 'candidato dado de alta exitosamente'),
    resultAdded:      new message(false,"200", 'Your result has been added successfully'),
    userNotFound:     new message(true, "404", 'Usuario no encontrado'),
    incorrect:        new message(true, "403", 'Usuario/Contrasena Invalida'),
    add_question_result: new message(false,"200","la pregunta se ha dado de alta exitosamente"),
    pool_added: new message(false,"200","la pool se ha dado de alta exitosamente"),
    pool_founded: new message(true,"200","la pool no pudo darse de alta, ya existe"),
    downgrade_impossible: "el desempeño del candidato es muy bajo",
    upgrade_impossible: "el desempeño del candidato es muy bueno",
    junior: "JUNIOR",
    semisenior: "SEMISENIOR",
    senior: "SENIOR",
    downgrade(name){
        return "el desempeño del candidato ha sido muy bajo, cambiamos el seniority de la entrevista a "+name.toLowerCase();
    },
    upgrade(name){
        return "el desempeño del candidato ha sido muy bueno,cambiamos el seniority de la entrevista a "+name.toLowerCase(); 
    },
    seniority_pool_empty(upgrade){
        let message;
        if(upgrade){
            message = "bueno, pero no pudimos mejorar el seniority";
        }else{
            message =  "bajo, pero no pudimos bajar el seniority";
        }
        message = "el desempeño del candidato ha sido muy "+message;
        return message;
    },
    validated(token){
        return new message(false,"200",token)
    }
}