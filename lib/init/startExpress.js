const http = require('http');

module.exports = function (callback) {

  const app = this.app;
  const server = http.createServer(app);

  /**
  * Start Http server.
  */
  server.listen(app.get('port'));

  server.on('listening', function() {
    console.log('%s App is running at http://localhost:%d in %s mode', '✓', app.get('port'), app.get('env')); 
    console.log('  Press CTRL-C to stop\n');
  });

  /*
  * Handle error
  */
  server.on('error', function(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
      console.error(`Port ${app.get('port')} requires elevated privileges`);
      process.exit(1);
      break;
      case 'EADDRINUSE':
      console.error(`Port ${app.get('port')} is already in use`);
      process.exit(1);
      break;
      default:
      throw error;
    }
  });

  return callback();
};
