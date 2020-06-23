const { table } = require("console");

const nodemailer = require("nodemailer"),
fs = require('fs'),
QR_CODE   = require('qrcode'),
pdf = require('html-pdf'),
table_row = "<div style=\"padding-bottom:0px;height: 21px;font-size:20px;\">CONTENT<span style=\"font-weight:bold;\">.    score: PUNTAJE</span></div>";

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
         function read_html_results(model,base_64_QR){
             var date =  new Date().toISOString().split('T')[0],
                 results =  fs.readFileSync('C:/InterviewAPI/templates/resultados.html', 'utf8');
                 results =  results.replace("PH_TECHNOLOGY",model.technology)
                                   .replace("PH_NAME_POOL",model.pool)
                                   .replace("PH_INTERVIEWER",model.interviewer)
                                   .replace("PH_CANDIDATE_NAME",model.candidate_name)
                                   .replace("PH_SCORE",model.final_score)
                                   .replace("PH_COUNT_QUESTION",model.count)
                                   .replace("PH_QR_CODE",base_64_QR)
                                   .replace("PH_DATE", date)
                                   .replace("PH_BIRTHDATE",model.candidate_age);
                 
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
     module.downloadPDF = async (DNI) =>{
        var results_db  = client.results(),
            candidates_db = client.candidates(),
            candidate   = await candidates_db.findOne({_id: parseInt(DNI)}),
            resultados  = await results_db.findOne({candidate_id: parseInt(DNI)}),
            append      = '',
            i = 1;

            resultados.results.forEach(question => {
                let description = i+".  "+question.description;
                    score       = question.score,
                    row  = table_row.replace("CONTENT",description)
                                    .replace("PUNTAJE",score)
                    append += row;
                    i++;
            });

            var full_score     = 0,
            question_count = resultados.results.length;
            tech     = candidate.technology;
            resultados.results.forEach(question => {full_score += question.score});

        var count_total  = (question_count*5),
            count_result = count_total.toString()+"/"+full_score.toString();

          
           let  html       = fs.readFileSync('C:/InterviewAPI/templates/resultados_QR.html', 'utf8'),
                base_64_QR = await module.generate_qrcode(DNI);
                html = html.replace("PH_RESULTADOS",append)
                           .replace("PH_CANDIDATE",candidate.name +" "+candidate.surname)
                           .replace("PH_TECHNOLOGY",tech)
                           .replace("PH_NAME_POOL",resultados.seniority)
                           .replace("PH_INTERVIEWER",resultados.interviewer)
                           .replace("PH_COUNT_QUESTION",question_count)
                           .replace("PH_SCORE",count_result)
                           .replace("PH_CODIGO_QR",base_64_QR)
                           .replace("PH_BIRTHDATE",getAge(candidate.birthday));   

        const stream = await new Promise((resolve, reject) => {
                    pdf.create(html).toStream((err, stream) => {resolve(stream)});
          });
        return stream;

     };
     module.generate_qrcode = async (DNI) => {
        var params_db = client.params(),
            param_method  = await params_db.findOne({ parameter_name: "QR_METHOD"}),
            full_method   = param_method.parameter_value + DNI,
            base_64_QR    = await QR_CODE.toDataURL(full_method);

            return base_64_QR;
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
            base_64_QR  = await module.generate_qrcode(result_model.DNI),
            body        =  read_html_results(result_model,base_64_QR),
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
function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  }