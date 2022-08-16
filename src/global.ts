import consola from 'consola';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';
import { original } from 'immer';

window.__original = original;
window.__consola = consola;

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');
