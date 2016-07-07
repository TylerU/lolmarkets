import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import _ from 'lodash';
import { Link } from 'react-router';

import styles from './styles.css';

class EmbeddedTwitchPlayer extends React.Component {
  render() {
    return (
      <div>
        <iframe
          className={styles.frame}
          muted="true"
          autoPlay={0}
          frameBorder="0"
          src={`http://player.twitch.tv/?channel=${this.props.stream}&autoplay=false`}
          scrolling="no"
          allowFullScreen>
        </iframe>
      </div>
    );
  }

}
export class StreamPage extends React.Component {
  render() {
    const stream = {
      name: 'Voyboy',
      imageUrl: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_scarra-320x180.jpg',
      betVolume: 50,
      markets: 2,
      title: 'Voyboy | im the best league player in my room'
    };

    return (
      <div>
        <h3>{stream.name}</h3>
        <div className={styles.embedContainer}>
          <div className={styles.embedItem}>
            <EmbeddedTwitchPlayer stream={stream.name} />
          </div>
        </div>
        <div>
          <h3>Open Markets</h3>
          <div>
            Nothing here
          </div>
        </div>
      </div>
    );
  }
}

StreamPage.propTypes = {
};

function mapDispatchToProps(dispatch) {
  return {
    // changeRoute: (url) => dispatch(push(url)),
  };
}

export default connect(null, mapDispatchToProps)(StreamPage);
