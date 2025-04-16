// src/confer/client/shared/types.js
/**
 * @typedef {Object} Message
 * @property {string} id - Unique identifier for the message
 * @property {string} content - Content of the message
 * @property {'text' | 'image'} type - Type of the message
 * @property {string} timestamp - ISO timestamp of when the message was created
 */

/**
 * @typedef {Object} AdminSession
 * @property {string} adminId - Unique identifier for the admin
 * @property {number} lastActivity - Timestamp of last activity
 */

/**
 * @typedef {Object} ConnectionStatus
 * @property {'connecting' | 'connected' | 'disconnected' | 'timeout_warning'} status - Current connection status
 * @property {string} [error] - Optional error message
 * @property {boolean} [timeoutWarning] - Whether a timeout warning is active
 * @property {number} [timeoutAt] - When the session will timeout
 */

// Export empty object since we're just using this file for JSDoc definitions
export default {};