const db = require('../../config/databases/databases');

class ResourceRepository {
    async createResource(resourceEntityObject) {
        const resourceAccessToken = Math.random().toString(32).slice(2);
        const { userId, resourceUrl, expirationTime } = resourceEntityObject;

        const query = `
        INSERT INTO resources (user_id, resource_url, expiration_time, access_token)
        VALUES (?, ?, ?, ?)
        `;

        return new Promise((resolve, reject) => {

            db.query(query, [userId, resourceUrl, new Date(expirationTime), resourceAccessToken], (err, result) => {
                if (err) {
                    // Handle specific error cases like duplicate entry
                    if (err.code === 'ER_DUP_ENTRY') {
                        return reject({ status: false, message: 'Email already exists' });
                    }
                    // General database error
                    return reject({ status: false, message: err.message });
                }

                // Success case
                resolve({ resourceId: result.insertId, resourceAccessToken });
            });
        });
    }


    async getResources(userId, status) {

        let query = 'SELECT * FROM resources WHERE user_id = ?';
        const params = [userId];

        if (status === 'active') {
            query += ' AND is_expired = 0';
        } else if (status === 'expired') {
            query += ' AND is_expired = 1';
        }

        return new Promise((resolve, reject) => {

            db.query(query, params, (err, results) => {
                if (err) {
                    // Handle specific error cases like duplicate entry
                    if (err.code === 'ER_DUP_ENTRY') {
                        return reject({ status: false, message: 'Email already exists' });
                    }
                    // General database error
                    return reject({ status: false, message: err.message });
                }

                // Success case
                resolve({ resources: results });
            });
        });
    }

    async getResource(id, accessToken) {

        const query = 'SELECT * FROM resources WHERE id = ? AND access_token = ? LIMIT 1';

        return new Promise((resolve, reject) => {

            db.query(query, [id, accessToken], (err, results) => {
                if (err) {
                    // Handle specific error cases like duplicate entry
                    if (err.code === 'ER_DUP_ENTRY') {
                        return reject({ status: false, message: 'Email already exists' });
                    }
                    // General database error
                    return reject({ status: false, message: err.message });
                }

                // Success case
                resolve({ resources: results });
            });
        });
    }

    async deleteResource(resourceId, userId) {

        const query = 'DELETE FROM resources WHERE id = ? AND user_id = ?';

        return new Promise((resolve, reject) => {

            db.query(query, [resourceId, userId], (err, result) => {
                if (err) {
                    // Handle specific error cases like duplicate entry
                    if (err.code === 'ER_DUP_ENTRY') {
                        return reject({ status: false, message: 'Email already exists' });
                    }
                    // General database error
                    return reject({ status: false, message: err.message });
                }
                console.log(result);
                
                if(result.affectedRows === 0) return resolve({ message: `Resource not found`});
                
                // Success case
                resolve({ message: `Deleted resource ${resourceId} successfully` });
            });
        });
    }
}

module.exports = ResourceRepository;