var client = require('../base_de_datos/Cliente')
module.exports = {
    searchOne: async function search(id){
        var candidates = await client.candidates();
        var usuario    = await candidates.findOne({"_id":parseInt(id)});
        return  usuario;
    },
    searchAll : async function search(){
        var candidates = await client.candidates();
        var usuarios   = await candidates.find({}).toArray();
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
        var resultado           = await candidates.update(
            { _id: candidate.id },
            { $set: candidate },
        )
        return resultado;
    }
}