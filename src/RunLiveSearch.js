import React from "react";

const RunLiveSearch = (name, value, ls, lsRoute, rfa_headers) => {
  console.log("run live search -name: ", name);
  //get a list of options as the user types,like when using Google to search.
  //set the name of the location to place the search result.
  //The inputs must have a "lsr={this.state.lsr[inputname]}" property
  //first, if the input change leaves the field blank, clear the options list
  if (value === "") {
    const returnObj = "";
    console.log("blank result: ", returnObj);
    return returnObj;
    //if the input value is not blank, fetch the options
  } else {
    // get the options from the database
    let prom = ls.search(name, value, lsRoute, rfa_headers);
    prom.then(res => {
      console.log("about to set lsr list");
      // place the options into state in a result set component
      SetLSRList(res);
    });
  } //else
};

const SetLSRList = res => {
  console.log("set lsr list");
  //if there is no result, set a message for that, else, get the results from the "lsrResult" return object.
  let list = res.data.lsrResult;
  let newList;
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
  //place the "newList" element into state
  const returnObj = newList;
  console.log("non blank result: ", returnObj);
  return returnObj;
};

export default RunLiveSearch;
