import React from 'react';
import Validate from './Validate'
import Ajax from './Ajax'
import LiveSearch from './LiveSearch'

class Form extends React.Component {
    constructor(props) {
        super();
        this.state = {
            error: {},
            userNotify: {},
            formData: {},
            lsr: {}, //live search result. list of value from live search
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.lsrSelect = this.lsrSelect.bind(this);
        //this.isArray = this.isArray.bind(this);
        this.submitData = this.submitData.bind(this);
        this.restoreInputHandler = this.restoreInputHandler.bind(this);
    }

    componentDidMount = () => {
        let inputs ={}
        React.Children.map(this.props.children, child => {
            if(child.type.name === 'Input' || child.type.name === 'TextArea') {
                inputs[child.props.name] = '';
            }
        });        
        this.setState({ formData: inputs});
    }

    onChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        var lsSource = [name][0];
        //clear the error on resume typing
        this.setState({
            userNotify: {},
            lsSource: lsSource
        });
        //place updated data into state
        this.rebuildFormData(name, value, lsSource);
       
        //run live search if applicable to current input, not othewise
        //let ls = new LiveSearch();
        //let list = ls.getLSA();
        //if (list.includes(name)) {
          //  this.runLiveSearch(name, value, lsSource);
        //}
    }

    rebuildFormData = (name, value, lsSource) => {
        console.log('rebuild: ', name, value)
        //place updated data into state
        //check for possible arrays
        //let isArray = this.isArray(name, value);
        let newVals = Object.assign({}, this.state.formData);
        newVals[name] = value;
        this.setState({
            [name]: value,
            lsSource: name,
            formData: newVals
        });
    }

    /*
    isArray = (name, value) => {
        let a = this.state.formData;
        for(input in a){
            if(name === input) {
                    var newArray = [];
                    newArray.push(a[name]);
                    newArray.push(value);
            }
        }
    }
*/
    runLiveSearch(name, value, lsSource) {
        //get a list of options as the user types ,like Google live search
        //set the name of the location to place the search result. The inputs must have a "lsr={this.state.lsr}""
        let targetField = 'lsr' + lsSource;
        let ls = new LiveSearch();
        let list = ls.getLSA();
        //first, if the input change leaves the field blank, clear the options list
        if (value === '') {
            this.setState({
                [targetField]: ''
            });
            //if the input value is not blank, fetch the options
        } else {
            if (list.includes(name)) {
                let prom = ls.search(name, value, this.props.lsrURL);
                prom.then((res) => {
                    this.setLSRList(res, targetField);
                })
            }
        }//else
    }

    setLSRList(res, targetField) {
        //if there is not result, set a message for that, else, set the results into state
        let list = res.data.results;
        let newList;
        if (res.data.nr) {
            newList = res.data.nr;
        } else {
            newList = list.map((item) =>
                <p className="lsr" onClick={(event) => this.lsrSelect(event)} id={item[Object.keys(item)[0]]}>{item[Object.keys(item)[0]]}</p>
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
        this.rebuildFormData(input, event.target.id, input);
        this.autoFill(input, event.target.id);
    }

    autoFill = (id, val) => {
        const autofill = new AutoFill();
        var dest = autofill.getRef(id);
        Ajax.get("http://localhost:3004/autofill/" + id + "/" + val)
            .then((res) => {
                if (res.data.results) {
                    let obj = res.data.results;
                    let val;
                    for (var key in obj) {
                        val = obj[key];
                    }
                    this.rebuildFormData(dest, val);
                }
            })
    }

    onSubmit = (event) => {
        event.preventDefault();
        let val = new Validate(this.state.formData, this.props.valrules);
        let prom = val.isError();
        prom.then((error) => {
            console.log('val error?', error)
            if (error.hasError) {
                this.setState({
                    userNotify: error,
                    validForm: false
                })
            }else {
                this.setState({
                    validForm: true,
                    userNotify: {}
                })
                this.submitData();
            }
        })
    }

    submitData = () => {
        let bodyData;
        if(typeof this.props.extraData !== 'undefined') {
            bodyData = Object.assign(this.props.extraData, this.state.formData);
        } else {
            bodyData = this.state.formData;
        }
        Ajax.post(this.props.action, bodyData)
            .then((resp) => {
                if (typeof resp.data.error == 'undefined') {
                    if (this.props.clearOnSubmit === 'false') {
                        this.setState({
                                
                                userNotify: {}
                            });
                    } else {
                        this.setState({
                                formData: {},
                                userNotify: {},
                                value: '', //clear the input fields
                                restoreValue: this.state.value //set the current value state in another object to restore later
                            });
                    }
                    this.restoreInputHandler();
                    this.props.response(resp.data);
                } else {
                    this.setState({
                        userNotify: resp.data.error
                    });
                }
            });
    }

    restoreInputHandler = () => {
        this.setState({
            value: this.state.restoreValue //restore the value state back to the value object
        });
    }
 
    render() {
        const inputs = React.Children.map(this.props.children, child =>
            React.cloneElement(child, {
                value: this.state.value,
                onChange: this.onChange,
                error: this.state.userNotify[child.props.name]
            })
        );

        //React.Children.map(this.props.children, child => this.getInitialInputs(child))
            
        return (
            <div id="form-container">
                <p className="formTitle">{this.props.formTitle}</p>
                <form id={this.props.formID} onSubmit={this.onSubmit} >
                    {inputs} {/*there must be nested input components passed in*/}
                </form>
            </div>
        )
    };
}

export default Form;