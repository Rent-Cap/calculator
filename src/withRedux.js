import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
  zip: state.zip,
  refund: state.refund,
});
const mapDispatchToProps = (dispatch) => ({
  changeZip: (zip) => dispatch({ type: 'CHANGE_ZIP', zip }),
  changeRefund: (refund) => dispatch({ type: 'CHANGE_REFUND', refund }),
});

export default connect(mapStateToProps, mapDispatchToProps);
