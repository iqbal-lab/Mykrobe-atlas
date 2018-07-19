/* @flow */

import { combineReducers } from 'redux';
import notifications from './notifications';

export {
  NotificationCategories,
  getNotifications,
  getFilteredNotifications,
  showNotification,
  hideNotification,
  hideAllNotifications,
  dismissNotification,
  dismissAllNotifications,
  setNotificationExpanded,
  updateNotification,
  notificationsSaga as rootNotificationsSaga,
} from './notifications';

const reducer = combineReducers({
  notifications,
});

export default reducer;
