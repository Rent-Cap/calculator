import { connect } from 'react-redux';

const mapStateToProps = state => {
  return ({
    zip: state.zip
  })
};
const mapDispatchToProps = dispatch => {
  return {
    changeZip: zip => dispatch({type: 'CHANGE_ZIP', zip})
  }
};

export default connect(mapStateToProps, mapDispatchToProps)