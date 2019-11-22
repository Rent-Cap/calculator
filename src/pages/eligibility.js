import React from 'react'
import Layout from '../components/Layout'
import { checkFlags } from '../Helpers'
function Question(text, order) {
  // https://stackoverflow.com/questions/8012002/create-a-unique-number-with-javascript-time
  this.id = new Date().valueOf().toString(36) + Math.random().toString(36).substr(2)
  this.text = text
  this.responseList = []
  this.active = false
  this.order = order || 0
}

// const template = new Question('', 0)
const q1 = new Question('Has everyone in your home lived in your building unit for at least 12 months?', 0)
const q2 = new Question('Is your building at least 15 years old? This applies to buildings built before January 1st, 2005. Not sure how old your building is? Check with your city’s planning department.', 2)
const q3 = new Question('Do you share a kitchen or bathroom with your landlord?', 2)
const q4 = new Question('How many units are there in your building or on the property? If you rent a room in a single-family home, click "One".', 3)
const q5 = new Question('Is your building owned by a corporation, real estate investment trust (REIT), or LLC in which at least one member is a corporation? Not sure who owns your building? Check with your city’s planning department.', 4)
const q5_2 = new Question('Do you rent a room in your landlord’s house/apartment or live in an ADU on your landlord’s property? An accessory dwelling unit (ADU) is an additional separate living space located on a property.', 4)
const q6 = new Question('Does your landlord live with you and is s/he currently renting out more than 2 rooms or accessory dwelling units? An accessory dwelling unit is an additional separate living space located on a property.', 5)
const q7 = new Question('Is a portion of your rent paid for by a government agency or with a housing voucher? Affordable housing units are exempt from the Tenant Protection Act.', 6)
const q8 = new Question('Has anyone in your building unit lived there for at least 24 months?', 1)
const q9 = new Question(' Is your building a dormitory connected to any higher education institutions? Buildings that were constructed and maintained by a higher education institution (i.e. University) for students to occupy are exempt from the Tenant Protection Act.', 7)
const q10 = new Question('Did your landlord live on the property prior to the start of your tenancy and does your landlord continue to reside on the property?', 7)
const temp = new Question('dependsOnState', 17)
// red
const conclusion1 = new Question('Unfortunately, your building is neither covered by rent control nor just-cause eviction protection from the Tenant Protections Act.', 17)
// blue
const conclusion2 = new Question('Your building is not covered by rent control from the Tenant Protection Act. Fortunately, your building is covered by the just-cause eviction protection! Click here for a list of just-cause reasons for eviction.', 17)
// yellow
const conclusion3 = new Question('Your building is covered by rent control from the Tenant Protection Act. However, your building is not covered by the just-cause eviction protection.', 17)
// green
const conclusion4 = new Question('Great news! Your building is covered by both rent control and just-cause eviction protection from the Tenant Protection Act! Click here for a list of just-cause reasons for eviction.', 17)

q1.active = true
q1.responseList = [{ value: q2, label: 'Yes', flags: [['first-q', 'yes']]}, { value: q8, label: 'No', flags: [['first-q', 'no']] }]
q2.responseList = [{ value: q3, label: 'Yes', flags: [['#2', 'yes']]}, { value: conclusion1, label: 'No', flags: [['#2', 'no']]}]
// NOTE: if 'no' then no just-cause eviction protection
q3.responseList = [{ value: q4, label: 'Yes', flags: [['kitchen-q', 'no']] }, { value: q4, label: 'No', flags: [['kitchen-q', 'no']] }]
q4.responseList = [{ value: q5,label: 'One' }, { label: 'Two', value: q10 }, { label: 'Three or more', value: temp }]
q5.responseList = [{ label: 'Yes', value: q5_2 }, { value: conclusion1, label: 'No'}]
q5_2.responseList = [{ label: 'Yes', value: q6, flags:[['property-q', 'yes']] }, { value: conclusion1, label: 'No', flags:[['property-q', 'no']] }]
// NOTE: If no, then no just-cause eviction protection
q6.responseList = [{ label: 'Yes', value: q7, flags: [['adu-q', 'yes']] }, { label: 'No', value: q7, flags: [['adu-q', 'no']] }]
q7.responseList = [{ label: 'Yes', value: temp, flags: [['voucher-q', 'yes']] }, { label: 'No', value: q9, flags: [['voucher-q', 'no']] }]
q8.responseList = [{ label: 'Yes', value: q2 }, { label: 'No', value: q2, flags: [['no-just', 'yes']] }]
q9.responseList = [{ label: 'Yes', value: temp }, { label: 'No', value: temp }]
q10.responseList = [{ label: 'Yes', value: temp }, { label: 'No', value: temp }]

