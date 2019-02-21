import React from 'react'
import Validate from './Validate'
import Ajax from './Ajax'
import LiveSearch from './LiveSearch'

class FormClass extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      table: [],
      userNotify: {},
      formData: {}
    };
    this.route = '';
    this.rfa_onSubmit = this.rfa_onSubmit.bind(this);
    this.rfa_onChange = this.rfa_onChange.bind(this);
    this.lsrSelect = this.lsrSelect.bind(this);
    this.submitData = this.submitData.bind(this);
  }

  rfa_onChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    var lsSource = [name][0];
    //clear the error on resume typing
    let clEr = Object.assign({}, this.state.userNotify);
    clEr[name] = '';
    this.setState({
      userNotify: clEr,
      lsSource: lsSource
    });
    //place updated data into state
    this.rebuildFormData(name,value,lsSource);
    //run live seach if its turned on in the descendant class
    if(this.useLiveSearch) {
      let ls = new LiveSearch(this.lsa);
      let list = ls.getLSA(); 
      //run live search if applicable to current input, not othewise
      if(list.includes(name)){
        this.runLiveSearch(name, value, lsSource,ls);
      }
    }
  }

  rebuildFormData = (name,value,lsSource) => {
    //place updated data into state
    let newVals = Object.assign({}, this.state.formData);
    newVals[name] = value;
    this.setState({
      [name]: value,
      lsSource: name,
      formData: newVals
    });
  }

  runLiveSearch(name, value, lsSource,ls) {
    //get a list of options as the user types ,like Google live search
    //set the name of the location to place the search result. The inputs must have a "lsr={this.state.lsr[inputname]}""
    let targetField = 'lsr' + lsSource;
    let list = ls.getLSA(); 
    //first, if the input change leaves the field blank, clear the options list
    if(value === ''){
      this.setState({
        [targetField]: ''
      });
    //if the input value is not blank, fetch the options
    }else{
      if(list.includes(name)){
        let prom = ls.search(name, value,this.lsRoute);
        prom.then( (res) => {
          this.setLSRList(res,targetField);
        })
      }
    }//else
  }

  setLSRList(res, targetField) {
    //if there is not result, set a message for that, else, set the results into state
    let list = res.data.lsrResult;
    let newList;
    if(res.data.nr){ 
      newList = res.data.nr;
    }else{
      newList = list.map((item) => 
          <p className="lsr" 
            onClick={(event) => this.lsrSelect(event)} 
            id={item[Object.keys(item)[0]]} 
            key={item[Object.keys(item)[0]]}
          >
          {item[Object.keys(item)[0]]}
          </p>
       );
    }
    //place the "list" value into state
      this.setState({
        [targetField]: newList
      });
  }

  lsrSelect = (event) => {  
    //get the value of the clicked search result and place it into the form field
    //then clear the search result list
    let input = this.state.lsSource;
    let toClear = 'lsr' + [input];
    this.setState({
      [toClear]: ''
    });
    this.rebuildFormData(input,event.target.id,input);
    // this.autoFill(input, event.target.id);
  }

  // autoFill = (id, val) => {
  //   const autofill = new AutoFill();
  //   var dest = autofill.getRef(id);
  //   Ajax.get(this.autoFillRoute + "/" + id + "/"+ val)
  //   .then((res) => {
  //     if(res.data.results){
  //       let obj = res.data.results;
  //       let val;
  //       for(var key in obj) {
  //         val = obj[key];
  //       }
  //       this.rebuildFormData(dest,val);
  //     }
  //   })
  // }

  rfa_onSubmit = (event) => {
    event.preventDefault();
    console.log('submit', this.state.formData)
    let val = new Validate(this.state.formData, this.valRules);
    let prom = val.isError();
    prom.then( (error) => {
        if(error.hasError){ 
          console.log('error: ', error)
          this.setState({
            userNotify: error,
            validForm: false
          })
        }
        if(!error.hasError){
          console.log('no error')
          this.setState({
            validForm: true
          })
          this.submitData();
        }
      }) 
  }

  submitData = () => {
    console.log('submit data')
    let bodyData;
    if(typeof this.extraData !== 'undefined') {
        bodyData = Object.assign(this.extraData, this.state.formData);
    } else {
        bodyData = this.state.formData;
    }
    Ajax.post(this.route, bodyData)
    .then((res) => {
      this.response(res)
    })
  }

  //controlls for the light box on most pages
  closeLightBox = () => {
    this.setState({dataView: false});
  }
}

export default FormClass;