var client = require('../base_de_datos/Cliente')
var userController = require('../controllers/USERS')

module.exports = {
   technologies_dropdown_list: async function search() {
      var list = [],
          technologies = await client.tecnologies(),
          pools       = await technologies.find({}).toArray();
      pools.forEach(pool => {list.push(pool.technology)});

      let uniqueArray = list.filter(function(elem, pos) {
         return list.indexOf(elem) == pos;
     })
     uniqueArray.push("otra");
   return uniqueArray;
   },
   poolsAll:async function search(name){
      var CollectionPools = await client.tecnologies();
      var pools = await CollectionPools.find({}).toArray();
      return pools;
   },
   poolByName: async function search(name){
      var CollectionPools = await client.tecnologies();
      var pools = await CollectionPools.find({'name':name}).toArray();
      return pools;
   },
   poolsBytechnology: async function search(technology){
      var CollectionPools = await client.tecnologies();
      var pools = await CollectionPools.find({"technology":technology}).toArray()
      return pools
   },
   poolTwoParams: async function search(poolname,technology){
      var CollectionPools = await client.tecnologies();
      var pool = await CollectionPools.findOne({"technology":technology, "name":poolname});
      return pool;
   },
   poolAddQuestion: async function search(poolId, question) {
      var CollectionPools = await client.tecnologies();
      var pool = await CollectionPools.findOne({'_id':poolId});
      pool.questions.push(question);
      return await CollectionPools.updateOne({_id:poolId},
         {$set: {questions: pool.questions}});
   },
   poolDeleteQuestion: async function search(poolId, questionId) {
      var CollectionPools = await client.tecnologies();
      var pool = await CollectionPools.findOne({'_id':poolId});
      pool.questions.splice(pool.questions.findIndex(q => q._id === questionId), 1);
      //return pool.questions;
      return await CollectionPools.updateOne({'_id':poolId},
         {$set: {questions: pool.questions}});
   },
   poolUpdateQuestion: async function search(poolId, question) {
      var CollectionPools = await client.tecnologies();
      var pool = await CollectionPools.findOne({'_id':poolId});
      pool.questions.splice(pool.questions.findIndex(q => q._id === question._id), 1);
      pool.questions.push(question);
      return await CollectionPools.updateOne({'_id':poolId},
         {$set: {questions: pool.questions}});
   }
}
