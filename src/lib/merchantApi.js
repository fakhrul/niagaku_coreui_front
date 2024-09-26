
class MerchantApi {
    getList() {
        var url = apiUrl + 'merchants';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getListByChartAccountId(id) {
        var url = apiUrl + 'merchants/ByChartAccount/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });
    }

    get(id) {
        var url = apiUrl + 'merchants/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });
    }
    create(data) {
        var url = apiUrl + 'merchants';
        return api.call('post', url, data)
            .then(({ data }) => {
                return data
            });

    }
    update(data) {
        var url = apiUrl + 'merchants/';
        return api.call('put', url + data.id, data)
            .then(({ data }) => {
                return data
            });
    }
    delete(id) {
        var url = apiUrl + 'merchants/';
        return api.call('delete', url + id)
            .then(({ data }) => {
                return data
            });
    }

}

export default MerchantApi;