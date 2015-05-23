import _ from 'lodash';
import React from 'react';

import Messages from './Messages';
import MessageInput from './MessageInput';

export default React.createClass({

    render() {
        return <div>
            <Messages { ...this.props } />
            <MessageInput />
        </div>
    }

});

