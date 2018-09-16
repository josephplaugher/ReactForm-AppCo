import React from 'react';

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = { readOnlyVal: ''}
  }
  static displayname = 'ReadOnlyInput';

  componentDidMount = () => {
    this.setState({readOnlyVal: this.props.readOnlyVal})
  }

  render() {

    //make the password field type "password" so its contents are hidden
    var type;
    if (this.props.name === 'password') {
      type = 'password';
    } else {
      type = '"text"';
    }

    return (
      <div className="input-container">
        <p className="label">{this.props.label} </p>
        <p className='input-error'>{this.props.error} </p>
        <input className="textinput"
          type={type}
          id={this.props.name}
          name={this.props.name}
          value={this.props.readOnlyVal}
          autoComplete="off"
        />
      </div>
    );
  }
}

export default Input;