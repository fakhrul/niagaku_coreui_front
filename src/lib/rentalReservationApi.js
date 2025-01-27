
class RentalReservationApi {

    getStatus() {
        var url = apiUrl + 'rentalreservations/states';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getListByRentalProduct(id) {
        var url = apiUrl + 'rentalreservations/rentalProduct/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });
    }

    getListByCurrentBusiness() {
        var url = apiUrl + 'rentalreservations/currentBusiness/';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getListByCurrentTenant() {
        var url = apiUrl + 'rentalreservations/currentUser/';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getList({
        rentalProductId = '',
    }
    ) {
        var url = apiUrl + 'rentalreservations/filter';
        const params = new URLSearchParams();

        params.append('rentalProductId', rentalProductId);

        url += `?${params.toString()}`;


        return api.call('get', url, )
            .then(({ data }) => {
                return data
            });
    }


    // getList() {
    //     var url = apiUrl + 'rentalreservations';
    //     return api.call('get', url)
    //         .then(({ data }) => {
    //             return data
    //         });
    // }


    get(id) {
        var url = apiUrl + 'RentalAvailabilities/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });
    }


    // createBatch(data) {
    //     var url = apiUrl + 'rentalreservations/batch';
    //     return api.call('post', url, data)
    //         .then(({ data }) => {
    //             return data
    //         });

    // }

    create(data) {
        var url = apiUrl + 'rentalreservations';
        return api.call('post', url, data)
            .then(({ data }) => {
                return data
            });

    }
    update(data) {
        var url = apiUrl + 'rentalreservations/';
        return api.call('put', url + data.id, data)
            .then(({ data }) => {
                return data
            });
    }
    delete(id) {
        var url = apiUrl + 'rentalreservations/';
        return api.call('delete', url + id)
            .then(({ data }) => {
                return data
            });
    }

}

export default RentalReservationApi;