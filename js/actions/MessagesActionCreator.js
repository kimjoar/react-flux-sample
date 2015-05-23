import Immutable from 'immutable';

import ajax from '../lib/ajax';
import Dispatcher from '../dispatcher/Dispatcher';

export default {

    fetchAll() {
        console.log('ACTION', 'fetch all messages');

        ajax.get('/messages').then(
            messages => {
                Dispatcher.dispatch({
                    type: 'receive_messages',
                    messages: Immutable.fromJS(messages)
                });
            });
    },

    create(message) {
        console.log('ACTION', 'saving message:', message.fields);

        ajax.post('/message', message.get('fields').toJS()).then(
            newFields => {
                console.log('ACTION', 'save successful:', newFields);

                Dispatcher.dispatch({
                    type: 'save_message_success',
                    message: message
                        .set('fields', Immutable.fromJS(newFields))
                        .delete('error')
                });
            },
            err => {
                console.log('ACTION', 'save failed:', err);

                Dispatcher.dispatch({
                    type: 'save_message_failed',
                    message: message.set('error', Immutable.fromJS(err))
                });
            });
    }

};

