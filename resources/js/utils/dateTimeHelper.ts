import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import dayjs from 'dayjs';

// Initialize plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const getTimezoneOptions = () => {
  return Intl.supportedValuesOf('timeZone').map((zone) => {
    const now = dayjs().tz(zone);
    const offset = now.format('Z');
    const cityName = zone.replace(/_/g, ' ').replace(/\//g, ' / ') || zone;

    return {
      value: zone,
      label: `(GMT${offset}) ${cityName}`,
      offsetValue: now.utcOffset(),
    };
  })
  .sort((a, b) => a.offsetValue - b.offsetValue);
};

const timeZoneOptions = getTimezoneOptions();

export { timeZoneOptions };
