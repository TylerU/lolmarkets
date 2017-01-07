// import { connect } from 'react-redux';
import React from 'react';
import _ from 'lodash';
import { loadGlobalLeaderboard } from 'globalReducers/leaderboards/actions';
import { selectGlobalLeaderboard } from 'globalReducers/leaderboards/selectors';
import { connect } from 'react-redux';
import { selectLoggedIn } from 'globalReducers/user/selectors';
import Leaderboard from 'components/Leaderboard';

class LeaderboardPage extends React.Component {
  render() {
    return (
      <div>
        <h2>Global Leaderboard</h2>
        <Leaderboard loadAll={this.props.loadAll} leaderboard={this.props.globalLeaderboard} />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadAll: (skip, limit) => dispatch(loadGlobalLeaderboard(null, skip, limit)),
  };
}

function mapStateToProps(state, props) {
  return {
    globalLeaderboard: selectGlobalLeaderboard()(state),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LeaderboardPage);
