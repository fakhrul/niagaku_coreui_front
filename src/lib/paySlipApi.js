let apiUrl = process.env.VUE_APP_API_URL;


class PaySlipApi {

    
    
    getSlipStates() {
        var url = apiUrl + 'paySlips/states';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getSlipTypes() {
        var url = apiUrl + 'paySlips/types';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getListByCurrentBusiness(){
        var url = apiUrl + 'paySlips/currentBusiness/';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getListByCurrentTenant(){
        var url = apiUrl + 'paySlips/currentUser/';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getList() {
        var url = apiUrl + 'paySlips';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }


    get(id) {
        var url = apiUrl + 'paySlips/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });
    }
    create(data) {
        var url = apiUrl + 'paySlips';
        return api.call('post', url, data)
            .then(({ data }) => {
                return data
            });

    }
    update(data) {
        var url = apiUrl + 'paySlips/';
        return api.call('put', url + data.id, data)
            .then(({ data }) => {
                return data
            });
    }
    delete(id) {
        var url = apiUrl + 'paySlips/';
        return api.call('delete', url + id)
            .then(({ data }) => {
                return data
            });
    }

}

export default PaySlipApi;