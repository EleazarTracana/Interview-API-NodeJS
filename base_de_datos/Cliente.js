module.exports = function(db) {
    var module = {};
    module.counters = () => {
        return db.collection('COUNTERS');
    };
    module.candidates = () => {
        return db.collection('CANDIDATES');
    };
    module.tecnologies = () => { 
        return db.collection('POOLS');
    };
    module.users = () => {
        return db.collection('USERS');
    };
    module.results = () => {
        return db.collection('RESULTS');
    },
    module.params = () => {
        return db.collection("PARAMS");
    },
    module.permisos = () => {
        return db.collection("PERMISOS");
    },
    module.getNextSequence = async (name) => {
        var db = module.counters();
                  await db.updateOne(
                         { "_id" : name },
                         { $inc: { "seq" : 1 } }
                  );
        let counter = await db.findOne({'_id':name}); 
            return counter.seq;
    }
    return module;
}


