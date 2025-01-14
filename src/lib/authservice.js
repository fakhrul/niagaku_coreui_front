import axios from 'axios'

class AuthService {
    constructor() {
        this.token = window.localStorage.getItem('token');
        let userData = window.localStorage.getItem('user');
        if (userData !== 'undefined') {
            this.user = userData ? JSON.parse(userData) : null;
            if (this.token !== null) {
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.token;
                axios.defaults.headers.common['api-token'] = this.token;
            }
        }
    }

    getUser() {
        api.call('get', apiUrl + 'Account/get-user')
            .then(({ data }) => {
                this.user = data;
            });
    }
    getDefaultBusinessName() {
        try {
            return this.user.userData.profile.defaultBusiness.name;
        } catch (error) {
            return "Unknown";
        }
    }
    getUserName() {
        // console.log(this.user);
        return this.user.userData.userName;
    }

    doLogin(data) {
        var url = apiUrl + 'Account/login';

        return api.call('post', url, data)
            .then((response) => {
                return response.data
            });

    }
    
    resendVerificationEmail(data) {
        var url = apiUrl + 'Account/resendverification';
        return api.call('post', url, data)
            .then((response) => {
                return response.data
            });

    }

    
    sendForgotPassword(data) {
        var url = apiUrl + 'Account/forgotPassword';
        return api.call('post', url, data)
            .then((response) => {
                return response.data
            });
    }

    
    resetPassword(data) {
        var url = apiUrl + 'Account/resetPassword';
        return api.call('post', url, data)
            .then((response) => {
                return response.data
            });

    }

    register(data) {

        var url = apiUrl + 'Account/register';

        return api.call('post', url, data)
            .then((response) => {
                return response.data
            });

    }

    deleteByTenant(id) {
        var url = apiUrl + 'Account/deleteByTenant/';
        return api.call('delete', url + id)
            .then(({ data }) => {
                return data
            });
    }

    verifyEmail(data) {
        // Convert object to URL parameters using URLSearchParams
        const params = new URLSearchParams(data);
        const queryString = params.toString();

        var url = apiUrl + 'Account/verifyEmail?' + queryString;
        console.log(url);
        return api.call('post', url, data)
            .then((response) => {
                return response.data
            });

    }

    recordLogin(token, user) {
        window.localStorage.setItem('token', token);
        window.localStorage.setItem('user', JSON.stringify(user));

        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
        this.token = token;
        this.user = user;
    }

    isSuperAdmin() {
        return this.user.userData.role == 'super';
    }

    getRole() {
        try {
            if (this.user.userData.role == 'super')
            return "admin";
        return this.user.userData.role;
            
        } catch (error) {
            return "";
        }
    }

    logout() {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.token;
        if (this.token) {
            api.call('post', apiUrl + 'Account/logout')
                .then(({ data }) => {
                    // EventBus.$emit('userLoggedOut');
                })
            // EventBus.$emit('userLoggedOut');
        };
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('user');
        this.token = null;
        this.user = null;

    }

    check() {
        return !!this.token;
    }


}

export default AuthService;