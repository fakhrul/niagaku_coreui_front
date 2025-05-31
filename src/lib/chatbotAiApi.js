let chatApiUrl = window.config.CHATBOT_API_URL;

class ChatbotAiApi {

    refresh(businessId, profileId) {
        const url = chatApiUrl + 'refresh';
        const form = new FormData();
        form.append('businessId', businessId);
        form.append('profileId', profileId);
        return api.call('post', url, form).then(({ data }) => data);
    }

    ask(question, businessId, profileId) {
        const url = chatApiUrl + 'ask';
        const form = new FormData();
        form.append('question', question);
        form.append('businessId', businessId);
        form.append('profileId', profileId);
        return api.call('post', url, form).then(({ data }) => data);
    }

    uploadPdf(file, businessId, profileId) {
        const url = chatApiUrl + 'upload-pdf';
        const form = new FormData();
        form.append('file', file);
        form.append('businessId', businessId);
        form.append('profileId', profileId);
        return api.call('post', url, form).then(({ data }) => data);
    }

    crawlUrl(websiteUrl, businessId, profileId) {
        const url = chatApiUrl + 'crawl-url';
        const form = new FormData();
        form.append('url', websiteUrl);
        form.append('businessId', businessId);
        form.append('profileId', profileId);
        return api.call('post', url, form).then(({ data }) => data);
    }

}

export default ChatbotAiApi;