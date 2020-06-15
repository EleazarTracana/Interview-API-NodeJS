var client = require('../base_de_datos/Cliente.js')
const nodemailer = require("nodemailer");
const fs = require('fs');


function read_html_credentials(username,password){
   var credentials =  fs.readFileSync('C:/InterviewAPI/templates/credenciales.html', 'utf8');
       credentials = credentials.replace('PH_USERNAME',username)
                                .replace('PH_PASSWORD',password);

        return credentials;
}
async function create_email() {
   var params = await client.params();
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

module.exports = {
    GetAll: async function search(name) {
        var allparams  = await client.params(),
            params = allparams.find({}).toArray();
        return params;
     },
     all_permissions: async function(){
        var permissions_db  = await client.permisos(),
            all_permissions = await permissions_db.find({}).toArray();
            return all_permissions;
     },
     sendEmail_credentials: async (email_receiver,username,password) =>{

        var transporter = await create_email(),
            params    = await client.params(),
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
     google_places_key: async() =>{
         var params = await client.params(),
             key    = await params.findOne({parameter_name:"API_PLACES_KEY"});
             return key;
     },
     question_difficulty_dropdown: async () => {
        var params = await client.params(),
            key    = await params.findOne({parameter_name: "DROPDOWN_DIFFICULTY"});

        let min = key.parameter_value.min_difficulty,
            max = key.parameter_value.max_difficulty,
            array = [];

            array.push("seleccionar dificultad");
            for(min ; min <= max; min++)
                array.push(min.toString());

            
         return array;       
     }
    
}