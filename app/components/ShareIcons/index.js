import styles from './styles.css';
import React from 'react';
import { Glyphicon } from 'react-bootstrap';

export class YesShareIcon extends React.Component {
  render() {
    const curStyle = _.defaults(this.props.style || {}, { color: '#00bc8c' });

    return (
      <Glyphicon className={styles.shareIcon} glyph="ok-sign" style={curStyle} />
    );
  }
}

export class NoShareIcon extends React.Component {
  render() {
    const curStyle = _.defaults(this.props.style || {}, { color: '#e74c3c' });

    return (
      <Glyphicon className={styles.shareIcon} glyph="remove-sign" style={curStyle} />
    );
  }
}