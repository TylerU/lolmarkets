import React, { PropTypes } from 'react';

import styles from './styles.css';
import MoneyIcon from '../MoneyIcon';
import numeral from 'numeral';
import moment from 'moment';


// TODO - move this function to a library
function formatPrice(x) {
  return numeral(x).format('0.00');
}

class Leaderboard extends React.Component {
  refresh() {
    clearTimeout(this.to);
    const interval = 60000;
    this.props.loadAll(0, 100);
    if (this.props.loggedIn) {
      this.props.loadUser();
    }
    this.to = setTimeout(() => this.refresh, interval);
  }

  componentWillMount() {
    this.refresh();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.loggedIn !== null && prevProps.loggedIn === null) {
      this.refresh();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.to);
  }

  render() {
    const leaderboardObjects = this.props.leaderboard.result;

    const leaderboardRows = _.map(leaderboardObjects, (user) => {
      return (
        <tr key={user.userId}>
          <td
            data-title="Ranking"
          >{user.ranking}</td>
          <td
            data-title="User Name"
          >{user.username}</td>
          <td
            data-title="Pre-close Gains"
          ><MoneyIcon />{formatPrice(user.profit)}</td>
        </tr>);
    });

    return (
      <div className={`${styles.tableContainer} well`}>
        {this.props.userRanking ? (<div className={`${styles.yourStatsContainer}`}>
          <div className={`${styles.statsLeft}`}>Your Ranking: </div>
          <div className={`${styles.statsRight}`}>{this.props.userRanking.ranking}</div>
          <div className={`${styles.statsLeft}`}>Net Profit: </div>
          <div className={`${styles.statsRight}`}>
            <MoneyIcon />
            <span>{formatPrice(this.props.userRanking.profit)}</span>
          </div>
        </div>) : null}
        <table className="table table-responsive table-striped">
          <thead>
          <tr key="-1">
            <th>Rank</th>
            <th>Username</th>
            <th>Net Profit</th>
          </tr>
          </thead>
          <tbody>
          {leaderboardRows}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Leaderboard;
