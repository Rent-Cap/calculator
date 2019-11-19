import React from 'react'
import MyDocument from './MyDocument';
import { PDFViewer } from '@react-pdf/renderer';
import { handleInput } from '../Helpers'
import withRedux from '../withRedux'
import { Link } from 'gatsby'

class GenerateLetter extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tenant: '',
      landlord: '',
      refundOverride: 0
    }
    this.handleInput = handleInput.bind(this);
  }
  render() {
    const { refund } = this.props
    return (
      <div>
        <h2>What's your name?</h2>
        <input value={this.state.tenant} type="text" onChange={(e) => this.handleInput('tenant', e)}></input>
        <h2>What's your landlord's name?</h2>
        <input value={this.state.landlord} onChange={(e) => this.handleInput('landlord', e)}></input>
        <h2>How much is owed? {refund ? '(Value from' : ''} <Link to="/calculator">calculator</Link>{refund ? `: ${refund})` : ''}</h2>
        <input value={this.state.refundOverride} onChange={(e) => this.handleInput('refundOverride', e)}></input>
        <h1>Send this letter to your landlord:</h1>
        { typeof window != 'undefined' && 
          <PDFViewer>
            <MyDocument tenant={this.state.tenant} landlord={this.state.landlord} refund={this.state.refundOverride || refund}></MyDocument>
          </PDFViewer>
        }
        <br />
        <small>To download the pdf, right click on the PDF Viewer above and select 'Save As'</small>
      </div>
    )
  }
}

export default withRedux(GenerateLetter)