/****************************************************/
/*         PHPSession - v0.1.6                      */
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
    function PHPSession(arg) {
      var host, port;
      host = arg.host, port = arg.port;
      if (host == null) {
        host = '127.0.0.1';
      }
      if (port == null) {
        port = '11211';
      }
      this.mem = new Memcached(host + ":" + port);
    }

    PHPSession.prototype.get = function(arg) {
      var cb, id, session;
      id = arg.id, cb = arg.cb;
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

    PHPSession.prototype.set = function(arg) {
      var cb, id, json, lifetime;
      id = arg.id, json = arg.json, lifetime = arg.lifetime, cb = arg.cb;
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

    PHPSession.prototype.replace = function(arg) {
      var cb, id, json, lifetime;
      id = arg.id, json = arg.json, lifetime = arg.lifetime, cb = arg.cb;
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
              return _this.mem.replace("sessions/" + id, content, lifetime, function(err) {
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

    PHPSession.prototype.refresh = function(arg) {
      var cb, id, lifetime;
      id = arg.id, lifetime = arg.lifetime, cb = arg.cb;
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
              content = JSON.stringify(session);
              return _this.mem.replace("sessions/" + id, content, lifetime, function(err) {
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

    PHPSession.prototype.update = function(arg) {
      var cb, id, key, lifetime, value;
      id = arg.id, key = arg.key, value = arg.value, lifetime = arg.lifetime, cb = arg.cb;
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
              return _this.mem.replace("sessions/" + id, content, lifetime, function(err) {
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

    PHPSession.prototype["delete"] = function(arg) {
      var cb, id;
      id = arg.id, cb = arg.cb;
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
