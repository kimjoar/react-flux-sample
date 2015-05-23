import _ from 'lodash';
import uuid from 'node-uuid';
import EventEmitter from 'events';

import createMessage from '../lib/createMessage';
import Dispatcher from '../dispatcher/Dispatcher';

let messages = null;

// READ API
const MessagesStore = _.assign({}, EventEmitter.prototype, {

    all: function() {
        return messages;
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
            messages = action.messages.map(createMessage);
            console.log('STORE', 'messages received:', messages);
            MessagesStore.emitChange();
            break;

        case 'save_message_success':
            addMessage(action.message);
            MessagesStore.emitChange();
            break;

        case 'save_message_failed':
            addMessage(action.message);
            MessagesStore.emitChange();
            break;

        default:
            // noop

    }

});

export default MessagesStore;

function addMessage(message) {
    // We create a copy of existing messages, but exclude the one
    // we want to add if its already in the list
    let newMessages = _.reject(messages, m => m.cid == message.cid);
    // We then add our message
    newMessages.push(message);
    // ... and update the messages
    messages = newMessages;
}

