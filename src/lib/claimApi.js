class ClaimApi {

    updateState(data, accountId) {
        const url = apiUrl + `claims/state/${data.id}?accountId=${accountId || ''}`;
        return api.call('put', url, data)
          .then(({ data }) => data);
      }

      getRecommendedChartAccount(profileId, state) {
        var url = apiUrl + `claims/profile/${profileId}/recommended-account?type=${state}`;
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
        var url = apiUrl + 'claims/nextclaimno';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getListByCurrentUser() {
        var url = apiUrl + 'claims/currentUser/';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getList() {
        var url = apiUrl + 'claims';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }
    
    getClaimState() {
        var url = apiUrl + 'claims/states';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }
    get(id) {
        var url = apiUrl + 'claims/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });
    }
    create(data) {
        var url = apiUrl + 'claims';
        return api.call('post', url, data)
            .then(({ data }) => {
                return data
            });

    }
    update(data) {
        var url = apiUrl + 'claims/';
        return api.call('put', url + data.id, data)
            .then(({ data }) => {
                return data
            });
    }


    delete(id) {
        var url = apiUrl + 'claims/';
        return api.call('delete', url + id)
            .then(({ data }) => {
                return data
            });
    }

}

export default ClaimApi;