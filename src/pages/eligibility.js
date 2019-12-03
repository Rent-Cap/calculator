import React from 'react'
import Layout from '../components/Layout'
import { getQuestionStateFromQuery, queryToArray, questions } from '../Helpers'
import { navigate } from '@reach/router'
import { SecondaryButton } from '../components/Buttons'
import './eligibility.css'

class Eligibility extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      questions
    }
    this.handleClick = this.handleClick.bind(this)
    this.setStateFromQuery = this.setStateFromQuery.bind(this)
  }
  setStateFromQuery() {
    const query = this.props.location.search.substring(1);
    const questions = getQuestionStateFromQuery(query)
    this.setState({ questions })
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

    // TODO: Should be able to leave the query as a string instead of doing this
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
  }
  componentDidMount() {
    // decode query params to determine initial flowchart state
    this.setStateFromQuery()
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
          {!this.state.questions[0].focused &&
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
        <h1>Are you eligible?</h1>
        <div className="eligibility-container">
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