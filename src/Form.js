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
            targetfield: ''
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.lsrSelect = this.lsrSelect.bind(this);
        this.submitData = this.submitData.bind(this);
        this.restoreInputHandler = this.restoreInputHandler.bind(this);
    }

    componentDidMount = () => {
        var inputs = {}
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
            lsSource: lsSource,
            targetfield: lsSource
        });
        //place updated data into state
        this.rebuildFormData(name, value, lsSource);
       
        //run live search if applicable to current input, not othewise
        const ls = new LiveSearch(this.props.lsa);
        const list = ls.getLSA();
        if (list.includes(name)) {
            //console.log('about to runLiveSearch: ',name, value, lsSource)
            this.runLiveSearch(ls, name, value, lsSource);
        }
    }

    rebuildFormData = (name, value, lsSource) => {
        //place updated data into state
        //check for possible arrays
        let newVals = Object.assign({}, this.state.formData);
        newVals[name] = value;
        this.setState({
            [name]: value,
            lsSource: name,
            formData: newVals
        });
    }

    runLiveSearch(ls, name, value, lsSource) {
        //get a list of options as the user types ,like Google live search
        //set the name of the location to place the search result. The inputs must have a "lsr={this.state.lsr}""
        let targetfield = lsSource;
        //console.log('why array? ', targetfield)
        //first, if the input change leaves the field blank,
        //clear the options list
        if (value === '') {
            this.setState({
                [targetfield]: ''
            });
        //if the input value is not blank, fetch the options
        } else {
            if (ls.getLSA().includes(name)) {
                let prom = ls.search(name, value, this.props.lsrURL);
                prom.then((res) => {
                    //console.log('search result: ', res)
                    //run the function to build the react component
                    //that contains the result set.
                    //takes the result of the ajax reques and
                    //the name of the field in question
                    this.setLSRList(res, [targetfield][0]);
                })
            }
        }//else
    }

    setLSRList(res, targetfield) {
        //console.log('lsr result: ', res, 'target field: ', targetfield)
        //if there is no result, set a message for that, else, set the results into state
        var list = res.data.lsrResult;
        var newList;
        if (list === undefined) {
            newList = res.data.noResult;
        } else {
            newList = list.map((item) =>
                <p className="lsr" onClick={(event) => this.lsrSelect(event)} id={item[Object.keys(item)[0]]}>{item[Object.keys(item)[0]]}</p>
            );
        }
        console.log('the target field: ', targetfield, 'ls result: ', list)
        //place the "list" value into state
        this.setState({
            targetfield: targetfield,
            lsr: newList
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
            //console.log('val error?', error)
            if (error.hasError) {
                this.setState({
                    userNotify: error,
                    validForm: false
                })
            }else {
                //console.log('no errors')
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

        //console.log('before bodydata: ', this.state.formData)
        if(typeof this.props.extraData !== 'undefined') {
            bodyData = Object.assign(this.props.extraData, this.state.formData);
        } else {
            bodyData = this.state.formData;
        }
        //console.log('after bodydata: ', bodyData)
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
                error: this.state.userNotify[child.props.name],
                lsr: this.state.lsr,
                targetfield: this.state.targetfield
            })
        );
            
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