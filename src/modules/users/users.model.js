const db = require('../../config/databases/databases');

class UserRepository {
    /**
     * Creates a new user in the database.
     *
     * @param {Object} userEntityObject - The user entity object containing user details.
     * @param {string} userEntityObject.name - The name of the user.
     * @param {string} userEntityObject.email - The email address of the user.
     * @returns {Promise<Object>} A promise that resolves to an object containing the new user's ID and access token, or rejects with an error object if the operation fails.
     */
    async createUser(userEntityObject) {
        const access_token = Math.random().toString(32).slice(2);
        const { name, email } = userEntityObject;

        const query = `
            INSERT INTO users (name, email, created_at, login_token)
            VALUES (?, ?, ?, ?)
        `;

        return new Promise((resolve, reject) => {
            db.query(query, [name, email, new Date(), access_token], (err, result) => {
                if (err) {
                    // Handle specific error cases like duplicate entry
                    if (err.code === 'ER_DUP_ENTRY') {
                        return reject({ status: false, message: 'Email already exists' });
                    }
                    // General database error
                    return reject({ status: false, message: err.message });
                }

                // Success case
                resolve({ userId: result.insertId, access_token });
            });
        });
    }

    /**
     * Validates a user by their ID and access token.
     *
     * @param {number} userId - The unique identifier of the user.
     * @param {string} accessToken - The access token associated with the user.
     * @returns {Promise} A promise that resolves to an object containing the user's data if valid, or rejects with an error object if invalid.
     * @throws Will throw an error if the database query fails.
     */
    async validateUser(userId, accessToken) {

        const query = `
            Select * FROM users WHERE id = ? AND login_token = ? LIMIT 1;
        `;

        return new Promise((resolve, reject) => {
            db.query(query, [userId, accessToken], (err, result) => {
                if (err) {
                    // General database error
                    return reject({ status: false, message: err.message });
                }

                // Success case
                resolve({ result: result });
            });
        });
    }
}

module.exports = UserRepository;
