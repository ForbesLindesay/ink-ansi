import React = require('react');
import {Text, TextProps} from 'ink';
import ansiRegex = require('ansi-regex');
const {visible} = require('unicoderegexp');

function stripAnsiControlCharacters(str: string) {
  return str.replace(ansiRegex(), (str) => (str.endsWith('m') ? str : ''));
}

function stripSpecialCharacters(str: string) {
  // we leave `\u001b` in to allow for setting colours via ansi escape sequences
  // you should make sure to use stripAnsiControlCharacters though.
  return str
    .replace(/\t/g, ' ')
    .replace(/\r?\n/g, ' ')
    .split('')
    .filter((c) => c === '\u001b' || visible.test(c) || / /.test(c))
    .join('');
  // return str.replace(/[^\u0020-\u007e\u00a1-\u024f\u001b]/g, '');
}

export function normalizeString(str: string): string {
  return stripSpecialCharacters(stripAnsiControlCharacters(str));
}
function recursivelyNormalize(children: React.ReactNode): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (typeof child === 'string') {
      return normalizeString(child);
    }
    if (
      React.isValidElement(child) &&
      (child.type === InkAnsiText || child.type === Text)
    ) {
      return {
        ...child,
        type: Text,
        props: {
          ...child.props,
          children: recursivelyNormalize(child.props.children),
        },
      };
    }
    if (Array.isArray(child)) {
      return recursivelyNormalize(child);
    }
    return child;
  });
}
const InkAnsiText: React.NamedExoticComponent<TextProps> = React.memo(
  ({children, ...otherProps}: TextProps) => {
    return <Text {...otherProps}>{recursivelyNormalize(children)}</Text>;
  },
);
InkAnsiText.displayName = 'InkAnsiText';
export default InkAnsiText;

module.exports = Object.assign(InkAnsiText, {
  default: InkAnsiText,
  normalizeString,
});
