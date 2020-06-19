import React from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Alert = ({ alerts }) => alerts && alerts.map(alert => (
  <div key={alert.id} className={`alert alert-${alert.alertType}`}>
    { alert.msg }
  </div>
));

Alert.propTypes = {
  alerts: PropTypes.array.isRequired
}

//mapping redux state to a react prop
const mapStateToProps = state => ({
  //will make props.alert avaiable to this component
  alerts: state.alert
});

export default connect(mapStateToProps)(Alert);
