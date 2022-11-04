let apiUrl = process.env.VUE_APP_API_URL;


class BuildingCodeApi {

    getList() {
        var url = apiUrl + 'buildingCodes';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getListByBuildingRuleId(id){
        var url = apiUrl + 'buildingCodes/ByBuildingRule/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });

    }

    get(id) {
        var url = apiUrl + 'buildingCodes/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });
    }
 
    create(data) {
        var url = apiUrl + 'buildingCodes';
        return api.call('post', url, data)
            .then(({ data }) => {
                return data
            });

    }
    update(data) {
        var url = apiUrl + 'buildingCodes/';
        return api.call('put', url + data.id, data)
            .then(({ data }) => {
                return data
            });
    }
    delete(id) {
        var url = apiUrl + 'buildingCodes/';
        return api.call('delete', url + id)
            .then(({ data }) => {
                return data
            });
    }

}

export default BuildingCodeApi;