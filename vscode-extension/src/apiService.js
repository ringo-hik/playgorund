const axios = require('axios');
const https = require('https');

class ApiService {
    constructor() {
        this.baseURL = 'http://localhost:3004';
        this.timeout = 30000;
        
        // Create axios instance with custom configuration
        this.httpClient = axios.create({
            baseURL: this.baseURL,
            timeout: this.timeout,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'SWDP-ChatOps-Extension/1.0.0'
            }
        });

        // Add request interceptor for logging
        this.httpClient.interceptors.request.use(
            (config) => {
                console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
                if (config.data) {
                    console.log('Request Data:', config.data);
                }
                return config;
            },
            (error) => {
                console.error('Request Error:', error);
                return Promise.reject(error);
            }
        );

        // Add response interceptor for logging
        this.httpClient.interceptors.response.use(
            (response) => {
                console.log(`API Response: ${response.status} ${response.statusText}`);
                return response;
            },
            (error) => {
                console.error('Response Error:', error.message);
                if (error.response) {
                    console.error('Error Status:', error.response.status);
                    console.error('Error Data:', error.response.data);
                }
                return Promise.reject(error);
            }
        );
    }

    /**
     * Generate Weekly Report
     * @param {string} personaCode - The persona code (e.g., 'weekly_report')
     * @param {string} userId - User ID extracted from git email
     * @returns {Promise<Object>} API response
     */
    async generateWeeklyReport(personaCode, userId) {
        try {
            console.log(`Generating weekly report for user: ${userId}, persona: ${personaCode}`);
            
            const requestBody = {
                personaCode: personaCode,
                category: 'Extension',
                userId: userId,
                action: 'generate',
                timestamp: new Date().toISOString()
            };

            const response = await this.httpClient.post('/message-async', requestBody);
            
            return {
                success: response.data.success || true,
                data: response.data.data || response.data,
                sessionId: response.data.sessionId,
                message: response.data.message || 'Weekly report generated successfully'
            };

        } catch (error) {
            return this.handleError('generateWeeklyReport', error);
        }
    }

    /**
     * Provide Feedback on existing report
     * @param {string} personaCode - The persona code (e.g., 'weekly_report')
     * @param {string} userId - User ID extracted from git email
     * @param {string} feedback - User feedback text
     * @param {string} currentReport - Current report content to be modified
     * @returns {Promise<Object>} API response
     */
    async provideFeedback(personaCode, userId, feedback, currentReport) {
        try {
            console.log(`Providing feedback for user: ${userId}, persona: ${personaCode}`);
            
            const requestBody = {
                personaCode: personaCode,
                category: 'Extension',
                userId: userId,
                action: 'feedback',
                userQuery: feedback,
                currentContent: currentReport,
                timestamp: new Date().toISOString()
            };

            const response = await this.httpClient.post('/message-async', requestBody);
            
            return {
                success: response.data.success || true,
                data: response.data.data || response.data,
                sessionId: response.data.sessionId,
                message: response.data.message || 'Feedback processed successfully'
            };

        } catch (error) {
            return this.handleError('provideFeedback', error);
        }
    }

    /**
     * Health Check
     * @returns {Promise<Object>} API response
     */
    async healthCheck() {
        try {
            const response = await this.httpClient.get('/health');
            
            return {
                success: response.data.success || true,
                data: response.data.data,
                message: response.data.message || 'Health check successful'
            };

        } catch (error) {
            return this.handleError('healthCheck', error);
        }
    }

    /**
     * Get Available Personas (for future extension)
     * @returns {Promise<Object>} API response
     */
    async getPersonas() {
        try {
            const response = await this.httpClient.get('/personas');
            
            // Filter only Extension category personas
            let personas = response.data.data || [];
            if (Array.isArray(personas)) {
                personas = personas.filter(persona => persona.category === 'Extension');
            }

            return {
                success: response.data.success || true,
                data: personas,
                message: response.data.message || 'Personas loaded successfully'
            };

        } catch (error) {
            return this.handleError('getPersonas', error);
        }
    }

    /**
     * Send General Feedback
     * @param {Object} feedbackData - Feedback data
     * @returns {Promise<Object>} API response
     */
    async sendFeedback(feedbackData) {
        try {
            const response = await this.httpClient.post('/feedback', feedbackData);
            
            return {
                success: response.data.success || true,
                data: response.data.data,
                message: response.data.message || 'Feedback sent successfully'
            };

        } catch (error) {
            return this.handleError('sendFeedback', error);
        }
    }

    /**
     * Handle API errors consistently
     * @param {string} operation - Operation name for logging
     * @param {Error} error - Error object
     * @returns {Object} Standardized error response
     */
    handleError(operation, error) {
        console.error(`API Error in ${operation}:`, error);

        let errorMessage = 'Unknown error occurred';
        let errorDetails = {};

        if (error.response) {
            // Server responded with error status
            const status = error.response.status;
            errorMessage = this.getStatusMessage(status);
            errorDetails = {
                status: status,
                statusText: error.response.statusText,
                data: error.response.data
            };
        } else if (error.request) {
            // Request was made but no response received
            errorMessage = 'Network error - no response from server';
            errorDetails = {
                code: error.code,
                message: error.message
            };
        } else {
            // Something else happened
            errorMessage = error.message || 'Request configuration error';
            errorDetails = {
                message: error.message
            };
        }

        return {
            success: false,
            errorMessage: errorMessage,
            errorDetails: errorDetails,
            operation: operation
        };
    }

    /**
     * Get user-friendly status messages
     * @param {number} status - HTTP status code
     * @returns {string} User-friendly message
     */
    getStatusMessage(status) {
        const statusMessages = {
            400: 'Invalid request format',
            401: 'Authentication required',
            403: 'Access denied',
            404: 'Service not found',
            408: 'Request timeout',
            429: 'Too many requests',
            500: 'Internal server error',
            502: 'Gateway error',
            503: 'Service unavailable',
            504: 'Gateway timeout'
        };

        return statusMessages[status] || `HTTP error ${status}`;
    }

    /**
     * Test connection to the API
     * @returns {Promise<boolean>} True if connection is successful
     */
    async testConnection() {
        try {
            const response = await this.healthCheck();
            return response.success;
        } catch (error) {
            console.error('Connection test failed:', error);
            return false;
        }
    }

    /**
     * Get current configuration
     * @returns {Object} Current configuration
     */
    getConfig() {
        return {
            baseURL: this.baseURL,
            timeout: this.timeout
        };
    }

    /**
     * Update configuration
     * @param {Object} config - New configuration
     */
    updateConfig(config) {
        if (config.baseURL) {
            this.baseURL = config.baseURL;
            this.httpClient.defaults.baseURL = config.baseURL;
        }
        
        if (config.timeout) {
            this.timeout = config.timeout;
            this.httpClient.defaults.timeout = config.timeout;
        }

        console.log('API configuration updated:', this.getConfig());
    }
}

module.exports = {
    ApiService
};