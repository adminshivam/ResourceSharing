const db = require('../../config/databases/databases');

const UserRepository = require('../users/users.model');
const ResourceRepository = require('./resource.model');

const { getUserDetailsFromHeaders } = require('../../utils/common.helper');

class ResourceManager {

    // Create a new resource
    static createResource =async (req, res) => {

        try {
            const { resourceUrl, expirationTime } = req.body;
    
            const { userId, accessToken } = getUserDetailsFromHeaders(req.headers);

            if (!userId || !resourceUrl || !expirationTime || !accessToken) {
                return res.status(400).json({ message: 'Missing required fields.' });
            }
    
            const userRepository = new UserRepository();
    

            const users = await userRepository.validateUser(userId, accessToken);
            
            if(users.result.length <= 0) {
                return res.status(401).json({ message: 'Invalid user or access token.' });
            }
    
            const resource = await new ResourceRepository().createResource({ userId: userId, resourceUrl, expirationTime });
    
            return res.status(200).json(resource);
        } catch (error) {
            console.log(`RS-RC-CR-E001 | Error in creating a new resource | Error: %o`, error);
            return res.status(500).json(error);
        }
        
    };

    // Get all resources
    static getResources = async (req, res) => {
        const { status } = req.query;

        const { userId, accessToken } = getUserDetailsFromHeaders(req.headers);

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required.' });
        }

        try {
            
            new UserRepository().validateUser(userId, accessToken);
    
            const resouceRepository = new ResourceRepository();
    
            const fetchedResources = await resouceRepository.getResources(userId, status);
    
            return res.status(200).json(fetchedResources);
        } catch (error) {
            console.log(`RS-RC-GR-E001 | Error while fetching resources for user ${userId} | Error: %o`, error);
            return res.status(500).json(error);
        }
    };

    // Get a specific resource
    static getResource = async (req, res) => {
        const { id: resourceId } = req.params;

        const { userId, accessToken } = getUserDetailsFromHeaders(req.headers);

        if(!resourceId) {
            return res.status(400).json({ message: 'Resource ID is required.' });
        }

        if (!accessToken) {
            return res.status(400).json({ message: 'Access token is required.' });
        }

        try {
            const resourceRepository = new ResourceRepository();
    
            const activeResource = await resourceRepository.getResource(resourceId, accessToken);
    
            return res.status(200).json(activeResource);
        } catch (error) {
            console.log(`RS-RC-GRS-E001 | Error in fetching resource ${resourceId} | Error: %o`, error);
            return res.status(500).json(error);
        }

    };

    // Delete a resource
    static deleteResource = async (req, res) => {
        const { id: resourceId } = req.params;

        const { userId, accessToken } = getUserDetailsFromHeaders(req.headers);

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required.' });
        }

        try {
            const userRepository = new UserRepository();
    
            const users = await userRepository.validateUser(userId, accessToken);
            
            if(users.result.length <= 0) {
                return res.status(401).json({ message: 'Invalid user or access token.' });
            }
    
            const resourceRepository = new ResourceRepository();
    
            const deletedResource = await resourceRepository.deleteResource(resourceId, userId);
    
            return res.status(200).json({data: deletedResource});
        } catch (error) {
            console.log(`RS-RC-GRS-E001 | Error in fetching resource ${resourceId} | Error: %o`, error);
            return res.status(500).json(error);
        }
    }
}

module.exports = ResourceManager;