import React from 'react';
import { RouteHandler } from 'react-router';

export default React.createClass({

    render() {
        return <div>
            <h1>Chat!</h1>
            <RouteHandler { ...this.props } />
        </div>
    }

});

