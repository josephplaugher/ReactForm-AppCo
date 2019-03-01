import React from "react";
import Validate from "./Validate";
import Ajax from "./Ajax";
import LiveSearch from "./LiveSearch";

class FormClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userNotify: {},
      formData: {}
    };
    this.route = "";
    this.rfa_onSubmit = this.rfa_onSubmit.bind(this);
    this.rfa_onChange = this.rfa_onChange.bind(this);
    this.lsrSelect = this.lsrSelect.bind(this);
    this.submitData = this.submitData.bind(this);
  }

  rfa_onChange = event => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    var lsSource = [name][0];
    //clear any previously set errors on resume typing
    let clEr = Object.assign({}, this.state.userNotify);
    clEr[name] = "";
    this.setState({
      userNotify: clEr,
      lsSource: lsSource
    });
    //place updated data into state
    this.rebuildFormData(name, value, lsSource);
    //run live seach if its turned on in the descendant class
    if (this.useLiveSearch) {
      let ls = new LiveSearch(this.lsa);
      let list = ls.getLSA();
      //run live search if applicable to current input, not othewise
      if (list.includes(name)) {
        this.runLiveSearch(name, value, lsSource, ls);
      }
    }
  };

  rebuildFormData = (name, value, lsSource) => {
    //place updated data into state
    let newVals = Object.assign({}, this.state.formData);
    newVals[name] = value;
    this.setState({
      [name]: value,
      lsSource: name,
      formData: newVals
    });
  };

  runLiveSearch(name, value, lsSource, ls) {
    //get a list of options as the user types,like when using Google to search.
    //set the name of the location to place the search result.
    //The inputs must have a "lsr={this.state.lsr[inputname]}" property
    let targetField = "lsr" + lsSource;
    let list = ls.getLSA();
    //first, if the input change leaves the field blank, clear the options list
    if (value === "") {
      this.setState({
        [targetField]: ""
      });
      //if the input value is not blank, fetch the options
    } else {
      if (list.includes(name)) {
        // get the options from the database
        let prom = ls.search(name, value, this.lsRoute, this.rfa_headers);
        prom.then(res => {
          // place the options into state in a result set component
          this.setLSRList(res, targetField);
        });
      }
    } //else
  }

  setLSRList(res, targetField) {
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
    this.setState({
      [targetField]: newList
    });
  }

  lsrSelect = event => {
    //get the value of the clicked search result and place it into the form field
    //then clear the search result list
    let input = this.state.lsSource;
    let toClear = "lsr" + [input];
    this.setState({
      [toClear]: ""
    });
    //update the form state with the newly selected value from the live search
    this.rebuildFormData(input, event.target.id, input);
  };

  rfa_onSubmit = event => {
    // begin the form submission process
    event.preventDefault();
    console.log("submit", this.state.formData);
    // run user side form data validation, this will be repeated on the server
    let val = new Validate(this.state.formData, this.valRules);
    let prom = val.isError();
    prom.then(error => {
      if (error.hasError) {
        if (
          this.valRules.mode === "debug" ||
          this.valRules.mode === "development"
        ) {
          console.log(
            `ReactForm-AppCo Validation Error 
          (this message will only occur in debug or development mode): `,
            error
          );
        }
        //set the error object onto the application input
        this.setState({
          userNotify: error
        });
      }
      if (!error.hasError) {
        if (
          this.valRules.mode === "debug" ||
          this.valRules.mode === "development"
        ) {
          console.log(`ReactForm-AppCo Validation: No errors`);
        }
        //when no errors exist, go ahead and submit the form
        this.submitData();
      }
    });
  };

  submitData = () => {
    console.log("formclass");
    let bodyData;
    //if there is other data that needs to be sent with form submission
    // but won't be provided via an input
    // add it to the "extraData" state object.
    if (typeof this.extraData !== "undefined") {
      bodyData = Object.assign(this.extraData, this.state.formData);
    } else {
      bodyData = this.state.formData;
    }
    Ajax.post(this.route, bodyData, this.rfa_headers).then(res => {
      this.response(res);
    });
  };
}

export default FormClass;
