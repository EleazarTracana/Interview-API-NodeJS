module.exports = (db) => {
   var client = require('../base_de_datos/Cliente')(db),
      module = {};

   module.technologies_dropdown_list = async () => {
      var list = [],
          technologies = client.tecnologies(),
          pools       = await technologies.find({}).toArray();
      list.push("seleccionar tecnologia");
      pools.forEach(pool => {list.push(pool.technology)});
      let uniqueArray = list.filter(function(elem, pos) {
         return list.indexOf(elem) == pos;
     });
   return uniqueArray;
   };
   module.pool_add = async (pool) => {
      var collection = client.tecnologies();
         let next_pk = await client.getNextSequence("poolid");
         pool.questions = [];
         pool._id = next_pk;
         let response =  await collection.insertOne(pool);
      return response;
   };
   module.poolsAll = async () => {
      var CollectionPools = client.tecnologies();
      var pools = await CollectionPools.find({}).toArray();
      return pools;
   };
   module.poolByName = async (name) => {
      var CollectionPools = client.tecnologies();
      var pools = await CollectionPools.find({'name':name}).toArray();
      return pools;
   };
   module.poolsBytechnology = async (technology) => {
      var CollectionPools =  client.tecnologies();
      var pools = await CollectionPools.find({"technology":technology}).toArray()
      return pools
   };
   module.poolTwoParams = async (poolname,technology) =>{
      var CollectionPools =  client.tecnologies();
      var pool = await CollectionPools.findOne({"technology":technology, "name":poolname});
      return pool;
   };
   module.poolAddQuestion = async (poolId, question) => {
      var CollectionPools =  client.tecnologies();
      var pool = await CollectionPools.findOne({'_id':poolId});
      pool.questions.push(question);
      return await CollectionPools.updateOne({_id:poolId},
         {$set: {questions: pool.questions}});
   };
   module.poolDeleteQuestion = async (poolId, questionId) => {
      var CollectionPools =  client.tecnologies();
      var pool = await CollectionPools.findOne({'_id':poolId});
      pool.questions.splice(pool.questions.findIndex(q => q._id === questionId), 1);
      return await CollectionPools.updateOne({'_id':poolId},
         {$set: {questions: pool.questions}});
   };
   module.poolUpdateQuestion = async (poolId, question) => {
      var CollectionPools = client.tecnologies();
      var pool = await CollectionPools.findOne({'_id':poolId});
      pool.questions.splice(pool.questions.findIndex(q => q._id === question._id), 1);
      pool.questions.push(question);
      return await CollectionPools.updateOne({'_id':poolId},
         {$set: {questions: pool.questions}});
   };
   return module;
}
