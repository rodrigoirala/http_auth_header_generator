
const config = require('config');
const clientsIps = config.get( 'whiteListClients').map( ( client )=>{
  return client.ip;
});
/**
 * Middleware para controlar que la ip de origen se encuentre dentro de las admitidas
 * @param ctx
 * @param next
 */
 module.exports = async (ctx, next) => {

  if (!clientsIps.includes( ctx.socket.remoteAddress )){
    ctx.status = 403
    ctx.body = { Error: "Invalid IP source request " + ctx.socket.remoteAddress};
    return;
  }

  await next()
}
