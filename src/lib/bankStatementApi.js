
class BankStatementApi {

    
    getListByCurrentBusiness() {
        var url = apiUrl + 'bankstatements/currentBusiness/';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getListByCurrentUser() {
        var url = apiUrl + 'bankstatements/currentUser/';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    createBankStatementImage(data) {
        var url = apiUrl + 'bankstatements/newBankStatementImages/';
        return api.call('put',url, data)
            .then(({ data }) => {
                return data
            });
    }

    getBankStatementDataSet() {
        var url = apiUrl + 'bankstatements/xmlList';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getList() {
        var url = apiUrl + 'bankstatements';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }


    get(id) {
        var url = apiUrl + 'bankstatements/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });
    }
    getNext(id) {
        var url = apiUrl + 'bankstatements/nextTo/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });

    }
    
    getPrev(id) {
        var url = apiUrl + 'bankstatements/prevTo/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });

    }

    create(data) {
        var url = apiUrl + 'bankstatements';
        return api.call('post', url, data)
            .then(({ data }) => {
                return data
            });

    }
    update(data) {
        var url = apiUrl + 'bankstatements/';
        return api.call('put', url + data.id, data)
            .then(({ data }) => {
                return data
            });
    }
    delete(id) {
        var url = apiUrl + 'bankstatements/';
        return api.call('delete', url + id)
            .then(({ data }) => {
                return data
            });
    }

}

export default BankStatementApi;