import _ from 'lodash';
import uuid from 'node-uuid';
import Immutable from 'immutable';
import EventEmitter from 'events';

import createMessage from '../lib/createMessage';
import Dispatcher from '../dispatcher/Dispatcher';

let messages = {};
let failedFetch = {};

// READ API
const MessagesStore = _.assign({}, EventEmitter.prototype, {

    all: function(channel) {
        return messages[channel];
    },

    error: function(channel) {
        return failedFetch[channel];
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
MessagesStore.dispatchToken = Dispatcher.register(function(action) {

    console.log('STORE', 'received action:', action);

    switch(action.type) {

        case 'receive_messages':
            delete failedFetch[action.channel];
            updateMessages(action.channel, action.messages);
            MessagesStore.emitChange();
            break;

        case 'receive_messages_failed':
            failedFetch[action.channel] = action.error;
            MessagesStore.emitChange();
            break;

        case 'save_message_success':
            addMessage(action.channel, action.message);
            MessagesStore.emitChange();
            break;

        case 'save_message_failed':
            addMessage(action.channel, action.message);
            MessagesStore.emitChange();
            break;

        default:
            // noop

    }

});

export default MessagesStore;

function updateMessages(channel, newMessages) {
    console.log('STORE', 'messages received:', channel, newMessages.toJS());
    messages[channel] = newMessages.map(createMessage);
}

function addMessage(channel, message) {
    if (!messages.hasOwnProperty(channel)) {
        messages[channel] = Immutable.List();
    }

    messages[channel] = messages[channel]
        // Exclude the message we're adding if its already in the list
        .filterNot(m => m.get('cid') == message.get('cid'))
        // We then add our message
        .push(message);
}

