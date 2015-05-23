import React from 'react';

export default React.createClass({

    render() {
        let failed = this.props.failed;
        let message = failed.message;

        return <div className="failed">
            Sending "{ message.body }" failed. <button onClick={ this._onRetry }>Retry</button>
        </div>
    },

    _onRetry() {
        let failed = this.props.failed;

        console.log('retry', failed);
    }

});
