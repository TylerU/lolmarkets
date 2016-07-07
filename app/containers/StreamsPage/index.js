import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import _ from 'lodash';
import { Link } from 'react-router';

import styles from './styles.css';

export class StreamsPage extends React.Component {
  render() {
    const streams = [
      {
        name: 'Voyboy',
        imageUrl: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_voyboy-320x180.jpg',
        betVolume: 1000,
        markets: 3,
        title: 'Voyboy: Chasing Challenger SoloQ~ !video'
      },
      {
        name: 'WingsOfDeath',
        imageUrl: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_wingsofdeath-320x180.jpg',
        betVolume: 200,
        markets: 5,
        title: 'You can call me washed up that just means im clean af | Trying new DPI | Join us https://discordapp.com/invite/wingsofdeat'
      },
      {
        name: 'Scarra',
        imageUrl: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_scarra-320x180.jpg',
        betVolume: 50,
        markets: 2,
        title: 'scarra | im the best league player in my room'
      }];

    let streamPreviews = _.map(streams, (stream) => {
      const linkDest = `stream/${stream.name}`;
      
      return (
        <div key={stream.name} className={styles.streamPreviewContainer}>
          <Link to={linkDest}><h4 className={styles.streamPreviewUser}>{stream.name}</h4> </Link>
          <Link to={linkDest}><img className={styles.streamPreviewImg} src={stream.imageUrl} /> </Link>
          <Link className={styles.linkWhite} to={linkDest}><h5 className={styles.streamPreviewTitle}>{stream.title}</h5> </Link>
          <div className={styles.streamPreviewVolume}>Bet Volume: {stream.betVolume}</div>
          <div className={styles.streamPreviewMarkets}>Open Markets: {stream.markets}</div>
        </div>
      )
    });
    return (
      <div>
        <h3>Popular Streams</h3>
        <div className={styles.streamPreviewsContainer}>
          {streamPreviews}
        </div>
      </div>
    );
  }
}

StreamsPage.propTypes = {
};

function mapDispatchToProps(dispatch) {
  return {
    // changeRoute: (url) => dispatch(push(url)),
  };
}

export default connect(null, mapDispatchToProps)(StreamsPage);
