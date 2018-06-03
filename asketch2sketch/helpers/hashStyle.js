import murmurHash from 'murmur2js';
import sortObjectKeys from './sortObjectKeys';

export default function hashStyle(obj) {
  return obj ? murmurHash(JSON.stringify(sortObjectKeys(obj))) : 0;
}
