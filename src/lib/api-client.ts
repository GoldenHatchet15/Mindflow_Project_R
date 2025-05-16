// API client using fetch instead of axios

// Generate a user ID 
const getUserId = (): string => {
  const USER_ID_KEY = 'mindflow_user_id';
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    // Create a more stable ID format
    userId = 'user_' + Date.now().toString(36);
    localStorage.setItem(USER_ID_KEY, userId);
    console.log('Created new user ID:', userId);
  }
  return userId;
};

// API base URL - use the backend service name from docker-compose
const API_URL = 'http://localhost:5000';

// API client
const api = {
  get: async (url: string): Promise<{ data: any }> => {
    try {
      console.log(`API GET request to ${API_URL}${url}`);
      const response = await fetch(`${API_URL}${url}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': getUserId()
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`API GET response:`, data);
      return { data };
    } catch (error) {
      console.error('API GET error:', error);
      // Fall back to returning empty array for get requests
      return { data: [] };
    }
  },

  post: async (url: string, body: any): Promise<{ data: any }> => {
    try {
      console.log(`API POST request to ${API_URL}${url}`, body);
      const response = await fetch(`${API_URL}${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': getUserId()
        },
        body: JSON.stringify(body)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`API POST response:`, data);
      return { data };
    } catch (error) {
      console.error('API POST error:', error);
      return { data: body };
    }
  },

  put: async (url: string, body: any): Promise<{ data: any }> => {
    try {
      console.log(`API PUT request to ${API_URL}${url}`, body);
      const response = await fetch(`${API_URL}${url}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': getUserId()
        },
        body: JSON.stringify(body)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`API PUT response:`, data);
      return { data };
    } catch (error) {
      console.error('API PUT error:', error);
      return { data: body };
    }
  },

  delete: async (url: string): Promise<{ data: any }> => {
    try {
      console.log(`API DELETE request to ${API_URL}${url}`);
      const response = await fetch(`${API_URL}${url}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': getUserId()
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`API DELETE response:`, data);
      return { data };
    } catch (error) {
      console.error('API DELETE error:', error);
      return { data: { msg: 'Deleted' } };
    }
  }
};

export default api;
export { getUserId };