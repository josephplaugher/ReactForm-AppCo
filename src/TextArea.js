import React from 'react'

class TextArea extends React.Component {
	constructor(props) {
		super(props)
	}
	render() {
		return (
			<div className='rfa_input-container'>
				<p className='rfa_textarea-label'>{this.props.label} </p>
				<br />
				<textarea
					className='rfa_textarea'
					id={this.props.id}
					name={this.props.name}
					onChange={this.props.onChange}
					value={this.props.value}
					rows={this.props.rows}
					cols={this.props.cols}
				/>
				<p className='rfa_input-error'>{this.props.error} </p>
			</div>
		)
	}
}

export default TextArea
