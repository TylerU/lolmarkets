// import { connect } from 'react-redux';
import React from 'react';
import _ from 'lodash';
import { loadGlobalLeaderboard } from 'globalReducers/leaderboards/actions';
import { selectGlobalLeaderboard, selectGlobalLeaderboardUser } from 'globalReducers/leaderboards/selectors';
import { connect } from 'react-redux';
import { selectLoggedIn, selectUserObj } from 'globalReducers/user/selectors';
import Leaderboard from 'components/Leaderboard';

class LeaderboardPage extends React.Component {
  render() {
    console.log('User:', this.props.user);
    return (
      <div>
        <h2>Global Leaderboard</h2>
        <Leaderboard
          loadAll={this.props.loadAll}
          loadUser={_.partial(this.props.loadUser, this.props.user ? this.props.user.get('username') : '')}
          leaderboard={this.props.globalLeaderboard}
          loggedIn={this.props.loggedIn}
          userRanking={this.props.globalLeaderboardUser} />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadAll: (skip, limit) => dispatch(loadGlobalLeaderboard(null, skip, limit)),
    loadUser: (user, skip, limit) => dispatch(loadGlobalLeaderboard(user, skip, limit)),
  };
}

function mapStateToProps(state, props) {
  return {
    globalLeaderboard: selectGlobalLeaderboard()(state),
    loggedIn: selectLoggedIn()(state),
    globalLeaderboardUser: selectGlobalLeaderboardUser()(state),
    user: selectUserObj()(state),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LeaderboardPage);
