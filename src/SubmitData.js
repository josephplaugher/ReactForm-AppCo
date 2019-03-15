import Ajax from "./Ajax";

const SubmitData = (formData, extraData, route, headers) => {
  return new Promise((resolve, reject) => {
    console.log("submitting data");
    let bodyData;
    //if there is other data that needs to be sent with form submission
    // but won't be provided via an input
    // add it to the "extraData" state object.
    if (typeof extraData !== "undefined") {
      bodyData = Object.assign(extraData, formData);
    } else {
      bodyData = formData;
    }
    Ajax.post(route, bodyData, headers).then(res => {
      resolve(res);
    });
  });
};

export default SubmitData;
