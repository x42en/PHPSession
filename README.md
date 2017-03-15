# PHPSession

[![NPM](https://nodei.co/npm/phpsession.png?compact=true)](https://nodei.co/npm/phpsession/)

[![Downloads per month](https://img.shields.io/npm/dm/phpsession.svg?maxAge=2592000)](https://www.npmjs.org/package/phpsession)
[![npm version](https://img.shields.io/npm/v/phpsession.svg)](https://www.npmjs.org/package/phpsession)
[![Build Status](https://travis-ci.org/x42en/phpsession.svg?branch=master)](https://travis-ci.org/x42en/phpsession)
[![Dependencies](https://david-dm.org/x42en/phpsession.svg)](https://www.npmjs.org/package/phpsession)

Simple module to manipulate PHP session vars ($_SESSION) stored in JSON, using *memcached*  
>CAREFUL: this is NEW version of memcache !

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
    sess = new PHPSESSION()
  ```


## Method usage:

### Connect to server:
  ```coffeescript
    sess.connect
      host: 127.0.0.1  # Default value
      port: 11211      # Default value
  ```

### Check server is connected
  ```coffeescript
    if sess.isConnected()
      console.log 'All right !!'
  ```

### Retrieve $_SESSION value:
  ```coffeescript
    sess.get
      id: '9eir0ul21knvmlhu0a4kleh8j1'
      ,(data) -> console.log data
  ```

### Define a $_SESSION var:
  ```coffeescript
    sess.set
      id: '9eir0ul21knvmlhu0a4kleh8j1'
      data: { 'hello': 'world' }
      lifetime: 1440
  ```

### Replace a $_SESSION var:
  ```coffeescript
    sess.replace
      id: '9eir0ul21knvmlhu0a4kleh8j1'
      data: { 'hello': 'world' }
      lifetime: 1440
  ```

### Refresh a $_SESSION:
  ```coffeescript
    sess.refresh
      id: '9eir0ul21knvmlhu0a4kleh8j1'
      lifetime: 1440
  ```

### Update specific $_SESSION key:
  ```coffeescript
    sess.update
      id: '9eir0ul21knvmlhu0a4kleh8j1'
      key: 'hello'
      value: 'better world'
      lifetime: 1440
  ```

### Delete $_SESSION id:
  ```coffeescript
    sess.delete
      id: '9eir0ul21knvmlhu0a4kleh8j1'
  ```


## Extended usage

All methods supports callback parameters:
  ```coffeescript
    sess.set
      id: '9eir0ul21knvmlhu0a4kleh8j1'
      data: { 'hello': 'better world' }
      , (res) ->
        console.log "Received: #{res}"
        # Do something with result...
  ```

## Run tests

You can run unit-tests using mocha with:
  ```sh
    npm test
  ```