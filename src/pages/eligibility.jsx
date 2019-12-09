import React from 'react';
import { Link } from 'gatsby';
// import { navigate } from '@reach/router';
import Layout from '../components/Layout';
import { getQuestionStateFromQuery, queryToArray, questions } from '../Helpers';
import { PrimaryButton2, PrimaryButton } from '../components/Buttons';
import './eligibility.css';

class Eligibility extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questions,
      query: '',
    };
    this.handleClick = this.handleClick.bind(this);
    this.setStateFromQuery = this.setStateFromQuery.bind(this);
    this.previousQuestion = this.previousQuestion.bind(this);
  }

  componentDidMount() {
    // decode query params to determine initial flowchart state
    this.setStateFromQuery(this.props.location.search.substring(1));
  }

  // eslint-disable-next-line
  componentDidUpdate(prevProps, prevState) {
    // eslint-disable-next-line
    if (this.state.query !== prevState.query) {
      // TODO: Enable back button history
      // window.history.pushState({}, 'history', `${this.state.query}`)
      // this.props.location.search = this.state.query
      this.setStateFromQuery();
    }
  }

  setStateFromQuery(q) {
    // eslint-disable-next-line
    const query = q || this.state.query.substring(1)
    const updatedQuestions = getQuestionStateFromQuery(query);
    this.setState({ questions: updatedQuestions });
  }

  handleClick(questionIdx, responseIdx) {
    const q = this.state.questions.slice(0);
    const question = q[questionIdx];
    const response = question.responseList[responseIdx];
    // const search = this.props.location.search.substring(1);
    const search = this.state.query.substring(1);
    // TODO: Should be able to leave the query as a string instead of doing this
    let query = queryToArray(search);
    // if already exists in the array, change the value, otherwise push new value
    // NOTE: This is intentionally a double equals (==)
    // eslint-disable-next-line
    const queryQuestionIdx = query.findIndex((el) => el[0] == questionIdx);
    if (queryQuestionIdx >= 0) {
      // On change we need to chop off the rest of the query string
      query[queryQuestionIdx][1] = response.label;
      query = query.slice(0, queryQuestionIdx + 1);
    } else {
      query.push([questionIdx, response.label]);
    }
    const queryString = query.map((a) => `${a[0]}=${a[1]}`).join('&');
    // navigate(`?${queryString}`)
    this.setState({ query: `?${queryString}` });
  }

  previousQuestion() {
    // const search = this.props.location.search.substring(1);
    const search = this.state.query.substring(1);
    if (!search) return;
    const arr = search.split('&');
    // if (arr.length === 0) navigate('')
    if (arr.length === 0) return;
    arr.pop();
    // navigate(`?${arr.join('&')}`)
    const query = `?${arr.join('&')}`;
    this.setState({ query });
  }

  render() {
    const questionList = this.state.questions.map((question, idx) => {
      const responseList = question.responseList.map(((response, idx2) => (
        <li key={response.label}>
          {/* TODO: Investigate why this logic seems to be backwards */}
          {!response.isLink
            ? (
              <PrimaryButton2 onClick={() => this.handleClick(idx, idx2)}>
                <span className={`${response.active ? 'active ' : ''}choice`}>
                  {response.label}
                </span>
              </PrimaryButton2>
            )
            : <Link to="/calculator"><PrimaryButton>{response.label}</PrimaryButton></Link>}
        </li>
      )));
      return (
        <li
          className={`${question.active ? 'active ' : ''}question-item${question.focused ? ' focused' : ''}`}
          style={{ order: question.order }}
          key={question.id}
        >
          <div className="card">
            {!this.state.questions[0].focused
            // eslint-disable-next-line
            && <small role="button" className="back-button" onClick={() => { this.previousQuestion(); }}>Previous Question</small>}
            <div className="card-body">
              <p>{question.text}</p>
            </div>
            <div className="card-footer">
              <ul className="response-list">{responseList}</ul>
            </div>
          </div>
        </li>
      );
    });
    return (
      <Layout>
        <h1>Am I Protected?</h1>
        <p>
          On January 1, 2020 the Tenant Protection Act will expand
          protections to 8 million more renters,
          making it the single largest advancement for renters rights in California history!
          The new law ensures renters are protected from unjust evictions and unfair rent increases.
          However, tenants must satisfy a set of eligibility requirements to be covered by the law.
          Answer the questions below to understand if you are covered under the
          Tenant Protection Act.
        </p>
        <div className="eligibility-container">
          <ul className="question-list">{questionList}</ul>
        </div>
      </Layout>
    );
  }
}

export default Eligibility;
