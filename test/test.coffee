require 'coffee-script/register'
CoffeeScript = require 'coffee-script'

chai         = require 'chai'
chaiFiles    = require 'chai-files'

path         = require 'path'
PHPSession         = require path.join(__dirname, '..','phpsession')

chai.use(chaiFiles)
expect  = chai.expect
file    = chaiFiles.file
dir     = chaiFiles.dir

ID = '12345TEST'

sess = new PHPSession()

describe 'PHPSession', ->
    describe '#init', ->
        it "prove that memcached is accessible", (done) ->
            try
                # Connect to 127.0.0.1 port 11211
                sess.connect null,
                    (conn) ->
                        expect(conn).to.be.true
                        done()
            catch err
                done err
        it "prove that memcached is connected", () ->
            expect(sess.isConnected()).to.be.true
    
    describe '#set', ->
        it "should create entry for session #{ID}", (done) ->
            try
                sess.set
                    id: ID
                    data: {name: 'test'}
                    ,(res) ->
                        expect(res).to.be.true
                        done()
            catch err
                done err

    describe '#get', ->
        res = undefined

        it "should retrieve #{ID} entry", (done) ->
            try
                sess.get
                    id: ID
                    , (res) ->
                        expect(res.name).to.be.string
                        expect(res.name).to.have.string('test')
                        done()
            catch err
                donne err
    
    describe '#replace', ->
        it "should replace #{ID} 'name' value", (done) ->
            try
                sess.replace
                    id: ID
                    data: {name: 'Doe'}
                    , (res) ->
                        expect(res).to.be.true
                        done()
            catch err
                donne err

        it "should validate #{ID} modification", (done) ->
            try
                sess.get
                    id: ID
                    , (res) ->
                        expect(res.name).to.be.string
                        expect(res.name).to.have.string('Doe')
                        done()
            catch err
                donne err

    describe '#refresh', ->
        it "should change #{ID} lifetime", (done) ->
            try
                sess.refresh
                    id: ID
                    lifetime: 10
                    , (res) ->
                        expect(res).to.be.true
                        done()
            catch err
                donne err

    describe '#update', ->
        it "should update #{ID} with surname", (done) ->
            try
                sess.update
                    id: ID
                    key: 'surname'
                    value: 'John'
                    lifetime: 50
                    , (res) ->
                        expect(res).to.be.true
                        done()
            catch err
                donne err

        it "should validate #{ID} modification", (done) ->
            try
                sess.get
                    id: ID
                    , (res) ->
                        expect(res.name).to.be.string
                        expect(res.surname).to.be.string
                        expect(res.name).to.have.string('Doe')
                        expect(res.surname).to.have.string('John')
                        done()
            catch err
                donne err

    describe '#delete', ->
        it "should delete #{ID} entry", (done) ->
            try
                sess.delete
                    id: ID
                    , (res) ->
                        expect(res).to.be.true
                        done()
            catch err
                donne err

        it "should validate #{ID} deletion", (done) ->
            try
                sess.get
                    id: ID
                    , (res) ->
                        expect(res).to.be.undefined
                        done()
            catch err
                donne err