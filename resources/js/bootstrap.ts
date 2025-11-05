import axios from 'axios';
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import weekday from 'dayjs/plugin/weekday';

// Extend dayjs with plugins Ant Design DatePicker expects (weekday(), localeData(), etc.)
dayjs.extend(weekday);
dayjs.extend(localeData);

window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
