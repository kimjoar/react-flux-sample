import 'babel/polyfill';

import React from 'react';
import Router from 'react-router';
import { Route, DefaultRoute } from 'react-router';

import App from './components/App';
import Home from './components/Home';

const routes = <Route path='/' handler={ App }>
    <DefaultRoute handler={ Home } />
    <Route
        name='channel'
        path='channel/:channel'
        handler={ Home } />
</Route>

Router.run(routes, Router.HistoryLocation, (Root, state) => {
    React.render(
        <Root
            params={ state.params }
            query={ state.query } />,
        document.body
    );
});
