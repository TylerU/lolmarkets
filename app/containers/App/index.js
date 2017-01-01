import React from 'react';
import { IndexLink } from 'react-router';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { push } from 'react-router-redux';

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

import { socket, UserService } from 'globalReducers/feathers-app';

import MoneyIcon from '../../components/MoneyIcon';

// Import the CSS reset, which HtmlWebpackPlugin transfers to the build folder
import 'sanitize.css/sanitize.css';

import styles from './styles.css';

export class App extends React.Component {
  componentWillMount() {
    socket.on('reconnect', () => {
      setTimeout(
        () => this.props.attemptReauth(),
        1000 /* time for server to start up */);
    });

    // TODO - figure out where this belongs
    function updateUser(user) {
      if (this.props.user.get('id') === user.id) {
        this.props.updateUser(user);
      }
    }

    UserService.on('updated', updateUser.bind(this));
    UserService.on('patched', updateUser.bind(this));
  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div>
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <IndexLink to="/">Zilean.gg</IndexLink>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <LinkContainer to="/streams"><NavItem eventKey={1}>Active Streams</NavItem></LinkContainer>
              {this.props.loggedIn ? <LinkContainer to="/portfolio"><NavItem eventKey={4.3}>My Portfolio</NavItem></LinkContainer> : null }
            </Nav>
            {this.props.loggedIn ? (
              <Nav pullRight>
                <NavItem eventKey={3} className={styles.coinContainer}>
                  <MoneyIcon />
                  {Math.round(this.props.user.get('money') * 100) / 100}
                </NavItem>
                <NavDropdown eventKey={4} title={this.props.user.get('username')} id="nav-dropdown">
                  {/* <MenuItem eventKey="4.1">Profile</MenuItem> */}
                  <MenuItem eventKey="4.2" onClick={this.props.logout}>Logout</MenuItem>
                </NavDropdown>
              </Nav>) : (<Nav pullRight>
                <LinkContainer to="/login"><NavItem eventKey={3}>Login / Create Account</NavItem></LinkContainer>
              </Nav>)}
          </Navbar.Collapse>
        </Navbar>
        <div className="container">
          {this.props.children}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  loggedIn: React.PropTypes.bool,
  user: React.PropTypes.oneOfType([
    React.PropTypes.shape({
      money: React.PropTypes.number,
      username: React.PropTypes.string,
    }),
    null]),
  attemptReauth: React.PropTypes.func,
  updateUser: React.PropTypes.func,
  logout: React.PropTypes.func,
  children: React.PropTypes.node,
};

function mapDispatchToProps(dispatch) {
  return {
    logout: () => dispatch(logout()),
    attemptReauth: () => dispatch(attemptReauth()),
    changeRoute: (url) => dispatch(push(url)),
    updateUser: (user) => dispatch(userUpdate(user)),
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
export default connect(mapStateToProps, mapDispatchToProps)(App);
