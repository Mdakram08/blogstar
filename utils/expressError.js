class ExpressError extends Error{
    constructor (statusCode,messsage){
      super(messsage)
      this.statusCode=statusCode;
      // this.message=messsage;
    }
}
module.exports=ExpressError;