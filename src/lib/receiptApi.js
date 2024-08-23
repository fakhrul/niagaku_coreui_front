let apiUrl = process.env.VUE_APP_API_URL;


class ReceiptApi {

    createReceiptImage(data) {
        var url = apiUrl + 'receipts/newReceiptImages/';
        return api.call('put',url, data)
            .then(({ data }) => {
                return data
            });
    }

    getReceiptDataSet() {
        var url = apiUrl + 'receipts/xmlList';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getList() {
        var url = apiUrl + 'receipts';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }


    get(id) {
        var url = apiUrl + 'receipts/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });
    }
    getNext(id) {
        var url = apiUrl + 'receipts/nextTo/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });

    }
    
    getPrev(id) {
        var url = apiUrl + 'receipts/prevTo/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });

    }

    create(data) {
        var url = apiUrl + 'receipts';
        return api.call('post', url, data)
            .then(({ data }) => {
                return data
            });

    }
    update(data) {
        var url = apiUrl + 'receipts/';
        return api.call('put', url + data.id, data)
            .then(({ data }) => {
                return data
            });
    }
    delete(id) {
        var url = apiUrl + 'receipts/';
        return api.call('delete', url + id)
            .then(({ data }) => {
                return data
            });
    }

}

export default ReceiptApi;