// Import the modules.
const UserRepository = require("./users.model");

// Create a new user.
const createUser = async (req, res) => {
    const { name, email } = req.body;

    // Validate the api request parameters
    if (!name || !email) {
        return res.status(400).json({ message: 'Please provide and email for the user' });
    }

    const userRepository = new UserRepository();
    const userDetails = {
        name,
        email,
    }

    try {
        // Create a new user if not already existing.
        const createdUser = await userRepository.createUser(userDetails);
        return res.status(201).json(createdUser);
    } catch (error) {
        console.log(`U-UC-CU-E001 | Error in creating user | Error: %o`, error);
        return res.status(500).json(error);
    }
};

module.exports = { createUser };