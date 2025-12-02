import { connectRedis } from './redis/client';
import { addGroup,addLinkToGroup, showGroups } from './redis/link';

await connectRedis();