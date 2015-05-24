import cx from 'classnames';
import React from 'react';
import { Link } from 'react-router';

export default React.createClass({

    getInitialState() {
        return {
            channels: ['general', 'random']
        }
    },

    render() {
        return <ul className="channels">
            { this.state.channels.map(this.channel) }
        </ul>
    },

    channel(channel) {
        var classes = {
            'channel': true,
            'channel-active': this.props.active === channel
        };

        return <li className={ cx(classes) }>
            <Link to='channel' params={{ channel: channel }}>
                { channel }
            </Link>
        </li>
    }

});

