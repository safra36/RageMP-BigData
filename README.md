# RageMP-BigData
This plugin was created for experiment and might not be what you are looking for, this is intended to be used for sending big data to clients in chunks to make the size unlimited for the server owners, this will eliminate original rage-mp events limit and will be as fast as them when being used for small data, but i suggest that you use original ones just in case.


# API (Server-Side Only)
for obvious reasons i made this only to go from server-side to client-side and not client-side to server-side, there is a commented code about this and with a bit of knowlegde you can get it to work but it's not recommended since it will basically flood your server if you have many players so stay of it!

```js
/*
    @player -> valid muliplayer player object
    @eventName -> the event which is defined on client-side (just a normal event name)
    @Data -> it must be an string, if you are sending big json data just stringify it then parse it on client-side agian.

    ! no arguments are supported, the only thing you can pass is only a big data (no limit)
 */
player.callBig(player, eventName, Data)
```


# Benchmark
Well, the time it takes to transfer the data really depends on player network speed, data chunk size and the size of the data it self.
For testing, i sent a very big json file contaning all rage-mp clothing with their torsos and names and prices (which i use on server-side my self), the file is something around 15MB, it took something about ~3s to transfer the whole data to the client, this is a beta version of the library but any help is accepted for optimizations.


# Installation
- Copy all the files to your packages/client-packages
- Make sure to add the client-side file to your index.js
- Enjoy!