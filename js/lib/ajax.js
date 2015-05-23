var $ = require('jquery');
var _ = require('lodash');

var ajax = {

    get: function(url) {
        return request(url, {
            type: "GET",
            dataType: "json"
        });
    },

    post: function(url, data) {
        var obj = {
            type: "POST",
            dataType: "json"
        };

        if (data) {
            _.assign(obj, {
                contentType: "application/json",
                data: JSON.stringify(data)
            });
        }

        return request(url, obj);
    },

    put: function(url, data) {
        var obj = {
            type: "PUT",
            dataType: "json"
        };

        if (data) {
            _.assign(obj, {
                contentType: "application/json",
                data: JSON.stringify(data)
            });
        }

        return request(url, obj);
    },

    del: function(url) {
        return request(url, {
            type: "DELETE"
        });
    }

};

export default ajax;

function request(url, obj) {
    return new Promise(function(resolve, reject) {
        $.ajax(url, obj).then(
            function(data) {
                resolve(data);
            },
            function(jqXHR) {
                reject(extractErrors(jqXHR));
            }
        );
    });
}

// We will either receive an object with keys "type" and "message", or
// an array with objects with keys "type" and "text", and an optional
// "key" value. We normalize errors to an array.
function extractErrors(jqXHR) {
    var json = jqXHR.responseJSON;
    if (json) {
        if (_.isArray(json)) {
            return _.map(json, createError)
        }

        if (_.isPlainObject(json)) {
            return [createError(json)];
        }

        throw new Error("Unhandled error message: {}", jqXHR.responseText);
    }

    return [createError({ text: "An error occured", status: jqXHR.status })];
}

function createError(item) {
    return {
        status: item.status,
        type: 'error',
        text: item.message
    };
}

