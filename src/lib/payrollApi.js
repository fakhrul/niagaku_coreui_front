class PayrollApi {

    updateState(data, accountId) {
        const url = apiUrl + `payrolls/state/${data.id}?accountId=${accountId || ''}`;
        return api.call('put', url, data)
          .then(({ data }) => data);
      }

      getRecommendedChartAccount(profileId, state) {
        var url = apiUrl + `payrolls/profile/${profileId}/recommended-account?type=${state}`;
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    // updateState(data, accountId) {
    //     const url = apiUrl + `expenses/state/${data.id}?accountId=${accountId || ''}`;
    //     return api.call('put', url, data)
    //       .then(({ data }) => data);
    //   }

      
    getNextReferenceNumber() {
        var url = apiUrl + 'payrolls/next-no';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }
    getListByCurrentBusiness(){
        var url = apiUrl + 'payrolls/currentBusiness/';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }
    getListByCurrentUser() {
        var url = apiUrl + 'payrolls/currentUser/';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getList() {
        var url = apiUrl + 'payrolls';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }
    
    getEmployerContributionTypes() {
        var url = apiUrl + 'payrolls/employer-contribution-types';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }
    getDeductionTypes() {
        var url = apiUrl + 'payrolls/deduction-types';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getEarningTypes() {
        var url = apiUrl + 'payrolls/earning-types';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getPayrollState() {
        var url = apiUrl + 'payrolls/states';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }
    get(id) {
        var url = apiUrl + 'payrolls/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });
    }
    create(data) {
        var url = apiUrl + 'payrolls';
        return api.call('post', url, data)
            .then(({ data }) => {
                return data
            });

    }
    update(data) {
        var url = apiUrl + 'payrolls/';
        return api.call('put', url + data.id, data)
            .then(({ data }) => {
                return data
            });
    }


    delete(id) {
        var url = apiUrl + 'payrolls/';
        return api.call('delete', url + id)
            .then(({ data }) => {
                return data
            });
    }

}

export default PayrollApi;