import murmurHash from 'murmur2js';
import sortObjectKeys from './sortObjectKeys';

const hashStyle = obj => murmurHash(JSON.stringify(sortObjectKeys(obj)));

export default hashStyle;