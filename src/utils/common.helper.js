const getUserDetailsFromHeaders = (headers) => {

    const userId = headers?.['user-id'];
    const accessToken = headers?.['access-token'];

    return { userId, accessToken };
};


module.exports = { getUserDetailsFromHeaders };