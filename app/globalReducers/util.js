import { take, actionChannel } from 'redux-saga/effects';
import { takeEvery, buffers } from 'redux-saga';
import { REAUTH_SUCCESS, REAUTH_ERROR } from 'globalReducers/user/constants';

// ALL WATCHERS THAT CALL API FUNCTIONS THAT MIGHT EVER REQUIRE LOGIN SHOULD USE THIS
// it's unfortunate that I can't find a better way to remind myself of this. Hello future bugs
export function* wrapWatcherWaitOnAuth(action, worker) {
  const chan = yield actionChannel(action, buffers.expanding());
  yield take([REAUTH_SUCCESS, REAUTH_ERROR]);
  yield* takeEvery(chan, worker);
}
