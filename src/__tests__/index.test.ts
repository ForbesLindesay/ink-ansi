import InkAnsiText, {normalizeString} from '../';

test('InkAnsiText', () => {
  expect(typeof InkAnsiText).toBe('object');
});
test('normalizeString', () => {
  expect(typeof normalizeString).toBe('function');
  // TODO: test cases for normalizing strings
});
