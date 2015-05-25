import Immutable from 'immutable';
import io from 'socket.io-client';

import ajax from '../lib/ajax';
import Dispatcher from '../dispatcher/Dispatcher';
import createMessage from '../lib/createMessage';

export default {

    create(channel, message) {
        console.log('ACTION', 'saving message:', message.get('fields').toJS());

        ajax.post('/message/' + channel, message.get('fields').toJS()).then(
            res => {
                console.log('ACTION', 'save successful:', res);

                let fields = Immutable.fromJS(res);
                message = message.set('fields', fields);

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
                Dispatcher.dispatch({
                    type: 'receive_messages',
                    channel: channel,
                    messages: Immutable.fromJS(messages)
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

