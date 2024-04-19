const axios = require('axios');
const { ApiError } = require('./ApiError');
const https = require('https');

const httpRequest = (method, api) => async (url, data) => {

  const options = {
    method,
    url: url,
  };

  if (data) {
    if (method === 'get') {
      options.params = data;
    } else {
      options.data = data;
    }
  }

  return api(options);
}

const throwApiError = ({ data = {}, status = 500 }) => {
  console.error('API: Error Ocurred', status, data); //eslint-disable-line
  throw new ApiError(data, status);
};

const generalError = {
  _global: ['Unexpected Error Occurred'],
};

const createInterceptor = ( api ) => {
  api.interceptors.response.use(
    response => response,
    async ({ config: requestConfig, response = {}, data }) => {
      const errorData = {
        status: response.status,
        data: {
          ...data,
          errors: data && data.errors ? data.errors : generalError,
        },
      };
  
      return response;
    },
  );
};

class CredentialsClient {

  constructor( params ) {
    this.instanceParams = params;
    this.authHeaders = null; 

    this.apiClient = this.createClient();
    createInterceptor( this.apiClient);
  }

  createClient(){

    const options =   {
      withCredentials: true,
      responseType: 'json',
      httpsAgent: new https.Agent({  
        rejectUnauthorized: false
      })
    };

    return axios.create( options);
  }

  async getAuthHeaders( ctx ){
    if ( !this.authHeaders || (ctx.query ? ctx.query['renew']: false)  ){
      console.log( ["Renewing credentials requested by", 
                  ctx.socket.remoteAddress, 
                  "for service",
                  ctx.path,
                  "of class",
                  this.constructor.name
                ].join(" "));
      await this.fetchAuthHeaders();
    }
    
    return this.authHeaders;
  }

  async fetchAuthHeaders(){
    try{
      const response = await this.post( this.instanceParams.authEndpoint, this.instanceParams.credentials);
      this.parseCredentialsResponse( response);
      const serviceHeaders = (this.instanceParams && this.instanceParams.serviceHeaders ? this.instanceParams.serviceHeaders: {});
      this.authHeaders = {...this.authHeaders, ...serviceHeaders};
    } catch( e) {
      throw e;
    }
  }

  async get( url, data) {
    const req = httpRequest('get', this.apiClient);
    try{
      return await req(url, data);
    } catch( e) {
      throw new ApiError(e.message, e.response.status);
    } 
  }

  async post( url, data) {
    const req = httpRequest('post', this.apiClient);
    try{
      return await req(url, data);
    } catch( e) {
      throw new ApiError(e.message, e.response.status);
    } 
  }

  async put( url, data) {
    const req = httpRequest('put', this.apiClient);
    try{
      return await req(url, data);
    } catch( e) {
      throw new ApiError(e.message, e.response.status);
    } 
  }

  async delete( url, data) {
    const req = httpRequest('delete', this.apiClient);
    try{
      return await req(url, data);
    } catch( e) {
      throw new ApiError(e.message, e.response.status);
    } 
  }
}

module.exports = { CredentialsClient };
