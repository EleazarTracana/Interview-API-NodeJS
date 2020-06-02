const MongoClient  = require('mongodb').MongoClient;
const url          = "mongodb+srv://EleazarTracana:5q7f7EFKpyz1GuqC@cluster0-mvhqd.mongodb.net/test?retryWrites=true&w=majority";
// url = "mongodb+srv://Colloquium:I37j2cOeQuzuMyyQ@cluster0-zu10c.mongodb.net/test?retryWrites=true&w=majority"

module.exports = {
    conexion: async function Conectar() {   
        client = await MongoClient.connect(url, { useUnifiedTopology: true });
        return client;
    },
    counters : async function candidates(){
        var base   =  await this.conexion() ;
        return base.db('INTERVIEW').collection('COUNTERS');
    },
    candidates : async function candidates(){
        var base   =  await this.conexion() ;
        return base.db('INTERVIEW').collection('CANDIDATES');
    },
    tecnologies: async function tecnology() {
        var base   =  await this.conexion();
        return base.db('INTERVIEW').collection('POOLS');
    },
    users: async function tecnology() {
        var base   =  await this.conexion();
        return base.db('INTERVIEW').collection('USERS');
    },
    results: async function results(){
        var base   =  await this.conexion();
        return base.db('INTERVIEW').collection('RESULTS');
    },
    params: async function search(){
        var base = await this.conexion();
        return base.db('INTERVIEW').collection("PARAMS");
    },
    getNextSequence: async function NextSequence(name){
        var db =  await this.counters();
            var ret = db.findAndModify(
                   {
                     query: { _id: name },
                     update: { $inc: { seq: 1 } },
                     new: true
                   }
            );
            return ret.seq;
    }
}


