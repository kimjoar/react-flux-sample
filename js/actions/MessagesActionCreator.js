import uuid from 'node-uuid';

import ajax from '../lib/ajax';
import Dispatcher from '../dispatcher/Dispatcher';

const actions = {

    fetchAll() {
        console.log('ACTION', 'fetch all messages');

        ajax.get('/messages').then(
            messages => {
                Dispatcher.dispatch({
                    type: 'receive_messages',
                    messages: messages
                });
            });
    },

    save(message) {
        console.log('ACTION', 'saving message:', message);

        message.cid = uuid.v4();

        ajax.post('/message', message).then(
            res => {
                console.log('ACTION', 'save successful:', res);

                Dispatcher.dispatch({
                    type: 'save_message_success',
                    message: res
                });
            },
            err => {
                console.log('ACTION', 'save failed:', err);

                Dispatcher.dispatch({
                    type: 'save_message_failed',
                    error: err,
                    message: message
                });
            });
    }

};

export default actions;

