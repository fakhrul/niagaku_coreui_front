class PaymentApi {


    // getListByCurrentTenant() {
    //     var url = apiUrl + 'businesses/currentUser/';
    //     return api.call('get', url)
    //         .then(({ data }) => {
    //             return data
    //         });
    // }

    // getList() {
    //     var url = apiUrl + 'businesses';
    //     return api.call('get', url)
    //         .then(({ data }) => {
    //             return data
    //         });
    // }

    
    // getDefaultLogoUrl() {
    //     var url = apiUrl + 'businesses/defaultlogo/';
    //     return api.call('get', url)
    //         .then(({ data }) => {
    //             return data
    //         });
    // }

    // get(id) {
    //     var url = apiUrl + 'businesses/';
    //     return api.call('get', url + id)
    //         .then(({ data }) => {
    //             return data
    //         });
    // }

    // createByCurrentTenant(data)
    // {
    //     var url = apiUrl + 'businesses/currentTennant';
    //     return api.call('post', url, data)
    //         .then(({ data }) => {
    //             return data
    //         });
    // }
   createPaymentIntent(data) {
        var url = apiUrl + 'payment/create-payment-intent';
        return api.call('post', url, data)
            .then(({ data }) => {
                return data
            });

    }

    // create(data) {
    //     var url = apiUrl + 'payment';
    //     return api.call('post', url, data)
    //         .then(({ data }) => {
    //             return data
    //         });

    // }
    // update(data) {
    //     var url = apiUrl + 'businesses/';
    //     return api.call('put', url + data.id, data)
    //         .then(({ data }) => {
    //             return data
    //         });
    // }

    // updateDefaultBusiness(data) {
    //     var url = apiUrl + 'businesses/updateDefaultBusiness/';
    //     return api.call('put', url + data.id, data)
    //         .then(({ data }) => {
    //             return data
    //         });
    // }

    // delete(id) {
    //     var url = apiUrl + 'businesses/';
    //     return api.call('delete', url + id)
    //         .then(({ data }) => {
    //             return data
    //         });
    // }

}

export default PaymentApi;