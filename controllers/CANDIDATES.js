var client = require('../base_de_datos/Cliente')
const linkedinUriBase = "https://www.linkedin.com/in/"
const githubUriBase = "https://github.com/";

module.exports = {
    searchOne: async function search(id){
        var candidates = await client.candidates();
        var usuario    = await candidates.findOne({"_id":parseInt(id)});
        this.InsertLinks(usuario);
        return  usuario;
    },
    searchAll : async function search(){
        var candidates = await client.candidates(),
        usuarios   = await candidates.find({}).toArray();
        
        if(usuarios != null && usuarios instanceof Array ){
            usuarios.forEach(value => this.InsertLinks(value))
        }
        return usuarios;
    },
    addCandidate: async function add(candidate){
        var candidates = await client.candidates();
        var resultado  = await candidates.insertOne(candidate);
        return resultado;
    },
    deleteCandidate: async function Delete(id) {
        var candidates = await client.candidates();
        var resultado  = await candidates.deleteOne({_id: id});
        return resultado;
    },
    updateCandidate: async function Update(candidate){
        var candidates = await client.candidates();
        var resultado           = await candidates.updateOne(
            { _id: candidate.id },
            { $set: candidate }
        );
        return resultado;
    },
    InsertLinks: function insert(usuario){
        if(usuario != null){
            if(usuario.github != "")
                usuario.github = githubUriBase + usuario.github;
            if(usuario.linkedin != "")
                usuario.linkedin = linkedinUriBase + usuario.linkedin;   
        }
        return usuario;
    }
}