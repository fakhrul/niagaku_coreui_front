
class RentalAvailabilityApi {

    getStatus() {
        var url = apiUrl + 'rentalavailabilities/states';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getListByRentalProduct(id){
        var url = apiUrl + 'rentalavailabilities/rentalProduct/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });
    }

    getListByCurrentBusiness(){
        var url = apiUrl + 'rentalavailabilities/currentBusiness/';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getListByCurrentTenant(){
        var url = apiUrl + 'rentalavailabilities/currentUser/';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getList() {
        var url = apiUrl + 'rentalavailabilities';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }


    get(id) {
        var url = apiUrl + 'RentalAvailabilities/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });
    }

    
    // createBatch(data) {
    //     var url = apiUrl + 'rentalavailabilities/batch';
    //     return api.call('post', url, data)
    //         .then(({ data }) => {
    //             return data
    //         });

    // }

    create(data) {
        var url = apiUrl + 'rentalavailabilities';
        return api.call('post', url, data)
            .then(({ data }) => {
                return data
            });

    }
    update(data) {
        var url = apiUrl + 'rentalavailabilities/';
        return api.call('put', url + data.id, data)
            .then(({ data }) => {
                return data
            });
    }
    delete(id) {
        var url = apiUrl + 'rentalavailabilities/';
        return api.call('delete', url + id)
            .then(({ data }) => {
                return data
            });
    }

}

export default RentalAvailabilityApi;