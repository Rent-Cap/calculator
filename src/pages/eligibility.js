import React from 'react'
import Layout from '../components/Layout'
import { checkFlags } from '../Helpers'
import { navigate } from '@reach/router'
import { SecondaryButton } from '../components/Buttons'
import './eligibility.css'

let QUESTION_ID = 0
function Question(text, order) {
  // https://stackoverflow.com/questions/8012002/create-a-unique-number-with-javascript-time
  // this.id = new Date().valueOf().toString(36) + Math.random().toString(36).substr(2)
  this.id = QUESTION_ID
  this.text = text
  this.responseList = []
  this.active = false
  this.order = order || 0
  this.variableText = false
  QUESTION_ID++
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
const temp = new Question('Sorry, encountered an error: Please send current URL to c4sf rentcap slack group for fix', 17)
// red
const conclusion1 = new Question('Unfortunately, your building is neither covered by rent control nor just-cause eviction protection from the Tenant Protections Act.', 17)
// blue
const conclusion2 = new Question('Your building is not covered by rent control from the Tenant Protection Act. Fortunately, your building is covered by the just-cause eviction protection! Click here for a list of just-cause reasons for eviction.', 17)
// yellow
const conclusion3 = new Question('Your building is covered by rent control from the Tenant Protection Act. However, your building is not covered by the just-cause eviction protection.', 17)
// green
const conclusion4 = new Question('Great news! Your building is covered by both rent control and just-cause eviction protection from the Tenant Protection Act! Click here for a list of just-cause reasons for eviction.', 17)

q1.active = true
q1.focused = true
temp.variableText = true

q1.responseList = [{ value: q2, label: 'Yes', flags: [['first-q', 'yes']]}, { value: q8, label: 'No', flags: [['first-q', 'no']] }]
q2.responseList = [{ value: q3, label: 'Yes', flags: [['#2', 'yes']]}, { value: conclusion1, label: 'No', flags: [['#2', 'no']]}]
// NOTE: if 'no' then no just-cause eviction protection
q3.responseList = [{ value: q4, label: 'Yes', flags: [['kitchen-q', 'yes']] }, { value: q4, label: 'No', flags: [['kitchen-q', 'no']] }]
q4.responseList = [{ value: q5,label: 'One' }, { label: 'Two', value: q10 }, { label: 'Three or more', value: temp, flowResult: 'three' }]
q5.responseList = [{ label: 'Yes', value: q5_2 }, { value: conclusion1, label: 'No'}]
q5_2.responseList = [{ label: 'Yes', value: q6, flags:[['property-q', 'yes']] }, { value: conclusion1, label: 'No', flags:[['property-q', 'no']] }]
// NOTE: If no, then no just-cause eviction protection
q6.responseList = [{ label: 'Yes', value: q7, flags: [['adu-q', 'yes']] }, { label: 'No', value: q7, flags: [['adu-q', 'no']] }]
q7.responseList = [{ label: 'Yes', value: temp, flowResult: 'voucher-yes' }, { label: 'No', value: q9 }]
q8.responseList = [{ label: 'Yes', value: q2 }, { label: 'No', value: q2, flags: [['no-just', 'yes']] }]
q9.responseList = [{ label: 'Yes', value: temp, flowResult: 'dorm-yes' }, { label: 'No', value: temp, flowResult: 'dorm-no' }]
q10.responseList = [{ label: 'Yes', value: temp, flowResult: 'landlord-yes' }, { label: 'No', value: temp, flowResult: 'landlord-no' }]

// NOTE: ALWAYS keep temp in the last index
const questions = [q1, q2, q3, q4, q5, q5_2, q6, q7, q8, q9, q10, conclusion1, conclusion2, conclusion3, conclusion4, temp]

// red, blue, yellow, green
const conclusionTexts = [conclusion1.text, conclusion2.text, conclusion3.text, conclusion4.text]

function queryToArray(query) {
  const result = [];
  const pairs = query.split('&')
  for (let i = 0; i < pairs.length; i++) {
      if(!pairs[i])
          continue;
      let pair = pairs[i].split('=');
      const key = decodeURIComponent(pair[0])
      const value = decodeURIComponent(pair[1])
      result.push([key, value])
   }
   return result;
}

class Eligibility extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // WARNING: Adding more state vars will require modifying setActiveFromFlags (we assume other state vars are flags)
      questions
    }
    this.handleClick = this.handleClick.bind(this)
    this.setStateFromQuery = this.setStateFromQuery.bind(this)
  }
  setFlag(flag, value) {
    if (!flag) return

    const obj = {}
    obj[flag] = value
    this.setState(obj)
  }
  setStateFromQuery(init = false) {
    const search = this.props.location.search.substring(1);
    const query = search ? queryToArray(search) : []

    // TODO: Move this logic to helpers
    const setActiveFromFlags = flowResult => {
      const q = this.state.questions.slice(0)
      const flags = {}
      Object.keys(this.state).forEach(key => {
        if (key !== 'questions') {
          flags[key] = this.state[key]
        }
      })

      // logic = [red, blue, yellow, green] from Carmen's doc
      let logic = []
      switch(flowResult) {
        case 'voucher-yes':
          // red: Yes (+ (No to First Q AND No to #2) OR (Yes to Kitchen Q) OR (No to ADU Q)): 
          // blue: Yes (+ (Yes to First Q OR #2) AND ((No to Property Q) OR (No to ADU Q))): 
          logic = ['(not first-q and not #2) or (kitchen-q) or (not adu-q)', '(first-q or #2) and ((not property-q or not adu-q))']
          break
        case 'dorm-yes':
            // red: Yes (+ (No to First Q AND No to #2) OR (Yes to Kitchen Q) OR (No to ADU Q)): 
            // blue: Yes (+ (Yes to First Q OR #2) AND ((No to Property Q) OR (No to ADU Q)))
            logic = ['(not first-q and not #2) or (kitchen-q) or (not adu-q)', '(first-q or #2) and ((not property-q) or (not adu-q))']
          break
        case 'dorm-no':
          // yellow: No (+ (No to First Q AND No to #2) OR (Yes to Kitchen Q) OR (No to ADU Q))
          // green: No (+ (Yes to First Q OR #2) AND ((No to Property Q) OR (No to ADU Q))):
          logic = ['', '', '(not first-q and not #2) or (kitchen-q) or (not adu-q)', '(first-q or #2) and ((not property-q) or (not adu-q))']
          break
        case 'landlord-yes':
          // blue: Yes (+ Yes to First Q OR #2):
          // red: Yes (+ No to First Q AND #2):
          logic = ['first-q or #2', 'not first-q and #2']
          break
        case 'landlord-no':
          // yellow: No (+ No to First Q AND #2)
          // green: No (+ Yes to First Q OR #2)
          logic = ['', '', 'not first-q and #2', 'first-q or #2']
          break
        case 'three':
          // yellow: (+ No to First Q AND #2)
          // green: (+ Yes to First Q OR #2)
          // WARNING: Ambiguity at not first-q AND #2
          logic = ['', '', 'not first-q and #2', 'first-q or #2']
          break
        default:
          throw new Error('Unknown flow result')
      }
      let setText = false
      for(let i = 0; i < logic.length; i++) {
        if (checkFlags(logic[i], flags)) {
          // console.log('setting text to:', conclusionTexts[i])
          setText = true
          q[q.length - 1].text = conclusionTexts[i]
        }
      }
      if (!setText) {
        console.error('Did not set a conclusion result. Check logic', flags)
      }
      this.setState({ questions: q })
    }
    // TODO: Move this logic to helpers
    const deactivateChildren = root => {
      if (!root) return
      root.active = false
      root.focused = false

      // Reset all flags below this child
      if (root.responseList) {
        for(let i = 0; i < root.responseList.length; i++) {
          const response = root.responseList[i]
          response.active = false
          // response.focused = false
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

    for(let i = 0; i < query.length; i++) {
      const term = query[i]
      const questionIdx = questions.findIndex(q => {
        return q.id == term[0]
      })
      const question = questions[questionIdx]
      question.focused = false
      question.responseList.forEach(r => {
        r.active = false
        r.focused = false
      })
      const responseIdx = question.responseList.findIndex(r => r.label == term[1])

      // Hide all responses
      for(let i = 0; i < question.responseList.length; i++) {
        deactivateChildren(question.responseList[i].value)
      }

      const response = questions[questionIdx].responseList[responseIdx]
      if (response.flags && response.flags.length > 0) {
        for(let i = 0; i < response.flags.length; i++) {
          this.setFlag(response.flags[i][0], response.flags[i][1])
        }
      }

      // TODO: This doesn't work on load if it is already showing variable text
      if (response.value.variableText && !init) setActiveFromFlags(response.flowResult)

      response.active = true
      response.value.active = true

      // set the last one to focused
      if (i === query.length - 1) {
        response.value.focused = true
      }
    }

    // Edge case for empty query (first question visible)
    if (query.length === 0) {
      const question = questions[0]
      questions[0].active = true
      questions[0].focused = true
      for(let i = 0; i < question.responseList.length; i++) {
        deactivateChildren(question.responseList[i].value)
      }
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.location.search !== prevProps.location.search) {
      this.setStateFromQuery()
    }
  }

  handleClick(questionIdx, responseIdx) {    
    const q = this.state.questions.slice(0)
    const question = q[questionIdx]
    const response = question.responseList[responseIdx]
    const search = this.props.location.search.substring(1);
    let query = queryToArray(search)

    // if already exists in the array, change the value, otherwise push new value
    // NOTE: This is intentionally a double equals (==)
    const queryQuestionIdx = query.findIndex(el => el[0] == questionIdx)
    if (queryQuestionIdx >= 0) {
      // On change we need to chop off the rest of the query string
      query[queryQuestionIdx][1] = response.label
      query = query.slice(0, queryQuestionIdx + 1)
    } else {
      query.push([questionIdx, response.label])
    }
    const queryString = query.map(a => a[0] + '=' + a[1]).join('&');
    navigate(`?${queryString}`)
    this.setState({ questions: q })
  }
  componentDidMount() {
    // decode query params to determine initial flowchart state
    this.setStateFromQuery(true)
  }
  render() {
    const questionList = this.state.questions.map((question, idx) => {
      const responseList = question.responseList.map(((response, idx2) => (
        <li key={idx2}>
          <SecondaryButton onClick={() => this.handleClick(idx, idx2)}>
            <span className={`${response.active ? 'active ' : ''}choice`}>
              {response.label}
            </span>
          </SecondaryButton>
        </li>
      )))
      return (
        <li className={`${question.active ? 'active ' : ''}question-item${question.focused ? ' focused' : ''}`} style={{order: question.order}} key={question.id}>
          <div className="card">
          {!q1.focused &&
            <small className="back-button" onClick={() => { if (window) window.history.back() }}>Previous Question</small>
          }
          <div className="card-body">
            <p>{question.text}</p>
          </div>
          <div className="card-footer">
            <ul className="response-list">{responseList}</ul>
          </div>
          </div>
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
        <div className="elgibility-container">
          {/* <div className="card-body"> */}
          <ul className="question-list">{questionList}</ul>
          {/* </div> */}
          {/* <h4>state (TODO: Hide this in prod)</h4>
          <ul>
            {flagList}
          </ul> */}
        </div>
      </Layout>
    )
  }
}

export default Eligibility