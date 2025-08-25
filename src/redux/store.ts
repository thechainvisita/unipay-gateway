import { createStore, applyMiddleware, AnyAction } from 'redux';
import { thunk, ThunkDispatch } from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension';
import rootReducer from './rootReducer';

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

export default store;

