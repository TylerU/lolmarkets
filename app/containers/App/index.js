/**
 *
 * App.react.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Link, IndexLink } from 'react-router';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer, IndexLinkContainer } from 'react-router-bootstrap';

import MoneyIcon from '../../components/MoneyIcon';

// Import the CSS reset, which HtmlWebpackPlugin transfers to the build folder
import 'sanitize.css/sanitize.css';

import styles from './styles.css';

export class App extends React.Component {
  render() {
    return (
      <div>
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <IndexLink to="/">LoL Markets</IndexLink>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <LinkContainer to="/streams"><NavItem eventKey={1}>Active Streams</NavItem></LinkContainer>
              <LinkContainer to="/portfolio"><NavItem eventKey={4.3}>My Portfolio</NavItem></LinkContainer>
            </Nav>
            <Nav pullRight>
              <NavItem eventKey={3} className={styles.coinContainer}>
                <MoneyIcon />
                4
              </NavItem>
              <NavDropdown eventKey={4} title="DinoEntrails" id="nav-dropdown">
                <MenuItem eventKey="4.1">Profile</MenuItem>
                <MenuItem eventKey="4.2">Logout</MenuItem>
              </NavDropdown>
            </Nav>
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
  children: React.PropTypes.node,
};

export default App;
