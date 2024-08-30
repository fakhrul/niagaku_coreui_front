
class PurchaseQuotationApi {

    getListByCurrentBusiness()
    {
        var url = apiUrl + 'purchaseQuotations/currentBusiness/';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });

    }

    getList() {
        var url = apiUrl + 'purchaseQuotations';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }


    get(id) {
        var url = apiUrl + 'purchaseQuotations/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });
    }
    getNext(id) {
        var url = apiUrl + 'purchaseQuotations/nextTo/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });

    }
    
    getPrev(id) {
        var url = apiUrl + 'purchaseQuotations/prevTo/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });

    }

    create(data) {
        var url = apiUrl + 'purchaseQuotations';
        return api.call('post', url, data)
            .then(({ data }) => {
                return data
            });

    }
    update(data) {
        var url = apiUrl + 'purchaseQuotations/';
        return api.call('put', url + data.id, data)
            .then(({ data }) => {
                return data
            });
    }
    delete(id) {
        var url = apiUrl + 'purchaseQuotations/';
        return api.call('delete', url + id)
            .then(({ data }) => {
                return data
            });
    }

}

export default PurchaseQuotationApi;