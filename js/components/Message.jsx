import React from 'react';

import MessagesActionCreator from '../actions/MessagesActionCreator';

export default React.createClass({

    render() {
        let message = this.props.message;
        let fields = message.fields;

        if (message.error) {
            return this.renderFailed();
        }

        return <div>{ fields.body }</div>
    },

    renderFailed() {
        let message = this.props.message;
        let fields = message.fields;

        return <div className="failed">
            Sending "{ fields.body }" message. <button onClick={ this._onRetry }>Retry</button>
        </div>
    },

    _onRetry() {
        let message = this.props.message;

        console.log('retry', message);

        MessagesActionCreator.create(message);
    }

});
