import React from 'react'
import Disclaimer from '../components/Disclaimer';
import { PrimaryButton, SecondaryButton, SuccessButton, DangerButton } from '../components/Buttons'
import { withTranslation } from 'react-i18next';
import { handleInput, calculateTotalAmountOwedToTenant, calculateMaxRent } from '../Helpers'
import GenerateLetter from '../components/GenerateLetter';
import withRedux from '../withRedux';
import Layout from '../components/Layout'
import { DateRangePicker } from 'react-dates';
import moment from 'moment'
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

const emptyRentRange1 = {rent: 0, startDate: moment('3-15-2019'), endDate: moment('3-15-2019').add(1, 'months', true), focusedInput: null, id: 0, totalMonthsPaid: 1}
const emptyRentRange2 = {rent: 0, startDate: moment('4-15-2019'), endDate: moment(), focusedInput: null, id: 1, totalMonthsPaid: 1}

class Calculator extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pastRent: 0,
      currentRent: 0,
      cpi: 0.033,
      showSection: false,
      showRentIncrease: false,
      showLetter: false,
      rentRanges: [emptyRentRange1, emptyRentRange2]
    }
    this.handleInput = handleInput.bind(this)
    this.addRentRange = this.addRentRange.bind(this)
    this.removeRentRange = this.removeRentRange.bind(this)
    this.calculateRentIncreasePercentage = this.calculateRentIncreasePercentage.bind(this)
    this.handleRentRangeValueChange = this.handleRentRangeValueChange.bind(this)
    this.handleRentRangeDateChange = this.handleRentRangeDateChange.bind(this)
    this.handleDateChange = this.handleDateChange.bind(this)
    this.handleFocusChange = this.handleFocusChange.bind(this)
  }
  addRentRange(e) {
    const t = this.state.rentRanges.slice(0)
    const r = Object.assign({}, emptyRentRange2)
    r.id = +new Date()
    t.push(r)
    this.setState({rentRanges: t})
  }
  handleRentRangeDateChange(e, idx) {
    const t = this.state.rentRanges.slice(0)
    t[idx].startDate = e.startDate || t[idx].startDate
    t[idx].endDate = e.endDate || t[idx].endDate
    t[idx].totalMonthsPaid = t[idx].endDate.diff(t[idx].startDate, 'months', true)
    this.setState({rentRanges: t})
  }
  handleRentRangeValueChange(e, idx) {
    const t = this.state.rentRanges.slice(0)
    t[idx].rent = e.target.value
    this.setState({rentRanges: t})
  }
  removeRentRange(idx) {
    const t = this.state.rentRanges.slice(0)
    if (t.length < 2) return
    t.splice(idx, 1)
    this.setState({rentRanges: t})
  }
  calculateRentIncreasePercentage() {
    return parseFloat((this.state.currentRent - this.state.pastRent)/this.state.pastRent * 100).toFixed(0);
  }
  handleDateChange({ startDate, endDate }, idx) {
    this.setState({ startDate, endDate });
  }
  handleFocusChange(focusedInput, idx) {
    const t = this.state.rentRanges.slice(0)
    t[idx].focusedInput = focusedInput
    this.setState({ rentRanges: t });
  }
  
  render() {
    const { t, refund, changeRefund } = this.props
    const maxRent = calculateMaxRent(this.state.pastRent, this.state.cpi);
    const rentIncreasePercentage = this.calculateRentIncreasePercentage();
    const updateRefund = () => {
      const t = calculateTotalAmountOwedToTenant(this.state.rentRanges, this.state.cpi)
      changeRefund(t)
    }
    // TODO: This is not a performant solution because it will update every render.
    // Instead, put all vars the refund relies on (currentRent, maxRent, any rent increases, etc)
    // and have the refund as a calculated value from those other values. 
    updateRefund()
    const rentRanges = this.state.rentRanges
    const that = this;
    const rentRangeList = rentRanges.map((rent, idx) => {
      return (
        <li key={rent.id}>
          {idx > 1 &&
            <DangerButton className="remove" onClick={() => that.removeRentRange(idx)}>&times;</DangerButton>
          }
          <div>
            Rent: $<input type="number" onChange={(e) => this.handleRentRangeValueChange(e, idx)}></input>
            <DateRangePicker
              endDate={rentRanges[idx].endDate}
              endDateId="endDate"
              focusedInput={rentRanges[idx].focusedInput}
              isOutsideRange={() => null}
              onDatesChange={(e) => this.handleRentRangeDateChange(e, idx)}
              onFocusChange={(e) => this.handleFocusChange(e, idx)}
              startDate={rentRanges[idx].startDate}
              startDateId="startDate"
            />
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
            <select name="cpi-picker" onChange={(e) => this.handleInput('cpi', e)}>
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
                <input type="number" value={this.state.currentRent} onChange={(e) => this.handleInput('currentRent', e)}></input>
                <br />
                <h4>Your rent increased by {rentIncreasePercentage}%. Your maximum rent is {maxRent}. Enter your rent information below to calculate a potential refund</h4>
              </div>
            </div>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Enter your rent history from March 15, 2019 to now.</h5>
                <section className="rent-increases">
                  <ul>{rentRangeList}</ul>
                  <SuccessButton className="add" onClick={this.addRentRange}>+</SuccessButton>
                </section>
              </div>
            </div>
            <br />
              <h4>Based on the information provided, you may be owed ${refund}</h4>
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
