var pomelo = require('pomelo');
var bearcat = require('bearcat');
/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'game');

var Configure = function() {
  // app configuration
  app.configure('production|development', 'connector|gate', function(){
    app.set('connectorConfig',
      {
        connector : pomelo.connectors.hybridconnector,
        heartbeat : 3,
        useDict : true,
        useProtobuf : true
      });
  });

  app.configure('production|development', function() {
    app.loadConfig('mysql', app.getBase() + '/config/mysql/adb.json');
    let dbClient = bearcat.getBean('mysqlPool').init(app.get('mysql'));
    app.set('dbClient', dbClient);
  })
}

var contextPath = require.resolve('./context.json');
bearcat.createApp([contextPath]);

bearcat.start(function() {
  Configure(); // pomelo configure in app.js
  app.set('bearcat', bearcat);

  // start app
  app.start();
})


process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});
