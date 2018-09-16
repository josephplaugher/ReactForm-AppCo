import React from 'react';

class Input extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {

    //make the password field type "password" so its contents are hidden
    var type;
    if (this.props.name === 'password') {
      type = 'password';
    } else {
      type = '"text"';
    }
    if(this.props.lsr) {
      var lsr = 'lsr' + this.props.name;
    }

    return (
      <div className="input-container">
        <p className={this.props.labelClass}>{this.props.label} </p>
        <p className={this.props.errorClass}>{this.props.error} </p>
        <input className="textinput"
          type={type}
          id={this.props.name}
          name={this.props.name}
          value={this.props.value}
          onChange={this.props.onChange}
          autoComplete="off"
        />
        { this.props.lsr ? (
        <div id={lsr} className="search-result">{this.props.lsr}</div>
        ) : ( null )}
      </div>
    );
  }
}

export default Input;