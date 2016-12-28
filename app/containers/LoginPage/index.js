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
import { Field, reduxForm } from 'redux-form/immutable';

const validate = values => {
  const errors = {};
  const username = values.get('username');
  if (!username) {
    errors.username = 'Required';
  } else if (username.length > 512) {
    errors.username = 'Must be 512 characters or less';
  } else if (!/^[a-zA-Z0-9]*$/i.test(username)) {
    errors.username = 'Must be only letters and numbers';
  }

  const email = values.get('email');
  if (!email) {
    errors.email = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
    errors.email = 'Invalid email address';
  }

  const password = values.get('password');
  if (!password) {
    errors.password = 'Required';
  } else if (password.length < 5) {
    errors.password = 'Must be 5 characters or more';
  } else if (password.length > 512) {
    errors.password = 'Must be 512 characters or fewer';
  }

  return errors;
};
const renderField = ({ input, label, type, meta: { touched, error, warning } }) => (
  <FormGroup>
    <Col componentClass={ControlLabel} sm={2}> {label}</Col>
    <Col sm={10}>
      <FormControl {...input} placeholder={label} type={type} />
      {touched && ((error && <span>{error}</span>) || (warning && <span>{warning}</span>))}
    </Col>
  </FormGroup>
);
const SyncValidationForm = (props) => {
  const { handleSubmit, pristine, reset, submitting } = props;
  return (
    <Form horizontal onSubmit={handleSubmit}>
      <Field name="email" type="email" component={renderField} label="Email" />
      <Field name="username" type="text" component={renderField} label="Username" />
      <Field name="password" type="password" component={renderField} label="Password" />
      <div style={{ float: 'right' }}>
        <button className="btn btn-success" type="submit" disabled={submitting}>Create Account</button>
        {/*<button className="btn btn-danger" type="button" disabled={pristine || submitting} onClick={reset}>Clear Values</button>*/}
      </div>
    </Form>
  );
};


const FForm =  reduxForm({
  form: 'loginForm',  // a unique identifier for this form
  validate,                // <--- validation function given to redux-form
})(SyncValidationForm);

class ContactPage extends React.Component {
  handleSubmit = (values) => {
    // Do something with the form values
    console.log(values.toJS());
  }
  render() {
    return (
      <FForm onSubmit={this.handleSubmit} />
    );
  }
}
export default ContactPage;