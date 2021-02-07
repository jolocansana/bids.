const users = [];
const User = require('../models/UserModel');

async function userJoin(id, user_id, listingId, isGuest) {

    if(!isGuest) {
        let user = await User.findOne({ _id: user_id }).sort('_id firstname lastname');
        users.push({ id: id, user, room: listingId });
    } else {
        users.push({ id: id, user: { _id: id }, room: listingId });
    }

    return users;
}

function getCurrentUser(_id) {
    return users.find(user => user.id === _id);
}

function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if(index !== -1) {
        return users.splice(index, 1)[0];
    }
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave
}