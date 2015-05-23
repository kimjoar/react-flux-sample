import uuid from 'node-uuid';

export default function(fields) {
    return {
        // We give every message it's unique client id on the frontend
        cid: uuid.v4(),
        fields: fields
    }
}

