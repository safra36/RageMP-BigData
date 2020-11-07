


// var BigData = require('./Clothes.json')

/* var dataTypes = {
    "DATA_JSON":"object",
    "DATA_ARRAY":"object",
    "DATA_NUMBER":"number",
    "DATA_STRING":"string",
    "DATA_FLOAT":"number"
} */








var EntitySharedVariables = [];

mp.players.callBig = (eventName, ...Data) => {
    mp.players.forEach(_player => {
        _player.callBig(eventName, Data)
    });
}

mp.events.add('playerJoin', (player) => {

    player.callBig = (eventName, Data) => {

        var DataArray = chunkString(JSON.stringify(Data), 10024);
        var DataID = makeid(32);

        player.call('DataReceiver:Init', [DataID, 'string', eventName])

        var DataSender = new mp.Event('DataSender:InitSuccess', (_player, id) => {

            if (id == DataID) {
                for (const DataChunk of DataArray) {
                    // console.log(`Seding Data Chunk: ${DataChunk}`)
                    if (DataArray.indexOf(DataChunk) == DataArray.length - 1) {
                        _player.call('DataReceiver:Receive', [DataID, DataChunk, 1, DataArray.indexOf(DataChunk)])
                        DataSender.destroy();
                        break;
                    }
                    else {
                        _player.call('DataReceiver:Receive', [DataID, DataChunk, 0, DataArray.indexOf(DataChunk)])
                    }

                    // await timer(50);
                }



            }
        })

    }

    // Currently only on the player, not a shared data
    player.setBigVariable = (name, data) => {

        var SharedDataObject = {
            name: name,
            id: player.id,
            type: 'player',
            data: data
        }

        var DataArray = chunkString(JSON.stringify(SharedDataObject), 10024);
        var DataID = makeid(32);

        // Sync the data to everyone on the server
        mp.players.call('DataReceiver:SharedData:Init', [DataID, 'player', player.id, name])

        // Just creating an event each player it self
        for (const x of mp.players.toArray()) {
            //Destory the last sender event if there are left overs
            if (x.DataSender != null) x.DataSender.destroy();

            x.DataSender = new mp.Event('DataSender:InitSuccess', (_player, id) => {

                if (id == DataID) {
                    for (const DataChunk of DataArray) {
                        // console.log(`Seding Data Chunk: ${DataChunk}`)
                        if (DataArray.indexOf(DataChunk) == DataArray.length - 1) {
                            _player.call('DataReceiver:Receive', [DataID, DataChunk, 1, DataArray.indexOf(DataChunk)])
                            x.DataSender.destroy();
                            break;
                        }
                        else {
                            _player.call('DataReceiver:Receive', [DataID, DataChunk, 0, DataArray.indexOf(DataChunk)])
                        }

                    }

                    //Destory the last ender event if there are left overs
                    if (x.DataSenderEnd != null) x.DataSenderEnd.destroy();

                    x.DataSenderEnd = new mp.Event('DataSender:End', (__player, endId, eventName) => {

                        console.log(`Data Tansmission ended! ${id} - ${endId} - ${eventName}, ${name}`)

                        if (id == endId && eventName == name) {
                            var EntityDataIndex = DataHadnler_DoesEntityOfTypeHasData(player.id, 'player', name);
                            if (EntityDataIndex != -1 && EntitySharedVariables[EntityDataIndex] != undefined) {
                                EntitySharedVariables[EntityDataIndex].data = SharedDataObject.data;
                            }
                            else {
                                EntitySharedVariables.push(SharedDataObject);
                            }

                            x.DataSenderEnd.destroy();
                        }

                    })

                }
            })
        }

    }


    player.getBigVariable = (name) => {

        var EntityDataIndex = DataHadnler_DoesEntityOfTypeHasData(player.id, 'player', name);
        if (EntityDataIndex != -1 && EntitySharedVariables[EntityDataIndex] != undefined) {
            return EntitySharedVariables[EntityDataIndex].data
        }
        else {
            return undefined;
        }

    }
})


