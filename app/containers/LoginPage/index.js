import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import _ from 'lodash';
import { Link } from 'react-router';

import { createStructuredSelector } from 'reselect';
import { loadAllChannels } from 'globalReducers/channels/actions';
import { selectChannelsJs } from 'globalReducers/channels/selectors';
import { FormGroup, FormControl, ControlLabel, HelpBlock, Form, Col} from 'react-bootstrap';
import {
  selectAuthLoading,
  selectAuthError,
  selectLoggedIn,
  selectUserObj,
} from 'globalReducers/user/selectors';


import {
  attemptReauth,
  userUpdate,
  logout,
} from 'globalReducers/user/actions';

import styles from './styles.css';
import { Field, reduxForm } from 'redux-form/immutable';

const validate = (values, props) => {
  const errors = {};

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

  if (props.isLogin) return errors;

  const username = values.get('username');
  if (!username) {
    errors.username = 'Required';
  } else if (username.length > 512) {
    errors.username = 'Must be 512 characters or less';
  } else if (!/^[a-zA-Z0-9]*$/i.test(username)) {
    errors.username = 'Must be only letters and numbers';
  }

  const passwordConfirm = values.get('passwordConfirm');
  if (password !== passwordConfirm) {
    errors.passwordConfirm = 'Passwords must match';
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
  const { handleSubmit, pristine, reset, submitting, submitText, isLogin } = props;
  return (
    <Form horizontal onSubmit={handleSubmit}>
      <Field name="email" type="email" component={renderField} label="Email" />
      {!isLogin ? <Field name="username" type="text" component={renderField} label="Username" /> : null}
      <Field name="password" type="password" component={renderField} label="Password" />
      {!isLogin ? <Field name="passwordConfirm" type="password" component={renderField} label="Confirm Password" />: null}

      <div style={{ float: 'right' }}>
        <button className="btn btn-success" type="submit" disabled={submitting}>{submitText}</button>
      </div>
    </Form>
  );
};

const FForm =  reduxForm({
  form: 'loginForm',  // a unique identifier for this form
  validate,                // <--- validation function given to redux-form
  touchOnChange: true,
})(SyncValidationForm);

class PreLoginPage extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      tab: 0,
    };
  }

  handleLogin(values) {
    // Do something with the form values
    console.log(values.toJS());
  }

  render() {
    return (
      <div>
        <div style={{ width: '500px', marginLeft: 'auto', marginRight: 'auto', paddingBottom: '50px' }}>
          <div className="clearfix">
            <h3 style={{float: 'left'}}>Login</h3>
            <h5 style={{float: 'right', marginTop: '30px'}}>Or <Link to="/register">Create Account</Link></h5>
          </div>
          <FForm onSubmit={this.handleLogin} submitText="Login" isLogin />
        </div>
      </div>
    );
  }
}


class PreRegisterPage extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      tab: 0,
    };
  }

  handleLogin(values) {
    // Do something with the form values
    console.log(values.toJS());
  }

  render() {
    return (
      <div>
        <div style={{ width: '500px', marginLeft: 'auto', marginRight: 'auto', paddingBottom: '50px' }}>
          <div className="clearfix">
            <h3 style={{float: 'left'}}>Create Account</h3>
            <h5 style={{float: 'right', marginTop: '30px'}}>Or <Link to="/login">Login</Link></h5>
          </div>
          <FForm onSubmit={this.handleLogin} submitText="Create Account" />
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    attemptReauth: () => dispatch(attemptReauth()),
    changeRoute: (url) => dispatch(push(url)),
    dispatch,
  };
}

const mapStateToProps = createStructuredSelector({
  user: selectUserObj(),
  loading: selectAuthLoading(),
  loggedIn: selectLoggedIn(),
  error: selectAuthError(),
});

// Wrap the component to inject dispatch and state into it
const LoginPage = connect(mapStateToProps, mapDispatchToProps)(PreLoginPage);
const RegisterPage = connect(mapStateToProps, mapDispatchToProps)(PreRegisterPage);

export { LoginPage, RegisterPage };


// export default ContactPage;
