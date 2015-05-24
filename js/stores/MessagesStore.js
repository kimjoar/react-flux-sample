import _ from 'lodash';
import uuid from 'node-uuid';
import Immutable from 'immutable';
import EventEmitter from 'events';

import createMessage from '../lib/createMessage';
import Dispatcher from '../dispatcher/Dispatcher';

const cidPath = ['fields', 'cid'];

let messages = {};
let errors = {};

// READ API
const MessagesStore = _.assign({}, EventEmitter.prototype, {

    all(channel) {
        return messages[channel];
    },

    error(channel) {
        return errors[channel];
    },

    emitChange() {
        this.emit('change');
    },

    addChangeListener(callback) {
        this.on('change', callback);
    },

    removeChangeListener(callback) {
        this.removeListener('change', callback);
    },

});

// WRITE API
MessagesStore.dispatchToken = Dispatcher.register(action => {

    console.log('STORE', 'received action:', action);

    switch(action.type) {

        case 'receive_messages':
            delete errors[action.channel];
            updateMessages(action.channel, action.messages);
            MessagesStore.emitChange();
            break;

        case 'receive_messages_failed':
            errors[action.channel] = action.error;
            MessagesStore.emitChange();
            break;

        case 'receive_message':
            addOrUpdate(action.channel, action.message);
            MessagesStore.emitChange();
            break;

        case 'save_message_success':
            addOrUpdate(action.channel, action.message.delete('error'));
            MessagesStore.emitChange();
            break;

        case 'save_message_failed':
            addOrUpdate(action.channel, action.message.set('error', action.error));
            MessagesStore.emitChange();
            break;

        default:
            // noop

    }

});

export default MessagesStore;

// Reset all messages on a channel
function updateMessages(channel, newMessages) {
    console.log('STORE', 'messages received:', channel, newMessages.toJS());
    messages[channel] = newMessages.map(createMessage);
}

// Add or update a message on a channel
function addOrUpdate(channel, message) {
    if (!messages.hasOwnProperty(channel)) {
        messages[channel] = Immutable.List();
    }

    messages[channel] = messages[channel]
        // Exclude the message we're adding if its already in the list
        .filterNot(m => m.getIn(cidPath) == message.getIn(cidPath))
        // We then add our message
        .push(message);
}

