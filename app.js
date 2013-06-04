// My SocketStream 0.3 app

var express = require('express'),
  ss = require('socketstream'),
  fs = require('fs'),
  path = require('path'),
  server,
  app = express(),
  RouteDir = 'server/routes',
  files = fs.readdirSync(RouteDir),
  conf = require('./conf'),
  fb = require('node-firebird')  ; // jrt

// code & template formatters
ss.client.formatters.add(require('ss-jade'));
ss.client.formatters.add(require('ss-stylus'));
// user server-side compiled Hogan (Mustache) templates
ss.client.templateEngine.use(require('ss-hogan')); 

// Define a single-page client called 'main'
ss.client.define('main', {
  view: 'app.jade',
  css:  ['libs', 'app.styl'],
  code: ['libs', 'app'],
  tmpl: '*'
});


// jrt
var CFG = LoadConfig();
console.log(CFG);
CFG.connections = CFG.connections || [];
console.log('---------CFG.host,CFG.port, CFG.database,CFG.user,CFG.password,CFG.pagesize,CFG.role---------');
console.log(CFG.host, CFG.port, CFG.database, CFG.user, CFG.password, CFG.pagesize, CFG.role);
console.log('------------------');


function LoadConfig() {
    var cfg = {};
    try {
        fs.statSync(__dirname + '/server/cfg/cfg.json');
        var sCfg = fs.readFileSync(__dirname + '/server/cfg/cfg.json', 'utf8');
        cfg = JSON.parse(sCfg);
        console.log('CFG ', __dirname);
    }
    catch (e) {
        console.log("Error loading config " + e.message)
    }
    return cfg;
}

function logerror(err) {
    console.log(err.message);
}
fb.attachOrCreate(
    {
        host: CFG.host, database: CFG.database, user: CFG.user, password: CFG.password
    },
    function (err, db) {
        if (err) {
            console.log(err.message);
        } else {
            database = db;
            test1();
            console.log("\n\r db connected " );         //,database
        }
    }
);

test1 = function () {
    // we have a good connection if results are displayed!
    qrystr = 'select ID from "Staff" where id <10';
    database.execute(qrystr, function (err, results, fields) {
            console.log('database.query result "Staff"  ', results);
        },
        logerror);

};

// pack / minify if product env
if (ss.env === 'production') {
  ss.client.packAssets();
} else {
  // serve tests in non-production env
  ss.client.define('tests', {
    view: 'tests.jade',
    css: ['tests/mocha.css'],
    code: ['libs', 'app', 'tests'],
    tmpl: '*'
  });

  app.get('/tests', function (req, res) {
    res.serveClient('tests');
  });
}

files.forEach(function (file) {
  var filepath = path.resolve('./', RouteDir, file),
    route = require(filepath);
  console.log('adding ExpressJS routes found in %s', filepath);
    route.init(app, ss);
  // route.init(app, ss, database);
});

// catch-all route
app.get('/*', function (req, res) {
  res.serveClient('main');
});

// start 'er up
server = app.listen(conf.webServer.port, function () {
  console.log('web server listening on port %d in %s mode', conf.webServer.port, ss.env);
});
ss.start(server);



// append socketstream middleware
app.stack = ss.http.middleware.stack.concat(app.stack);

// FIXME: remove this code; just demo of pubsub
setInterval(function () {
  ss.api.publish.all('foo:bar', new Date());
}, 3000);

process.on('uncaughtException', function (err) {
  console.log('ERR (uncaught) ', err);
});
