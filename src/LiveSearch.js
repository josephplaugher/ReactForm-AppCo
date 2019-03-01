import Ajax from "./Ajax";

class LiveSearch {
  constructor(lsa) {
    //Set live search array.
    //this determines what fields will
    //trigger a live search
    this.lsa = lsa;
  }

  getLSA = () => {
    //get the list of fields that will trigger a live search
    console.log("ls array: ", this.lsa);
    return this.lsa;
  };

  search = (name, value, url, headers) => {
    // set and return the search promise
    return new Promise((resolve, reject) => {
      Ajax.get(url + "/name/" + name + "/value/" + value, headers)
        .then(res => {
          resolve(res);
        })
        .catch(error => {
          reject(error);
        });
    });
  };
}

export default LiveSearch;
