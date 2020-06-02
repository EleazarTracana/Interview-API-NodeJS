module.exports = {
  message : class ResponseMessage{
    constructor(error,codigo,mensaje) {
        this.error  = error;
        this.codigo = codigo;
        this.mensaje = mensaje; 
      }
    },
  results : class Results{
    constructor(dni,technology,results,pk){
      this.technology = technology,
      this.candidate_id = dni,
      this.results = results
      this._id = pk
    }
  }    
}
