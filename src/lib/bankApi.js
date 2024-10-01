class BankApi {
    removeBankStatementDocuments(bankStatementId, documentId) {
        var url = apiUrl + 'banks/removeDocument/' + bankStatementId + '/' + documentId;
        return api.call('put', url)
            .then(({ data }) => {
                return data
            });
    }

    updateBankStatementDocuments(id, data) {
        var url = apiUrl + 'banks/addDocuments/';
        return api.call('put', url + id, data)
            .then(({ data }) => {
                return data
            });
    }
    getListByCurrentBusiness(){
        var url = apiUrl + 'banks/currentBusiness/';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getListByCurrentTenant(){
        var url = apiUrl + 'banks/currentUser/';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getList() {
        var url = apiUrl + 'banks';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }


    get(id) {
        var url = apiUrl + 'banks/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });
    }
    create(data) {
        var url = apiUrl + 'banks';
        return api.call('post', url, data)
            .then(({ data }) => {
                return data
            });

    }
    update(data) {
        var url = apiUrl + 'banks/';
        return api.call('put', url + data.id, data)
            .then(({ data }) => {
                return data
            });
    }
    delete(id) {
        var url = apiUrl + 'banks/';
        return api.call('delete', url + id)
            .then(({ data }) => {
                return data
            });
    }

}

export default BankApi;