// NOTE: ALWAYS keep temp in the last index
const questions = [q1, q2, q3, q4, q5, q5_2, q6, q7, q8, q9, q10, conclusion1, conclusion2, conclusion3, conclusion4, temp]

class Eligibility extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // WARNING: Adding more state vars will require modifying setActiveFromFlags (we assume other state vars are flags)
      questions
    }
    this.handleClick = this.handleClick.bind(this)
  }
  setFlag(flag, value, callback) {
    if (!flag) return

    const obj = {}
    obj[flag] = value
    this.setState(obj, () => {
      if (callback) {
        callback()
      }
    })
  }

  handleClick(questionIdx, responseIdx) {
    const q = this.state.questions.slice(0)
    const question = q[questionIdx]
    const response = question.responseList[responseIdx]

    question.responseList.forEach(r => r.active = false)
    response.active = true

    const setActiveFromFlags = () => {
      const q = this.state.questions.slice(0)
      const flags = {}
      Object.keys(this.state).forEach(key => {
        if (key !== 'questions') {
          flags[key] = this.state[key]
        }
      })
      if (checkFlags([['voucher-q', 'and', 'not', 'first-q', 'and', 'not', '#2'], 'or', ['voucher-q', 'and', 'kitchen-q'], 'or', ['voucher-q', 'and', 'not', 'adu-q']], flags)) {
        // red
        q[q.length - 1].text = conclusion1.text
      }
      if (checkFlags([['voucher-q', 'and', 'first-q', 'or', '#2'], 'and', ['not', 'property-q', 'and', 'kitchen-q'], 'or', ['not', 'adu-q']], flags)) {
        // blue
        q[q.length - 1].text = conclusion2.text
      }
      this.setState({ questions: q })
    }
    const deactivateChildren = root => {
      if (!root) return
      root.active = false

      // Reset all flags below this child
      if (root.responseList) {
        for(let i = 0; i < root.responseList.length; i++) {
          const response = root.responseList[i]
          response.active = false
          if (response.flags) {
            for(let i = 0; i < response.flags.length; i++) {
              this.setFlag(response.flags[i][0], 'unknown')
            }
          }
        }
      }

      for(let i = 0; i < root.responseList.length; i++) {
        deactivateChildren(root.responseList[i].value)
      }
    }
    // Hide all responses
    for(let i = 0; i < question.responseList.length; i++) {
      deactivateChildren(question.responseList[i].value)
    }

    
    if (response.flags && response.flags.length > 0) {
      for(let i = 0; i < response.flags.length; i++) {
        const callback = response.value.text === 'dependsOnState' ? setActiveFromFlags : null
        this.setFlag(response.flags[i][0], response.flags[i][1], callback)
      }
    }

    response.value.active = true
    this.setState({ questions: q })
  }
  render() {
    const questionList = this.state.questions.map((question, idx) => {
      const responseList = question.responseList.map(((response, idx2) => (
        <li key={idx2}>
          <button onClick={() => this.handleClick(idx, idx2)}>
            <span style={{fontWeight: response.active ? 700 : 400}}>
              {response.label}
            </span>
          </button>
        </li>
      )))
      return (
        <li style={{order: question.order,display: question.active ? 'block' : 'none'}} key={question.id}>
          <p>{question.text}</p>
          <ul>{responseList}</ul>
        </li>
      )
    })
    const flagList = Object.keys(this.state).map(flagKey => {
      return (
        <li key={flagKey}>
          {flagKey !== 'questions' &&
            <span>{flagKey}: {this.state[flagKey]}</span>
          }
        </li>
      )
    })
    return (
      <Layout>
        <div>
          <ul style={{display: 'flex', flexDirection: 'column'}}>{questionList}</ul>
          {/* <hr />
          <h4>state (TODO: Hide this in prod)</h4>
          <ul>
            {flagList}
          </ul> */}
        </div>
      </Layout>
    )
  }
}

export default Eligibility