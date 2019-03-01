import axios from "axios";

const get = (url, headers) => {
  const request = axios({
    withCredentials: true,
    method: "get",
    url: url,
    responseType: "json",
    headers: headers
  });
  request.catch(error => console.log("ajax error: " + error));
  return request;
};

const post = (url, formData, headers) => {
  const request = axios({
    withCredentials: true,
    url: url,
    method: "post",
    data: formData,
    responseType: "json",
    headers: headers
  });
  request.catch(error => console.log("ajax error: " + error));
  return request;
};

export default { get, post };
