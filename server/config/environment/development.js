'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  // mongo: {
  //   uri: 'mongodb://localhost/coda-dev'
  // },

  seedDB: true,

  redis: {
  	expiration: 86400
  }
};
