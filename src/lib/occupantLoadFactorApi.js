
class OccupantLoadFactorApi {

    getList() {
        var url = apiUrl + 'occupantLoadFactors';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getByBuildingCodeAndBuildingRule(codeId, ruleId) {
        var url = apiUrl + 'occupantLoadFactors/ByBuildingCodeAndBuildingRule/' + codeId + '/' + ruleId;
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }
    get(id) {
        var url = apiUrl + 'occupantLoadFactors/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });
    }

    create(data) {
        var url = apiUrl + 'occupantLoadFactors';
        return api.call('post', url, data)
            .then(({ data }) => {
                return data
            });

    }
    update(data) {
        var url = apiUrl + 'occupantLoadFactors/';
        return api.call('put', url + data.id, data)
            .then(({ data }) => {
                return data
            });
    }
    delete(id) {
        var url = apiUrl + 'occupantLoadFactors/';
        return api.call('delete', url + id)
            .then(({ data }) => {
                return data
            });
    }

}

export default OccupantLoadFactorApi;