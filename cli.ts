import { connectRedis } from "./redis/client";
import { addGroup, showGroups } from "./redis/link"
import readline from 'readline';

await connectRedis();