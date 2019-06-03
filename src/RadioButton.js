import React from 'react'

class RadioButton extends React.Component {
	render() {
		//make the password field type "password" so its contents are hidden
		let type
		if (this.props.name === 'password') {
			type = 'password'
		} else {
			type = '"text"'
		}
		let lsr = 'lsr' + this.props.name

		let autoC
		if (this.props.autoComplete === true) {
			autoC = 'on'
		} else {
			autoC = 'off'
		}

		return (
			<div className='rfa_input-container'>
				<p className='rfa_label'>{this.props.label} </p>
				<p className='rfa_input-error'>{this.props.error} </p>
				<input
					type={type}
					id={this.props.id}
					name={this.props.name}
					value={this.props.value}
					onChange={this.props.onChange}
					autoComplete={autoC}
					className='rfa_textinput'
				/>
				{this.props.lsr ? (
					<div id={lsr} className='rfa_search-result'>
						{this.props.lsr}
					</div>
				) : null}
			</div>
		)
	}
}

export default RadioButton
