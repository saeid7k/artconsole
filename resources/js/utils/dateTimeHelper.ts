import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import dayjs from 'dayjs';
import { usePage } from '@inertiajs/react';

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

const dayjsUserTz = (date?: string, userTimezone?: string) => {
  let tz = usePage().props.auth?.user?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || '';

  if (!date) {
    return dayjs().tz(userTimezone ?? tz);
  } else if (!date.includes('T') && !date.includes(' ')) {
    return dayjs(date);
  } else {
    return dayjs.utc(date).tz(userTimezone ?? tz);
  }
};

const timeZoneOptions = getTimezoneOptions();

export { timeZoneOptions, dayjsUserTz };
