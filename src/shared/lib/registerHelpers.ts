import Handlebars from 'handlebars';

import authorMessage from '../helpers/authorMessage';
import formatDate from '../helpers/formatDate';
import getIcon from '../helpers/getIcon';
import messageTypeText from '../helpers/messageTypeText';

const HELPERS = [
  {
    name: 'formatDate',
    fn: formatDate,
  },
  {
    name: 'getIcon',
    fn: getIcon,
  },
  {
    name: 'authorMessage',
    fn: authorMessage,
  },
  {
    name: 'messageTypeText',
    fn: messageTypeText,
  },
];

export const registerHelpers = () => {
  HELPERS.forEach((h) => Handlebars.registerHelper(h.name, h.fn));
};
