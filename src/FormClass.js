import React from "react";
import OnChange from "./OnChange";
import OnSubmit from "./OnSubmit";
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
    this.rebuildFormData(
      newState.rebuildFormData.name,
      newState.rebuildFormData.value,
      newState.userNotify
    );
    //run live seach if its turned on in the descendant class
    if (this.useLiveSearch) {
      let ls = new LiveSearch(this.lsa);
      let list = ls.getLSA();
      //run live search if applicable to current input, not othewise
      if (list.includes(event.target.name)) {
        const name = event.target.name;
        var targetField = "lsr" + [name][0];
        var setList = ls.search(
          event.target.name,
          event.target.value,
          this.lsRoute,
          this.rfa_headers,
          this.lsrSelect
        );
        setList.then(newList => {
          this.setState({
            [targetField]: newList,
            //set lsSource to be used later in the lsrSelect callback
            lsSource: newState.lsSource
          });
        });
      }
    }
  };

  rebuildFormData = (name, value, userNotify) => {
    //place updated data into state
    let newVals = Object.assign({}, this.state.formData);
    newVals[name] = value;
    this.setState({
      [name]: value,
      formData: newVals,
      userNotify: userNotify
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
    this.rebuildFormData(input, event.target.id, "");
  };

  rfa_onSubmit = event => {
    event.preventDefault();
    // on user submit, run validation and either clear
    // user error messages or set new ones
    var Submit = OnSubmit(this.state.formData, this.valRules);
    Submit.then(submit => {
      if (submit.validForm === true) {
        // validForm is set to true is no errors exist
        // and the submit data function is called
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
