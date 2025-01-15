class ExpensesApi {

    updateState(data) {
        var url = apiUrl + 'expenses/state/';
        return api.call('put', url + data.id, data)
            .then(({ data }) => {
                return data
            });
    }
    getStatusTypes() {
        var url = apiUrl + 'expenses/states';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    removeInvoiceDocument(id, documentId) {
        var url = apiUrl + 'expenses/RemoveInvoiceDocument/' + id + '/' + documentId;
        return api.call('delete', url)
            .then(({ data }) => {
                return data
            });
    }

    removePaymentDocument(id, documentId) {
        var url = apiUrl + 'expenses/RemovePaymentDocument/' + id + '/' + documentId;
        return api.call('delete', url)
            .then(({ data }) => {
                return data
            });
    }

    removeReceiptDocument(id, documentId) {
        var url = apiUrl + 'expenses/RemoveReceiptDocument/' + id + '/' + documentId;
        return api.call('delete', url)
            .then(({ data }) => {
                return data
            });
    }


    getListByCurrentBusiness() {
        var url = apiUrl + 'expenses/currentBusiness/';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getList() {
        var url = apiUrl + 'expenses';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }


    get(id) {
        var url = apiUrl + 'expenses/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });
    }
    getNext(id) {
        var url = apiUrl + 'expenses/nextTo/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });

    }
    
    getPrev(id) {
        var url = apiUrl + 'expenses/prevTo/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });

    }

    create(data) {
        var url = apiUrl + 'expenses';
        return api.call('post', url, data)
            .then(({ data }) => {
                return data
            });

    }
    update(data) {
        var url = apiUrl + 'expenses/';
        return api.call('put', url + data.id, data)
            .then(({ data }) => {
                return data
            });
    }
    delete(id) {
        var url = apiUrl + 'expenses/';
        return api.call('delete', url + id)
            .then(({ data }) => {
                return data
            });
    }

}

export default ExpensesApi;