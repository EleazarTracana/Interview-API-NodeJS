var client = require('../base_de_datos/Cliente'),
    candidate_functions = require('../controllers/CANDIDATES'),
    results             = require('../Modulos/models').results;

module.exports= {
    create_default_results: async (dni,technology) => {
        var results_db = await client.results(),
            next_pk = await client.getNextSequence("resultsid"),
            empty_array = [],
            candidate_results = new results(dni,technology,empty_array,next_pk);
            
        let callback =  await results_db.insertOne(candidate_results);
        return callback;
    },
    update_candidate_results: async(candidate,question,poolid) => {
      if(question._id == -1){
       var  empty_question = {
          description: 'se han acabado las preguntas de la pool',
          score: 0,
          difficulty: 0,
          _id: -1
        }
        return empty_question;
      }
      var results_db = await client.results(),
          pool_db    = await client.tecnologies(),
          pool       = await pool_db.findOne({_id:poolid}),
          results_cd = await results_db.findOne({candidate_id: candidate._id });
          results_cd.results.push(question);
          await results_db.updateOne({candidate_id:candidate._id},{results: results_cd});

      var next_question  = await get_next_question(pool,results_cd);
      return next_question;
    }
  }
async function get_next_question(pool,resultado){  
        current_sum_candidate = 0,
        current_length_candidate = resultado.questions.length;

        resultado.forEach(question => {current_sum_candidate += question.score})
        var current_value = Math.round(current_sum_candidate/current_length_candidate),
            filtered_questions = pool.questions.filter(e => !resultado.questions.includes(e)),
            next_difficulty = GetNextDifficulty(current_value);

        var next_question = filtered_questions.find(e => e.difficulty == next_difficulty);
        if(next_question == null){
          next_question =  filtered_questions[0];
          if(next_question == null){
            next_question = {
              description: 'se han acabado las preguntas de la pool',
              score: 0,
              difficulty: 0,
              _id: -1
            }
          }
        }
        return next_question;
};
var GetNextDifficulty = (total) =>{
  console.log('total: ' + total);
    var next_value = 1;
    const highest_score = 5,
          highest_medium_score = 4,
          medium_score = 3,
          medium_slow_score =2,
          slow_score = 1;
          
          if(total == highest_score){
            next_value = highest_score
          }else if(total == highest_medium_score) {
            next_value = highest_score
          }else if(total == medium_score){
            next_value = medium_score
          }else if(total == medium_slow_score){
            next_value  = slow_score;
          }
          console.log('next_value: ' + total);
    return next_value;
}