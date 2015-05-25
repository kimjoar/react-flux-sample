import _ from 'lodash';
import React from 'react';

import Alert from './Alert';
import Spinner from './Spinner';
import Message from './Message';
import MessagesStore from '../stores/MessagesStore';
import MessagesActionCreator from '../actions/MessagesActionCreator';

function getStateFromStores(props) {
    return {
        messages: MessagesStore.all(props.channel),
        error: MessagesStore.error(props.channel)
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
            MessagesActionCreator.fetchAll(this.props.channel);
        }
    },

    componentWillUnmount() {
        console.log('MESSAGES', 'unmounting');
        MessagesStore.removeChangeListener(this._onChange);
    },

    componentWillReceiveProps(nextProps) {
        console.log('MESSAGES', 'receiving props:', nextProps);

        this.setState(getStateFromStores(nextProps), function() {
            if (this.state.messages == null) {
                console.log('MESSAGES', "no messages, let's fetch");
                MessagesActionCreator.fetchAll(nextProps.channel);
            }
        });
    },

    componentWillUpdate() {
        let node = React.findDOMNode(this);
        this.shouldScrollBottom = (node.scrollTop + node.offsetHeight) === node.scrollHeight;
    },

    componentDidUpdate() {
        if (this.shouldScrollBottom) {
            let node = React.findDOMNode(this);
            node.scrollTop = node.scrollHeight;
        }
    },

    render() {
        return <div className='chat'>
            { this.content() }
        </div>
    },

    content() {
        let messages = this.state.messages;
        let error = this.state.error;

        if (error != null) {
            return <Alert>
                Fetching messages for channel '{ this.props.channel }' failed.
            </Alert>
        }

        if (messages == null) {
            return <Spinner type='large' />
        }

        console.log('MESSAGES', 'rendering', messages && messages.count());

        if (messages.count() == 0) {
            return <p>Ingen meldinger</p>
        }

        return <ul className='messages'>
            { messages.map(this.renderMessage) }
        </ul>
    },

    renderMessage(message) {
        return <li key={ message.getIn(['fields', 'cid']) }>
            <Message
                message={ message }
                channel={ this.props.channel } />
        </li>
    },

    _onChange() {
        this.setState(getStateFromStores(this.props));
    }

});

