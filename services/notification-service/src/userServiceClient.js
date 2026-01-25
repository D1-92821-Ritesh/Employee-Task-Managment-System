const axios = require('axios');

// Get user-service URL from Eureka
function getUserServiceUrl() {
    try {
        const eurekaClient = require('../index').eurekaClient;
        const instances = eurekaClient.getInstancesByAppId('user-service');
        if (instances && instances.length > 0) {
            const instance = instances[0];
            const host = instance.hostName || instance.ipAddr;
            const port = instance.port['$'] || instance.port;
            return `http://${host}:${port}`;
        }
    } catch {
        // Fallback if Eureka not available
    }
    return process.env.USER_SERVICE_URL || 'http://localhost:8082';
}

async function getUserEmail(userId) {
    try {
        const baseUrl = getUserServiceUrl();
        const response = await axios.get(`${baseUrl}/api/users/${userId}`);
        return response.data.email || null;
    } catch {
        return null;
    }
}

module.exports = { getUserEmail };
