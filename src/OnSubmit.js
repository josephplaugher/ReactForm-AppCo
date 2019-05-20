import Validate from './Validate'

const OnSubmit = (formData, valRules) => {
	return new Promise((resolve, reject) => {
		// begin the form submission process
		// run user side form data validation, this will be repeated on the server
		let val = new Validate(formData, valRules)
		let prom = val.isError()
		prom.then((error) => {
			if (error.hasError) {
				//   only console log the errors in not in production mode
				if (
					valRules.settings.mode === 'debug' ||
					valRules.settings.mode === 'development'
				) {
					valRules.settings.log.dev({
						ReactForm_AppCo_Validation_Errors: error,
						rules_enforced: valRules.rules
					})
				}
				if (valRules.settings.mode === 'production') {
					valRules.settings.log.prod({
						ReactForm_AppCo_Validation_Errors: error,
						rules_enforced: valRules.rules
					})
				}
				//set the error object onto the application input
				var returnObj = {
					userNotify: error,
					validForm: false //this controlls whether form is submitted
				}
				resolve(returnObj)
			}
			if (!error.hasError) {
				if (
					valRules.settings.mode === 'debug' ||
					valRules.settings.mode === 'development'
				) {
					console.log(`ReactForm-AppCo Validation: No errors`)
				}
				if (valRules.settings.mode === 'production') {
					valRules.settings.log.prod(`ReactForm-AppCo Validation: No errors`)
				}
				//when no errors exist, go ahead and submit the form
				var returnObj = {
					userNotify: {}, //clear the error object
					validForm: true //this controlls whether form is submitted
				}
				resolve(returnObj)
			}
		})
	})
}

export default OnSubmit
