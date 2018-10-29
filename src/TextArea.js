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
        <p className="label">{this.props.label} </p>
        <p className='input-error'>{this.props.error} </p>
        <textarea className="textarea"
          id={this.props.name}
          name={this.props.name}
          onChange={this.props.onChange}
          value={this.props.value}
          rows={this.props.rows}
          cols={this.props.cols}
        />
        { this.props.lsr ? (
        <div id={lsr} className="search-result">{this.props.lsr}</div>
        ) : ( null )}
      </div>
    );
  }
}

export default TextArea;