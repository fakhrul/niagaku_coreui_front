let apiUrl = process.env.VUE_APP_API_URL;


class RoomApi {

    getList() {
        var url = apiUrl + 'rooms';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }


    get(id) {
        var url = apiUrl + 'rooms/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });
    }
 
    create(data) {
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

export default RoomApi;