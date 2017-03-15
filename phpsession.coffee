# Copyright [2015] 
# @Email: x62en (at) users (dot) noreply (dot) github (dot) com
# @Author: Ben Mz

# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at

#     http://www.apache.org/licenses/LICENSE-2.0

# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

Memcached = require 'memcached'

module.exports = class PHPSession
    connected = false
    constructor: () ->
        try
            @mem = new Memcached()
        catch err
            throw err

    connect: ({host, port}={}, cb) ->
        unless host
            host = '127.0.0.1'
        unless port
            port = '11211'

        @mem.connect "#{host}:#{port}", (err, conn) =>
            if err
                throw err
            @connected = true
            cb true
        

    isConnected: -> @connected

    get: ({id}={}, cb) ->
        unless id
            throw 'No id set'

        @mem.get "sessions/#{id}", (err, raw) ->
            if err
                throw err
            if typeof cb is "function"
                try
                    cb JSON.parse(raw)
                catch e
                    cb raw

    set: ({id, data, lifetime}={}, cb) ->
        unless id
            throw 'No id set'
        unless lifetime
            lifetime = 1440
        unless data
            data = {}

        content = JSON.stringify data
        @mem.set "sessions/#{id}", content, lifetime, (err) ->
            if err
                throw err
            if typeof cb is "function"
                cb true
                
    replace: ({id, data, lifetime}={}, cb) ->
        unless id
            throw 'No id set'
        unless lifetime
            lifetime = 1440
        unless data
            data = {}

        content = JSON.stringify data
        @mem.replace "sessions/#{id}", content, lifetime, (err) ->
            if err
                throw err
            if typeof cb is "function"
                cb true
                
    refresh: ({id, lifetime}={}, cb) ->
        unless id
            throw 'No id set'
        unless lifetime
            lifetime = 1440

        @get
            id: id
            ,(session) =>
                unless session
                    throw 'No session found'

                content = JSON.stringify session
                @mem.replace "sessions/#{id}", content, lifetime, (err) ->
                    if err
                        throw err
                    if typeof cb is "function"
                        cb true
                
    update: ({id, key, value, lifetime}={}, cb) ->
        unless id
            throw 'No id set'
        unless key
            throw 'No key set'
        unless lifetime
            lifetime = 1440

        @get
            id: id
            , (session) =>
                unless session
                    throw 'No session found'

                session[key] = value
                content = JSON.stringify session
                @mem.replace "sessions/#{id}", content, lifetime, (err) ->
                    if err
                        throw err
                    if typeof cb is "function"
                        cb true
                
    delete: ({id}={}, cb) ->
        unless id
            throw 'No id set'

        @mem.del "sessions/#{id}", (err) ->
            if err
                throw err
            if typeof cb is "function"
                cb true