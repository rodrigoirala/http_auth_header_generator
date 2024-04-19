'use strict';

const start = () => {

  process.env.NODE_ENV = process.env.NODE_ENV || 'development';

  const config = require('config');
  const Koa = require('koa');
  const Router = require('koa-router');
  const http = require('http');

  const app = new Koa();
  const auth = require('./middleware/authorize');
  app.use( auth );

  const sf = require('./ServicesFactory');
  sf.init( config.services ); 

  let router = new Router();
  const serviceNames = Object.keys( config.services);

  for ( const sName of serviceNames ){
    router.get( '/' + sName,  async (ctx, next)=>{
      const serviceInstance = sf.getServiceInstance( sName );
      try {
        const authHeaders = await serviceInstance.getAuthHeaders( ctx );
        ctx.body = {
          authHeaders
        }
      } catch ( e ){
        ctx.status = 500;
        ctx.body = {
          error: "Internal error"
        }
        throw e;
      }
    });
  }

  app.use( router.routes());

  http.createServer(app.callback()).listen(config.port, function () {
    console.log('Listening on port '+ config.port +' in '+ process.env.NODE_ENV +' mode');
  });

  return app;
};

module.exports = start();
