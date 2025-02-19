// import axios from 'axios';

// class FileUploadApi {
//     uploadDocument(formData) {
//         const url = `${apiUrl}Documents/UploadFile`;
//         return axios.post(url, formData)
//             .then(x => x.data);
//     }

//     uploadImages(formData) {
//         const url = `${apiUrl}Documents/UploadImage`;
//         return axios.post(url, formData)
//             .then(x => x.data);
//     }
    
// }

// export default FileUploadApi;


import axios from 'axios';

class FileUploadApi {
    uploadDocument(formData, onUploadProgress) {
        const url = `${apiUrl}Documents/UploadFile`;
        return axios.post(url, formData, {
            onUploadProgress: onUploadProgress
        })
        .then(x => x.data);
    }

    uploadImages(formData, onUploadProgress) {
        const url = `${apiUrl}Documents/UploadImage`;
        return axios.post(url, formData, {
            onUploadProgress: onUploadProgress
        })
        .then(x => x.data);
    }
}

export default FileUploadApi;

