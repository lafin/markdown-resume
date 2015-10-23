/* global marked, jsPDF */

import React from 'react';
import ReactDOM, { findDOMNode } from 'react-dom';

import {
  Button,
  FormInput
} from 'elemental';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: localStorage.getItem('state') || 'Type some ***markdown*** here!'
    };
  }

  handleChange(event) {
    const value = event.target.value;
    this.setState({
      value: value,
    });
    localStorage.setItem('state', value);
  }

  handleExport() {
    const doc = new jsPDF();
    const preview = findDOMNode(this.refs.preview).innerHTML;
    doc.fromHTML(preview, 15, 15, {
      width: 170,
    }, () => {
      doc.save();
    });
  }

  render() {
    return (<div style={{height: '100%'}}>
      <div className="header">
        <Button style={{margin: '8px'}} onClick={this.handleExport.bind(this)}>Export to PDF</Button>
      </div>
      <div className="main">
        <FormInput className="content left" placeholder="Type some ***markdown*** here!" onChange={this.handleChange.bind(this)} defaultValue={this.state.value} multiline />
        <div className="content right" ref="preview" dangerouslySetInnerHTML={{__html: marked(this.state.value || '', {sanitize: true})}}></div>
      </div>
    </div>);
  }
}

ReactDOM.render(<Main />, document.getElementById('app'));
