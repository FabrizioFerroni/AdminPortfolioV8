import { subscribersFeature } from './subscribers.reducer';

export const selectSubscribers = subscribersFeature.selectSubscribers;
export const selectSubscribersLoading = subscribersFeature.selectIsLoading;
export const selectSubscribersError = subscribersFeature.selectError;
export const selectSelectedSubscriber = subscribersFeature.selectSelected;
export const selectSubscribersStatusCode = subscribersFeature.selectStatusCode;
export const selectSubscriberMeta = subscribersFeature.selectMeta;
export const selectSubscriberStats = subscribersFeature.selectStats;
export const selectSubscriberStatsLoading = subscribersFeature.selectIsLoadingStats;
