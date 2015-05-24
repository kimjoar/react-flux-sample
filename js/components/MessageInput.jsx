import React from 'react';

import createMessage from '../lib/createMessage';
import MessagesActionCreator from '../actions/MessagesActionCreator';
import ActiveChannelMixin from '../lib/ActiveChannelMixin';

const KEY_CODE_ENTER = 13;

export default React.createClass({

    mixins: [ActiveChannelMixin],

    getInitialState() {
        return {
            body: ''
        }
    },

    componentDidMount() {
        this.focus();
    },

    componentDidUpdate(prevProps, prevState) {
        // If the channel was activated, try to focus the input field
        if (prevState.isChannelActive === false && this.state.isChannelActive === true) {
            this.focus();
        }
        // If we change channels, focus the input field
        else if (prevProps.channel !== this.props.channel) {
            this.focus();
        }
    },

    render() {
        // We don't allow the user to write before a channel
        // is active, i.e. before we have received data from
        // the server.
        let isChannelActive = this.state.isChannelActive;

        return <div className='chat-input'>
            <input
                ref='chatInput'
                type='text'
                value={ this.state.body }
                disabled={ !isChannelActive }
                onChange={ this._onChange }
                onKeyUp={ this._save }
                />
        </div>
    },

    _onChange(e) {
        let body = e.target.value;
        this.setState({ body: body });
    },

    _save(e) {
        let keyCode = e.keyCode;
        let body = this.state.body;
        let channel = this.props.channel;

        if (keyCode == KEY_CODE_ENTER && body.trim() != '') {
            let message = createMessage({ body: body });
            console.log('INPUT', 'enter pressed, saving:', message.toJS());
            MessagesActionCreator.create(channel, message);
            this.setState(this.getInitialState());
        }
    },

    focus() {
        React.findDOMNode(this.refs.chatInput).focus();
    }

});

