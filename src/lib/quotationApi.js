let apiUrl = process.env.VUE_APP_API_URL;


class QuotationApi {

    getListByCurrentBusiness()
    {
        var url = apiUrl + 'quotations/currentBusiness/';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });

    }

    getListByCurrentTenant(){
        var url = apiUrl + 'quotations/currentUser/';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getList() {
        var url = apiUrl + 'quotations';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }


    get(id) {
        var url = apiUrl + 'quotations/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });
    }
    create(data) {
        var url = apiUrl + 'quotations';
        return api.call('post', url, data)
            .then(({ data }) => {
                return data
            });

    }
    update(data) {
        var url = apiUrl + 'quotations/';
        return api.call('put', url + data.id, data)
            .then(({ data }) => {
                return data
            });
    }
    delete(id) {
        var url = apiUrl + 'quotations/';
        return api.call('delete', url + id)
            .then(({ data }) => {
                return data
            });
    }

}

export default QuotationApi;