mp.events.add("playerReady", (player) => {

    for (const SharedDataObject of EntitySharedVariables) {
        var DataArray = chunkString(JSON.stringify(SharedDataObject), 10024);
        var DataID = makeid(32);

        player.call('DataReceiver:SharedData:Init', [DataID, 'string', player.id, name])
        var DataSender = new mp.Event('DataSender:InitSuccess', (_player, id) => {

            if (id == DataID) {
                for (const DataChunk of DataArray) {
                    // console.log(`Seding Data Chunk: ${DataChunk}`)
                    if (DataArray.indexOf(DataChunk) == DataArray.length - 1) {
                        _player.call('DataReceiver:Receive', [DataID, DataChunk, 1, DataArray.indexOf(DataChunk)])
                        DataSender.destroy();
                        break;
                    }
                    else {
                        _player.call('DataReceiver:Receive', [DataID, DataChunk, 0, DataArray.indexOf(DataChunk)])
                    }

                }

                var DataSenderEnd = new mp.Event('DataSender:End', (__player, endId, eventName) => {

                    if (id == endId && eventName == name) {
                        var EntityDataIndex = DataHadnler_DoesEntityOfTypeHasData(player.id, 'player', name);
                        if (EntityDataIndex != -1 && EntitySharedVariables[EntityDataIndex] != undefined) {
                            EntitySharedVariables[EntityDataIndex].data = SharedDataObject.data;
                        }
                        else {
                            EntitySharedVariables.push(SharedDataObject);
                        }

                        DataSenderEnd.destroy();
                    }

                })

            }
        })
    }

});


mp.events.add("playerQuit", (player, exitType, reason) => {

    var EntityIndexes = DataHandler_GetAllEntityDataOfType(player.id, 'player');
    console.log(`Player ${player.name} left, indexes: ${JSON.stringify(EntityIndexes)}`)

    if(EntityIndexes.length > 0)
    {
        for(const index of EntityIndexes)
        {
            const EntityDataObject = EntitySharedVariables[index];
            if(EntityDataObject != undefined)
            {
                mp.players.call('DataReceiver:SharedData:Delete', ['player', EntityDataObject.id, EntityDataObject.name]);
                EntitySharedVariables.splice(index, 1);
                console.log(`Deleted player shared data of name ${EntityDataObject.name}`)
            }
        }
    }

});


/* mp.events.add('DataSender:End', (player, id, eventName) => {

    console.log(`Data Ended`)
                    
}) */




/* mp.events.add('DataSender:Init', (player, id, type, eventName) => {

    mp.events.callRemote('DataSender:InitSuccess', id);

    var ChuckBucket = [];
    var DataHandler = new mp.Event('DataSender:Receive', (dataId, data, endSig) => {
        if(endSig)
        {
            if(type == dataTypes.DATA_ARRAY || dataTypes.DATA_JSON)
            {
                mp.events.call(player, eventName, DataHandler_CreateJSONFromBucket(ChuckBucket));
                DataHandler.destroy();
            }
            else if(type == dataTypes.DATA_STRING)
            {
                mp.events.call(player, eventName, DataHandler_CreateStringBucket(ChuckBucket));
                DataHandler.destroy();
            }
        }
        if(dataId == id)
        {
            ChuckBucket.push(data);
        }
    })

}); */







// Shared functions

/* function DataHandler_CreateJSONFromBucket(BucketArray)
{
    var JSONString = '';
    for(const chunk of BucketArray)
    {
        JSONString += chunk;
    }
    return JSON.parse(JSONString);
}

function DataHandler_CreateStringBucket(BucketArray)
{
    var DataString = '';
    for(const chunk of BucketArray)
    {
        DataString += chunk;
    }
    return unescape(DataString)
} */

function DataHadnler_DoesEntityOfTypeHasData(entityId, entityType, dataName) {
    for (const PlayerDataObject of EntitySharedVariables) {
        if (PlayerDataObject.id == entityId && PlayerDataObject.type == entityType && PlayerDataObject.name == dataName) {
            return EntitySharedVariables.indexOf(PlayerDataObject);
        }
    }

    return -1;
}

function DataHandler_GetAllEntityDataOfType(entityId, entityType)
{
    console.log(JSON.stringify(EntitySharedVariables))
    var ReturnArray = [];
    for (const PlayerDataObject of EntitySharedVariables) {
        if (PlayerDataObject.id == entityId && PlayerDataObject.type == entityType) {
            ReturnArray.unshift(EntitySharedVariables.indexOf(PlayerDataObject))
        }
    }

    return ReturnArray;
}

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function chunkString(str, size) {
    const numChunks = Math.ceil(str.length / size)
    const chunks = new Array(numChunks)

    for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
        chunks[i] = str.substr(o, size)
    }

    return chunks
}

/* function chunkString(str, length) {
    return str.match(new RegExp('.{1,' + length + '}', 'g'));
} */

const timer = ms => new Promise(res => setTimeout(res, ms))
