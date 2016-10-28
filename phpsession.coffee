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
	constructor: ({host, port}) ->
		unless host?
			host = '127.0.0.1'
		unless port?
			port = '11211'

		@mem = new Memcached("#{host}:#{port}")

	get: ({id, cb}) ->
		session = ''
		@mem.get "sessions/#{id}", (err, raw) =>
			if err? or not raw? or raw.length is 0
				cb()
			else
				session = JSON.parse(raw)
				cb session

	set: ({id, json, lifetime, cb}) ->
		unless id?
			cb 'ERRMISSPARAM'
			return

		unless lifetime?
			lifetime = 1440

		unless cb?
			cb = console.log

		@get
			id: id
			cb: (session) =>
				if session?
					content = JSON.stringify json
					@mem.set "sessions/#{id}", content, lifetime, (err) =>
						if err?
							cb err
						else
							cb()
				else
					cb 'ERRNOSESS'

	replace: ({id, json, lifetime, cb}) ->
		unless id?
			cb 'ERRMISSPARAM'
			return

		unless lifetime?
			lifetime = 1440

		unless cb?
			cb = console.log

		@get
			id: id
			cb: (session) =>
				if session?
					content = JSON.stringify json
					@mem.replace "sessions/#{id}", content, lifetime, (err) =>
						if err?
							cb err
						else
							cb()
				else
					cb 'ERRNOSESS'

	refresh: ({id, lifetime, cb}) ->
		unless id?
			cb 'ERRMISSPARAM'
			return

		unless lifetime?
			lifetime = 1440

		unless cb?
			cb = console.log

		@get
			id: id
			cb: (session) =>
				if session?
					content = JSON.stringify session
					@mem.replace "sessions/#{id}", content, lifetime, (err) =>
						if err?
							cb err
						else
							cb()
				else
					cb 'ERRNOSESS'

	update: ({id, key, value, lifetime, cb}) ->
		unless key? and id?
			cb 'ERRMISSPARAM'
			return

		unless lifetime?
			lifetime = 1440

		unless cb?
			cb = console.log

		@get
			id: id
			cb: (session) =>
				if session?
					session[key] = value
					content = JSON.stringify session
					@mem.replace "sessions/#{id}", content, lifetime, (err) =>
						if err?
							cb err
						else
							cb()
				else
					cb 'ERRNOSESS'

	delete: ({id, cb}) ->
		unless id?
			cb 'ERRMISSPARAM'
			return

		unless cb?
			cb = console.log

		@get
			id: id
			cb: (session) =>
				if session?
					@mem.del "sessions/#{id}", (err) =>
						if err?
							cb err
						else
							cb()
				else
					cb 'ERRNOSESS'
