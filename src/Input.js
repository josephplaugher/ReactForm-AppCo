import React from 'react';

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {list: ''};
  }

  componentWillUpdate = () => {
    if(this.props.targetfield === this.props.name) {
    console.log('in input comp: target field prop:', this.props.targetfield,' this component name: ', this.props.name, ' lsr: ', this.props.lsr)
    }
  }

  render() {

    //make the password field type "password" so its contents are hidden
    var type;
    if (this.props.name === 'password') {
      type = 'password';
    } else {
      type = '"text"';
    }
    /*
    if (this.props.lsr) {
      var lsr = 'lsr' + this.props.name;
    }
    */

    //if the targetField prop matches the name prop, 
    //populate this.state.list with the search results
    {this.props.targetfield === this.props.name ? (
      () => {
        console.log('live search in Input running')
        console.log('the result set: ', this.props.lsr)
        var List = this.props.lsr.map((list) =>
          <div id={list} className="search-result">{list}</div>
        )
        this.setState({list: List})
      }
    ) : ( null )}

    return (
      <div className="input-container">
        <p className={this.props.labelClass}>{this.props.label} </p>
        <p className={this.props.errorClass}>{this.props.error} </p>
        <input className="textinput"
          type={type}
          id={this.props.name}
          name={this.props.name}
          value={this.props.prePopVal || this.props.value}
          onChange={this.props.onChange}
          autoComplete="off"
        />
        <div>{this.state.list}</div>
      </div>
    )
  }
}

export default Input;