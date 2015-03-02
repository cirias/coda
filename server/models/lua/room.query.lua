local start = ARGV[1];
local stop = ARGV[2];
local roomIds = redis.call('lrange', 'rooms', start, stop);
local rooms = {};
for i, roomId in ipairs(roomIds) do
	table.insert(rooms, redis.call('get', 'room:'..roomId));
end
return rooms;