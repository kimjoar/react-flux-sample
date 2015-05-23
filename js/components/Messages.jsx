import _ from 'lodash';
import React from 'react';

import FailedMessage from './FailedMessage';
import MessagesStore from '../stores/MessagesStore';
import MessagesActionCreator from '../actions/MessagesActionCreator';

function getStateFromStores(props) {
    return {
        messages: MessagesStore.all(),
        failed: MessagesStore.failed()
    };
}

export default React.createClass({

    getInitialState() {
        return getStateFromStores(this.props);
    },

    componentDidMount() {
        console.log('MESSAGES', 'mounting, props:', this.props);
        MessagesStore.addChangeListener(this._onChange);

        if (this.state.messages == null) {
            console.log('MESSAGES', "no messages, let's fetch");
            MessagesActionCreator.fetchAll();
        }
    },

    componentWillUnmount() {
        console.log('MESSAGES', 'unmounting');
        MessagesStore.removeChangeListener(this._onChange);
    },

    componentWillReceiveProps(nextProps) {
        console.log('MESSAGES', 'receiving props:', nextProps);
        this.setState(getStateFromStores(nextProps));
    },

    render() {
        var messages = this.state.messages;
        var failed = this.state.failed;

        console.log('MESSAGES', 'render:', messages);

        if (messages == null) {
            return <p>Spinner</p>
        }

        if (messages.length == 0 && failed.length == 0) {
            return <p>Ingen meldinger</p>
        }

        return <ul>
            { messages.map(this.renderMessage) }
            { failed.map(this.renderFailed) }
        </ul>
    },

    renderMessage(message) {
        return <li key={ message.id }>
            { message.body }
        </li>
    },

    renderFailed(failed) {
        return <li key={ failed.message.cid }>
            <FailedMessage failed={ failed } />
        </li>
    },

    _onChange() {
        this.setState(getStateFromStores(this.props));
    }

});

