const nodemailer = require("nodemailer");
const fs = require('fs');

module.exports = (db) => {
    var client = require('../base_de_datos/Cliente.js')(db),
        module = {};

        function read_html_credentials(username,password){
            var credentials =  fs.readFileSync('C:/InterviewAPI/templates/credenciales.html', 'utf8');
                credentials = credentials.replace('PH_USERNAME',username)
                                         .replace('PH_PASSWORD',password);
         
                 return credentials;
         }
         function read_html_crendentials_update(username,password){
             var credentials =  fs.readFileSync('C:/InterviewAPI/templates/credenciales_cambio.html', 'utf8');
                 credentials = credentials.replace('PH_USERNAME',username)
                                          .replace('PH_PASSWORD',password);
              return credentials;
         }
         function read_html_results(model){
             var results =  fs.readFileSync('C:/InterviewAPI/templates/resultados.html', 'utf8'),
                 results =  results.replace("PH_TECHNOLOGY",model.technology)
                                   .replace("PH_NAME_POOL",model.pool)
                                   .replace("PH_INTERVIEWER",model.interviewer)
                                   .replace("PH_DESEMP",model.rating)
                                   .replace("PH_SCORE",model.final_score);
                 
                 return results;
         
         }
         async function create_email() {
            var params =  client.params();
                _email    = await params.findOne({ parameter_name: "EMAIL_ACCOUNT"}),
                _password = await params.findOne({parameter_name:"EMAIL_PASSWORD"}),
                _server   = await params.findOne({parameter_name:"SMTP_SERVER"}),
                _port     = await params.findOne({parameter_name:"SMTP_PORT"}),
                _secure   = await params.findOne({parameter_name:"SMTP_SECURE"});
         
            let transporter = await nodemailer.createTransport({
                host: _server.parameter_value,
                port: _port.parameter_value,
                secure: _secure.parameter_value, 
                auth: {
                  user: _email.parameter_value,
                  pass: _password.parameter_value, 
                },
              });
              return transporter;
         }    

    module.GetAll = async () => {
        var allparams  = client.params(),
            params = allparams.find({}).toArray();
        return params;
     };
     module.all_permissions = async () => {
        var permissions_db  =  client.permisos(),
            all_permissions = await permissions_db.find({}).toArray();
            return all_permissions;
     };
     module.sendEmail_credentials = async (email_receiver,username,password) =>{
        var transporter = await create_email(),
            params    =  client.params(),
            _email    = await params.findOne({ parameter_name: "EMAIL_ACCOUNT"}),
            body      =  read_html_credentials(username,password),
            info      = await transporter.sendMail({
                 from: _email.parameter_value,
                 to: email_receiver , 
                 subject: "Credenciales de Acceso", 
                 html: body, 
          });
          return info;
     },
     module.sendEmail_credentials_update = async (email_receiver,username,password) => {
        var transporter = await create_email(),
        params    = client.params(),
        _email    = await params.findOne({ parameter_name: "EMAIL_ACCOUNT"}),
        body      =  read_html_crendentials_update(username,password),
        info      = await transporter.sendMail({
             from: _email.parameter_value,
             to: email_receiver , 
             subject: "Actualizacion de Credenciales", 
             html: body, 
      });
      return info;
     };
     module.sendEmail__results = async(email_receiver,result_model) => {
        var transporter = await create_email(),
            params      = client.params(),
            _email      = await params.findOne({ parameter_name: "EMAIL_ACCOUNT"}),
            body        =  read_html_results(username,password),
            info      = await transporter.sendMail({
                from: _email.parameter_value,
                to: email_receiver , 
                subject: "Resultado Entrevista", 
                html: body, 
         });
         return info;
     };
     module.google_places_key = async() =>{
         var params = client.params(),
             key    = await params.findOne({parameter_name:"API_PLACES_KEY"});
             return key;
     };
     module.question_difficulty_dropdown = async () => {
        var params = client.params(),
            key    = await params.findOne({parameter_name: "DROPDOWN_DIFFICULTY"});

        let min = key.parameter_value.min_difficulty,
            max = key.parameter_value.max_difficulty,
            array = [];

            array.push("seleccionar dificultad");
            for(min ; min <= max; min++)
                array.push(min.toString());   
         return array;       
     }
     return module;
    
}