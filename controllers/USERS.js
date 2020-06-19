module.exports = (db) => {
    var client = require('../base_de_datos/Cliente')(db),
        manage = require('../controllers/MANAGE')(db),
        module = {};
    
    module.searchOne = async (username) => {
        var users =  client.users();
        var usuario    = await users.findOne({"username": username});
        return  usuario;
    };
    module.searchAll = async () => {
        var users =  client.users();
        var usuarios   = await users.find({}).toArray();
        return usuarios;
    };
    module.addUser = async (user) => {
        var users   =  client.users(),
            nextPk = await client.getNextSequence("userid");
        user._id = nextPk;
        var resultado  = await users.insertOne(user);
        return resultado;
    };
    module.deleteUser = async (user) => {
        var users =  client.users();
        var resultado  = await users.deleteOne({_id: user.id});
        return resultado;
    };
    module.user_update = async (user_model,pass_no_enc) =>{
        var users_db =  client.users(),
            user     = await users_db.findOne({_id : user_model._id});
            
            await users_db.updateOne({ _id: user._id },{ $set: user_model });
        if(user.password != user_model.password){
          await manage.sendEmail_credentials_update(user_model.email,model_user.username,pass_no_enc)
        }
        return resultado;
    };
    return module;
}