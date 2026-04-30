import { expect, test } from '@playwright/test';

import {
  elementMatchesAnyLabel,
  labelMatchesEntry,
  normalizeLabel,
  query,
  queryAll,
} from '../../src/content/dom';

type SelectorRoot = Pick<ParentNode, 'querySelector' | 'querySelectorAll'>;

function makeRoot(matches: Element[]): ParentNode {
  const root: SelectorRoot = {
    querySelector: <T extends Element = Element>(selector: string): T | null => {
      if (selector === 'throw') {
        throw new DOMException('Invalid selector');
      }

      return (matches[0] ?? null) as T | null;
    },
    querySelectorAll: <T extends Element = Element>(selector: string): NodeListOf<T> => {
      if (selector === 'throw') {
        throw new DOMException('Invalid selector');
      }

      return matches as unknown as NodeListOf<T>;
    },
  };

  return root as unknown as ParentNode;
}

function makeElementLabel(
  attributes: Partial<Record<'aria-label' | 'title', string>>,
  textContent = '',
): Element {
  return {
    getAttribute: (name: string) => attributes[name as 'aria-label' | 'title'] ?? null,
    textContent,
  } as unknown as Element;
}

test('query helpers return matches and swallow invalid selectors', () => {
  const first = makeElementLabel({ 'aria-label': 'First' });
  const second = makeElementLabel({ 'aria-label': 'Second' });
  const root = makeRoot([first, second]);

  expect(query('valid', root)).toBe(first);
  expect(queryAll('valid', root)).toEqual([first, second]);
  expect(query('throw', root)).toBeNull();
  expect(queryAll('throw', root)).toEqual([]);
});

test('normalizeLabel removes chevrons, folds whitespace, and lowercases text', () => {
  expect(normalizeLabel('  YouTube  Music ›  Selected >  ')).toBe('youtube music selected');
  expect(normalizeLabel('\nSubscriptions\tLink')).toBe('subscriptions link');
});

test('labelMatchesEntry accepts YouTube sidebar label variants without overmatching', () => {
  expect(labelMatchesEntry('subscriptions', 'Subscriptions')).toBe(true);
  expect(labelMatchesEntry('subscriptions subscriptions', 'Subscriptions')).toBe(true);
  expect(labelMatchesEntry('subscriptions selected', 'Subscriptions')).toBe(true);
  expect(labelMatchesEntry('subscriptions link', 'Subscriptions')).toBe(true);
  expect(labelMatchesEntry('my subscriptions', 'Subscriptions')).toBe(false);
  expect(labelMatchesEntry('subscriptions and more', 'Subscriptions')).toBe(false);
});

test('elementMatchesAnyLabel combines aria label, title, and text before matching', () => {
  const matchingElement = makeElementLabel({ 'aria-label': 'Explore ›' }, 'Selected');
  const blankElement = makeElementLabel({});
  const unrelatedElement = makeElementLabel({ title: 'Library' }, 'History');

  expect(elementMatchesAnyLabel(matchingElement, ['Explore'])).toBe(true);
  expect(elementMatchesAnyLabel(blankElement, ['Explore'])).toBe(false);
  expect(elementMatchesAnyLabel(unrelatedElement, ['Explore'])).toBe(false);
});
