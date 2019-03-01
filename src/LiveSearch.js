import React from "react";
import Ajax from "./Ajax";

class LiveSearch {
  constructor(lsa) {
    //Set live search array.
    //this determines what fields will
    //trigger a live search
    this.lsa = lsa;
    this.list = [];
  }

  getLSA = () => {
    //get the list of fields that will trigger a live search
    // console.log("ls array: ", this.lsa);
    return this.lsa;
  };

  search = (name, value, url, headers) => {
    if (value === "") {
      return "";
    } else {
      // set and return the search promise
      return new Promise((resolve, reject) => {
        Ajax.get(url + "/name/" + name + "/value/" + value, headers)
          .then(res => {
            var list = res.data.lsrResult;
            var newList;
            // on the server, set the message desired when no results are found
            // onto the "nr" object
            if (res.data.nr) {
              newList = res.data.nr;
            } else {
              // build the result set element
              newList = list.map(item => (
                <p
                  className="lsr"
                  onClick={event => this.lsrSelect(event)}
                  id={item[Object.keys(item)[0]]}
                  key={item[Object.keys(item)[0]]}
                >
                  {item[Object.keys(item)[0]]}
                </p>
              ));
            }
            resolve(newList);
          })
          .catch(error => {
            reject("Live search error ", error);
          });
      });
    }
  };

  setLSRList = list => {
    console.log("set lsr list: ", list);
    this.list = list;
  };

  getLSRList = () => {
    return this.list;
  };
}

export default LiveSearch;
