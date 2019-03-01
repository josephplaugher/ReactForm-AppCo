import React from "react";
import OnChange from "./OnChange";
import RunLiveSearch from "./RunLiveSearch";
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
    let newState = OnChange(event, this.state.userNotify);
    this.setState({
      userNotify: newState.userNotify,
      lsSource: newState.lsSource
    });
    //place updated data into state
    this.rebuildFormData(
      newState.rebuildFormData.name,
      newState.rebuildFormData.value,
      newState.rebuildFormData.lsSource
    );
    //run live seach if its turned on in the descendant class
    if (this.useLiveSearch) {
      console.log("use live search ");

      let ls = new LiveSearch(this.lsa);
      let list = ls.getLSA();
      //run live search if applicable to current input, not othewise
      if (list.includes(event.target.name)) {
        console.log("ls source: ", newState.lsSource);
        var searchRes = RunLiveSearch(
          event.target.name,
          event.target.value,
          newState.lsSource,
          ls,
          this.lsRoute,
          this.rfa_headers
        );
        let tf = searchRes.targetField;
        this.setState({
          [tf]: searchRes.newList
        });
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
