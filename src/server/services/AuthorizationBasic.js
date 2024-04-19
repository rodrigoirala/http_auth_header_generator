const axios = require('axios');
const {CredentialsClient} = require('./http_api');

class AuthorizationBasic extends CredentialsClient{

  constructor( params) {
    super( params);
  }

  async fetchAuthHeaders(){

    /*hacer nada ya que se utilizan las credenciales del constructor. 
    Pero debe estar declarada para que sea llamada en esta subclase y no la superclase*/
    await this.parseCredentialsResponse();
  }

  async parseCredentialsResponse(){

    this.authHeaders = {
      'Authorization': 'Basic ' + Buffer.from( this.instanceParams.credentials.user + ':' + this.instanceParams.credentials.pass ).toString('base64')
    };
  }
}

module.exports = AuthorizationBasic;
