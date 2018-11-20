class validate {
    constructor(inputs, valRules){
        this.error = {};
        this.inputs = inputs;
        this.valRules = valRules;
        this.preValidation();
        this.startValidation();
    }

    preValidation = () => {
        //console.log('the rueles', this.valRules)
        return this.valRules.mode === 'debug' ? console.log('validation module running in debug mode. No rules will be enforced') 
        :   this.valRules.mode === 'development' ? this.valRules.log.dev('Validation running in development mode')
        :   this.valRules.mode === 'production' ? this.valRules.log.prod('Validation running in production mode')
        //only start validation if not in debug mode
        :   this.valRules.mode !== 'debug' ?  this.startValidation()
        :   this.valRules.log.dev(null)
    }

    startValidation = () => {
        //console.log('starting validation')
        for(var name in this.inputs) {
            this.valRules.forEach(rule => {
                if(name === rule.name) {
                    this.check(name, this.inputs[name],rule)
                }
            });
        }
    }

    check = (name, val, rule) => {
        //check that required fields for not empty
        if(rule.required && val.length < 1) {
            this.setErrorMessage(name, rule.errorMsg);
        }
        //check that custom matching expressions are met
        if(rule.hasOwnProperty('match')) {
            this.match(val, rule.match) ? true : this.setErrorMessage(name, rule.errorMsg);
        }
        //check for alphanumeric/string only input
        if(rule.hasOwnProperty('alphanumeric')) {
            this.alphanumeric(val) ? true : this.setErrorMessage(name, rule.errorMsg);
        }
        //check for numeric only input
        if(rule.hasOwnProperty('numeric')) {
            this.numeric(val) ? true : this.setErrorMessage(name, rule.errorMsg);
        }
        //check for decimal format input
        if(rule.hasOwnProperty('decimal')) {
            this.isFloat(val) ? true : this.setErrorMessage(name, rule.errorMsg);
        }
        //check for undesired characters
        if(rule.hasOwnProperty('restricted')) {
            this.restricted(val,rule.restricted) ? true : this.setErrorMessage(name, rule.errorMsg);
        }
        //check for valid email format if specified
        if(rule.hasOwnProperty('email')) {
            this.isEmail(val) ? true : this.setErrorMessage(name, rule.errorMsg);
        }
    }

    setErrorMessage = (name, msg) => {
        let newEr = Object.assign({}, this.error);
        newEr[name] = msg;
        this.error = newEr;
    }

    match = (val, expression) => {
        return expression.test(String(val).toLowerCase())
    }

    alphanumeric = (val) => {
        return isNaN(val);
    }

    numeric = (val) => {
        return (typeof val == 'number')
    }

    restricted = (val, characters) => {
        //not sure how to do this. come back to it
        return val.test(characters)
    }

    isEmail = (email) => {
        const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        return expression.test(String(email).toLowerCase())
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

    isFloat = (n) => {
        var numNum = +n;
        if (isNaN(numNum)){ 
            return false;
        }
    }


}

export default validate;