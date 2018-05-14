import murmurHash from 'murmur2js';
import sortObjectKeys from './sortObjectKeys';

const hashStyle = obj => obj ? murmurHash(JSON.stringify(sortObjectKeys(obj))) : 0;

export default hashStyle;
