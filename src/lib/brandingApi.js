
class BrandingApi {

    getListByActive(){
        var url = apiUrl + 'branding/active/';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getListByCurrentBusiness(){
        var url = apiUrl + 'branding/currentBusiness/';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    // getListByCurrentTenant(){
    //     var url = apiUrl + 'branding/currentUser/';
    //     return api.call('get', url)
    //         .then(({ data }) => {
    //             return data
    //         });
    // }

    getList() {
        var url = apiUrl + 'branding';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }


    getByCurrentUser()
    {
        var url = apiUrl + 'branding/currentUser/';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });

    }

    getByDomain(fullDomain) {
        var url = apiUrl + 'branding/domain/';
        return api.call('get', url + fullDomain)
            .then(({ data }) => {
                return data
            });
    }

    get(id) {
        var url = apiUrl + 'branding/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });
    }
    create(data) {
        var url = apiUrl + 'branding';
        return api.call('post', url, data)
            .then(({ data }) => {
                return data
            });

    }
    update(data) {
        var url = apiUrl + 'branding/';
        return api.call('put', url + data.id, data)
            .then(({ data }) => {
                return data
            });
    }
    delete(id) {
        var url = apiUrl + 'branding/';
        return api.call('delete', url + id)
            .then(({ data }) => {
                return data
            });
    }

}

export default BrandingApi;