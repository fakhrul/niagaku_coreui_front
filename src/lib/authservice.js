import axios from 'axios'
let apiUrl = process.env.VUE_APP_API_URL;

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
    getDefaultBusinessName(){
        try {
            return this.user.userData.profile.defaultBusiness.name;
        } catch (error) {
            return "Unknown";
        }
    }
    getUserName(){
        // console.log(this.user);
        return this.user.userData.userName;
    }

    // setDefaultBusinessName(data){
    //     console.log('setDefaultBusinessName');
    //     console.log(data);
    //     this.user.userData.profile.defaultBusiness = data;
    //     this.user.userData.profile.defaultBusinessId = data.Id;
    // }

    doLogin(data) {
        var url = apiUrl + 'Account/login';

        return api.call('post', url, data)
            .then((response) => {
                return response.data
            });

    }

    register(data) {
        var url = apiUrl + 'Account/Register';
        return api.call('post', url, data)
            .then((response) => {
                // console.log(response.data);
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
        if (this.user.userData.role == 'super')
            return "admin";
        return this.user.userData.role;
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