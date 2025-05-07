
class ReportApi {

    getNextNumber() {
        var url = apiUrl + 'reports/next-number';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getReportStatus() {
        var url = apiUrl + 'reports/states';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getGeneralLedger({
        startDate,
        endDate,
        chartAccountId
    }) {
        var url = apiUrl + 'reports/general-ledger';
        const params = new URLSearchParams();

        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        if (chartAccountId) params.append('chartAccountId', chartAccountId);
        url += `?${params.toString()}`;
        console.log('url', url);
        return api.call('get', url)
            .then(({ data }) => {
                return data;
            });
    }

    getListByCurrentBusiness() {
        var url = apiUrl + 'reports/currentBusiness/';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });

    }

    getListByCurrentTenant() {
        var url = apiUrl + 'reports/currentUser/';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getList() {
        var url = apiUrl + 'reports';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getItem(id) {
        var url = apiUrl + 'reports/item/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });
    }

    get(id) {
        var url = apiUrl + 'reports/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });
    }

    create(data) {
        var url = apiUrl + 'reports';
        return api.call('post', url, data)
            .then(({ data }) => {
                return data
            });

    }

    updateState(data) {
        var url = apiUrl + 'reports/state/';
        return api.call('put', url + data.id, data)
            .then(({ data }) => {
                return data
            });
    }

    update(data) {
        var url = apiUrl + 'reports/';
        return api.call('put', url + data.id, data)
            .then(({ data }) => {
                return data
            });
    }
    delete(id) {
        var url = apiUrl + 'reports/';
        return api.call('delete', url + id)
            .then(({ data }) => {
                return data
            });
    }

}

export default ReportApi;