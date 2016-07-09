import React, { PropTypes } from 'react';

import styles from './styles.css';
import Coin from '../../img/Coin_Icon.png';

class MoneyIcon extends React.Component {
  render() {
    return (
      <span>
        <img src={Coin} className={styles.coinImage} style={{ width: this.props.size }}/>
      </span>
    );
  }
}
export default MoneyIcon;
