import _ from 'lodash';
import uuid from 'node-uuid';
import Immutable from 'immutable';
import EventEmitter from 'events';

import createMessage from '../lib/createMessage';
import Dispatcher from '../dispatcher/Dispatcher';

const cidPath = ['fields', 'cid'];

let messages = Immutable.Map();
let errors = Immutable.Map();

// READ API
const MessagesStore = _.assign({}, EventEmitter.prototype, {

    // Return all messages on a channel
    all(channel) {
        return messages.get(channel);
    },

    // Return all errors on a channel
    error(channel) {
        return errors.get(channel);
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
            removeErrorFromChannel(action.channel);
            updateMessages(action.channel, action.messages);
            MessagesStore.emitChange();
            break;

        case 'receive_messages_failed':
            setErrorOnChannel(action.channel, action.error);
            MessagesStore.emitChange();
            break;

        case 'receive_message':
            addOrUpdateMessage(action.channel, action.message);
            MessagesStore.emitChange();
            break;

        case 'save_message_success':
            addOrUpdateMessage(action.channel, action.message.delete('error'));
            MessagesStore.emitChange();
            break;

        case 'save_message_failed':
            addOrUpdateMessage(action.channel, action.message.set('error', action.error));
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
    messages = messages.set(channel, newMessages.map(createMessage));
}

// Add or update a message on a channel
function addOrUpdateMessage(channel, message) {
    if (!messages.has(channel)) {
        messages = messages.set(channel, Immutable.List());
    }

    let newMessages = messages.get(channel)
        // Exclude the message we're adding if its already in the list
        .filterNot(m => m.getIn(cidPath) == message.getIn(cidPath))
        // We then add our message
        .push(message);

    messages = messages.set(channel, newMessages);
}

function setErrorOnChannel(channel, error) {
    console.log('STORE', 'setting error on channel', channel);
    errors = errors.set(channel, error);
}

function removeErrorFromChannel(channel) {
    console.log('STORE', 'removing error on channel', channel);
    errors = errors.delete(channel);
}

