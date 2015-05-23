const _ = require('lodash');
const uuid = require('node-uuid');
const Dispatcher = require('../dispatcher/Dispatcher');
const EventEmitter = require('events').EventEmitter;

let messages = null;
let failed = [];

// READ API
const MessagesStore = _.assign({}, EventEmitter.prototype, {

    all: function() {
        return messages;
    },

    failed: function() {
        return failed;
    },

    emitChange: function() {
        this.emit('change');
    },

    addChangeListener: function(callback) {
        this.on('change', callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener('change', callback);
    }

});

// WRITE API
Dispatcher.register(function(action) {

    console.log('STORE', 'received action:', action);

    switch(action.type) {

        case 'receive_messages':
            messages = action.messages;
            console.log('STORE', 'messages received:', messages);
            MessagesStore.emitChange();
            break;

        case 'save_message_success':
            messages.push(action.message);
            console.log('STORE', 'message received:', action.message);
            MessagesStore.emitChange();
            break;

        case 'save_message_failed':
            failed.push({
                error: action.error,
                message: action.message
            });
            console.log('STORE', 'error received:', action.error);
            MessagesStore.emitChange();
            break;

        default:
            // noop

    }

});

export default MessagesStore;

