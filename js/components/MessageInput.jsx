import _ from 'lodash';
import React from 'react';

import createMessage from '../lib/createMessage';
import MessagesActionCreator from '../actions/MessagesActionCreator';

const KEY_CODE_ENTER = 13;

export default React.createClass({

    getInitialState() {
        return {
            body: ''
        }
    },

    componentDidMount() {
        React.findDOMNode(this.refs.chatInput).focus();
    },

    render() {
        return <div className='chat-input'>
            <input
                ref='chatInput'
                type='text'
                value={ this.state.body }
                onChange={ this._onChange }
                onKeyUp={ this._save }/>
        </div>
    },

    _onChange(e) {
        let body = e.target.value;
        this.setState({ body: body });
    },

    _save(e) {
        let keyCode = e.keyCode;
        let body = this.state.body;

        if (keyCode == KEY_CODE_ENTER && body.trim() != '') {
            let message = createMessage({ body: body });
            console.log('INPUT', 'enter pressed, saving:', message);
            MessagesActionCreator.create(message);
            this.setState(this.getInitialState());
        }
    }

});

