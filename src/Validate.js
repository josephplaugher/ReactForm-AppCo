import moment from 'moment'
import Ajax from './Ajax';

class validate {
    constructor(inputs){
        this.error = ({});
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
                default:
                    break;
            }
        }
        }
    }

    getPromise = () => {
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