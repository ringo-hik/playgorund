const https = require('https');
const http = require('http');
const { URL } = require('url');

class ApiService {
    constructor() {
        this.baseURL = 'http://localhost:443/api/v1/extension';
        this.timeout = 30000;
    }

    async httpRequest(url, options = {}) {
        return new Promise((resolve, reject) => {
            const parsedUrl = new URL(url);
            const isHttps = parsedUrl.protocol === 'https:';
            const client = isHttps ? https : http;
            
            const requestOptions = {
                hostname: parsedUrl.hostname,
                port: parsedUrl.port || (isHttps ? 443 : 80),
                path: parsedUrl.pathname + parsedUrl.search,
                method: options.method || 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'SWDP-ChatOps-Extension/1.0.0',
                    ...options.headers
                },
                timeout: this.timeout
            };

            const req = client.request(requestOptions, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    try {
                        const result = {
                            status: res.statusCode,
                            statusText: res.statusMessage,
                            data: data ? JSON.parse(data) : null
                        };
                        resolve(result);
                    } catch (error) {
                        resolve({
                            status: res.statusCode,
                            statusText: res.statusMessage,
                            data: data
                        });
                    }
                });
            });

            req.on('error', reject);
            req.on('timeout', () => {
                req.destroy();
                reject(new Error('Request timeout'));
            });

            if (options.data) {
                req.write(JSON.stringify(options.data));
            }

            req.end();
        });
    }


    /**
     * Process Weekly Report Request (Generate or Apply Feedback)
     * @param {string} userId - User ID extracted from git email
     * @param {string} [feedback] - User feedback text (optional)
     * @param {string} [currentReport] - Current report content to be modified (optional)
     * @returns {Promise<Object>} API response
     */
    async processWeeklyReport(userId, feedback = null, currentReport = null) {
        try {
            let userQuery;
            
            if (feedback && currentReport) {
                userQuery = `<<DOCUMENT_START>>\n${currentReport}\n<<DOCUMENT_END>>\n\nREVISION_REQUEST: ${feedback}\n\nPlease revise the above document based on the revision request.`;
            } else {
                userQuery = "Generate a comprehensive weekly report based on the data from the last 8 days starting from today.";
            }
            
            const response = await this.httpRequest(`${this.baseURL}/weekly-report`, {
                method: 'POST',
                data: {
                    userId: userId,
                    userQuery: userQuery
                }
            });
            
            const operation = feedback ? 'feedback processing' : 'report generation';
            return {
                success: response.status === 200,
                data: response.data,
                message: `Weekly report ${operation} completed successfully`
            };

        } catch (error) {
            return this.handleError('processWeeklyReport', error);
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

        if (error.status) {
            // Server responded with error status
            errorMessage = this.getStatusMessage(error.status);
            errorDetails = {
                status: error.status,
                statusText: error.statusText,
                data: error.data
            };
        } else if (error.message) {
            // Network error or other error
            errorMessage = error.message;
            errorDetails = {
                message: error.message
            };
        } else {
            // Fallback
            errorMessage = 'Request failed';
            errorDetails = {
                error: error.toString()
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

}

module.exports = {
    ApiService
};