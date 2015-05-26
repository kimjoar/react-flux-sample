import io from 'socket.io-client';

import ajax from '../lib/ajax';
import Dispatcher from '../dispatcher/Dispatcher';
import createMessage from '../lib/createMessage';

export default {

    // Save a message in a channel
    create(channel, message) {
        // We extract the fields on the message and transform it into a regular
        // JavaScript object instead of an Immutable Map.
        let fields = message.get('fields').toJS();

        console.log('ACTION', 'saving message:', fields);

        ajax.post('/message/' + channel, fields).then(
            newFields => {
                console.log('ACTION', 'save successful:', newFields.toJS());

                message = message.set('fields', newFields);

                Dispatcher.dispatch({
                    type: 'save_message_success',
                    channel: channel,
                    message: message
                });
            },
            err => {
                console.log('ACTION', 'save failed:', err);

                Dispatcher.dispatch({
                    type: 'save_message_failed',
                    error: err,
                    channel: channel,
                    message: message
                });
            });
    },

    fetchAll(channel) {
        console.log('ACTION', 'fetch all messages for channel:', channel);

        ajax.get('/messages/' + channel).then(
            messages => {
                messages = messages.map(createMessage);

                Dispatcher.dispatch({
                    type: 'receive_messages',
                    channel: channel,
                    messages: messages
                });
            },
            err => {
                Dispatcher.dispatch({
                    type: 'receive_messages_failed',
                    channel: channel,
                    error: err
                });
            });
    },

    connect() {
        const socket = io();
        socket.on('message', data => {
            console.log('ACTION', 'receive WS', data);
            Dispatcher.dispatch({
                type: 'receive_message',
                channel: data.channel,
                message: createMessage(data.message)
            });
        });
    }

};

