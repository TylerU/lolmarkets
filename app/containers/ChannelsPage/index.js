import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import _ from 'lodash';
import { Link } from 'react-router';

import { createStructuredSelector } from 'reselect';
import { loadAllChannels } from './actions';
import { selectChannelsJs } from './selectors';

import styles from './styles.css';

export class StreamsPage extends React.Component {
  componentWillMount() {
    this.props.loadAllChannels();
  }

  render() {
    const streams = _.sortBy(_.values(this.props.channels), (channel) => -channel.markets.length);
    let streamPreviews = _.map(streams, (stream) => {
      const linkDest = `stream/${stream.displayName}`;

      return (
        <div key={stream.displayName} className={styles.streamPreviewContainer}>
          <Link to={linkDest}><h4 className={styles.streamPreviewUser}>{stream.displayName}</h4> </Link>
          <Link to={linkDest}><img alt={stream.displayName} className={styles.streamPreviewImg} src={stream.twitchImageUrl} /> </Link>
          <Link className={styles.linkWhite} to={linkDest}><h5 className={styles.streamPreviewTitle}>{stream.twitchStreamTitle}</h5> </Link>
          <div className={styles.streamPreviewMarkets}>Open Markets: {stream.markets ? stream.markets.length : 0}</div>
        </div>
      );
    });
    return (
      <div>
        <h2>Popular Streams</h2>
        <div className={styles.streamPreviewsContainer}>
          {streamPreviews}
        </div>
      </div>
    );
  }
}

StreamsPage.propTypes = {
  loadAllChannels: React.PropTypes.func,
  channels: React.PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  channels: selectChannelsJs(),
});

function mapDispatchToProps(dispatch) {
  return {
    loadAllChannels: () => dispatch(loadAllChannels()),
    changeRoute: (url) => dispatch(push(url)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StreamsPage);
