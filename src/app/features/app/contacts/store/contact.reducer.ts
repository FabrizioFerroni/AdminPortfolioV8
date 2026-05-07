import { createFeature, createReducer, on } from '@ngrx/store';
import { ContactState } from '../interfaces';
import { ContactsActions } from './contact.action';

const initialState: ContactState = {
  contacts: [],
  selected: null,
  meta: null,
  isLoading: false,
  error: null,
  statusCode: null,
  stats: null,
  isLoadingStats: false,
};

export const contactFeature = createFeature({
  name: 'contacts',
  reducer: createReducer(
    initialState,

    on(ContactsActions.getAll, state => ({
      ...state,
      isLoading: true,
      error: null,
      statusCode: null,
    })),

    on(ContactsActions.getAllSuccess, (state, { data }) => ({
      ...state,
      isLoading: false,
      contacts: data.contacts,
      meta: data.meta,
    })),

    on(ContactsActions.getAllFailure, (state, { error, statusCode }) => ({
      ...state,
      isLoading: false,
      error,
      statusCode,
    })),

    on(ContactsActions.getByIdSuccess, (state, { contact }) => ({
      ...state,
      selected: contact,
    })),

    on(ContactsActions.getByIdFailure, (state, { error, statusCode }) => ({
      ...state,
      error,
      statusCode,
    })),

    on(ContactsActions.clearError, state => ({
      ...state,
      error: null,
      statusCode: null,
    })),

    on(ContactsActions.getStats, state => ({
      ...state,
      isLoading: true,
      error: null,
      statusCode: null,
      isLoadingStats: true,
    })),

    on(ContactsActions.getStatsSuccess, (state, { stats }) => ({
      ...state,
      isLoading: false,
      isLoadingStats: false,
      stats,
    })),

    on(ContactsActions.getStatsFailure, (state, { error, statusCode }) => ({
      ...state,
      isLoading: false,
      isLoadingStats: false,
      error,
      statusCode,
    })),

    on(ContactsActions.updateStatus, state => ({
      ...state,
      isLoading: true,
      error: null,
      statusCode: null,
    })),

    on(ContactsActions.updateStatusSuccess, (state, { id, status }) => ({
      ...state,
      isLoading: false,
      contacts: state.contacts.map(c => (c.id === id ? { ...c, status } : c)),
      stats: state.stats,
    })),

    on(ContactsActions.updateStatusFailure, (state, { error, statusCode }) => ({
      ...state,
      isLoading: false,
      error,
      statusCode,
    })),

    on(ContactsActions.delete, state => ({
      ...state,
      isLoading: true,
      error: null,
      statusCode: null,
    })),

    on(ContactsActions.deleteSuccess, (state, { id }) => ({
      ...state,
      isLoading: false,
      subscricontactsbers: state.contacts.filter(s => s.id !== id),
    })),

    on(ContactsActions.deleteFailure, (state, { error, statusCode }) => ({
      ...state,
      isLoading: false,
      error,
      statusCode,
    }))
  ),
});
