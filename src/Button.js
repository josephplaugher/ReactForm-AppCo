import React from 'react';

class Button extends React.Component {
    
    render() {
        return (
            <input className={this.props.className}
                type={this.props.type}
                name={this.props.name}
                id={this.props.id}
                value={this.props.value}
                onClick={this.props.onClick}
            />
        )
    }
}

Button.defaultProps = {
    className: 'submit',
    type: 'submit',
    id: 'submit',
    value: 'button',
    onClick: null
}

export default Button;