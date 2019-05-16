ReactForm-AppCo is a full featured form building component for React.JS
Detailed usage instructions to come.

######Installation

```
npm install reactform-appco
```

######Basic Usage
At first glance, the primary class in this package, FormClass, appears to violate a principal of React.
The React developers strongly urge users NOT to use inheritence with React.Component, but rather to use
composition to build the UI. This is what what FormClass does. FormClass does not render anything to the UI. When you extend FormClass, you are bringing the logic that helps to effortlessly process user forms into
the existing rendered UI. You must extend FormClass for all of this to work.
The Input, Button and TextArea components are additional features that make it easy to build your form inputs.
They do in fact render to the UI. You can use FormClass with your own input and button components by
including the same props described below on your own components.

```
import React from 'react'
import { FormClass, Input, Button } from 'reactform-appco'
import ValRules from 'Util/ValRules'

class App extends FormClass {
	constructor(props) {
		super(props)
            //Set this to false to turn off live search.
            //Set this to true to turn it on. you can have dropdown
            //menus populate with values from your database as you type,
            //much like when searching with Google.
		this.useLiveSearch = false
            //This is the endpoint you want this form to submit to.
		this.route = '[your-webapp-usr]/login or [your-API-route]'
            //This is your form validation file. It is required.
            //In this example a ValRules object is imported above.
		this.valRules = ValRules
            //These are the required state item. You can add others as needed.
		this.state = {
			isLoggedIn: false,
			userData: {},
			email: '',
			password: ''
		}
        this.response = this.response.bind(this)
	}

    response(resp) {
        //your code goes here
    }


	render() {
		return (
			<div id='sign-in'>
			    <p>Sign In</p>
				<form onSubmit={this.rfa_onSubmit} >
                  <Input name="email" label="Email" value={this.state.email} onChange={this.rfa_onChange} autoComplete={true}/>
                  <Input name="password" label="Password" value={this.state.password} onChange={this.rfa_onChange} />
                  <div className="rfa_button-div">
                    <Button id="submit" value="Sign In" />
                  </div>
                </form>
			</div>
		)
	}
}

export default App

```

######Input Component: Specific Usage
There are a few properties the Input compent will accept.
name: will contain the name of the input upon form submission
label: label will be what the user sees as a titel for the input
value: must be the state object for that input. I.E., the value prop for the "email" input must
be "this.state.email".
onChange: to use the functionality in the FormClass, onChange must equal "this.fra_onChange".
If it is not, the form will not receive and process the input.
AutoComplete: accepts a boolean. Allows the browser to autofill a value from a previous instance of input.

######Validation Errors
Errors from form validation will be place in state according to the name of each input. To show validation
errors, you need to include "error={this.state.userNotify.[input name]}".
So on the email input it would be "error={this.state.userNotify.email}".

######Live Search
You can designate an input to include Live Search functionality by including the propery lsr={this.state.lsr[input name]} (lsr = live search result).
So if you were searching for a username or a list of usernames, you would include "lsr={this.state.lsrusername}" as property on the username input.
For this to work, you also must specifiy the following:

```
this.useLiveSearch = true //turns on the live search functionality.
this.lsRoute = [your-live-search-api-endpoint] //endpoint where your API will return the results needed
this.lsa = ['store','item'] //an array that controlls which inputs the module will attempt to perform a live search for. This is necessary to prevent executing the Live Search function on inputs that don't need it,
thus making unnecesary state changes. If the name of the input is in that array, Live Search will run whenever the input changes. Otherwise it will not.
```

######Live Search API Configuration.
The ReactForm-Appco module will send a get request to your API endpoint as follows:

```
[your-webapp-api] + "/name/" + [input-name] + "/value/" + [input-value], [{your-headers}]
```

An example request when searching for someone with username "Johnny" would be:

```
https://mywebapp.com/name/username/value/Johnny
The headers portion accepts an object with whatever headers you need to send. Often with Single Page Apps
we need to send a user token. ReactForm-Appco sends any httpsOnly cookies with each request by default.
```

ReactForm-Appco's Live Search feature accepts an array of search results (simple to retrieve with most database resolvers) and will render that array as a selectable list below the subject input. Once you click a result, it will populate the input and clear the list.

######Other Input Components
There is also a TextArea component that you can use instead of building your own. Simple usage is as follows.
The props are all the same as on the Input components

```
<TextArea
	name="comment"
	label="Leave a comment"
	className="my-class-name"
	value={this.state.comment}
	onChange={this.rfa_onChange}
/>
```

Finally, a Button component.

```
<Button
	name="button-name"
	id="submit"
	value="Sign In"
	onClick={myClickHandlerFunction}
/>
```

######CSS and Styles
To style the componets, includw styles in your css files as follows:

```
.rfa_input-container {
	//Your styles here. This controls the overall styles for the Input's parent div.
}

.rfa_textinput {
	//Your styles here. This controls the look of the input element itsself.
}

.rfa_label {
	//Your styles here. This controls to the appearance and position of the input labels.
}

.rfa_input-error {
	//Your styles here.
	//This controls the appearance of input-specific error messages delivered from validation.
}

.rfa_search-result {
	//Your styles here. This controls the look of the selectable search result list
}
```
