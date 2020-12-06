# RageMP-BigData
This plugin was created for experiment and might not be what you are looking for, this is intended to be used for sending big data to clients in chunks to make the size unlimited for the server owners, this will eliminate original rage-mp events limit and will be as fast as them when being used for small data, but i suggest that you use original ones just in case.


# API

for obvious reasons i made this only to go from server-side to client-side and not client-side to server-side, there is a commented code about this and with a bit of knowlegde you can get it to work but it's not recommended since it will basically flood your server if you have many players so stay of it!

## Server-Side Functions
```js
/**
    Send a big data to a player

    @param player valid muliplayer player object
    @param eventName the event which is defined on client-side (just a normal event name)
    @param DataArray It's an array of data like how player.call works, and it supports all types of data (objects, numbers, strings with no effect on the typing!)
    @callback dataReceived Optional callback triggers when the data is received in full by the client
    @param retry Optional param which is true by default, pass false to disable auto retry (this will cause the data to be lost, added by request but don't use it!)
 */
player.callBig(eventName, DataArray, dataReceived, &retry)

/**
    Send a big data to all players

    @param eventName the event which is defined on client-side (just a normal event name)
    @param DataArray It's an array of data like how player.call works, and it supports all types of data (objects, numbers, strings with no effect on the typing!
    
 */
mp.players.callBig(eventName, DataArray)

/**
    Set a big shared variable on players

    @param name name of the data
    @param data any type of data
    @callback dataReceived Optinal callback triggers when the data is received in full by the client
    @param retry Optional param which is true by default, pass false to disable auto retry (this will cause the data to be lost, added by request but don't use it!)
 */
player.setBigVariable(name, data, dataReceived, &retry)

/**
    Get a previously set shared data on the client
    @param name name of the data
 */
player.getBigVariable(name)

/**
    Set a big private data on client which is only set on a certain client, access it on server-side with player.privateData[dataName]
    You can use player.pdata.name instead from 0.0.3

    @param name name of the data
    @param data any type of data
    @callback dataReceived Optinal callback triggers when the data is received in full by the client
    @param retry Optional param which is true by default, pass false to disable auto retry (this will cause the data to be lost, added by request but don't use it!)
    
 */
player.setPrivateData(name, data, dataReceived, &retry)



/**
    Delete private data on server-side and client-side

    @param name name of the data
 */
player.deletePrivateData(name) 

```


## Server-Side Variables
```js
/**
 * Setter
 * Sets private data on client like setPrivateData but without optional retry
 * Use with try catch, it can only be set if there is no other pending data on the target name (throw error if there is a pending data)
 */
player.pdata.dataName = value


/**
 * Getter
 * Get private data which was set, must be used with await since the data may take time to reach client;
 */
var data = await player.pdata.dataName;
```

## Server-Side Events
```js
/**
    Detemine if a data has been fully received by the client

    @param player playerObject which has sent this signal
    @param id Id of the data sending session
    @param eventName Name of the even you have been called on the client previously using callBig
 */
mp.events.add('DataSender:End', (player, id, eventName) => {})

/**
    This will be called when the sent data was failed (there is an auto retry to put the data on player for sure but see this as a notification)

    @param id Id of the data sending session
    @param dataName Name of the data you have been set on the client
    @param errorCode -1 Means the data could not be parsed on client, -2 means there was some data chunks lost on the send proccess
 */
mp.events.add('DataSender:Failed', (id, dataName, errorCode) => {})
```

## Client-Side Functions
```js
/**
    Get a shared variable of a player

    @param name data name that was set on the player
 */
player.getBigVariable(name)
```

## Client-Side Variables
- You can get client private data using `mp.players.local.privateData[dataName]`

## Client-Side Events
```js
/**
    Get notified when a shared data get's updated on server-side

    @param dataName shared data name
    @param entityId id of the entity which this it's shared data has been updated (currently it's only a player)
    @param type get type of entity which is updated (player, object, vehicle, ped but currenly it's only player)
    @param oldData previously set data if it's forst time then it's undefined
    @param newData the latest data has been set on this name
 */
mp.events.addBigDataHandler(dataName, (entityId, type, oldData, newData) => {})

/**
    Get notified when a shared data get's updated on server-side

    @param dataName private data name
    @param oldData previously set data if it's forst time then it's undefined
    @param newData the latest data has been set on this name
 */
mp.events.addPrivateDataHandler(dataName, (oldData, newData) => {})

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



# Known Issues
- ~~~If your data fails and you set a new data which does not fail, the old data is probably gonna replace the new data over retry~~~