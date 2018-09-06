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
        this.route = '';
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        this.lsrSelect = this.lsrSelect.bind(this);
        this.submitData = this.submitData.bind(this);
    }

    onChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        var lsSource = [name][0];
        console.log('field: ', name, 'value: ', value);
        //clear the error on resume typing
        let clEr = Object.assign({}, this.state.userNotify);
        clEr[name] = '';
        this.setState({
            userNotify: clEr,
            lsSource: lsSource
        });
        //place updated data into state
        this.rebuildFormData(name, value, lsSource);
        //run live search if applicable to current input, not othewise
        let ls = new LiveSearch();
        let list = ls.getLSA();
        if (list.includes(name)) {
            this.runLiveSearch(name, value, lsSource);
        }
    }

    rebuildFormData = (name, value, lsSource) => {
        //place updated data into state
        let newVals = Object.assign({}, this.state.formData);
        newVals[name] = value;
        this.setState({
            [name]: value,
            lsSource: name,
            formData: newVals
        });
    }

    runLiveSearch(name, value, lsSource) {
        //get a list of options as the user types ,like Google live search
        //set the name of the location to place the search result. The inputs must have a "lsr={this.state.lsr}""
        let targetField = 'lsr' + lsSource;
        let ls = new LiveSearch();
        let list = ls.getLSA();
        console.log('list: ', list);
        //first, if the input change leaves the field blank, clear the options list
        if (value === '') {
            this.setState({
                [targetField]: ''
            });
            //if the input value is not blank, fetch the options
        } else {
            if (list.includes(name)) {
                let prom = ls.search(name, value);
                prom.then((res) => {
                    this.setLSRList(res, targetField);
                })
            }
        }//else
    }

    setLSRList(res, targetField) {
        console.log('lsr:', res);
        //if there is not result, set a message for that, else, set the results into state
        let list = res.data.results;
        let newList;
        if (res.data.nr) {
            newList = res.data.nr;
        } else {
            newList = list.map((item) =>
                <p className="lsr" onClick={(event) => this.lsrSelect(event)} id={item[Object.keys(item)[0]]}>{item[Object.keys(item)[0]]}</p>
            );
            console.log('new list:', newList);
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
        console.log('dest: ', dest);
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
        console.log('reactform submit...');
        event.preventDefault();
        let val = new Validate(this.state.formData);
        let prom = val.getPromise();
        prom.then((error) => {
            console.log('the error: ', error);
            if (error.hasError) {
                this.setState({
                    userNotify: error,
                    validForm: false
                })
            }
            if (!error.hasError) {
                this.setState({
                    validForm: true
                })
                console.log('about to submit...');
                this.submitData();
            }
        })
    }

    submitData = () => {
        console.log('submitting now...');
        Ajax.post(this.props.route, this.state.formData)
            .then((res) => {
                if (res.data.success) {
                    this.setState({
                        success: res.data.success,
                        userNotify: res.data.userNotify
                    })
                }
            })
    }



render() {
    const inputs = React.Children.map(this.props.children, child => 
        React.cloneElement(child, {
            value: this.state.value,
            onChange: this.onChange,
            error: this.userNotify
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