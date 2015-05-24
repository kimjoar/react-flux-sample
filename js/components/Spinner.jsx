import cx from 'classnames';
import React from 'react';

export default React.createClass({

    propTypes: {
        spin: React.PropTypes.bool,
        type: React.PropTypes.string
    },

    getDefaultProps() {
        return {
            spin: true,
            type: null
        }
    },

    render() {
        if (!this.props.spin) {
            return null;
        }

        let type = this.props.type;
        let classes = { "u-spinner": true };
        if (type != null) {
            classes["u-spinner--" + type] = true;
        }

        return <div className={ cx(classes) } />
    }

});

