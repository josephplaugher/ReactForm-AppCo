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
      <div className="rfa_input-container">
        <p className={this.props.labelClass}>{this.props.label} </p><br />
         <textarea className="rfa_textarea"
          id={this.props.id}
          name={this.props.name}
          onChange={this.props.onChange}
          value={this.props.value}
          rows={this.props.rows}
          cols={this.props.cols}
        />
        <p className="rfa_textarea-errror-class">{this.props.error} </p>
        { this.props.lsr ? (
        <div id={lsr} className="rfa_search-result">{this.props.lsr}</div>
        ) : ( null )}
      </div>
    );
  }
}

export default TextArea;