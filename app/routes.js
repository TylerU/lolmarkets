// These are the pages you can go to.
// They are all wrapped in the App component, which should contain the navbar etc
// See http://blog.mxstbr.com/2016/01/react-apps-with-pages for more information
// about the code splitting business
import { getAsyncInjectors } from './utils/asyncInjectors';

const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};

const loadModuleName = (cb, name) => (componentModule) => {
  cb(null, componentModule[name]);
};



export default function createRoutes(store) {
  // create reusable async injectors using getAsyncInjectors factory
  const { injectReducer, injectSagas } = getAsyncInjectors(store);

  const redirectIfLoggedIn = (nextState, replace) => {
    if (store.getState().getIn(['user', 'loggedIn'])) {
      replace('/streams');
    }
  };

  return [
    {
      path: '/',
      name: 'home',
      getComponent(nextState, cb) {
        // const importModules = Promise.all([
        //   System.import('containers/HomePage/reducer'),
        //   System.import('containers/HomePage/sagas'),
        //   System.import('containers/HomePage'),
        // ]);
        //
        // const renderRoute = loadModule(cb);
        //
        // importModules.then(([reducer, sagas, component]) => {
        //   injectReducer('home', reducer.default);
        //   injectSagas(sagas.default);
        //
        //   renderRoute(component);
        // });
        //
        // importModules.catch(errorLoading);
        System.import('containers/ChannelsPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    }, {
      path: '/portfolio',
      name: 'portfolio',
      getComponent(nextState, cb) {
        System.import('containers/PortfolioPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    }, {
      path: '/help',
      name: 'help',
      getComponent(nextState, cb) {
        System.import('containers/HomePage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    }, {
      path: '/leaderboard',
      name: 'leaderboard',
      getComponent(nextState, cb) {
        System.import('containers/LeaderboardPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    }, {
      path: '/login',
      name: 'login',
      onEnter: redirectIfLoggedIn,
      getComponent(nextState, cb) {
        System.import('containers/LoginPage')
          .then(loadModuleName(cb, 'LoginPage'))
          .catch(errorLoading);
      },
    }, {
      path: '/register',
      name: 'register',
      onEnter: redirectIfLoggedIn,
      getComponent(nextState, cb) {
        System.import('containers/LoginPage')
          .then(loadModuleName(cb, 'RegisterPage'))
          .catch(errorLoading);
      },
    }, {
      path: '/streams',
      name: 'streams',
      getComponent(nextState, cb) {
        System.import('containers/ChannelsPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    }, {
      path: '/stream/:streamName',
      name: 'stream',
      getComponent(nextState, cb) {
        System.import('containers/ChannelPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    }, {
      path: '*',
      name: 'notfound',
      getComponent(nextState, cb) {
        System.import('containers/NotFoundPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    },
  ];
}
