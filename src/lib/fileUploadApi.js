import * as axios from 'axios';

const BASE_URL = process.env.VUE_APP_API_URL;

class FileUploadApi {
    uploadDocument(formData) {
        const url = `${BASE_URL}Documents/UploadFile`;
        return axios.post(url, formData)
            .then(x => x.data);
    }
}

export default FileUploadApi;

// function uploadFingerPrintSchedule(formData) {
//     const url = `${BASE_URL}Documents/UploadFile`;
//     return axios.post(url, formData)
//         // get data
//         .then(x => x.data);
//         // add url field
//         // .then(x => {
//         //     console.log(img)
//         //     x.map(img => Object.assign({},
//         //         img, { url: img.data.url }))
//         // });
// }

// function uploadArea(formData) {
//     const url = `${BASE_URL}Areas/UploadFile`;
//     return axios.post(url, formData)
//         // get data
//         .then(x => x.data);
//         // add url field
//         // .then(x => {
//         //     console.log(img)
//         //     x.map(img => Object.assign({},
//         //         img, { url: img.data.url }))
//         // });
// }

// function uploadLevelFloorMap(formData) {
//     const url = `${BASE_URL}Locations/UploadFloorPlan`;
//     return axios.post(url, formData)
//         // get data
//         .then(x => x.data);
//         // add url field
//         // .then(x => {
//         //     console.log(img)
//         //     x.map(img => Object.assign({},
//         //         img, { url: img.data.url }))
//         // });
// }

// function uploadImage(formData) {
//     const url = `${BASE_URL}Documents/UploadImage`;
//     return axios.post(url, formData)
//         // get data
//         .then(x => x.data);
//         // add url field
//         // .then(x => {
//         //     console.log(img)
//         //     x.map(img => Object.assign({},
//         //         img, { url: img.data.url }))
//         // });
// }

// export { uploadArea, uploadLevelFloorMap, uploadImage, uploadFingerPrintSchedule }