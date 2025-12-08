import dotenv from 'dotenv';

dotenv.config({ quiet: true });

export default {
    server: {
        protocol: 'http',
        host: 'localhost',
        port: 3000
    }
}