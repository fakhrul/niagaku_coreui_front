class ExitStairDoorApi {

    getListByFloorPlanId(id){
        var url = apiUrl + 'exitStairDoors/ByFloorPlanId/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });

    }

    getList() {
        var url = apiUrl + 'exitStairDoors';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }


    get(id) {
        var url = apiUrl + 'exitStairDoors/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });
    }
 
    create(data) {
        var url = apiUrl + 'exitStairDoors';
        return api.call('post', url, data)
            .then(({ data }) => {
                return data
            });

    }
    update(data) {
        var url = apiUrl + 'exitStairDoors/';
        return api.call('put', url + data.id, data)
            .then(({ data }) => {
                return data
            });
    }
    delete(id) {
        var url = apiUrl + 'exitStairDoors/';
        return api.call('delete', url + id)
            .then(({ data }) => {
                return data
            });
    }

}

export default ExitStairDoorApi;