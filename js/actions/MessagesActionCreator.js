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

    create(message) {
        console.log('ACTION', 'saving message:', message.fields);

        ajax.post('/message', message.fields).then(
            newFields => {
                console.log('ACTION', 'save successful:', newFields);

                message.fields = newFields;

                // If this message had failed to save earlier
                delete message.error;

                Dispatcher.dispatch({
                    type: 'save_message_success',
                    message: message
                });
            },
            err => {
                console.log('ACTION', 'save failed:', err);

                message.error = err;

                Dispatcher.dispatch({
                    type: 'save_message_failed',
                    message: message
                });
            });
    }

};

export default actions;

