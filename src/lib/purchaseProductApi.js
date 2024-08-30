
class PurchaseProductApi {

    getListByCurrentBusiness(){
        var url = apiUrl + 'purchaseproducts/currentBusiness/';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getListByCurrentTenant(){
        var url = apiUrl + 'purchaseproducts/currentUser/';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getList() {
        var url = apiUrl + 'purchaseproducts';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }


    get(id) {
        var url = apiUrl + 'purchaseproducts/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });
    }
    create(data) {
        var url = apiUrl + 'purchaseproducts';
        return api.call('post', url, data)
            .then(({ data }) => {
                return data
            });

    }
    update(data) {
        var url = apiUrl + 'purchaseproducts/';
        return api.call('put', url + data.id, data)
            .then(({ data }) => {
                return data
            });
    }
    delete(id) {
        var url = apiUrl + 'purchaseproducts/';
        return api.call('delete', url + id)
            .then(({ data }) => {
                return data
            });
    }

}

export default PurchaseProductApi;