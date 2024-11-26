const db = require('../config/databases/databases');

setInterval(() => {
  console.log('CRON: Checking for expired resources...');
  const query = `
    UPDATE resources
    SET is_expired = true
    WHERE expiration_time <= NOW() AND is_expired = false
  `;
  db.query(query, (err) => {
    if (err) console.error('Error updating expired resources:', err.message);
  });
}, 60000); // Run every 1 minute
