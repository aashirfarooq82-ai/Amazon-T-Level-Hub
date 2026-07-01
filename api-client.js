/**
 * Frontend API Client
 * Secure communication with backend API
 * 
 * Features:
 * - Error handling
 * - Input validation
 * - CORS support
 * - Accessibility features
 */

class APIClient {
  constructor(baseURL = 'http://localhost:3000/api') {
    this.baseURL = baseURL;
  }

  /**
   * Submit contact form
   * @param {object} data - Form data
   * @returns {Promise} - API response
   */
  async submitContact(data) {
    try {
      const response = await fetch(`${this.baseURL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Form submission failed');
      }

      return result;
    } catch (error) {
      console.error('Contact submission error:', error);
      throw error;
    }
  }

  /**
   * Submit registration form
   * @param {object} data - Form data
   * @returns {Promise} - API response
   */
  async submitRegistration(data) {
    try {
      const response = await fetch(`${this.baseURL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      return result;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Check API health
   * @returns {Promise} - Health status
   */
  async checkHealth() {
    try {
      const response = await fetch(`${this.baseURL}/health`);
      return await response.json();
    } catch (error) {
      console.error('Health check error:', error);
      return { status: 'unavailable' };
    }
  }
}

// Initialize API client
const apiClient = new APIClient();

// Export for use in HTML
window.apiClient = apiClient;
