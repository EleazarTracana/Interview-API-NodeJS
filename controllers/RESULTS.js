var client = require('../base_de_datos/Cliente'),
    candidate_functions = require('../controllers/CANDIDATES'),
    results             = require('../Modulos/models').results,
    Interview           = require('../Modulos/models').Interview,
    enums               = require('../Modulos/constantes');

module.exports = {
    create_default_results: async (dni,technology) => {
        var results_db = await client.results(),
            next_pk = await client.getNextSequence("resultsid"),
            empty_array = [],
            candidate_results = new results(dni,technology,empty_array,next_pk);
            candidate_results.finished = false;
            
        let callback =  await results_db.insertOne(candidate_results);
        return callback;
    },
    update_candidate_results: async(candidate,question,poolid) => {
      var results_db = await client.results(),
          pool_db    = await client.tecnologies(),
          pool       = await pool_db.findOne({_id:poolid}),
          results_cd = await results_db.findOne({"candidate_id": candidate._id });
          results_cd.results.push(question);
          await results_db.updateOne({candidate_id:candidate._id},
              {$set: {results: results_cd.results}});

      var next_question  = await get_next_question(pool,pool_db,results_cd.results);
      return next_question;
    }
  }
async function get_next_question(pool,pool_db,resultado){  
       var current_sum_candidate = 0,
           current_length_candidate = resultado.length,
           up_grade = false,
           down_grade = false,
           grade_message,
           new_pool;

        resultado.forEach(question => {current_sum_candidate += question.score})
        var current_value = Math.round(current_sum_candidate/current_length_candidate),
            counter = current_length_candidate + 1;
         
        if(current_length_candidate == 3 && current_value <= 2){
          down_grade = true;
          switch(pool.name){
            case enums.semisenior:
              new_pool = await pool_db.findOne({technology: pool.technology, name: enums.junior});
              grade_message = enums.downgrade(enums.junior);
              break;
            case enums.senior:
              new_pool = await pool_db.findOne({technology: pool.technology, name: enums.semisenior});
              grade_message = enums.downgrade(enums.semisenior);
              break;
            case enums.junior:
              new_pool = pool;
              grade_message = enums.downgrade_impossible;
              break;
          }
        }
        if(current_length_candidate == 6 && current_value >= 4){
          up_grade = true;
          switch(pool.name){
            case enums.semisenior:
              new_pool = await pool_db.findOne({technology: pool.technology, name: enums.senior});
              grade_message = enums.upgrade(enums.senior);
              break;
            case enums.junior:
              new_pool = await pool_db.findOne({technology: pool.technology, name: enums.semisenior});
              grade_message = enums.upgrade(enums.semisenior);
              break;
            case enums.senior:
              new_pool = pool;
              grade_message = enums.upgrade_impossible;
              break;
          }
        }
        if(down_grade || up_grade){
          if(new_pool == null){
              grade_message = enums.seniority_pool_empty(up_grade);
              new_pool      = pool;
          }
        }else
          new_pool = pool;
        
        var filtered_questions = new_pool.questions.filter(e => !resultado.includes(e));
        next_difficulty = GetNextDifficulty(current_value);

        var next_question = filtered_questions.find(e => e.difficulty == next_difficulty);
        if(next_question == null){
          next_question =  filtered_questions[0];
          if(next_question == null){
            next_question = {
              description: 'se han acabado las preguntas de la pool',
              score: 0,
              difficulty: 0
            }
          }
        }
        let Interview_response = new Interview((down_grade || up_grade ),new_pool._id,next_question,counter,grade_message);
        return Interview_response;
};
var GetNextDifficulty = (total) => {
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
    return next_value;
}