import Immutable from 'immutable';

import ajax from '../lib/ajax';
import Dispatcher from '../dispatcher/Dispatcher';

export default {

    fetchAll(channel) {
        console.log('ACTION', 'fetch all messages');

        ajax.get('/messages/' + channel).then(
            messages => {
                Dispatcher.dispatch({
                    type: 'receive_messages',
                    channel: channel,
                    messages: Immutable.fromJS(messages)
                });
            });
    },

    create(channel, message) {
        console.log('ACTION', 'saving message:', message.get('fields').toJS());

        ajax.post('/message/' + channel, message.get('fields').toJS()).then(
            newFields => {
                console.log('ACTION', 'save successful:', newFields);

                Dispatcher.dispatch({
                    type: 'save_message_success',
                    channel: channel,
                    message: message
                        .set('fields', Immutable.fromJS(newFields))
                        .delete('error')
                });
            },
            err => {
                console.log('ACTION', 'save failed:', err);

                Dispatcher.dispatch({
                    type: 'save_message_failed',
                    channel: channel,
                    message: message.set('error', Immutable.fromJS(err))
                });
            });
    }

};

