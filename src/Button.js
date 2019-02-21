import React from 'react';

class Button extends React.Component {

    render() {
        return (
            <input className="rfa_submit" 
                type="submit" 
                name={this.props.name}
                id={this.props.id} 
                value={this.props.value}
                onClick={this.props.onClick}
            />   
        )
    }
}

export default Button;