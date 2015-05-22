import React from 'react';
import { RouteHandler } from 'react-router';

export default React.createClass({

    render() {
        return <div>
            <h1>React!</h1>
            <RouteHandler { ...this.props } />
        </div>
    }

});

