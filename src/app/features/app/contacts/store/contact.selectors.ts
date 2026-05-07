import { contactFeature } from './contact.reducer';

export const selectContacts = contactFeature.selectContacts;
export const selectContactsLoading = contactFeature.selectIsLoading;
export const selectContactsError = contactFeature.selectError;
export const selectSelectedContact = contactFeature.selectSelected;
export const selectContactsStatusCode = contactFeature.selectStatusCode;
export const selectContactMeta = contactFeature.selectMeta;
export const selectContactstats = contactFeature.selectStats;
export const selectContactstatsLoading = contactFeature.selectIsLoadingStats;
