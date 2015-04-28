/****************************************************/
/*         PHPSession - v0.1.4                      */
/*                                                  */
/*         Manage $_SESSION var in node.js          */
/****************************************************/
/*             -    Copyright 2015    -             */
/*                                                  */
/*   License: Apache v 2.0                          */
/*   @Author: Ben Mz                                */
/*   @Email: bmz (at) certiwise (dot) com           */
/*                                                  */
/****************************************************/

(function() {
  var Memcached, PHPSession;

  Memcached = require('memcached');

  module.exports = PHPSession = (function() {
    function PHPSession(_arg) {
      var host, port;
      host = _arg.host, port = _arg.port;
      if (host == null) {
        host = '127.0.0.1';
      }
      if (port == null) {
        port = '11211';
      }
      this.mem = new Memcached("" + host + ":" + port);
    }

    PHPSession.prototype.get = function(_arg) {
      var cb, id, session;
      id = _arg.id, cb = _arg.cb;
      session = '';
      return this.mem.get("sessions/" + id, (function(_this) {
        return function(err, raw) {
          if ((err != null) || (raw == null) || raw.length === 0) {
            return cb();
          } else {
            session = JSON.parse(raw);
            return cb(session);
          }
        };
      })(this));
    };

    PHPSession.prototype.set = function(_arg) {
      var cb, id, json, lifetime;
      id = _arg.id, json = _arg.json, lifetime = _arg.lifetime, cb = _arg.cb;
      if (id == null) {
        cb('ERRMISSPARAM');
        return;
      }
      if (lifetime == null) {
        lifetime = 1440;
      }
      if (cb == null) {
        cb = console.log;
      }
      return this.get({
        id: id,
        cb: (function(_this) {
          return function(session) {
            var content;
            if (session != null) {
              content = JSON.stringify(json);
              return _this.mem.set("sessions/" + id, content, lifetime, function(err) {
                if (err != null) {
                  return cb(err);
                } else {
                  return cb();
                }
              });
            } else {
              return cb('ERRNOSESS');
            }
          };
        })(this)
      });
    };

    PHPSession.prototype.update = function(_arg) {
      var cb, id, key, lifetime, value;
      id = _arg.id, key = _arg.key, value = _arg.value, lifetime = _arg.lifetime, cb = _arg.cb;
      if (!((key != null) && (id != null))) {
        cb('ERRMISSPARAM');
        return;
      }
      if (lifetime == null) {
        lifetime = 1440;
      }
      if (cb == null) {
        cb = console.log;
      }
      return this.get({
        id: id,
        cb: (function(_this) {
          return function(session) {
            var content;
            if (session != null) {
              session[key] = value;
              content = JSON.stringify(session);
              return _this.mem.set("sessions/" + id, content, lifetime, function(err) {
                if (err != null) {
                  return cb(err);
                } else {
                  return cb();
                }
              });
            } else {
              return cb('ERRNOSESS');
            }
          };
        })(this)
      });
    };

    PHPSession.prototype["delete"] = function(_arg) {
      var cb, id;
      id = _arg.id, cb = _arg.cb;
      if (id == null) {
        cb('ERRMISSPARAM');
        return;
      }
      if (cb == null) {
        cb = console.log;
      }
      return this.get({
        id: id,
        cb: (function(_this) {
          return function(session) {
            if (session != null) {
              return _this.mem.del("sessions/" + id, function(err) {
                if (err != null) {
                  return cb(err);
                } else {
                  return cb();
                }
              });
            } else {
              return cb('ERRNOSESS');
            }
          };
        })(this)
      });
    };

    return PHPSession;

  })();

}).call(this);
