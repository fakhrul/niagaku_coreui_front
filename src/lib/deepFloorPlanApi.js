let apiUrl = process.env.VUE_APP_DEEP_FLOOR_PLAN_URL;


class DeepFloorPlanApi {

    analyze(data){
        console.log(data);
        var url = apiUrl + 'analyze';
        return api.call('post', url, data)
            .then(({ data }) => {
                return data
            });

    }
    getRoomPoints(data) {
        var url = apiUrl + 'rooms';
        return api.call('post', url, data)
            .then(({ data }) => {
                return data
            });

    }
    update(data) {
        var url = apiUrl + 'rooms/';
        return api.call('put', url + data.id, data)
            .then(({ data }) => {
                return data
            });
    }
    delete(id) {
        var url = apiUrl + 'rooms/';
        return api.call('delete', url + id)
            .then(({ data }) => {
                return data
            });
    }

}

export default DeepFloorPlanApi;