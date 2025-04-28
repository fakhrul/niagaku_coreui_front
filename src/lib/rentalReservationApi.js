
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
        startDate = '',
        endDate = '',
        totalDays = '',
        cleaningIsPaid = '',
        minDaysFilter = false,
    }) {
        var url = apiUrl + 'rentalreservations/filter';
        const params = new URLSearchParams();
    
        if (rentalProductId) params.append('rentalProductId', rentalProductId);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (totalDays) params.append('totalDays', totalDays);
        if (cleaningIsPaid !== '') params.append('cleaningIsPaid', cleaningIsPaid);
        params.append("minDaysFilter", minDaysFilter); // Boolean value

        url += `?${params.toString()}`;
    
        console.log('Generated API URL:', url);
    
        return api.call('get', url)
            .then(({ data }) => {
                return data;
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
    addBatch(data) {
        console.log('addBatch', data)
        var url = apiUrl + 'rentalreservations/addBatch/';
        return api.call('post', url, data)
            .then(({ data }) => {
                return data
            });
    }

    updateBatch(data) {
        var url = apiUrl + 'rentalreservations/batch/';
        return api.call('put', url, data)
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