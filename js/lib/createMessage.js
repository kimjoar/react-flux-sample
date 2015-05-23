import uuid from 'node-uuid';
import Immutable from 'immutable';

export default function(fields) {
    return Immutable.fromJS({
        // We give every message it's unique client id on the frontend
        cid: uuid.v4(),
        fields: fields
    });
}

