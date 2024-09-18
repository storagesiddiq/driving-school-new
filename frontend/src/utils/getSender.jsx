
export const getSenderName = (loggedUser, users) => {
    if (!users || users.length < 2) return '';
    return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
};

export const getSenderAvatar = (loggedUser, users) => {
    if (!users || users.length < 2) return '';
    return users[0]?._id === loggedUser?._id ? users[1].avatar : users[0].avatar;
};

export const getAllDetails = (loggedUser, users) => {
    if (!users || users.length < 2) return '';
    return users[0]?._id === loggedUser?._id ? users[1] : users[0];
};
