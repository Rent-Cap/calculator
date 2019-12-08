import React from 'react';
import { Link } from 'gatsby';
import { navigate } from '@reach/router';
import Layout from '../components/Layout';
import { getQuestionStateFromQuery, queryToArray, questions } from '../Helpers';
import { SecondaryButton, PrimaryButton } from '../components/Buttons';
import './eligibility.css';

class Eligibility extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questions,
    };
    this.handleClick = this.handleClick.bind(this);
    this.setStateFromQuery = this.setStateFromQuery.bind(this);
    this.previousQuestion = this.previousQuestion.bind(this);
  }

  componentDidMount() {
    // decode query params to determine initial flowchart state
    this.setStateFromQuery();
  }

  componentDidUpdate(prevProps) {
    // eslint-disable-next-line
    if (this.props.location.search !== prevProps.location.search) {
      this.setStateFromQuery();
    }
  }

  setStateFromQuery() {
    // eslint-disable-next-line
    const query = this.props.location.search.substring(1);
    const q = getQuestionStateFromQuery(query);
    this.setState({ questions: q });
  }

  handleClick(questionIdx, responseIdx) {
    const q = this.state.questions.slice(0);
    const question = q[questionIdx];
    const response = question.responseList[responseIdx];
    const search = this.props.location.search.substring(1);

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
    navigate(`?${queryString}`);
  }

  previousQuestion() {
    const search = this.props.location.search.substring(1);
    if (!search) return;
    const arr = search.split('&');
    if (arr.length === 0) navigate('');
    arr.pop();
    navigate(`?${arr.join('&')}`);
  }

  render() {
    const questionList = this.state.questions.map((question, idx) => {
      const responseList = question.responseList.map(((response, idx2) => (
        <li key={response.label}>
          {/* TODO: Investigate why this logic seems to be backwards */}
          {!response.isLink
            ? (
              <SecondaryButton onClick={() => this.handleClick(idx, idx2)}>
                <span className={`${response.active ? 'active ' : ''}choice`}>
                  {response.label}
                </span>
              </SecondaryButton>
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
        <h1>Are you eligible?</h1>
        <div className="eligibility-container">
          <ul className="question-list">{questionList}</ul>
        </div>
      </Layout>
    );
  }
}

export default Eligibility;
