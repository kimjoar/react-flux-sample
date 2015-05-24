import _ from 'lodash';
import uuid from 'node-uuid';
import Immutable from 'immutable';
import EventEmitter from 'events';

import Dispatcher from '../dispatcher/Dispatcher';
import MessagesStore from './MessagesStore';

let isActive = {};

// READ API
const ChannelStore = _.assign({}, EventEmitter.prototype, {

    isActive: function(channel) {
        return isActive[channel] || false;
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
ChannelStore.dispatchToken = Dispatcher.register(function(action) {

    switch(action.type) {

        case 'receive_messages':
            // waitFor means that MessagesStore should process
            // this event before it's processed here.
            Dispatcher.waitFor([MessagesStore.dispatchToken]);

            isActive[action.channel] = true;
            ChannelStore.emitChange();
            break;

        case 'receive_messages_failed':
            Dispatcher.waitFor([MessagesStore.dispatchToken]);

            isActive[action.channel] = false;
            ChannelStore.emitChange();
            break;

        default:
            // noop

    }

});

export default ChannelStore;

