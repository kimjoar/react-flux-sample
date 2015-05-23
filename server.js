var _ = require('lodash');
var http = require('http');
var uuid = require('node-uuid');
var express = require('express');
var bodyParser = require('body-parser');
var history = require('connect-history-api-fallback');

var app = express();
app.use(bodyParser.json());
app.use(history());
app.use(express.static('dist'));
app.use(express.static('public'));

app.use(function(err, req, res, next) {
    require('util').inspect(err);
    res.status(500).send({ error: err.message });
});

var messages = [{
    id: "123",
    body: "Kim Joar tester"
}];

app.get('/messages', function(req, res) {
    res.json(messages);
});

app.post('/message', function(req, res) {
    var message = req.body;
    message.id = uuid.v4();
    messages.push(message);

    res.json(message);
});

app.route('/message/:id')
    .put(function(req, res) {
        var id = req.params.id;
        var newMessage = req.body;

        var message = _.where(messages, { id: id });
        _.assign(message, newMessage);

        res.json(messages[id]);
    })
    .delete(function(req, res) {
        var id = req.params.id;
        delete messages[id];

        res.status(204).end();
    });

http.createServer(app)
    .listen(9999, function() {
        console.log('Running on port 9999');
    });

