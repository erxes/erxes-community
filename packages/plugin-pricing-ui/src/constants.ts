import { __ } from '@erxes/ui/src/utils';

export const SUBMENU = [{ title: __('Discounts'), link: '/pricing/discounts' }];

export const STATUS_FILTER_OPTIONS = ['active', 'archived', 'completed'];

export const WEEK_OPTIONS = [
  {
    label: 'Monday',
    value: 1
  },
  {
    label: 'Tuesday',
    value: 2
  },
  {
    label: 'Wednesday',
    value: 3
  },
  {
    label: 'Thursday',
    value: 4
  },
  {
    label: 'Friday',
    value: 5
  },
  {
    label: 'Saturday',
    value: 6
  },
  {
    label: 'Sunday',
    value: 7
  }
];

export const REPEAT_OPTIONS = [
  {
    label: 'Every Day',
    value: 'everyDay'
  },
  {
    label: 'Every Week',
    value: 'everyWeek'
  },
  {
    label: 'Every Month',
    value: 'everyMonth'
  },
  {
    label: 'Every Year',
    value: 'everyYear'
  }
];

export const DATE_OPTIONS = [
  {
    label: 'Day',
    value: 'day'
  },
  {
    label: 'Week',
    value: 'week'
  },
  {
    label: 'Month',
    value: 'month'
  },
  {
    label: 'Year',
    value: 'year'
  }
];
