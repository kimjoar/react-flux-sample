import _ from 'lodash';
import React from 'react';

import Messages from './Messages';
import MessageInput from './MessageInput';

export default React.createClass({

    render() {
        return <div>
            <ul className="channels">
                <li className="channel">general</li>
                <li className="channel">random</li>
            </ul>
            <Messages { ...this.props } />
            <MessageInput />
        </div>
    }

});

