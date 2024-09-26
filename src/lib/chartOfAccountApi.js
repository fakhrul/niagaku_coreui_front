class ChartOfAccountApi {

    getListByCurrentBusiness()
    {
        var url = apiUrl + 'chartAccounts/currentBusiness/';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });

    }

    getList() {
        var url = apiUrl + 'chartAccounts';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    suggestChartOfAccount(data) {
        var url = apiUrl + 'chartAccounts/suggest-account';
        return api.call('post', url, data)
            .then(({ data }) => {
                return data
            });

    }

    get(id) {
        var url = apiUrl + 'chartAccounts/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });
    }
    getNext(id) {
        var url = apiUrl + 'chartAccounts/nextTo/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });

    }
    
    getPrev(id) {
        var url = apiUrl + 'chartAccounts/prevTo/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });

    }

    create(data) {
        var url = apiUrl + 'chartAccounts';
        return api.call('post', url, data)
            .then(({ data }) => {
                return data
            });

    }
    update(data) {
        var url = apiUrl + 'chartAccounts/';
        return api.call('put', url + data.id, data)
            .then(({ data }) => {
                return data
            });
    }
    delete(id) {
        var url = apiUrl + 'chartAccounts/';
        return api.call('delete', url + id)
            .then(({ data }) => {
                return data
            });
    }

}

export default ChartOfAccountApi;