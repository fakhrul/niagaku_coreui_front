class TransactionApi {
    
    addBatch(data) {
        console.log('addBatch', data)
        var url = apiUrl + 'transactions/addBatch/';
        return api.call('post', url, data)
            .then(({ data }) => {
                return data
            });
    }

    getTransactionMatchTypes() {
        var url = apiUrl + 'transactions/transactionMatchTypes';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getTransactionSourceTypes() {
        var url = apiUrl + 'transactions/transactionSourceTypes';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getTransactionTypes() {
        var url = apiUrl + 'transactions/transactionTypes';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getListByCurrentBusiness(){
        var url = apiUrl + 'transactions/currentBusiness/';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getListByCurrentTenant(){
        var url = apiUrl + 'transactions/currentUser/';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getList() {
        var url = apiUrl + 'transactions';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }


    get(id) {
        var url = apiUrl + 'transactions/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });
    }
    create(data) {
        var url = apiUrl + 'transactions';
        return api.call('post', url, data)
            .then(({ data }) => {
                return data
            });

    }
    update(data) {
        var url = apiUrl + 'transactions/';
        return api.call('put', url + data.id, data)
            .then(({ data }) => {
                return data
            });
    }
    delete(id) {
        var url = apiUrl + 'transactions/';
        return api.call('delete', url + id)
            .then(({ data }) => {
                return data
            });
    }

}

export default TransactionApi;