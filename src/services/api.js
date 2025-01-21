import { logger } from "../utils/logger";

const API_URL = "http://127.0.0.1:8000/api";
let authToken = null;

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    logger.error(`API Error: ${response.status} ${response.statusText}`, error);
    throw new Error(error.message || "Something went wrong");
  }
  return response.json();
};

const getHeaders = () => {
  const token = localStorage.getItem('token');
  logger.debug('Current auth token:', token);
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  setAuthToken: (token) => {
    authToken = token;
    localStorage.setItem('token', token);
    logger.debug('Auth token set:', token);
  },

  clearAuthToken: () => {
    authToken = null;
    localStorage.removeItem('token');
    logger.debug("Auth token cleared");
  },

  get: async (endpoint) => {
    try {
      logger.debug(`GET request to ${endpoint}`);
      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: getHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      logger.error("API GET Error:", error);
      throw error;
    }
  },

  post: async (endpoint, data) => {
    try {
      logger.debug(`POST request to ${endpoint}`);
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    } catch (error) {
      logger.error("API POST Error:", error);
      throw error;
    }
  },

  put: async (endpoint, data) => {
    try {
      logger.debug(`PUT request to ${endpoint}`);
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(response);
    } catch (error) {
      logger.error("API PUT Error:", error);
      throw error;
    }
  },

  delete: async (endpoint) => {
    try {
      logger.debug(`DELETE request to ${endpoint}`);
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      return handleResponse(response);
    } catch (error) {
      logger.error("API DELETE Error:", error);
      throw error;
    }
  },
};

export const authApi = {
  register: async (userData) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 422) {
          const error = new Error("Validation failed");
          error.response = {
            status: 422,
            data: data,
          };
          throw error;
        }
        throw new Error(data.message || "Registration failed");
      }

      if (data.success) {
        return {
          user: data.data.user,
          token: data.data.authorization.token,
        };
      } else {
        throw new Error(data.message || "Registration failed");
      }
    } catch (error) {
      logger.error("Registration error:", error);
      throw error;
    }
  },

  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 422 || response.status === 401) {
          const error = new Error("Authentication failed");
          error.response = {
            status: response.status,
            data: data,
          };
          throw error;
        }
        throw new Error(data.message || "Login failed");
      }

      if (data.success) {
        return {
          user: data.data.user,
          token: data.data.authorization.token,
        };
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (error) {
      logger.error("Login error:", error);
      throw error;
    }
  },

  logout: async () => {
    try {
      // Try to make the logout request
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: getHeaders(),
      });

      // Clear token regardless of response
      api.clearAuthToken();

      // If the request was successful, return true
      if (response.ok) {
        return true;
      }

      // If we got a 401, it means the token was already invalid/expired
      // We still want to clear the local state in this case
      if (response.status === 401) {
        logger.debug("Token was invalid/expired during logout");
        return true;
      }

      // For other errors, throw
      throw new Error("Logout failed");
    } catch (error) {
      logger.error("Logout error:", error);
      // Still clear the token even if the request failed
      api.clearAuthToken();
      throw error;
    }
  },
};

export const goalApi = {
  createGoal: async (goalData) => {
    try {
      logger.debug('Creating new goal:', goalData);
      const response = await fetch(`${API_URL}/goals`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(goalData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 422) {
          const error = new Error('Validation failed');
          error.response = {
            status: 422,
            data: data,
          };
          throw error;
        }
        throw new Error(data.message || 'Goal creation failed');
      }

      return data;
    } catch (error) {
      logger.error('Goal creation error:', error);
      throw error;
    }
  },
  
  getGoal: async (goalId) => {
    return api.get(`/goals/${goalId}`);
  },

  getGoals: async () => {
    try {
      await delay(1000);
      const response = await fetch(`${API_URL}/goals/all`, {
        headers: getHeaders()
      });
      const data = await response.json();
      return data;
    } catch (error) {
      logger.error("Error fetching goals:", error);
      throw error;
    }
  },

  updateGoal: async (goalId, goalData) => {
    try {
      logger.debug(`Updating goal ${goalId}`, goalData);
      const response = await fetch(`${API_URL}/goals/${goalId}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(goalData),
      });
      return handleResponse(response);
    } catch (error) {
      logger.error(`Error updating goal ${goalId}:`, error);
      throw error;
    }
  },

  deleteGoal: async (goalId) => {
    try {
      logger.debug(`Deleting goal ${goalId}`);
      const response = await fetch(`${API_URL}/goals/${goalId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to delete goal');
      }

      return { success: true };
    } catch (error) {
      logger.error(`Error deleting goal ${goalId}:`, error);
      throw error;
    }
  },
};

export const milestoneApi = {
  // Get all milestones for a goal
  getMilestones: async (goalId) => {
    try {
      logger.debug(`Getting milestones for goal ${goalId}`);
      return api.get(`/goals/${goalId}/milestones`);
    } catch (error) {
      logger.error("Error getting milestones:", error);
      throw error;
    }
  },

  // Create a new milestone
  createMilestone: async (goalId, milestoneData) => {
    try {
      logger.debug(`Creating milestone for goal ${goalId}`, milestoneData);
      return api.post(`/goals/${goalId}/milestones`, milestoneData);
    } catch (error) {
      logger.error("Error creating milestone:", error);
      throw error;
    }
  },

  // Update a milestone
  updateMilestone: async (goalId, milestoneId, milestoneData) => {
    try {
      logger.debug(`Updating milestone ${milestoneId} for goal ${goalId}`, milestoneData);
      return api.put(`/goals/${goalId}/milestones/${milestoneId}`, milestoneData);
    } catch (error) {
      logger.error("Error updating milestone:", error);
      throw error;
    }
  },

  // Delete a milestone
  deleteMilestone: async (goalId, milestoneId) => {
    try {
      logger.debug(`Deleting milestone ${milestoneId} from goal ${goalId}`);
      return api.delete(`/goals/${goalId}/milestones/${milestoneId}`);
    } catch (error) {
      logger.error("Error deleting milestone:", error);
      throw error;
    }
  }
};

export const taskApi = {
  // Get all tasks for a milestone
  getTasks: async (milestoneId) => {
    try {
      logger.debug(`Getting tasks for milestone ${milestoneId}`);
      return api.get(`/milestones/${milestoneId}/tasks`);
    } catch (error) {
      logger.error("Error getting tasks:", error);
      throw error;
    }
  },

  // Create a new task
  createTask: async (milestoneId, taskData) => {
    try {
      logger.debug(`Creating task for milestone ${milestoneId}`, taskData);
      return api.post(`/milestones/${milestoneId}/tasks`, taskData);
    } catch (error) {
      logger.error("Error creating task:", error);
      throw error;
    }
  },

  // Update a task
  updateTask: async (milestoneId, taskId, taskData) => {
    try {
      logger.debug(`Updating task ${taskId} for milestone ${milestoneId}`, taskData);
      return api.put(`/milestones/${milestoneId}/tasks/${taskId}`, taskData);
    } catch (error) {
      logger.error("Error updating task:", error);
      throw error;
    }
  },

  // Delete a task
  deleteTask: async (milestoneId, taskId) => {
    try {
      logger.debug(`Deleting task ${taskId} from milestone ${milestoneId}`);
      return api.delete(`/milestones/${milestoneId}/tasks/${taskId}`);
    } catch (error) {
      logger.error("Error deleting task:", error);
      throw error;
    }
  }
};
