/****************************************************/
/*         PHPSession - v0.2.0                      */
/*                                                  */
/*         Manage $_SESSION var in node.js          */
/****************************************************/
/*             -    Copyright 2017    -             */
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
    var connected;

    connected = false;

    function PHPSession() {
      var err, error;
      try {
        this.mem = new Memcached();
      } catch (error) {
        err = error;
        throw err;
      }
    }

    PHPSession.prototype.connect = function(arg, cb) {
      var host, port, ref;
      ref = arg != null ? arg : {}, host = ref.host, port = ref.port;
      if (!host) {
        host = '127.0.0.1';
      }
      if (!port) {
        port = '11211';
      }
      return this.mem.connect(host + ":" + port, (function(_this) {
        return function(err, conn) {
          if (err) {
            throw err;
          }
          _this.connected = true;
          return cb(true);
        };
      })(this));
    };

    PHPSession.prototype.isConnected = function() {
      return this.connected;
    };

    PHPSession.prototype.get = function(arg, cb) {
      var id;
      id = (arg != null ? arg : {}).id;
      if (!id) {
        throw 'No id set';
      }
      return this.mem.get("sessions/" + id, function(err, raw) {
        var e, error;
        if (err) {
          throw err;
        }
        if (typeof cb === "function") {
          try {
            return cb(JSON.parse(raw));
          } catch (error) {
            e = error;
            return cb(raw);
          }
        }
      });
    };

    PHPSession.prototype.set = function(arg, cb) {
      var content, data, id, lifetime, ref;
      ref = arg != null ? arg : {}, id = ref.id, data = ref.data, lifetime = ref.lifetime;
      if (!id) {
        throw 'No id set';
      }
      if (!lifetime) {
        lifetime = 1440;
      }
      if (!data) {
        data = {};
      }
      content = JSON.stringify(data);
      return this.mem.set("sessions/" + id, content, lifetime, function(err) {
        if (err) {
          throw err;
        }
        if (typeof cb === "function") {
          return cb(true);
        }
      });
    };

    PHPSession.prototype.replace = function(arg, cb) {
      var content, data, id, lifetime, ref;
      ref = arg != null ? arg : {}, id = ref.id, data = ref.data, lifetime = ref.lifetime;
      if (!id) {
        throw 'No id set';
      }
      if (!lifetime) {
        lifetime = 1440;
      }
      if (!data) {
        data = {};
      }
      content = JSON.stringify(data);
      return this.mem.replace("sessions/" + id, content, lifetime, function(err) {
        if (err) {
          throw err;
        }
        if (typeof cb === "function") {
          return cb(true);
        }
      });
    };

    PHPSession.prototype.refresh = function(arg, cb) {
      var id, lifetime, ref;
      ref = arg != null ? arg : {}, id = ref.id, lifetime = ref.lifetime;
      if (!id) {
        throw 'No id set';
      }
      if (!lifetime) {
        lifetime = 1440;
      }
      return this.get({
        id: id
      }, (function(_this) {
        return function(session) {
          var content;
          if (!session) {
            throw 'No session found';
          }
          content = JSON.stringify(session);
          return _this.mem.replace("sessions/" + id, content, lifetime, function(err) {
            if (err) {
              throw err;
            }
            if (typeof cb === "function") {
              return cb(true);
            }
          });
        };
      })(this));
    };

    PHPSession.prototype.update = function(arg, cb) {
      var id, key, lifetime, ref, value;
      ref = arg != null ? arg : {}, id = ref.id, key = ref.key, value = ref.value, lifetime = ref.lifetime;
      if (!id) {
        throw 'No id set';
      }
      if (!key) {
        throw 'No key set';
      }
      if (!lifetime) {
        lifetime = 1440;
      }
      return this.get({
        id: id
      }, (function(_this) {
        return function(session) {
          var content;
          if (!session) {
            throw 'No session found';
          }
          session[key] = value;
          content = JSON.stringify(session);
          return _this.mem.replace("sessions/" + id, content, lifetime, function(err) {
            if (err) {
              throw err;
            }
            if (typeof cb === "function") {
              return cb(true);
            }
          });
        };
      })(this));
    };

    PHPSession.prototype["delete"] = function(arg, cb) {
      var id;
      id = (arg != null ? arg : {}).id;
      if (!id) {
        throw 'No id set';
      }
      return this.mem.del("sessions/" + id, function(err) {
        if (err) {
          throw err;
        }
        if (typeof cb === "function") {
          return cb(true);
        }
      });
    };

    return PHPSession;

  })();

}).call(this);
