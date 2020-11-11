import {randomInt} from 'crypto';

import chalk = require('chalk');
import React = require('react');
import {render, Box, Text} from 'ink';
import InkAnsiText from '.';

const withChalk = process.argv.includes('--chalk');
const withEmoji = process.argv.includes('--emoji');
const withControlSequences = process.argv.includes('--ctrl');
const withNesting = process.argv.includes('--nest');

const withStandardText = process.argv.includes('--standard');

const names = [
  'James',
  'John',
  'Robert',
  'Michael',
  'William',
  'David',
  'Richard',
  'Charles',
  'Joseph',
  'Thomas',
  'Christopher',
  'Daniel',
  'Paul',
  'Mark',
  'Donald',
  'George',
  'Kenneth',
  'Steven',
  'Edward',
  'Brian',
  'Ronald',
  'Anthony',
  'Kevin',
  'Jason',
  'Matthew',
  'Gary',
  'Timothy',
  'Jose',
  'Larry',
  'Jeffrey',
  'Frank',
  'Scott',
  'Eric',
  'Stephen',
  'Andrew',
  'Raymond',
  'Gregory',
  'Joshua',
  'Mary',
  'Patricia',
  'Linda',
  'Barbara',
  'Elizabeth',
  'Jennifer',
  'Maria',
  'Susan',
  'Margaret',
  'Dorothy',
  'Lisa',
  'Nancy',
  'Karen',
  'Betty',
  'Helen',
  'Sandra',
  'Donna',
  'Carol',
  'Ruth',
  'Sharon',
  'Michelle',
  'Laura',
  'Sarah',
  'Kimberly',
  'Deborah',
  'Jessica',
  'Shirley',
  'Cynthia',
  'Angela',
  'Melissa',
  'Brenda',
  'Amy',
  'Anna',
  'Rebecca',
  'Virginia',
  'Kathleen',
  'Pamela',
  'Martha',
  'Debra',
  'Amanda',
  'Stephanie',
  'Carolyn',
  'Christine',
  'Marie',
  'Janet',
  'Catherine',
  'Frances',
  'Ann',
  'Joyce',
];
const emojis = [
  '😀',
  '😃',
  '😄',
  '😁',
  '😆',
  '😅',
  '🤣',
  '😂',
  '🍻',
  '🍺',
  '😊',
];

const ForegroundColor: readonly typeof chalk.ForegroundColor[] = [
  'black',
  'red',
  'green',
  'yellow',
  'blue',
  'magenta',
  'cyan',
  'white',
  'gray',
  'grey',
  'blackBright',
  'redBright',
  'greenBright',
  'yellowBright',
  'blueBright',
  'magentaBright',
  'cyanBright',
  'whiteBright',
];

// const BackgroundColor: readonly typeof chalk.BackgroundColor[] = [
//   'bgBlack',
//   'bgRed',
//   'bgGreen',
//   'bgYellow',
//   'bgBlue',
//   'bgMagenta',
//   'bgCyan',
//   'bgWhite',
//   'bgGray',
//   'bgGrey',
//   'bgBlackBright',
//   'bgRedBright',
//   'bgGreenBright',
//   'bgYellowBright',
//   'bgBlueBright',
//   'bgMagentaBright',
//   'bgCyanBright',
//   'bgWhiteBright',
// ];

const Modifiers: readonly typeof chalk.Modifiers[] = [
  'reset',
  'bold',
  'dim',
  'italic',
  'underline',
  // 'inverse',
  'hidden',
  'strikethrough',
  // 'visible',
];

const controlSequences = [
  '\u001b[36m',
  '\u001b[2K',
  '\u001b[1G',
  // '\r',
];

function randomEntry<T>(entries: readonly T[]): T {
  const index = randomInt(0, entries.length);
  return entries[index];
}

function randomOrder<T>(entries: readonly T[]): T[] {
  return entries
    .map((e) => [e, Math.random()] as const)
    .sort(([, a], [, b]) => a - b)
    .map(([value]) => value);
}

function useRandomLines() {
  const [lines, setLines] = React.useState<string[]>([]);
  React.useEffect(() => {
    let timeout: NodeJS.Timeout;
    function addLine() {
      const length = 15; // randomInt(2, 30);
      const line: string[] = [];
      for (let i = 0; i < length; i++) {
        let text = randomEntry([
          ...names,
          ...(withEmoji ? emojis : []),
          ...(withControlSequences
            ? [...controlSequences, ...controlSequences, ...controlSequences]
            : []),
        ]);
        if (withChalk) {
          for (const key of randomOrder([
            randomEntry([randomEntry(ForegroundColor)]),
            // randomEntry([randomEntry(BackgroundColor)]),
            randomEntry([randomEntry(Modifiers)]),
          ])) {
            if (key) {
              text = chalk[key](text);
            }
          }
        }
        line.push(text);
      }
      setLines((lines) =>
        [
          ...lines,
          line.join(
            randomEntry([' ', ' ', randomEntry(['\t', '\r\n', '\n', '\r '])]),
          ),
        ].slice(-5),
      );
    }
    function run() {
      timeout = setTimeout(() => {
        addLine();
        run();
      }, randomInt(500, 1000));
    }
    for (let i = 0; i < 5; i++) {
      addLine();
    }
    run();
    return () => clearTimeout(timeout);
  }, []);
  return lines;
}

function FakeTerminalOutput() {
  const lines = useRandomLines();
  return (
    <>
      {lines.map((line, i) =>
        withStandardText ? (
          withNesting ? (
            <Text key={i}>
              <Text color="greenBright">[</Text>
              <Text>{line}</Text>
              <Text color="greenBright">]</Text>
            </Text>
          ) : (
            <Text key={i}>{line}</Text>
          )
        ) : withNesting ? (
          <InkAnsiText key={i}>
            <InkAnsiText color="greenBright">[</InkAnsiText>
            <Text>{line}</Text>
            <InkAnsiText color="greenBright">]</InkAnsiText>
          </InkAnsiText>
        ) : (
          <InkAnsiText key={i}>{line}</InkAnsiText>
        ),
      )}
    </>
  );
}

function Demo() {
  return (
    <Box flexDirection="column">
      <Box flexDirection="row" marginX={1} marginBottom={1}>
        <Box
          flexDirection="column"
          flexBasis={0}
          flexGrow={1}
          marginRight={1}
          borderStyle="single"
        >
          <FakeTerminalOutput />
        </Box>
        <Box
          flexDirection="column"
          flexBasis={0}
          flexGrow={1}
          marginRight={1}
          borderStyle="single"
        >
          <FakeTerminalOutput />
        </Box>
        <Box
          flexDirection="column"
          flexBasis={0}
          flexGrow={1}
          borderStyle="single"
        >
          <FakeTerminalOutput />
        </Box>
      </Box>
      <Box flexDirection="row" marginX={1} marginBottom={1}>
        <Box
          flexDirection="column"
          flexBasis={0}
          flexGrow={1}
          marginRight={1}
          borderStyle="single"
        >
          <FakeTerminalOutput />
        </Box>
        <Box
          flexDirection="column"
          flexBasis={0}
          flexGrow={1}
          borderStyle="single"
        >
          <FakeTerminalOutput />
        </Box>
      </Box>
      <Box
        flexDirection="column"
        marginX={1}
        marginBottom={1}
        borderStyle="single"
      >
        <FakeTerminalOutput />
      </Box>
    </Box>
  );
}
render(<Demo />);
