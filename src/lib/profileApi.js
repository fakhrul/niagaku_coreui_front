
class ProfileApi {


    getListByBusinessId(id)
    {
        var url = apiUrl + 'profiles/business/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });
    }

    getListByCurrentBusiness(isIncludeAdmin) {
        const include = isIncludeAdmin === true ? 'true' : 'false';
        const url = apiUrl + 'profiles/currentBusiness?isIncludeAdmin=' + include;
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    
    createProfileEmployee(data) {
        var url = apiUrl + 'profiles/employee';
        return api.call('post', url, data)
            .then(({ data }) => {
                return data
            });

    }

    createProfileAppUser(data) {
        var url = apiUrl + 'profiles/ProfileAppUser';
        return api.call('post', url, data)
            .then(({ data }) => {
                return data
            });

    }
    updateProfileAppUser(data) {
        var url = apiUrl + 'profiles/ProfileAppUser/';
        return api.call('put', url + data.profile.id, data)
            .then(({ data }) => {
                return data
            });
    }

    getProfileListByOperator() {
        var url = apiUrl + 'profiles/ByOperator';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getProfileList() {
        var url = apiUrl + 'profiles';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getProfileListByCurrentLeaderProfile() {
        var url = apiUrl + 'profiles/byCurrentLeaderProfile';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getListByCurrentTenant() {
        var url = apiUrl + 'profiles/currentTennant/';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }


    getCurrentProfile() {
        var url = apiUrl + 'profiles/byCurrentProfile';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getProfile(id) {
        var url = apiUrl + 'profiles/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });
    }

    createProfile(data) {
        var url = apiUrl + 'profiles';
        return api.call('post', url, data)
            .then(({ data }) => {
                return data
            });

    }
    updateProfile(data) {
        var url = apiUrl + 'profiles/';
        return api.call('put', url + data.id, data)
            .then(({ data }) => {
                return data
            });
    }
    deleteProfile(id) {
        var url = apiUrl + 'profiles/';
        return api.call('delete', url + id)
            .then(({ data }) => {
                return data
            });
    }

}

export default ProfileApi;