const linkedinUriBase = "https://www.linkedin.com/in/"
const githubUriBase = "https://github.com/";
const hackerrankUriBase = "https://www.hackerrank.com/"


module.exports = (db) => {
    var client = require('../base_de_datos/Cliente')(db),
        module = {};

    module.searchOne =  async (id) => {
        var candidates = client.candidates(),
            usuario    = await candidates.findOne({"_id":parseInt(id)});
        InsertLinks(usuario);
        return  usuario;
    };
    module.searchAll =  async () =>{
        var candidates_db =  client.candidates(),
            results_db    =  client.results(),
            candidates    = await candidates_db.find({}).toArray(),
            results_all   =  await results_db.find({}).toArray();
            candidates.forEach(value => InsertLinks(value));

        for(var i = 0; i < candidates.length; i++){
            var result_cand = results_all.find(x => x.candidate_id == candidates[i]._id);
            if(result_cand.finished == true){
                candidates[i].finished = true;
                candidates[i].pending  = false;
            }else if(result_cand.results.length > 0 && result_cand.finished == false){
                candidates[i].finished = false;
                candidates[i].pending  = true;
            }else if(result_cand.results.length == 0 && result_cand.finished == false){
                candidates[i].finished = false;
                candidates[i].pending  = false;
            }
        }
        return candidates;
    };
    module.addCandidate = async (candidate) => {
        var candidates = client.candidates();
        delete candidate.finished;
        delete candidate.pending;
        return await candidates.insertOne(candidate);;
    };
    module.deleteCandidate = async (id) => {
        var candidates =  client.candidates();
        return await candidates.deleteOne({_id: id});;
    };
    module.updateCandidate = async (candidate) => {
        var candidates = client.candidates();
        var resultado           = await candidates.updateOne(
            { _id: candidate._id },
            { $set: candidate }
        );
        return resultado;
    };
    function InsertLinks(usuario){
        if(usuario != null){
            if(usuario.github != null )
                usuario.github = githubUriBase + usuario.github;
            if(usuario.linkedin != null)
                usuario.linkedin = linkedinUriBase + usuario.linkedin;   
            if(usuario.hackerrank != null)
            usuario.hackerrank = hackerrankUriBase + usuario.hackerrank;
        }
        return usuario;
    }
    return module;
}
