import React from 'react'
import Layout from '../components/Layout'

function Question(text, order) {
  // https://stackoverflow.com/questions/8012002/create-a-unique-number-with-javascript-time
  this.id = new Date().valueOf().toString(36) + Math.random().toString(36).substr(2)
  this.text = text
  this.responseList = []
  this.active = false
  this.order = order || 0
}

const q1 = new Question('Has everyone in your home lived in your building unit for at least 12 months?', 0)
const q2 = new Question('Is your building at least 15 years old? This applies to buildings built before January 1st, 2005. Not sure how old your building is? Check with your city’s planning department.', 2)
const q3 = new Question('Do you share a kitchen or bathroom with your landlord?', 2)
const q4 = new Question('How many units are there in your building or on the property? If you rent a room in a single-family home, click "One".', 3)
const q5 = new Question('Is your building owned by a corporation, real estate investment trust (REIT), or LLC in which at least one member is a corporation? Not sure who owns your building? Check with your city’s planning department.', 4)
const q6 = new Question('Does your landlord live with you and is s/he currently renting out more than 2 rooms or accessory dwelling units? An accessory dwelling unit is an additional separate living space located on a property.', 5)
const q7 = new Question('Is a portion of your rent paid for by a government agency or with a housing voucher? Affordable housing units are exempt from the Tenant Protection Act.', 6)
const q8 = new Question('Has anyone in your building unit lived there for at least 24 months?', 1)
const template = new Question('')
const conclusion1 = new Question('Unfortunately, your building is neither covered by rent control nor just-cause eviction protection from the Tenant Protections Act.', 7)
const conclusion2 = new Question('Your building is not covered by rent control from the Tenant Protection Act. Fortunately, your building is covered by the just-cause eviction protection! Click here for a list of just-cause reasons for eviction.', 7)

q1.active = true
q1.responseList = [{ value: q2, label: 'Yes'}, { value: q8, label: 'No' }]
q2.responseList = [{ value: q3, label: 'Yes' }, { value: conclusion1, label: 'No'}]
// NOTE: if 'no' then no just-cause eviction protection
q3.responseList = [{ value: q4, label: 'Yes' }, { value: q4, label: 'No', flag: 'no-just' }]
q4.responseList = [{ value: q5,label: 'One' }, { label: 'Two'}, {label: 'Three'}, {label: 'Three or more'}]
q5.responseList = [{ label: 'Yes', value: q6 }, { value: conclusion1, label: 'No'}]
// NOTE: If no, then no just-cause eviction protection
q6.responseList = [{ label: 'Yes', value: q7}, { label: 'No', value: q7, flag: 'no-just'}]
q7.responseList = [{}, {}]
q8.responseList = [{ label: 'Yes', value: q2 }, { label: 'No', value: q2, flag: 'no-just' }]
const questions = [q1, q2, q3, q4, q5, q6, q7, q8, conclusion1, conclusion2]

class Eligibility extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      flags: {
        'no-just': 'unknown',
      },
      questions
    }
    this.handleClick = this.handleClick.bind(this)
  }
  setFlag(flag, value) {
    if (!flag) return
    const f = Object.assign({}, this.state.flags)
    f[flag] = value
    this.setState({ flags: f })
  }
  handleClick(questionIdx, responseIdx) {
    const q = this.state.questions.slice(0)
    const question = q[questionIdx]
    const response = question.responseList[responseIdx]

    // reset any flags
    question.responseList.forEach(res => {
      this.setFlag(res.flag, 'unknown')
    })

    const deactivateChildren = root => {
      if (!root) return
      root.active = false

      for(let i = 0; i < root.responseList.length; i++) {
        deactivateChildren(root.responseList[i].value)
      }
    }
    // Hide all responses
    for(let i = 0; i < question.responseList.length; i++) {
      deactivateChildren(question.responseList[i].value)
    }

    // If the question has a special flag e.g. eviction just cause clauses set it true
    this.setFlag(response.flag, 'yes')

    // Show the response provided
    response.value.active = true

    this.setState({ questions: q })
  }
  render() {
    const questionList = this.state.questions.map((question, idx) => {
      const responseList = question.responseList.map(((response, idx2) => (
        <li key={idx2}><button onClick={() => this.handleClick(idx, idx2)}>{response.label}</button></li>
      )))
      return (
        <li style={{order: question.order,display: question.active ? 'block' : 'none'}} key={question.id}>
          <p>{question.text}</p>
          <ul>{responseList}</ul>
        </li>
      )
    })
    return (
      <Layout>
        <div>
          {Object.entries(this.state.flags)}
          <ul style={{display: 'flex', flexDirection: 'column'}}>{questionList}</ul>
        </div>
      </Layout>
    )
  }
}

export default Eligibility