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
  componentWillMount() {
    // Poor man's refresh
    const interval = 60000;
    const refresh = () => {
      this.props.loadAll(0, 100);
      if (this.props.loggedIn) {
        this.props.loadUser();
      }
      this.to = setTimeout(refresh, interval);
    };
    this.to = setTimeout(refresh, 0);
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
          <div className={`${styles.statsRight}`}><MoneyIcon /> {formatPrice(this.props.userRanking.profit)}</div>
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
