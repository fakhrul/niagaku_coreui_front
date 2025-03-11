class PurchaseOrderApi {
    
    getNextNumber() {
        var url = apiUrl + 'purchaseorders/next-number';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }


    getPurchaseOrderStatus() {
        var url = apiUrl + 'purchaseorders/states';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getListByCurrentBusiness()
    {
        var url = apiUrl + 'purchaseorders/currentBusiness/';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });

    }

    getListByCurrentTenant(){
        var url = apiUrl + 'purchaseorders/currentUser/';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getList() {
        var url = apiUrl + 'purchaseorders';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }


    get(id) {
        var url = apiUrl + 'purchaseorders/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });
    }
    create(data) {
        var url = apiUrl + 'purchaseorders';
        return api.call('post', url, data)
            .then(({ data }) => {
                return data
            });

    }

    updateState(data) {
        var url = apiUrl + 'purchaseorders/state/';
        return api.call('put', url + data.id, data)
            .then(({ data }) => {
                return data
            });
    }

    update(data) {
        var url = apiUrl + 'purchaseorders/';
        return api.call('put', url + data.id, data)
            .then(({ data }) => {
                return data
            });
    }
    delete(id) {
        var url = apiUrl + 'purchaseorders/';
        return api.call('delete', url + id)
            .then(({ data }) => {
                return data
            });
    }

}

export default PurchaseOrderApi;