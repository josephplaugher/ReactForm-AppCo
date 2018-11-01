import React from 'react';

class TextArea extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {

    if(this.props.lsr) {
      var lsr = 'lsr' + this.props.name;
    }

    return (
      <div className="input-container">
        <p className={this.props.labelClass}>{this.props.label} </p><br />
         <textarea className="textarea"
          id={this.props.name}
          name={this.props.name}
          onChange={this.props.onChange}
          value={this.props.value}
          rows={this.props.rows}
          cols={this.props.cols}
        />
        <p className={this.props.textAreaErrorClass}>{this.props.error} </p>
        { this.props.lsr ? (
        <div id={lsr} className="search-result">{this.props.lsr}</div>
        ) : ( null )}
      </div>
    );
  }
}

export default TextArea;