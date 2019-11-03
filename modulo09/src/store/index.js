import createSagaMiddleware from 'redux-saga';
import createStore from './createStore';

import rootReducer from './modules/rootReducer';
import rootSaga from './modules/rootSaga';

const sagaMonitor =
  process.env.NODE_ENV === 'development'
    ? console.tron.createSagaMonitor
    : null;

const sagaMiddleWare = createSagaMiddleware({ sagaMonitor });

const middlewares = [sagaMiddleWare];

const store = createStore(rootReducer, middlewares);

sagaMiddleWare.run(rootSaga);

export default store;
