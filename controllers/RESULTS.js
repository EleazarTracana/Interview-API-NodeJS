var client = require('../base_de_datos/Cliente'),
    candidate_functions = require('../controllers/CANDIDATES'),
    results             = require('../Modulos/models').results

module.exports= {
    create_default_results: async (dni,technology) => {
        var results_db = await client.results(),
            next_pk = await client.getNextSequence("resultsid"),
            empty_array = [],
            candidate_results = new results(dni,technology,empty_array,next_pk);
            
        let callback =  await results_db.insertOne(candidate_results);
        return callback;
    }
}

/*faltaria el metodo que actualiza el resultado del usuario y probar y modificar
el metodo gext_next_question a tu gusto*/

async function get_next_question(dni_user,pool_id){  

    var candidate_db = await client.candidates(),
        pool_db   = await client.tecnologies(),
        candidate = await candidate_db.findOne({dni:dni_user}),
        pool      = await pool_db.findOne({_id:pool_id}),
        candidate_questions = candidate.results,
        pool_questions = pool.questions,
        current_sum_candidate = 0,
        current_length_candidate = candidate_questions.length;

        candidate_questions.forEach(question => {current_sum_candidate += question.score})
        var current_value = Math.round(current_sum_candidate/current_length_candidate),
            filtered_questions = pool_questions.filter(e => !candidate_questions.includes(e)),
            next_difficulty = GetNextDifficulty(current_value);

        var next_question = filtered_questions.find(e => e.difficulty == next_difficulty);
        if(next_question == null){
           //implementar logica si no hay mas preguntas con esa dificultad
        }

        return next_question;

};
var GetNextDifficulty = (total) =>{
    var next_value = 1;
    const highest_score = 5,
          highest_medium_score = 4,
          medium_score = 3,
          medium_slow_score =2,
          slow_score = 1;
          
          //lo hice de ejemplo mat pero a es a tu gusto
          if(total == highest_score){
            next_value = highest_score
          }else if(total == highest_medium_score) {
            next_value = highest_score
          }else if(total == medium_score){
            next_value = medium_score
          }else if(total == medium_slow_score){
            next_value  = slow_score;
          }
    return next_value;
}