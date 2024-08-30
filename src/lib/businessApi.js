class BusinessApi {


    getListByCurrentTenant() {
        var url = apiUrl + 'businesses/currentUser/';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getList() {
        var url = apiUrl + 'businesses';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }


    get(id) {
        var url = apiUrl + 'businesses/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });
    }
    create(data) {
        var url = apiUrl + 'businesses';
        return api.call('post', url, data)
            .then(({ data }) => {
                return data
            });

    }
    update(data) {
        var url = apiUrl + 'businesses/';
        return api.call('put', url + data.id, data)
            .then(({ data }) => {
                return data
            });
    }

    updateDefaultBusiness(data) {
        var url = apiUrl + 'businesses/updateDefaultBusiness/';
        return api.call('put', url + data.id, data)
            .then(({ data }) => {
                return data
            });
    }

    delete(id) {
        var url = apiUrl + 'businesses/';
        return api.call('delete', url + id)
            .then(({ data }) => {
                return data
            });
    }

}

export default BusinessApi;