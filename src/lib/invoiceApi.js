
class InvoiceApi {

    getInvoiceStatus() {
        var url = apiUrl + 'invoices/states';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getListByCurrentBusiness()
    {
        var url = apiUrl + 'invoices/currentBusiness/';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });

    }

    getListByCurrentTenant(){
        var url = apiUrl + 'invoices/currentUser/';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getList() {
        var url = apiUrl + 'invoices';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }


    get(id) {
        var url = apiUrl + 'invoices/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });
    }
    create(data) {
        var url = apiUrl + 'invoices';
        return api.call('post', url, data)
            .then(({ data }) => {
                return data
            });

    }
    update(data) {
        var url = apiUrl + 'invoices/';
        return api.call('put', url + data.id, data)
            .then(({ data }) => {
                return data
            });
    }
    delete(id) {
        var url = apiUrl + 'invoices/';
        return api.call('delete', url + id)
            .then(({ data }) => {
                return data
            });
    }

}

export default InvoiceApi;