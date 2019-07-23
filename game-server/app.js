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

  app.configure('production|development', 'auth', function() {
    app.loadConfig('mysql_adb', app.getBase() + '/config/mysql/adb.json');
    let dbClient = bearcat.getBean('mysqlPool').init(app.get('mysql_adb'));
    app.set('dbClient_adb', dbClient);
  })
}

var contextPath = require.resolve('./context.json');
bearcat.createApp([contextPath],{
  BEARCAT_LOGGER: "off", //这边应设置为 off，否则 由于 bear 还没加载完，会生成 undefined 名字的 log，并且所有日志会写入到这个 undefined 文件里
  BEARCAT_HOT: "on",// 开启热更新，如果是off 那么不会热更新
  BEARCAT_FUNCTION_STRING: true
});

bearcat.start(function() {
  Configure(); // pomelo configure in app.js
  app.set('bearcat', bearcat);

  // start app
  app.start();
})


process.on('uncaughtException', function (err) {
  console.error(' Caught exception: ' + err.stack);
});
