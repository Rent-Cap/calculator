import moment from "moment"

// Component Helpers

export function handleInput(key, event) {
  const obj = {}
  obj[key] = event.target.value
  this.setState(obj)
}

// Calculator Helpers 

export function calculateMaxRent(pastRent = 0, cpi = 0.033) {
  const plusTenPercent = pastRent * 1.1
  const cpiCalc = pastRent * (1 + 0.05 + parseFloat(cpi))
  const min = Math.min(plusTenPercent, cpiCalc)
  return parseFloat(min).toFixed(2)
}

// Used to determine the rent on march 15 2019 from range data
export function determineRentOnDateFromRentRanges(targetDate, rentRanges = []) {
  if (!targetDate) throw new Error('No target date given.')
  let rent
  for(let i = 0; i < rentRanges.length; i++) {
    const daysBefore = targetDate.diff(rentRanges[i].startDate, 'days', true)
    const daysAfter = rentRanges[i].endDate.diff(targetDate, 'days', true)
    if (daysBefore >= 0 && daysAfter >= 0) rent = rentRanges[i].rent
  }
  return rent
}

export function determineMaxRentFromRentRanges(targetDate, rentRanges = [], cpi = 0.033) {
  const rentOnTargetDate = determineRentOnDateFromRentRanges(targetDate, rentRanges)
  return calculateMaxRent(rentOnTargetDate, cpi)
}

export function calculateTotalAmountOwedToTenant(rentRanges = [], cpi = 0.033) {
  // NOTE: rentRanges must be sorted past --> present
  // WARNING: Only accurate before mar 15 2020!
  let result = 0
  if (rentRanges.length < 1) return result
  const mar152019 = moment([2019, 2, 15])
  const pastRent = determineRentOnDateFromRentRanges(mar152019, rentRanges)

  for (let i = 0; i < rentRanges.length; i++) {
    const rent = rentRanges[i].rent
    const start = rentRanges[i].startDate
    const end = rentRanges[i].endDate
    
    const maxRent = calculateMaxRent(pastRent, cpi)
    const janFirst2020 = moment([2020, 0, 1])
    const diff = rentRanges[i].endDate.diff(janFirst2020, 'months', true)
    const isAfterJan2020 = diff > 0 ? true : false
    const monthsPaidAfterJan2020 = isAfterJan2020 ? end.diff(start, 'months', true) : 0

    result += (rent > maxRent) ? (rent - maxRent) * monthsPaidAfterJan2020 : 0
  }
  return result > 0 ? parseFloat(result).toFixed(2) : 0
}

// Eligibility Helpers

export const checkFlags = (str, flags) => {
  if (!str) return false
  const logicalOperators = {
    'and': '&&',
    'or': '||',
    'not': '!'
  }
  const mapping = Object.assign(logicalOperators, flags)
  let i = 0
  // lazy way of forcing an eval at the end without checking for end of string
  str += ' '
  let result = ''
  let term = ''
  while (i < str.length) {
    const token = str[i]
    if (token !== ' ' && token !== '(' && token !== ')') {
      term += token
    } else {
      let op = mapping[term]
      if (op === 'yes' || op === 'Yes') op = true
      if (op === 'no' || op === 'No') op = false
      if (op === 'unknown') {
        console.log('Unknown flag, breaking out of function')
        return false
      }
      if (typeof op !== 'undefined') result += op
      result += token
      term = ''
    }
    i++
  }
  return eval(result)
}

