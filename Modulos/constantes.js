
const message    = require('./models.js').message;

module.exports = {

    invalid:          new message(true, "403", 'Invalid token'),
    genericError:     new message(true, "500", 'An error has ocurred'),
    candidateNoFound: new message(true, "404", 'Candidate not found'),
    candidateExist:   new message(true, "403", 'Candidate cannot by added. Already Exist'),
    paramNotFound:    new message(true, "404", 'Param not found'),
    candidateAdded:   new message(false,"200", 'Your candidate has been added successfully'),
    userNotFound:     new message(true, "404", 'User not found'),
    incorrect:        new message(true, "403", 'User/password incorrect'),
    validated(token){
        return new message(false,"200",token)
    }
}