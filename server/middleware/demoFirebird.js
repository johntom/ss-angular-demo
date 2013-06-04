// server/middleware/demoMiddleware.js
var fs = require('fs'),

    fb = require('node-firebird')  ; // jrt

// jrt

exports.dataconnect = function () {

    return function (req, res, next) {
        var CFG = LoadConfig();
        console.log(CFG);
        CFG.connections = CFG.connections || [];
        console.log('Middle---------CFG.host,CFG.port, CFG.database,CFG.user,CFG.password,CFG.pagesize,CFG.role---------');
        console.log(CFG.host, CFG.port, CFG.database, CFG.user, CFG.password, CFG.pagesize, CFG.role);
        console.log('------------------');


        function LoadConfig() {
            var cfg = {};
            try {
                fs.statSync(__dirname + '/cfg/cfg.json');
                var sCfg = fs.readFileSync(__dirname + '/cfg/cfg.json', 'utf8');
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
                    console.log("Im in the middleware \n\r db connected " );         //,database
                }
            }
        );


        test1 = function () {
            // qrystr = 'select ID,"Description" from "Codes" where id <10';
            qrystr = 'select ID from "Staff" where id <10';
            console.log('Midd qrystr.query result "Staff"  ', qrystr);
            database.execute(qrystr, function (err, results, fields) {
                    console.log('Midd database.query result "Staff"  ', results);
                },
                logerror);

        };

        req.dataconnect = database;

        return next();




    };
};

exports.foobarfb = function () {

    /**
     * This is a middleware function that
     * can be applied to both websockets and http
     * requests.  This middleware is being applied
     * to both 'server/routes/demoRoute.js' and 'server/rpc/demoRpc.js'
     * @param  {Object}   req  request object
     * @param  {Object}   res  response object
     * @param  {Function} next next middleware function in chain
     * @return {Void}        nothing
     */
    return function (req, res, next) {

        // tack a 'foo' property on req object just to show how this works
//        if (req) {
//            req.foobar = 'Hi, from foo.bar middleware';
//        }
        var CFG = LoadConfig();
        console.log(CFG);
        CFG.connections = CFG.connections || [];
        console.log('Middle---------CFG.host,CFG.port, CFG.database,CFG.user,CFG.password,CFG.pagesize,CFG.role---------');
        console.log(CFG.host, CFG.port, CFG.database, CFG.user, CFG.password, CFG.pagesize, CFG.role);
        console.log('------------------');


        function LoadConfig() {
            var cfg = {};
            try {
                fs.statSync(__dirname + '/cfg/cfg.json');
                var sCfg = fs.readFileSync(__dirname + '/cfg/cfg.json', 'utf8');
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
                    console.log("middleware \n\r db connected " );         //,database
                }
            }
        );


        test1 = function () {
            // qrystr = 'select ID,"Description" from "Codes" where id <10';
            qrystr = 'select ID from "Staff" where id <10';
            console.log('Midd qrystr.query result "Staff"  ', qrystr);
            database.execute(qrystr, function (err, results, fields) {
                    console.log('Midd database.query result "Staff"  ', results);
                },
                logerror);

        };

        req.foobarfb = results;
        // must call next on success, or next(err) if you want to bail
        return next();




    };
};