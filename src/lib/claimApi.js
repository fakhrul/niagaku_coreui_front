let apiUrl = process.env.VUE_APP_API_URL;


class ClaimApi {


    getListByCurrentUser() {
        var url = apiUrl + 'claims/currentUser/';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getList() {
        var url = apiUrl + 'claims';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }
    
    getClaimState() {
        var url = apiUrl + 'claims/states';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }
    get(id) {
        var url = apiUrl + 'claims/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });
    }
    create(data) {
        var url = apiUrl + 'claims';
        return api.call('post', url, data)
            .then(({ data }) => {
                return data
            });

    }
    update(data) {
        var url = apiUrl + 'claims/';
        return api.call('put', url + data.id, data)
            .then(({ data }) => {
                return data
            });
    }


    delete(id) {
        var url = apiUrl + 'claims/';
        return api.call('delete', url + id)
            .then(({ data }) => {
                return data
            });
    }

}

export default ClaimApi;