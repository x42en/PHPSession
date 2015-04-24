# Net_action

[![NPM](https://nodei.co/npm/phpsession.png?compact=true)](https://nodei.co/npm/phpsession/)

Simple module to manipulate PHP session vars ($_SESSION) stored in JSON, using memcached (* careful not memcache! *)

## Install

Install with npm:
  ```sh
    npm install phpsession
  ```
  
## Basic Usage

Require the module:
  ```coffeescript
    PHPSESSION = require 'phpsession'
  ```

Instantiate with URL:
  ```coffeescript
    sess = new PHPSESSION
            host: 127.0.0.1
            port: 11211
  ```


Retrieve $_SESSION value:
  ```coffeescript
    sess.get
      id: '9eir0ul21knvmlhu0a4kleh8j1'
  ```

Replace $_SESSION var:
  ```coffeescript
    sess.set
      id: '9eir0ul21knvmlhu0a4kleh8j1'
      json: { 'hello': 'world' }
      lifetime: 1440
  ```

Update specific $_SESSION key:
  ```coffeescript
    sess.update
      id: '9eir0ul21knvmlhu0a4kleh8j1'
      key: 'hello'
      value: 'better world'
      lifetime: 1440
  ```

Delete $_SESSION id:
  ```coffeescript
    sess.delete
      id: '9eir0ul21knvmlhu0a4kleh8j1'
  ```


## Extended usage

All methods, except get, supports callback parameters:
  ```coffeescript
    sess.set
      ressource: '9eir0ul21knvmlhu0a4kleh8j1'
      json: { 'hello': 'better world' }
      cb: do_something()
  ```