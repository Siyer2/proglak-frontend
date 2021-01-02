const config = require('../config/index.json');
const mixpanel = require('mixpanel-browser');

export function trackEvent(eventName: string, otherData?: object) {
    mixpanel.init(config.MIXPANEL_TOKEN);
    mixpanel.track(eventName, otherData ? otherData : null);
}