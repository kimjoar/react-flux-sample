import React from 'react';

import MessagesActionCreator from '../actions/MessagesActionCreator';

export default React.createClass({

    render() {
        let message = this.props.message;
        let fields = message.get('fields');

        if (message.has('error')) {
            return this.renderFailed();
        }

        return <div className='message'>
            { fields.get('body') }
        </div>
    },

    renderFailed() {
        let message = this.props.message;
        let fields = message.get('fields');

        return <div className='message message-failed'>
            Sending "{ fields.get('body') }" message. <button onClick={ this._onRetry }>Retry</button>
        </div>
    },

    _onRetry() {
        let message = this.props.message;
        let channel = this.props.channel;

        console.log('MESSAGE', 'retry', message);
        MessagesActionCreator.create(channel, message);
    }

});
