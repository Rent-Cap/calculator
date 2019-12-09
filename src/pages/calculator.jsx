import React from 'react';
import { withTranslation } from 'react-i18next';
import { DateRangePicker } from 'react-dates';
import moment from 'moment';
import Disclaimer from '../components/Disclaimer';
import {
  PrimaryButton, SuccessButton, DangerButton, PrimaryButton2,
} from '../components/Buttons';
import { handleInput, calculateTotalAmountOwedToTenant, calculateMaxRent } from '../Helpers';
import GenerateLetter from '../components/GenerateLetter';
import withRedux from '../withRedux';
import Layout from '../components/Layout';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import SEO from '../components/Seo';
import MailChimp from '../components/MailChimp'
import './calculator.css'

const emptyRentRange1 = {
  rent: 0,
  startDate: moment([2019, 2, 15]),
  endDate: moment([2019, 2, 15]),
  focusedInput: null,
  id: 0,
};
const emptyRentRange2 = {
  rent: 0,
  startDate: moment([2020, 0, 1]),
  endDate: moment([2020, 1, 1]),
  focusedInput: null,
  id: 1,
};

const INITIAL_SELECTION = 'Which region best describes where you live?'

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pastRent: undefined,
      currentRent: 0,
      cpi: 0.033,
      showSection: false,
      showLetter: false,
      showCpiDropdown: false,
      hideMailChimp: true,
      cpiSelection: INITIAL_SELECTION,
      rentRanges: [emptyRentRange1, emptyRentRange2],
    };
    this.handleInput = handleInput.bind(this);
    this.handlePastRentChange = this.handlePastRentChange.bind(this);
    this.addRentRange = this.addRentRange.bind(this);
    this.removeRentRange = this.removeRentRange.bind(this);
    this.calculateRentIncreasePercentage = this.calculateRentIncreasePercentage.bind(this);
    this.handleRentRangeValueChange = this.handleRentRangeValueChange.bind(this);
    this.handleRentRangeDateChange = this.handleRentRangeDateChange.bind(this);
    this.handleFocusChange = this.handleFocusChange.bind(this);
  }

  addRentRange() {
    const t = this.state.rentRanges.slice(0);
    const r = { ...emptyRentRange2 };
    r.startDate = moment(t[t.length - 1].endDate);
    r.endDate = moment(t[t.length - 1].endDate).add(1, 'months', true);
    r.id = +new Date();
    t.push(r);
    r.rent = 0;
    this.setState(() => ({ rentRanges: t }));
  }

  handleRentRangeDateChange(e, idx) {
    const t = this.state.rentRanges.slice(0);
    t[idx].startDate = e.startDate || t[idx].startDate;
    t[idx].endDate = e.endDate || t[idx].endDate;
    // const janFirst2020 = moment([2020, 0, 1])
    // const diff = t[idx].endDate.diff(janFirst2020, 'months', true)
    // t[idx].totalMonthsPaidAfterJan2020 = diff > 0 ? diff : 0
    this.setState(() => ({ rentRanges: t }));
  }

  handleRentRangeValueChange(e, idx) {
    const t = this.state.rentRanges.slice(0);
    t[idx].rent = e.target.value;
    if (idx === 0) {
      this.setState({ pastRent: t[idx].rent });
    }
    this.setState({ rentRanges: t });
    const temp = calculateTotalAmountOwedToTenant(t, this.state.cpi);
    this.props.changeRefund(temp);
  }

  handlePastRentChange(e) {
    this.setState({ pastRent: e.target.value });
    this.handleRentRangeValueChange(e, 0);
  }

  removeRentRange(idx) {
    const t = this.state.rentRanges.slice(0);
    if (t.length < 2) return;
    t.splice(idx, 1);
    this.setState({ rentRanges: t });
  }

  calculateRentIncreasePercentage() {
    return parseFloat(((this.state.currentRent - this.state.pastRent) / this.state.pastRent) * 100)
      .toFixed(0);
  }

  handleFocusChange(focusedInput, idx) {
    const t = this.state.rentRanges.slice(0);
    t[idx].focusedInput = focusedInput;
    this.setState({ rentRanges: t });
  }

  render() {
    const { t, refund } = this.props;
    const maxRent = calculateMaxRent(this.state.pastRent, this.state.cpi);
    const { rentRanges } = this.state;
    const that = this;
    const rentRangeList = rentRanges.map((rent, idx) => (
      <li key={rent.id}>
        {idx > 1
            && <DangerButton className="remove" onClick={() => that.removeRentRange(idx)}>&times;</DangerButton>}
        {idx === 0
          ? (
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text"><strong>Rent on March 15, 2019</strong></span>
              </div>
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text">$</span>
                </div>
                <input type="number" value={this.state.pastRent} className="form-control" placeholder="Rent on March 15, 2019" onChange={(e) => this.handleRentRangeValueChange(e, idx)} />
              </div>
            </div>
          ) : (
            <div className="rent-input">
              <div className="input-group mb-3">
                <div className="input-group-prepend">
                  <span className="input-group-text">$</span>
                </div>
                <input type="number" className="form-control" placeholder="Monthly Rent" onChange={(e) => this.handleRentRangeValueChange(e, idx)} />
              </div>
              <DateRangePicker
                endDate={rentRanges[idx].endDate}
                endDateId="endDate"
                focusedInput={rentRanges[idx].focusedInput}
                isOutsideRange={() => null}
                onDatesChange={(e) => this.handleRentRangeDateChange(e, idx)}
                onFocusChange={(e) => this.handleFocusChange(e, idx)}
                startDate={rentRanges[idx].startDate}
                startDateId="startDate"
                orientation="vertical"
              />
            </div>
          )}
      </li>
    ));
    return (
      <Layout>
        <SEO title="Calculator" />
        <h1>{t('calculator-title')}</h1>
        <div className="calculator-description">
          <p>
            Renters eligible for protection under the Tenant Protection Act are protected against
            rent increases that exceed 10% in a one year period or the cost of living + 5%,
            whichever is lower. If you have received a rent increase you can use our calculator
            to help you determine what the allowable increase is under the law, and if your rent
            increase exceeds the limit.
            Eligible renters who got a rent increase anytime on or after March 15, 2019
            should use the rent calculator, as increases in 2019 may be rolled back
            resulting in a rent reduction.
          </p>
          {this.state.hideMailChimp
            ? (
              <PrimaryButton onClick={() => this.setState({ hideMailChimp: false })}>
                I am interested in signing up to learn more
              </PrimaryButton>
            ) : (
              <MailChimp />
            )}
        </div>
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Where do you live?</h5>
            <div className="dropdown">
              <button onClick={() => { this.setState({ showCpiDropdown: !this.state.showCpiDropdown }); }} className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {this.state.cpiSelection}
              </button>
              <div style={{ display: this.state.showCpiDropdown ? 'block' : 'none' }} className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <a
                  onClick={() => {
                    this.setState({
                      showCpiDropdown: !this.state.showCpiDropdown,
                      cpiSelection: 'Oakland-Hayward-San Francisco',
                      cpi: 0.04,
                    });
                  }}
                  className="dropdown-item"
                >
Oakland-Hayward-San Francisco
                </a>
                <a
                  onClick={() => {
                    this.setState({
                      showCpiDropdown: !this.state.showCpiDropdown,
                      cpiSelection: 'Los Angeles-Long Beach-Anaheim',
                      cpi: 0.033,
                    });
                  }}
                  className="dropdown-item"
                >
Los Angeles-Long Beach-Anaheim
                </a>
                <a
                  onClick={() => {
                    this.setState({
                      showCpiDropdown: !this.state.showCpiDropdown,
                      cpiSelection: 'San Diego-Carlsbad',
                      cpi: 0.022,
                    });
                  }}
                  className="dropdown-item"
                >
San Diego-Carlsbad
                </a>
                <a
                  onClick={() => {
                    this.setState({
                      showCpiDropdown: !this.state.showCpiDropdown,
                      cpiSelection: 'Riverside-San Bernardino-Ontario',
                      cpi: 0.028,
                    });
                  }}
                  className="dropdown-item"
                >
Riverside-San Bernardino-Ontario
                </a>
                <a
                  onClick={() => {
                    this.setState({
                      showCpiDropdown: !this.state.showCpiDropdown,
                      cpiSelection: 'Any other region of California',
                      cpi: 0.033,
                    });
                  }}
                  className="dropdown-item"
                >
Any other region of California
                </a>
              </div>
            </div>
            <br />
            <h5>What was your rent on or since March 15, 2019?</h5>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text">$</span>
              </div>
              <input
                type="number"
                className="form-control"
                value={this.state.pastRent}
                placeholder="Monthly Rent"
                onChange={(e) => this.handlePastRentChange(e)}
              />
            </div>
          </div>
        </div>
        <br />
        <br />
        {this.state.pastRent > 0
          ? (
            <ul className="calculator-results">
              <li>
                <h4>Max Increase</h4>
                <h3>
                  {parseFloat((0.05 + parseFloat(this.state.cpi)) * 100).toFixed(2)}%
                </h3>
                <small>5% Base + {parseFloat(this.state.cpi * 100).toFixed(2)}% CPI</small>
                <br />
                <small><strong>{this.state.cpiSelection !== INITIAL_SELECTION ? this.state.cpiSelection : ''}</strong></small>
              </li>
              <li>
                <h4>Allowable Rent</h4>
                <h3>${maxRent}</h3>
                <small>Beginning Jan 1, 2020</small>
              </li>
            </ul>
          ) : (
            <h4>Your results will show here after you input your rent.</h4>
          )}
        <Disclaimer />
        <br />
        <br />
        {this.state.showSection
          ? (
            <h4>
              Enter your information below to determine how much money
              you may be owed as a rollback.
            </h4>
          ) : (
            <PrimaryButton2 style={{ width: '100%' }} onClick={() => this.setState({ showSection: true })}>
              Was I overcharged?
            </PrimaryButton2>
          )}
        <br />
        {this.state.showSection
          && (
          <section>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Enter your rent history from January 1st, 2020 to now.</h5>
                <section className="rent-increases">
                  <ul>{rentRangeList}</ul>
                  <SuccessButton className="add" onClick={this.addRentRange}>+</SuccessButton>
                </section>
              </div>
            </div>
            <br />
            <h4>
Based on the information provided, you may be owed $
              {refund}
            </h4>
            <br />
            {/* <PrimaryButton onClick={() => this.setState({showLetter: true})}>
            Generate a letter to your landlord</PrimaryButton> */}
          </section>
          )}
        {this.state.showLetter
          && <GenerateLetter />}
      </Layout>
    );
  }
}

export default withRedux(withTranslation()(Calculator));