let QUESTION_ID = 0
function Question(text, order) {
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
const temp = new Question('Sorry, encountered an error: Please go to the previous question', 17)
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

q1.responseList = [{ value: q2, label: 'Yes'}, { value: q8, label: 'No' }]
q2.responseList = [{ value: q3, label: 'Yes'}, { value: conclusion1, label: 'No'}]
// NOTE: if 'no' then no just-cause eviction protection
q3.responseList = [{ value: q4, label: 'Yes' }, { value: q4, label: 'No' }]
q4.responseList = [{ value: q5,label: 'One' }, { label: 'Two', value: q10 }, { label: 'Three or more', value: temp, flowResult: 'three' }]
q5.responseList = [{ label: 'Yes', value: q5_2 }, { value: conclusion1, label: 'No'}]
q5_2.responseList = [{ label: 'Yes', value: q6 }, { value: conclusion1, label: 'No' }]
// NOTE: If no, then no just-cause eviction protection
q6.responseList = [{ label: 'Yes', value: q7 }, { label: 'No', value: q7 }]
q7.responseList = [{ label: 'Yes', value: temp, flowResult: 'voucher-yes' }, { label: 'No', value: q9 }]
q8.responseList = [{ label: 'Yes', value: q2 }, { label: 'No', value: q2 }]
q9.responseList = [{ label: 'Yes', value: temp, flowResult: 'dorm-yes' }, { label: 'No', value: temp, flowResult: 'dorm-no' }]
q10.responseList = [{ label: 'Yes', value: temp, flowResult: 'landlord-yes' }, { label: 'No', value: temp, flowResult: 'landlord-no' }]

conclusion3.responseList = [{label: 'Calculate my Rent Cap', isLink: true}]
conclusion4.responseList = [{label: 'Calculate my Rent Cap', isLink: true}]
// NOTE: ALWAYS keep temp in the last index
export const questions = [q1, q2, q3, q4, q5, q5_2, q6, q7, q8, q9, q10, conclusion1, conclusion2, conclusion3, conclusion4, temp]

// red, blue, yellow, green
const conclusions = [conclusion1, conclusion2, conclusion3, conclusion4]

export function queryToArray(query) {
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

const questionIdToFlag = {
  '0': 'first-q',
  '1': '#2',
  '2': 'kitchen-q',
  '5': 'property-q',
  '6': 'adu-q'
}
const questionIdToFlowResult = {
  '3': 'three',
  '7': {'Yes': 'voucher-yes'},
  '9': {'Yes': 'dorm-yes', 'No': 'dorm-no'},
  '10': {'Yes': 'landlord-yes', 'No': 'landlord-no'}
}

// use query array to construct flag object
function queryArrayToFlagState(query) {
  const result = {}
  for(let i = 0; i < query.length; i++) {
    const flag = questionIdToFlag[query[i][0]]
    if (flag) {
      result[flag] = query[i][1]
    }
  }
  return result
}

function getFlowResultFromQueryArray(query = []) {
  if (query.length === 0) return ''
  const lastQuery = query[query.length - 1]
  const lastQuestionId = lastQuery[0]
  const lastQuestionValue = lastQuery[1]
  const res = questionIdToFlowResult[lastQuestionId]
  if (typeof res === 'string') {
    return res
  } else if (typeof res === 'object') {
    return res[lastQuestionValue]
  } else {
    // we have not reached a final question
    return ''
  }
}

// Use flag state to determine conclusion
function getConclusionFromQuery(query = []) {
  if (query.length === 0) return ''
  const flowResult = getFlowResultFromQueryArray(query)
  if (!flowResult) return ''
  const flags = queryArrayToFlagState(query)
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
  for(let i = 0; i < logic.length; i++) {
    if (checkFlags(logic[i], flags)) {
      return conclusions[i]
    }
  }
  console.error('Did not return conclusion text properly from flags', flags)
}

const deactivateChildren = root => {
  if (!root) return
  root.active = false
  root.focused = false

  // Reset all questions below this child
  if (root.responseList) {
    for(let i = 0; i < root.responseList.length; i++) {
      const response = root.responseList[i]
      response.active = false
    }
  }

  for(let i = 0; i < root.responseList.length; i++) {
    deactivateChildren(root.responseList[i].value)
  }
}

export function getQuestionStateFromQuery(query = '') {
  const questionsCopy = questions.slice(0)
  // Edge case for empty query (first question visible)
  if (query.length === 0) {
    const question = questionsCopy[0]
    questionsCopy[0].active = true
    questionsCopy[0].focused = true
    for(let i = 0; i < question.responseList.length; i++) {
      deactivateChildren(question.responseList[i].value)
    }
  }
  const queryArray = queryToArray(query)
  for(let i = 0; i < queryArray.length; i++) {
    const term = queryArray[i]
    const questionIdx = questionsCopy.findIndex(q => {
      return q.id == term[0]
    })
    // TODO: Check if question ID is in the conclusion mapping. If it is, set the text to the appropriate conclusion
    const question = questionsCopy[questionIdx]
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

    const response = questionsCopy[questionIdx].responseList[responseIdx]
    // conclusion result
    if (response.value.variableText) {
      const conclusion = getConclusionFromQuery(queryArray)
      if (conclusion) response.value = conclusion
    }

    response.active = true
    response.value.active = true

    // set the current visible question to focused
    if (i === queryArray.length - 1) {
      response.value.focused = true
    }
  }
  return questionsCopy
}
