local id = ARGV[1];

redis.call('del', 'room:'..id);
redis.call('lrem', 'rooms', 1, id);