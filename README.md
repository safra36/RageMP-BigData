# RageMP-BigData
This plugin was created for experiment and might not be what you are looking for, this is intended to be used for sending big data to clients in chunks to make the size unlimited for the server owners, this will eliminate original rage-mp events limit and will be as fast as them when being used for small data, but i suggest that you use original ones just in case.


# API

for obvious reasons i made this only to go from server-side to client-side and not client-side to server-side, there is a commented code about this and with a bit of knowlegde you can get it to work but it's not recommended since it will basically flood your server if you have many players so stay of it!

## Server-Side Functions
```js
/*
    Send a big data to a player

    @player -> valid muliplayer player object
    @eventName -> the event which is defined on client-side (just a normal event name)
    @DataArray -> It's an array of data like how player.call works, and it supports all types of data (objects, numbers, strings with no effect on the typing!)
 */
player.callBig(eventName, DataArray)

/*
    Send a big data to all players

    @eventName -> the event which is defined on client-side (just a normal event name)
    @DataArray -> It's an array of data like how player.call works, and it supports all types of data (objects, numbers, strings with no effect on the typing!
 */
mp.players.callBig(eventName, DataArray)

/*
    Set a big shared variable on players

    @name -> name of the data
    @data -> any type of data
 */
player.setBigVariable(name, data)

/*
    Get a previously set shared data on the client
    @name -> name of the data
 */
player.getBigVariable(name)
```

## Server-Side Events
```js
/*
    Detemine if a data has been fully received by the client

    @player playerObject which has sent this signal
    @id Id of the data sending session
    @eventName Name of the even you have been called on the client previously using callBig
 */
mp.events.add('DataSender:End', (player, id, eventName) => {})
```

## Client-Side Functions
```js
/*
    Get a shared variable of a player

    @name data name that was set on the player
 */
player.getBigVariable(name)
```

## Client-Side Events
```js
/*
    Get notified when a shared data get's updated on server-side

    @dataName shared data name
    @entityId id of the entity which this it's shared data has been updated (currently it's only a player)
    @type get type of entity which is updated (player, object, vehicle, ped but currenly it's only player)
    @oldData previously set data if it's forst time then it's undefined
    @newData the latest data has been set on this name
 */
mp.events.addBigDataHandler(dataName, (entityId, type, oldData, newData) => {})
```

# Example (BigData Event Sample)

## Server-Side
```js
// Big data is an array of rage-mp cloths (something around 15MB of data) and other ones are regular data (can be big data as well)
player.callBig('GetBigData', [BigData, 'Some Other Test Arguments', 3]);
```

## Client-Side
```js
mp.events.add('GetBigData', (BigJSONData, args1, argg2) => {
    mp.gui.chat.push(`Data: ${BigJSONData['Tops']['Male']['NONE'][0].name} - Type: ${typeof(BigJSONData)}`);
    mp.gui.chat.push(`Data: ${args1} - Type: ${typeof(args1)}`);
    mp.gui.chat.push(`Data: ${argg2} - Type: ${typeof(argg2)}`);
})
```

## Results
![Result of proccess](https://i.imgur.com/d7a7UiN.png)

# Benchmark
Well, the time it takes to transfer the data really depends on player network speed, data chunk size and the size of the data it self.
For testing, i sent a very big json file contaning all rage-mp clothing with their torsos and names and prices (which i use on server-side my self), the file is something around 15MB, it took something about ~3s to transfer the whole data to the client, this is a beta version of the library but any help is accepted for optimizations.


# Installation
- Copy all the files to your packages/client-packages
- Make sure to add the client-side file to your index.js
- Enjoy!