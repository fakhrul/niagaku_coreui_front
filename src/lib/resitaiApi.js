// let apiUrl = process.env.VUE_APP_OCR_API_URL;
let resitApiUrl = window.config.RESIT_AI_URL;

class ResitAiApi {
    extract(data) {
        var url = resitApiUrl + 'extract';
        console.log(data);
        return api.call('post', url, data)
            .then(({ data }) => {
                return data
            });

    }

}

export default ResitAiApi;