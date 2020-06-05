var client = require('../base_de_datos/Cliente.js')

module.exports = {
    GetAll: async function search(name) {
        var allparams  = await client.params();
        var params = allparams.find({}).toArray();
        return params;
     }
}