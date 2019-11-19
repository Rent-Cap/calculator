import React from 'react'
import Disclaimer from '../components/Disclaimer';
import { PrimaryButton, SecondaryButton, SuccessButton, DangerButton } from '../components/Buttons'
import { withTranslation } from 'react-i18next';
import { handleInput } from '../Helpers'
import GenerateLetter from '../components/GenerateLetter';
import withRedux from '../withRedux';
import Layout from '../components/Layout'

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
      rentIncreases: [{id: 0, date: '', value: 0}]
    }
    this.handleInput = handleInput.bind(this)
    this.addRentIncrease = this.addRentIncrease.bind(this)
    this.removeRentIncrease = this.removeRentIncrease.bind(this)
    this.calculateRentIncreasePercentage = this.calculateRentIncreasePercentage.bind(this)
    this.calculateMaxRent = this.calculateMaxRent.bind(this)
    this.handleRentIncreaseValueChange = this.handleRentIncreaseValueChange.bind(this)
    this.handleRentIncreaseDateChange = this.handleRentIncreaseDateChange.bind(this)
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
    t.splice(idx, 1)
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
    const { t, refund, changeRefund } = this.props
    const maxRent = this.calculateMaxRent();
    const rentIncreasePercentage = this.calculateRentIncreasePercentage();
    const updateRefund = () => {
      const t = parseFloat(this.state.currentRent - maxRent).toFixed(2)
      changeRefund(t)
    }
    // TODO: This is not a performant solution because it will update every render.
    // Instead, put all vars the refund relies on (currentRent, maxRent, any rent increases, etc)
    // and have the refund as a calculated value from those other values. 
    updateRefund()

    const that = this;
    const rentIncreases = this.state.rentIncreases.map(rent => {
      return (
        <li key={rent.id}>
          {this.state.rentIncreases.length > 1 &&
            <DangerButton className="remove" onClick={() => that.removeRentIncrease(rent.id)}>&times;</DangerButton>
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
      <Layout>
        <h1>{t('calculator-title')}</h1>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Where do you live?</h5>
            <select data-toggle="dropdown" onChange={(e) => this.handleInput('cpi', e)}>
              <option value="0.033" label="Select your location"></option>
              <option value="0.04" label="Oakland-Hayward-San Francisco"></option>
              <option value="0.033" label="Los Angeles-Long Beach-Anaheim"></option>
              <option value="0.022" label="San Diego-Carlsbad"></option>
              <option value="0.028" label="Riverside-San Bernardino-Ontario"></option>
              <option value="0.033" label="Other"></option>
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
        <PrimaryButton onClick={() => this.setState({showSection: true})}>Was I overcharged?</PrimaryButton>
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
                <SecondaryButton onClick={() => this.setState({showRentIncrease: true})}>Yes</SecondaryButton><SecondaryButton onClick={() => this.setState({showRentIncrease: false})}>No</SecondaryButton>
                {this.state.showRentIncrease &&
                  <section className="rent-increases">
                    <ul>{rentIncreases}</ul>
                    <SuccessButton className="add" onClick={this.addRentIncrease}>+</SuccessButton>
                  </section>
                }
              </div>
            </div>
            <br />
            <h4>Your rent increased by {rentIncreasePercentage}%. Your maximum rent is {maxRent} and you should be refunded ${refund}</h4>
            <Disclaimer />
            <br />
            <br />
            <PrimaryButton onClick={() => this.setState({showLetter: true})}>Generate a letter to your landlord</PrimaryButton>
          </section>
        }
        {this.state.showLetter &&
          <GenerateLetter/>
        }
      </Layout>
    )
  }
}

export default withRedux(withTranslation()(Calculator))
