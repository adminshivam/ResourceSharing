const express = require('express');

// import routes
const resourceRoutes = require('./src/modules/resourceSharing/resource.routes');
const userRoutes = require('./src/modules/users/users.routes');

// import cron job tasks
require('./src/crons/expiryCronJob');

const app = express();
app.use(express.json());

// enable routes with base path
app.use('/users', userRoutes);
app.use('/resources', resourceRoutes);

const port = 3000 || process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});