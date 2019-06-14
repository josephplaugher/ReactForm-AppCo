import React from 'react'

class Select extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		const options = this.props.options.map((option) => (
			<option key={option} value={option}>
				{option}
			</option>
		))

		var multiple
		if (this.props.multiple) {
			multiple = 'multiple'
		} else {
			multiple = ''
		}
		return (
			<div className='rfa_select-container'>
				<p className='rfa_label'>{this.props.label} </p>
				<p className='rfa_input-error'>{this.props.error} </p>
				<select
					className='rfa_select'
					id={this.props.name}
					name={this.props.name}
					value={this.props.value}
					onChange={this.props.onChange}
					{...multiple}
				>
					{options}
				</select>
			</div>
		)
	}
}

export default Select
