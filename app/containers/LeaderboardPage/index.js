// import { connect } from 'react-redux';
import React from 'react';
import _ from 'lodash';
import { loadUserMarkets, navigateToStreamById } from 'globalReducers/portfolio/actions';
import { selectPortfolio } from 'globalReducers/portfolio/selectors';
import { connect } from 'react-redux';
import { selectLoggedIn } from 'globalReducers/user/selectors';
import numeral from 'numeral';
import MoneyIcon from '../../components/MoneyIcon';
import styles from './styles.css';
import moment from 'moment';

// TODO - move this function to a library
function formatPrice(x) {
  return numeral(x).format('0.00');
}

class LeaderboardPage extends React.Component {
  componentWillMount() {
  }

  componentWillUnmount() {
  }

  render() {
    const leaderboardObjects = [
      {
        username: 'Dino',
        ranking: 1,
        profit: Math.random() * 100,
      },
      {
        username: 'Dino2',
        ranking: 2,
        profit: Math.random() * 100,
      },
      {
        username: 'Dino3',
        ranking: 3,
        profit: Math.random() * 100,
      },
      {
        username: 'Dino5',
        ranking: 4,
        profit: Math.random() * 100,
      },
    ];

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
      <div>
        <h2>Leaderboard</h2>
        <div className={`${styles.tableContainer} well`}>
          <table className="table table-responsive table-striped">
            <thead>
              <tr>
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
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

function mapStateToProps(state, props) {
  return {
    // globalLeaderboard: selectLeaderboard({})(state),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LeaderboardPage);
