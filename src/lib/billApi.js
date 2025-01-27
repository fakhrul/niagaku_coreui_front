class BillApi {
    updateState(data) {
        var url = apiUrl + 'bills/state/';
        return api.call('put', url + data.id, data)
            .then(({ data }) => {
                return data
            });
    }
    getStatusTypes() {
        var url = apiUrl + 'bills/states';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    removeInvoiceDocument(id, documentId) {
        var url = apiUrl + 'bills/RemoveInvoiceDocument/' + id + '/' + documentId;
        return api.call('delete', url)
            .then(({ data }) => {
                return data
            });
    }

    removePaymentDocument(id, documentId) {
        var url = apiUrl + 'bills/RemovePaymentDocument/' + id + '/' + documentId;
        return api.call('delete', url)
            .then(({ data }) => {
                return data
            });
    }

    removeReceiptDocument(id, documentId) {
        var url = apiUrl + 'bills/RemoveReceiptDocument/' + id + '/' + documentId;
        return api.call('delete', url)
            .then(({ data }) => {
                return data
            });
    }


    getListByCurrentBusiness() {
        var url = apiUrl + 'bills/currentBusiness/';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }


    getBillDataSet() {
        var url = apiUrl + 'bills/xmlList';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getList() {
        var url = apiUrl + 'bills';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }


    get(id) {
        var url = apiUrl + 'bills/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });
    }
    getNext(id) {
        var url = apiUrl + 'bills/nextTo/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });

    }
    
    getPrev(id) {
        var url = apiUrl + 'bills/prevTo/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });

    }

    create(data) {
        var url = apiUrl + 'bills';
        return api.call('post', url, data)
            .then(({ data }) => {
                return data
            });

    }
    update(data) {
        var url = apiUrl + 'bills/';
        return api.call('put', url + data.id, data)
            .then(({ data }) => {
                return data
            });
    }
    delete(id) {
        var url = apiUrl + 'bills/';
        return api.call('delete', url + id)
            .then(({ data }) => {
                return data
            });
    }

}

export default BillApi;