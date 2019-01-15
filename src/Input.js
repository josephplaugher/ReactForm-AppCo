import React from 'react';

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {list: ''};
  }

  render() {

    //make the password field type "password" so its contents are hidden
    var type;
    if (this.props.name === 'password') {
      type = 'password';
    } else {
      type = '"text"';
    }

    //if the targetField prop matches the name prop, 
    //populate List with the search results
    if(this.props.targetfield === this.props.name) {
      var List = this.props.lsr.map((item) =>
          <p className="lsr" onClick={(event) => this.props.lsrSelect(event)} 
              id={item[Object.keys(item)[0]]} 
              key={item[Object.keys(item)[0]]}>{item[Object.keys(item)[1]]}
          </p>
        );
    }

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
        <div id="liveSearchResult" className="search-result">{List}</div>
      </div>
    )
  }
}

export default Input;