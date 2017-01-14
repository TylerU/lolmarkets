import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Link } from 'react-router';
import MoneyIcon from 'components/MoneyIcon';
import { createStructuredSelector } from 'reselect';
import { YesShareIcon, NoShareIcon } from 'components/ShareIcons';

import styles from './styles.css';

export class HomePage extends React.Component {
  /**
   * when initial state username is not null, submit the form to load repos
   */
  componentDidMount() {

  }

  /**
   * Changes the route
   *
   * @param  {string} route The route we want to go to
   */
  openRoute = (route) => {
    this.props.changeRoute(route);
  };

  /**
   * Changed route to '/features'
   */
  openFeaturesPage = () => {
    this.openRoute('/features');
  };

  render() {
    const questions = [
      {
        question: 'What is all this?',
        answer: `Zilean.gg hosts League of Legends prediction markets.
                  Basically, you can bet fake internet money on the outcome of 
                  League streamers' games!`,
      },
      {
        question: 'Why would I want to bet fake internet money on League games?',
        answer: `The ability to correctly predict game outcomes while watching the game live
                is the one of the best objective measures of your League of Legends strategy and metagame 
                knowledge. Furthermore, the act of thoughtfully predicting outcomes
                and learning from our mistakes is a great way to further develop strategic game knowledge
                and reasoning skills.`,
      },
      {
        question: 'Okay, how do I play?',
        answer: (
          <ol>
            <li>Navigate to one of the many <Link to="/streams">Streams</Link> and check out the markets.</li>
            <li><div>Place bets! Each market is associated with a statement such as 'Imaqtpie will win this game' which will eventually be either true or false.
              Within each market, you can buy and sell two fake internet financial instruments:
               Yes Shares (<YesShareIcon style={{ marginRight: '0px' }} />)
              and No Shares (<NoShareIcon style={{ marginRight: '0px' }} />).</div>
              <div>Yes Shares are worth <MoneyIcon/>1 if the statement turns out to be true (if Imaqtpie wins), and are worth nothing if the statement is false.</div>
              <div>No Shares are worth nothing if the statement is true and <MoneyIcon />1 if it is false (that is, Imaqtpie loses).</div>
            </li>
            <li>Watch the stream and update your bets. At any time you can sell the shares you already have, or buy new ones. If Imaqtpie gets first blood and a triple kill 5 minutes in,
              maybe consider stocking up on Yes Shares. If he then goes on to die 13 times in a row, maybe get rid of those Yes Shares and buy up some No Shares
            </li>
            <li>
              Wait for the end of the game. As soon as the game is over, the system will automatically convert your shares into <MoneyIcon /> or clouds of dust, depending on how well you predicted the outcome.
              In our example, if Imaqtpie won the game and you had 10 Yes Shares, you will be given <MoneyIcon />10. If you had any No Shares, the money you used to buy them is now gone forever.
            </li>
          </ol>
        ),
      },
      {
        question: 'Help! I ran out of money!',
        answer: <span>Don't worry, you get a free <MoneyIcon />20 every day, just for logging in, so come back tomorrow and try again.</span>,
      }
    ];
    const qs = questions.map((q, i) => (
      <div key={i} className="">
        <h3>{q.question}</h3>
        <div>
          {q.answer}
        </div>
      </div>
    ));

    return (
      <article>
        <h1>Help / FAQ</h1>
        <div className="well">
          {qs}
        </div>
      </article>
    );
  }
}

HomePage.propTypes = {
};

function mapDispatchToProps(dispatch) {
  return {
    changeRoute: (url) => dispatch(push(url)),
    dispatch,
  };
}

const mapStateToProps = createStructuredSelector({
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
