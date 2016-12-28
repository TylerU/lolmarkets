import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import _ from 'lodash';
import { Link } from 'react-router';

import { createStructuredSelector } from 'reselect';
import { loadAllChannels } from 'globalReducers/channels/actions';
import { selectChannelsJs } from 'globalReducers/channels/selectors';
import { FormGroup, FormControl, ControlLabel, HelpBlock, Form, Col} from 'react-bootstrap';

import styles from './styles.css';

export class StreamsPage extends React.Component {

}

StreamsPage.propTypes = {
  loadAllChannels: React.PropTypes.func,
  channels: React.PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  channels: selectChannelsJs(),
});

function mapDispatchToProps(dispatch) {
  return {
    loadAllChannels: () => dispatch(loadAllChannels()),
    changeRoute: (url) => dispatch(push(url)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StreamsPage);
