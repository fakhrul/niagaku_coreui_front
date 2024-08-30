
class SalesOrderApi {

    getListByCurrentBusiness()
    {
        var url = apiUrl + 'salesOrders/currentBusiness/';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });

    }

    getList() {
        var url = apiUrl + 'salesOrders';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }


    get(id) {
        var url = apiUrl + 'salesOrders/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });
    }
    getNext(id) {
        var url = apiUrl + 'salesOrders/nextTo/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });

    }
    
    getPrev(id) {
        var url = apiUrl + 'salesOrders/prevTo/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });

    }

    create(data) {
        var url = apiUrl + 'salesOrders';
        return api.call('post', url, data)
            .then(({ data }) => {
                return data
            });

    }
    update(data) {
        var url = apiUrl + 'salesOrders/';
        return api.call('put', url + data.id, data)
            .then(({ data }) => {
                return data
            });
    }
    delete(id) {
        var url = apiUrl + 'salesOrders/';
        return api.call('delete', url + id)
            .then(({ data }) => {
                return data
            });
    }

}

export default SalesOrderApi;