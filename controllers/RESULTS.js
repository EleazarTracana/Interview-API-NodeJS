module.exports = (db) => {

  var client = require('../base_de_datos/Cliente')(db),
      manage = require('../controllers/MANAGE')(db),
      results             = require('../Modulos/models').results,
      Interview           = require('../Modulos/models').Interview,
      enums               = require('../Modulos/constantes'),
      module              = {};

    module.create_default_results = async (dni,technology) => {
        var results_db = client.results(),
            next_pk = await client.getNextSequence("resultsid"),
            empty_array = [],
            candidate_results = new results(dni,technology,empty_array,next_pk);
            candidate_results.finished = false;
            
        let callback =  await results_db.insertOne(candidate_results);
        return callback;
    };
    module.Interview = async(candidate,question,poolid,continuar) => {
      var results_db =  client.results(),
          pool_db    =  client.tecnologies(),
          results_cd = await results_db.findOne({"candidate_id": candidate._id }),
          pool;

          if(!continuar)
               pool = await pool_db.findOne({_id:poolid});
           else
               pool = await pool_db.findOne({name: results_cd.seniority, technology: candidate.technology});

        if(results_cd.results.length == 0){
          await results_db.updateOne({candidate_id:candidate._id},
            {$set: {seniority: pool.name}});
        }
        if(!continuar){
          results_cd.results.push(question);
          await results_db.updateOne({candidate_id:candidate._id},
              {$set: {results: results_cd.results}});
          }

      var next_question  = await get_next_question(pool,pool_db,results_cd.question);
      return next_question;
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
         if(filtered_questions.length > 0){
           next_question = filtered_questions[0];
         }else{
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
  return module;
  }
async function finish_interview(DNI,candidate_db,results_db,pool_name,name_interv,old_question){
      var candidate  =  await candidate_db.findOne({_id:DNI}),
          cand_result = await results_db.findOne({ "candidate_id" : DNI });
            await results_db.updateOne({ "candidate_id" : DNI },{$set: {finished: true}});

            var full_score     = 0,
                question_count = cand_result.results.length;
                tech     = candidate.technology;
            cand_result.results.forEach(question => {full_score += question.score});

            var count_total  = (question_count*5),
                count_result = count_total.toString()+"/"+full_score.toString();

            var model_mail = {
              technology: tech,
              pool: pool_name,
              final_score: count_result,
              interviewer: name_interv
            }  
       return await manage.sendEmail__results(candidate.email,model_mail);
}