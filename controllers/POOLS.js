var client = require('../base_de_datos/Cliente')

module.exports = {
   tecnologies: async function search() {
      var list = [];
      var tecnologies = await client.tecnologies();
      var pools    = await tecnologies.find({}).toArray();
      pools.forEach(pool => {list.push(pool.technology)});
      return  list;
   },
   poolByName: async function search(name){
      var CollectionPools = await client.tecnologies();
      var pool = await CollectionPools.findOne({'name':name});
      return pool;
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
   }
}
