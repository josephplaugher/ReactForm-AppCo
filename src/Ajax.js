import axios from 'axios'

const get = (url) => {
    //console.log('the token:', sessionStorage.getItem('AppreciateJWT'));
    const request = axios({method: 'get', url: url,
        responseType:'JSON'
        //headers:{"authorization": "bearer" + sessionStorage.getItem('AppreciateJWT'),"testing":"123"}
        });
    request
        .then(result => console.log('ajax firing: '+ result))
        .catch(error => console.log('ajax error: '+ error))
    return request;
}

const post = (url, formData) => {

    const request = axios({url:url,
        method: 'post',
        data: formData,
        config: { 
            headers: {"Content-Type": "multipart/form-data"}},
        responseType:'json'})  
        request
            .then(result => console.log('ajax firing: '+ result))
            .catch(error => console.log('ajax error: '+ error))
    return request;
}


export default {get, post};