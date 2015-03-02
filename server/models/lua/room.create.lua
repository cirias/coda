local id = ARGV[1];
local value = ARGV[2];

redis.call('set', 'room:'..id, value);
redis.call('rpush', 'rooms', id);