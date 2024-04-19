const axios = require('axios');
const {CredentialsClient, ApiError} = require('./http_api');

class PlainToken extends CredentialsClient{

  constructor( params) {
    super( params);
    this.token = null;
  }

  async parseCredentialsResponse( response ){
    const nestedTokenKeys = this.instanceParams.bodyResponseTokenKey.split('.');
    this.token  = nestedTokenKeys.reduce((accumulator, currentValue)  => {
      //en caso que la clave anidada de la respuesta o el error no exista se devuelve el mismo valor
      return accumulator[currentValue] || accumulator }, 
    response.data);

    this.authHeaders = {
      "Token": this.token
    };
  }
}

module.exports = PlainToken;
