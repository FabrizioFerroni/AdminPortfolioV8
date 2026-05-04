import { createFeature, createReducer, on } from '@ngrx/store';
import { SubscribersState } from '../interfaces/subscribers-state.interface';
import { SubscribersActions } from './subscriber.action';

const initialState: SubscribersState = {
  subscribers: [],
  selected: null,
  meta: null,
  isLoading: false,
  error: null,
  statusCode: null,
  stats: null,
  isLoadingStats: false,
};

export const subscribersFeature = createFeature({
  name: 'subscribers',
  reducer: createReducer(
    initialState,

    on(SubscribersActions.getAll, state => ({
      ...state,
      isLoading: true,
      error: null,
      statusCode: null,
    })),

    on(SubscribersActions.getAllSuccess, (state, { data }) => ({
      ...state,
      isLoading: false,
      subscribers: data.subscribers,
      meta: data.meta,
    })),

    on(SubscribersActions.getAllFailure, (state, { error, statusCode }) => ({
      ...state,
      isLoading: false,
      error,
      statusCode,
    })),

    on(SubscribersActions.getByIdSuccess, (state, { subscriber }) => ({
      ...state,
      selected: subscriber,
    })),

    on(SubscribersActions.getByIdFailure, (state, { error, statusCode }) => ({
      ...state,
      error,
      statusCode,
    })),

    on(SubscribersActions.clearError, state => ({
      ...state,
      error: null,
      statusCode: null,
    })),

    on(SubscribersActions.delete, state => ({
      ...state,
      isLoading: true,
      error: null,
      statusCode: null,
    })),

    on(SubscribersActions.deleteSuccess, (state, { email }) => ({
      ...state,
      isLoading: false,
      subscribers: state.subscribers.filter(s => s.email !== email),
    })),

    on(SubscribersActions.deleteFailure, (state, { error, statusCode }) => ({
      ...state,
      isLoading: false,
      error,
      statusCode,
    })),

    on(SubscribersActions.getStats, state => ({
      ...state,
      isLoading: true,
      error: null,
      statusCode: null,
      isLoadingStats: true,
    })),

    on(SubscribersActions.getStatsSuccess, (state, { stats }) => ({
      ...state,
      isLoading: false,
      isLoadingStats: false,
      stats,
    })),

    on(SubscribersActions.getStatsFailure, (state, { error, statusCode }) => ({
      ...state,
      isLoading: false,
      isLoadingStats: false,
      error,
      statusCode,
    }))
  ),
});
