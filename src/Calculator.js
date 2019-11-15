import React from 'react'
import { connect } from 'react-redux';

const Disclaimer = () => {
  return (
    <small>This does not consider local rent control ordinances, please check <a href="#">here</a> for your local laws.</small>
  )
}

const Letter = (props) => {
  const currentDate = new Date().toDateString();
  return (
    <section>
      <p>Dear {props.landlord || '________________'},</p>
      <p>According to (bill name) my rent is higher than laws allow. I am owed a refund of ${props.refund}.</p>
      <p>Thank you,</p>
      <p>{props.tenant || '________________'}</p>
      <p>{currentDate}</p>
    </section>
  )
}

class Calculator extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pastRent: 0,
      currentRent: 0,
      maxRent: 0,
      cpi: 0.033,
      showSection: false,
      showRentIncrease: false,
      showLetter: false,
      tenant: '',
      landlord: '',
      rentIncreases: [{id: 0, date: '', value: 0}]
    }
    this.handleInput = this.handleInput.bind(this)
    this.addRentIncrease = this.addRentIncrease.bind(this)
    this.removeRentIncrease = this.removeRentIncrease.bind(this)
    this.calculateRentIncreasePercentage = this.calculateRentIncreasePercentage.bind(this)
    this.calculateMaxRent = this.calculateMaxRent.bind(this)
    this.handleRentIncreaseValueChange = this.handleRentIncreaseValueChange.bind(this)
    this.handleRentIncreaseDateChange = this.handleRentIncreaseDateChange.bind(this)
  }
  handleInput(key, event) {
    const obj = {}
    obj[key] = event.target.value
    this.setState(obj)
  }
  addRentIncrease() {
    const t = this.state.rentIncreases.slice(0)
    t.push({id: +new Date(), date: '', value: 0})
    this.setState({rentIncreases: t})
  }
  handleRentIncreaseDateChange(id, e) {
    // TODO
  }
  handleRentIncreaseValueChange(id, e) {
    const t = this.state.rentIncreases.slice(0)
    const idx = t.findIndex(el => el.id === id)
    if (idx < 0) return
    t[idx].value = e.target.value
    this.setState({rentIncreases: t})
  }
  removeRentIncrease(id) {
    const arr = this.state.rentIncreases
    if (arr.length < 2) return
    const idx = arr.findIndex(el => el.id === id)
    if (idx < 0) return
    const t = this.state.rentIncreases.slice(0)
    const el = t.splice(idx, 1)
    this.setState({rentIncreases: t})
  }
  calculateMaxRent() {
    const plusTenPercent = this.state.pastRent * 1.1
    const cpiCalc = this.state.pastRent * (1 + 0.05 + parseFloat(this.state.cpi))
    const min = Math.min(plusTenPercent, cpiCalc)
    return parseFloat(min).toFixed(2)
  }
  calculateRentIncreasePercentage() {
    return parseFloat((this.state.currentRent - this.state.pastRent)/this.state.pastRent * 100).toFixed(0);
  }
  
  render() {
    const text = this.props.languages[this.props.language]

    const maxRent = this.calculateMaxRent();
    const rentIncreasePercentage = this.calculateRentIncreasePercentage();
    const refund = () => {
      const t = parseFloat(this.state.currentRent - maxRent).toFixed(2)
      return t > 0 ? t : '0'
    }
    const that = this;
    const rentIncreases = this.state.rentIncreases.map(rent => {
      return (
        <li key={rent.id}>
          {this.state.rentIncreases.length > 1 &&
            <button className="remove" onClick={() => that.removeRentIncrease(rent.id)}>x</button>
          }
          <div>
            <h3>When was the rent increase?</h3>
            <input onChange={(e) => that.handleRentIncreaseDateChange(rent.id, e)} type="date"></input> 
            <h3>What was the new rent?</h3>
            <input onChange={(e) => this.handleRentIncreaseValueChange(rent.id, e)}></input>
          </div>
        </li>
      )
    })
    return (
      <div>
        <h1>{text.calculator.title}</h1>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Where do you live?</h5>
            <select onChange={(e) => this.handleInput('cpi', e)}>
              <option value="0.033" label="Select your location"></option>
              <option value="0.04" label="Oakland-Hayward-San Francisco"></option>
              <option value="0.033" label="Los Angeles-Long Beach-Anaheim"></option>
            </select>
          </div>
        </div>
        <br />
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">What was your rent on March 15, 2019?</h5>
            <input type='number' value={this.state.pastRent} onChange={(e) => this.handleInput('pastRent', e)}></input>
          </div>
        </div>
        <br />
        <h4>Your maximum rent should be <strong>${maxRent}</strong></h4>
        <Disclaimer />
        <br />
        <br />
        <button className="btn btn-outline-primary" onClick={() => this.setState({showSection: true})}>Was I overcharged?</button>
        <br />
        {this.state.showSection &&
          <section>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">What is your current rent?</h5>
                <input type='number' value={this.state.currentRent} onChange={(e) => this.handleInput('currentRent', e)}></input>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Did your rent increase within the year (between March 15th and now)?</h5>
                <button onClick={() => this.setState({showRentIncrease: true})}>Yes</button><button onClick={() => this.setState({showRentIncrease: false})}>No</button>
                {this.state.showRentIncrease &&
                  <section className="rent-increases">
                    <ul>{rentIncreases}</ul>
                    <button className="add" onClick={this.addRentIncrease}>+</button>
                  </section>
                }
              </div>
            </div>
            <br />
            <h4>Your rent increased by {rentIncreasePercentage}%. Your maximum rent is {maxRent} and you should be refunded ${refund()}</h4>
            <Disclaimer />
            <br />
            <br />
            <button onClick={() => this.setState({showLetter: true})}>Generate a letter to your landlord
            </button>
          </section>
        }
        {this.state.showLetter &&
          <div>
            <h2>What's your name?</h2>
            <input value={this.state.tenant} type="text" onChange={(e) => this.handleInput('tenant', e)}></input>
            <h2>What's your landlord's name?</h2>
            <input value={this.state.landlord} onChange={(e) => this.handleInput('landlord', e)}></input>
            <h1>Send this letter to your landlord:</h1>
            <Letter tenant={this.state.tenant} landlord={this.state.landlord} refund={refund()}></Letter>
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = state => {
  return ({
    languages: state.languages,
    language: state.language
  })
};

export default connect(mapStateToProps)(Calculator);
