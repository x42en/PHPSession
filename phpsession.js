/****************************************************/
/*         PHPSession - v0.1.1                      */
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
      var id;
      id = _arg.id;
      this.mem.get("sessions/" + id, (function(_this) {
        return function(err, raw) {
          var session;
          if ((err != null) || (raw == null) || raw.length === 0) {
            return;
          }
          return session = JSON.parse(raw);
        };
      })(this));
      return session;
    };

    PHPSession.prototype.set = function(_arg) {
      var cb, content, id, json, lifetime, session;
      id = _arg.id, json = _arg.json, lifetime = _arg.lifetime, cb = _arg.cb;
      if (id == null) {
        return;
      }
      if (lifetime == null) {
        lifetime = 1440;
      }
      if (cb == null) {
        cb = console.log;
      }
      session = this.get(id);
      if (session != null) {
        content = JSON.stringify(json);
        return this.mem.set("sessions/" + id, content, lifetime, (function(_this) {
          return function(err) {
            if (err != null) {
              return cb(err);
            } else {
              return cb();
            }
          };
        })(this));
      }
    };

    PHPSession.prototype.update = function(_arg) {
      var cb, content, id, key, lifetime, session, value;
      id = _arg.id, key = _arg.key, value = _arg.value, lifetime = _arg.lifetime, cb = _arg.cb;
      if (!((key != null) && (id != null))) {
        return;
      }
      if (lifetime == null) {
        lifetime = 1440;
      }
      if (cb == null) {
        cb = console.log;
      }
      session = this.get(id);
      if (session != null) {
        session[key] = value;
        content = JSON.stringify(session);
        return this.mem.set("sessions/" + id, content, lifetime, (function(_this) {
          return function(err) {
            if (err != null) {
              return cb(err);
            } else {
              return cb();
            }
          };
        })(this));
      }
    };

    PHPSession.prototype["delete"] = function(_arg) {
      var cb, id, session;
      id = _arg.id, cb = _arg.cb;
      if (id == null) {
        return;
      }
      if (cb == null) {
        cb = console.log;
      }
      session = this.get(id);
      if (session != null) {
        return this.set({
          id: id,
          raw: null,
          lifetime: 0,
          cb: cb
        });
      }
    };

    return PHPSession;

  })();

}).call(this);
