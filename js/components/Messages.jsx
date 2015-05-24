import _ from 'lodash';
import React from 'react';

import Spinner from './Spinner';
import Message from './Message';
import MessagesStore from '../stores/MessagesStore';
import MessagesActionCreator from '../actions/MessagesActionCreator';

function getStateFromStores(props) {
    return {
        messages: MessagesStore.all()
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

    componentWillUpdate() {
        let node = this.getDOMNode();
        this.shouldScrollBottom = (node.scrollTop + node.offsetHeight) === node.scrollHeight;
    },

    componentDidUpdate() {
        if (this.shouldScrollBottom) {
            let node = React.findDOMNode(this);
            node.scrollTop = node.scrollHeight;
        }
    },

    render() {
        return <div className="chat">
            { this.content() }
        </div>
    },

    content() {
        let messages = this.state.messages;

        console.log('MESSAGES', 'render:', messages);

        if (messages == null) {
            return <Spinner type="large" />
        }

        if (messages.count() == 0) {
            return <p>Ingen meldinger</p>
        }

        return <ul className="messages">
            { messages.map(this.renderMessage) }
        </ul>
    },

    renderMessage(message) {
        return <li key={ message.get('cid') }>
            <Message message={ message }/>
        </li>
    },

    _onChange() {
        this.setState(getStateFromStores(this.props));
    }

});

