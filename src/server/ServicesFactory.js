class ServiceFactory {

  constructor() {
    this.serviceInstances = {};
  }

  static getInstance( ) {
    if (!this.instance) {
      this.instance = new ServiceFactory();
    }

    return this.instance;
  }

  init( servicesData ){
    
    const serviceNames = Object.keys( servicesData);
    this.serviceInstances = serviceNames.reduce(( pValue, sName) =>{
        const sClass = require( "./services/" + servicesData[sName].authType)
        const serviceInstance = new sClass(servicesData[sName].instanceParams);
        
        return {...pValue, [sName]: serviceInstance};
    }, {});
  }

  getServiceInstance( sName){

    return this.serviceInstances[sName];
  }
}

module.exports = ServiceFactory.getInstance();