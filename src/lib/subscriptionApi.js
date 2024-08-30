
class SubscriptionApi {

    getSubscriptionStatus() {
        var url = apiUrl + 'subscriptions/statuses';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getListByCurrentTenant() {
        var url = apiUrl + 'subscriptions/currentUser/';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getList() {
        var url = apiUrl + 'subscriptions';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }


    get(id) {
        var url = apiUrl + 'subscriptions/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });
    }
    create(data) {
        var url = apiUrl + 'subscriptions';
        return api.call('post', url, data)
            .then(({ data }) => {
                return data
            });

    }
    update(data) {
        var url = apiUrl + 'subscriptions/';
        return api.call('put', url + data.id, data)
            .then(({ data }) => {
                return data
            });
    }

    updateDefaultSubscription(data) {
        var url = apiUrl + 'subscriptions/updateDefaultSubscription/';
        return api.call('put', url + data.id, data)
            .then(({ data }) => {
                return data
            });
    }

    delete(id) {
        var url = apiUrl + 'subscriptions/';
        return api.call('delete', url + id)
            .then(({ data }) => {
                return data
            });
    }

}

export default SubscriptionApi;