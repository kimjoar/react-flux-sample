import React from 'react';

import Channels from './Channels';
import Messages from './Messages';
import MessageInput from './MessageInput';

export default React.createClass({

    render() {
        let params = this.props.params;
        let channel = params.channel || 'general';

        return <div>
            <Channels active={ params.channel } />
            <Messages />
            <MessageInput />
        </div>
    }

});

