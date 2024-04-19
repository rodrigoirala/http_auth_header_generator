const axios = require('axios');
const {CredentialsClient} = require('./http_api');

class AuthUserPass extends CredentialsClient{

  constructor( params) {
    super( params);
  }

  async fetchAuthHeaders(){

    /*hacer nada ya que se utilizan las credenciales del constructor. 
    Pero debe estar declarada para que sea llamada en esta subclase y no la superclase*/
    await this.parseCredentialsResponse();
  }

  async parseCredentialsResponse(){

    this.authHeaders = this.instanceParams.credentials;
  }
}

module.exports = AuthUserPass;
