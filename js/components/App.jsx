import React from 'react';
import { RouteHandler } from 'react-router';
import MessagesActionCreator from '../actions/MessagesActionCreator';

export default React.createClass({

    componentDidMount() {
        MessagesActionCreator.connect();
    },

    render() {
        return <div>
            <header>
                <h1>Chat!</h1>
            </header>
            <RouteHandler { ...this.props } />
        </div>
    }

});

