import { colors } from '@erxes/ui/src';

export const statusColorConstant = [
  {
    name: 'In_Progress',
    label: 'In Progress',
    color: colors.colorCoreBlue
  },
  {
    name: 'Unacceptable',
    label: 'Unacceptable',
    color: colors.colorCoreBlack
  },
  {
    name: 'Error',
    label: 'Error',
    color: colors.colorCoreRed
  },
  {
    name: 'Warning',
    label: 'Warning',
    color: colors.colorCoreYellow
  },
  {
    name: 'Danger',
    label: 'Danger',
    color: colors.colorCoreOrange
  },
  {
    name: 'Success',
    label: 'Success',
    color: colors.colorCoreGreen
  },
  {
    name: 'No_Result',
    label: 'No Result',
    color: colors.colorCoreGray
  }
];

export const COLORS = [
  colors.colorCoreGreen,
  colors.colorCoreYellow,
  colors.colorCoreOrange,
  colors.colorCoreRed,
  colors.colorCoreBlack
];

export const calculateMethods = [
  {
    value: '',
    label: 'Choose Calculate Method'
  },
  {
    value: 'Addition',
    label: 'Addition'
  },
  {
    value: 'Multiply',
    label: 'Multiply'
  }
];

export const subMenu = [
  { title: 'Risk assessments', link: '/settings/risk-assessments' },
  { title: 'Configs', link: '/settings/risk-assessment-configs' },
  { title: 'Submissions', link: '/settings/risk-assessment-submissions' }
];

export const cardTypes = [
  {
    value: '',
    label: 'Choose Type'
  },
  {
    value: 'task',
    label: 'Task'
  },
  {
    value: 'ticket',
    label: 'Ticket'
  }
];
