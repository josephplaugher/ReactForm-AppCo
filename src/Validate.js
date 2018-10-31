import moment from 'moment'
import Ajax from './Ajax';

class validate {
    constructor(inputs, valRules){
        this.error = ({});
        this.valRules = valRules;
        this.checkVals(inputs);
    }

    checkVals = (input) => {
        for(var name in input) {
        if(input.hasOwnProperty(name)){
            var val = input[name];//place the input value in the 'val' variable
            switch(name) {
                case 'date':
                case 'startdate':
                case 'enddate':
                    if( val.length < 1 ){ this.requiredMessage(name); }
                    let check = moment(val);
                    if(check.isValid() === false){ this.errorMessage(name,'Date must be in format: [YYY-MM-DD]'); }
                    break;
                case 'amount':
                    if(val.length < 1 ){ this.requiredMessage(name); }
                    if(this.isFloat(val) === false){ this.errorMessage(name,'This field must be a dollar value'); }
                    break;
                case 'email':
                    if(this.isEmail(val) !== true){ this.errorMessage(name, 'That is not a valid email address')}
                    break;
                default:
                    break;
            }
        }
        }
    }

    isError = () => {
        return new Promise( (resolve, reject) => {
            if(Object.keys(this.error).length === 0 && this.error.constructor === Object){
                this.error.hasError = false;
            }else{
                this.error.hasError = true;
            }   
            resolve(this.error);
        });
    }

    requiredMessage = (name) => {
        let newEr = Object.assign({}, this.error);
        newEr[name] = name + ' is a required field';
        this.error = newEr;
        console.log('test');
    }

    isEmail = (email) => {
        const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    
        return expression.test(String(email).toLowerCase())
    }
    

    isFloat = (n) => {
        var numNum = +n;
        if (isNaN(numNum)){ 
            return false;
        }
    }

    errorMessage = (name, msg) => {
        let newEr = Object.assign({}, this.error);
        newEr[name] = msg;
        this.error = newEr;
    }

    checkCoaValue = (name,value,type) => {
        Ajax.post("http://localhost:3004/validateData/", {value: value, type:type})
            .then((res) => {
                if(res.data.error){
                    this.errorMessage(name, res.data.error);
                }
            });
    }

}

export default validate;