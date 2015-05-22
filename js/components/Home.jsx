import React from 'react';

export default React.createClass({

    getInitialState() {
        return {
            name: 'World'
        }
    },

    changeValue(e) {
        let name = e.target.value;
        console.log('name', name);
        this.setState({ name: name });
    },

    render() {
        return <div>
            <h2>Hello { this.state.name }</h2>
            <input onChange={ this.changeValue } value={ this.state.name } />
        </div>
    }

});

