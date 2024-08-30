class ParamEgressApi {

    getList() {
        var url = apiUrl + 'paramEgress';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    
    getByBuildingCode(ruleId) {
        var url = apiUrl + 'paramEgress/ByBuildingRule/' + ruleId;
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    get(id) {
        var url = apiUrl + 'paramEgress/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });
    }

    create(data) {
        var url = apiUrl + 'paramEgress';
        return api.call('post', url, data)
            .then(({ data }) => {
                return data
            });

    }
    update(data) {
        var url = apiUrl + 'paramEgress/';
        return api.call('put', url + data.id, data)
            .then(({ data }) => {
                return data
            });
    }
    delete(id) {
        var url = apiUrl + 'paramEgress/';
        return api.call('delete', url + id)
            .then(({ data }) => {
                return data
            });
    }

}

export default ParamEgressApi;