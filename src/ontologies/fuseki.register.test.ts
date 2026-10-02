/**
 * The ontology's prefix label equals its ontologySlug (`fuseki`), and the pre-alignment label
 * `lincd-fuseki` still expands as a deprecated alias without winning compaction.
 */
import { Prefix } from '@_linked/core/utils/Prefix';
import { FusekiStore } from './fuseki.js';
import './fuseki.register.js';
import { packageExports } from '../package.js';

const NS = 'https://linked.cm/ont/fuseki/';

test('the ontology is registered under the `fuseki` prefix', () => {
  expect(Prefix.getFullURI('fuseki')).toBe(NS);
  expect((packageExports as any).fuseki?._prefix).toBe('fuseki');
});

test('compaction emits `fuseki:`, not the deprecated label', () => {
  expect(Prefix.toPrefixed(FusekiStore.id)).toBe('fuseki:FusekiStore');
});

test('the deprecated `lincd-fuseki:` label still expands', () => {
  expect(Prefix.toFull('lincd-fuseki:FusekiStore')).toBe(`${NS}FusekiStore`);
  expect(Prefix.toFull('fuseki:FusekiStore')).toBe(`${NS}FusekiStore`);
});
