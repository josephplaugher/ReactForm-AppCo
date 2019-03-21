import React from "react";

const RunLiveSearch = (name, value, ls, lsRoute, rfa_headers) => {
  //get a list of options as the user types,like when using Google to search.
  //set the name of the location to place the search result.
  //The inputs must have a "lsr={this.state.lsr[inputname]}" property
  //first, if the input change leaves the field blank, clear the options list
  if (value === "") {
    const returnObj = "";
    return returnObj;
    //if the input value is not blank, fetch the options
  } else {
    // get the options from the database
    let prom = ls.search(name, value, lsRoute, rfa_headers);
    prom.then(res => {
      // place the options into state in a result set component
      //   set and return the new list
      var nl = SetLSRList(res);
      return nl;
    });
  } //else
};

const SetLSRList = res => {
  //if there is no result, set a message for that, else, get the results from the "lsrResult" return object.
  let list = res.data.lsrResult;
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
  //place the "newList" element into state
  const returnObj = newList;
  //   return the resulting list to the RunLiveSearch function above
  return returnObj;
};

export default RunLiveSearch;
