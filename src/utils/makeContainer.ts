import Redis from 'ioredis';
import Container from 'typedi';

import { redisPass } from '../../config';

const redis = new Redis({ password: redisPass });

Container.set('redis', redis);

export default Container;
