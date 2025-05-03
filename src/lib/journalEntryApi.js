
class JournalEntryApi {
    
    getNextNumber() {
        var url = apiUrl + 'journalentries/next-number';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getJournalEntryStatus() {
        var url = apiUrl + 'journalentries/states';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getListByCurrentBusiness()
    {
        var url = apiUrl + 'journalentries/currentBusiness/';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });

    }

    getListByCurrentTenant(){
        var url = apiUrl + 'journalentries/currentUser/';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getList() {
        var url = apiUrl + 'journalentries';
        return api.call('get', url)
            .then(({ data }) => {
                return data
            });
    }

    getItem(id) {
        var url = apiUrl + 'journalentries/item/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });
    }

    get(id) {
        var url = apiUrl + 'journalentries/';
        return api.call('get', url + id)
            .then(({ data }) => {
                return data
            });
    }
    
    create(data) {
        var url = apiUrl + 'journalentries';
        return api.call('post', url, data)
            .then(({ data }) => {
                return data
            });

    }

    updateState(data) {
        var url = apiUrl + 'journalentries/state/';
        return api.call('put', url + data.id, data)
            .then(({ data }) => {
                return data
            });
    }

    update(data) {
        var url = apiUrl + 'journalentries/';
        return api.call('put', url + data.id, data)
            .then(({ data }) => {
                return data
            });
    }
    delete(id) {
        var url = apiUrl + 'journalentries/';
        return api.call('delete', url + id)
            .then(({ data }) => {
                return data
            });
    }

}

export default JournalEntryApi;