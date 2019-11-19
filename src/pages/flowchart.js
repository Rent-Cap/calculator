import React from 'react'
import { PrimaryButton, SecondaryButton } from '../components/Buttons'
import { withTranslation } from 'react-i18next';
import Layout from '../components/Layout'

class FlowChart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      noRentControl: false,
      overFifteen: false,
      eligible: 'unknown',
      buildingType: 'unknown',
    }
    this.setEligible = this.setEligible.bind(this)
  }
  setEligible() {
    if (!this.state.overFifteen ||
        this.state.buildingType === 'dorm')
      this.setState({eligible: 'no'})
    else
      this.setState({eligible: 'unknown'})
  }
  render() {
    const { t } = this.props
    const setOverFifteen = val => {
      this.setState({overFifteen: val}, () => {
        this.setEligible()
      });
    }
    const setBuildingType = type => {
      this.setState({buildingType: type}, () => {
        this.setEligible()
      });
    }
    const buildingList = [
      {name: 'Apartment', type: 'apartment'},
      {name: 'House', type:'house'},
      {name: 'Dorm', type: 'dorm'},
      {name: 'TODO: Add more building types', type: 'none'}
    ]
    const buildings = buildingList.map(building => {
      return (
        <li style={{cursor: 'pointer'}} className={building.type === this.state.buildingType ? 'active' : ''} onClick={() => setBuildingType(building.type)} key={building.name}>{building.name}</li>
      )
    })
    return (
      <Layout>
        <h1>{t('eligible-title')}</h1>
        <h2>Does your city have existing ordinance</h2>
        <ul>
          <li><a href="https://www.cityofberkeley.info/Rent_Stabilization_Board/Home/Guide_to_Rent_Control.aspx" rel="noopener noreferrer" target="_blank">Berkeley</a></li>
          <li><a href="https://sfrb.org/ordinance-regulations" rel="noopener noreferrer" target="_blank">San Francisco</a></li>
          <li>TODO: Add more cities here.</li>
        </ul>
        <PrimaryButton onClick={() => this.setState({noRentControl: true})}>My city is not listed OR it has less protections than the statewide law.</PrimaryButton>
        {this.state.noRentControl &&
          <div>
            <h2>Is your building over 15 years old?</h2>
            <div>
              <SecondaryButton onClick={() => {setOverFifteen(true)}}>Yes</SecondaryButton>
              <SecondaryButton onClick={() => {setOverFifteen(false)}}>No</SecondaryButton>
            </div>
          </div>
        }
        {this.state.overFifteen &&
          <div>
            <h2>What type of building is it?</h2>
            <ul>
              {buildings}
            </ul>
          </div>
          
        }
        {this.state.eligible === 'no' &&
          <h1>Sorry, you are not eligible</h1>
        }
        {this.state.eligible === 'yes' &&
          <h1>Congrats, you are eligible</h1>
        }
      </Layout>
    )
  }
}

export default withTranslation()(FlowChart);