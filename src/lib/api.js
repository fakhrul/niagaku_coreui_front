import axios from 'axios';

class Api {
  constructor() {
    this.setToken();
  }

  setToken() {
    const token = window.localStorage.getItem('token');
    const userData = window.localStorage.getItem('user');

    if (token && userData && userData !== 'undefined') {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      axios.defaults.headers.common['api-token'] = token;
    } else {
      delete axios.defaults.headers.common['Authorization'];
      delete axios.defaults.headers.common['api-token'];
    }
  }

  async call(method, url, data = null) {
    try {
      const response = await axios({
        method,
        url,
        data,
        headers: data instanceof FormData ? {} : { 'Content-Type': 'application/json' }

        // headers: {
        //   'Content-Type': 'application/json',
        // },
      });
      return response;
    } catch (error) {
        console.error('API call error:', error);
      // If unauthorized (token expired, etc)
      if (error.response?.status === 401) {
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('user');
      }

      // Re-throw proper error object for .catch usage in Vue
      if (error.response) {
        throw {
            status: error.response.data.status,
            data: error.response.data.title || error.response.data,
          };
  
        // throw error.response;
      } else if (error.request) {
        throw {
          status: 0,
          data: 'No response received from server',
        };
      } else {
        throw {
          status: 0,
          data: error.message || 'Unexpected error occurred',
        };
      }
    }
  }
}

export default Api;
