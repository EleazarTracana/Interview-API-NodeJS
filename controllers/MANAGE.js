var client = require('../base_de_datos/Cliente.js')
const nodemailer = require("nodemailer");

module.exports = {
    GetAll: async function search(name) {
        var allparams  = await client.params();
        var params = allparams.find({}).toArray();
        return params;
     },
     create_mail_client: ()=>{
        var params = await client.params();
            _email    = await params.findOne({ parameter_name: "EMAIL_ACCOUNT"}),
            _password = await params.findOne({parameter_name:"EMAIL_PASSWORD"}),
            _server   = await params.findOne({parameter_name:"SMTP_SERVER"}),
            _port     = await params.findOne({parameter_name:"SMTP_PORT"}),
            _secure   = await params.findOne({parameter_name:"SMTP_SECURE"})

        let transporter = nodemailer.createTransport({
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

}