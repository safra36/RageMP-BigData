

var dataTypes = {
    "DATA_EVENT":0,
    "DATA_SHARED":1
}

var entityTypes = {
    "player":0,
    "object":1,
    "vehicle":2,
    "ped":3
}


var EntitySharedData = []

/* {
    name,
    id,
    type,
    data
} */

mp.events.add('DataReceiver:Init', (id, type, eventName) => {

    mp.events.callRemote('DataSender:InitSuccess', id);

    var ChuckBucket = [];
    var DataHandler = new mp.Event('DataReceiver:Receive', (dataId, data, endSig, index) => {

        if(dataId == id)
        {
            ChuckBucket.push({
                index:index,
                data:data
            });

            if(endSig)
            {        
                DataHandler_CreateDataStructure(ChuckBucket, (StringData) => {
                    mp.events.call(eventName, ...StringData);
                    mp.events.callRemote('DataSender:End', id, eventName)
                    
                })
                
                DataHandler.destroy();
            }
        }
        
    })

});



mp.events.add('DataReceiver:SharedData:Init', (id, type, entityId, dataName) => {

    mp.events.callRemote('DataSender:InitSuccess', id);

    var ChuckBucket = [];
    var DataHandler = new mp.Event('DataReceiver:Receive', (dataId, data, endSig, index) => {

        if(dataId == id)
        {
            ChuckBucket.push({
                index:index,
                data:data
            });

            if(endSig)
            {    
                DataHandler_CreateDataStructure(ChuckBucket, (StringData) => {
                    mp.events.callRemote('DataSender:End', id, dataName)
                    var SharedDataIndex = DataHadnler_DoesEntityOfTypeHasData(entityId, type, dataName);
                    mp.gui.chat.push(`Shared Data Index: ${SharedDataIndex} - ${entityId} - ${type} - ${dataName}`);
                    if(SharedDataIndex == -1)
                    {
                        for(const DataHandlerObject of BigDataHandlers)
                        {
                            var functionExec = DataHandlerObject.func;
                            functionExec(entityId, type, undefined, StringData.data);
                        }

                        EntitySharedData.push(StringData);
                    }
                    else
                    {
                        for(const DataHandlerObject of BigDataHandlers)
                        {
                            var functionExec = DataHandlerObject.func;
                            functionExec(entityId, type, EntitySharedData[SharedDataIndex].data, StringData.data);
                        }
                        
                        EntitySharedData[SharedDataIndex].data = StringData.data;
                    }
                    
                })
                
                DataHandler.destroy();
            }
        }
        
    })

})


mp.events.add('DataReceiver:SharedData:Delete', (type, entityId, dataName) => {

    var SharedDataIndex = DataHadnler_DoesEntityOfTypeHasData(entityId, type, dataName);
    
    if(SharedDataIndex != -1 && EntitySharedData[SharedDataIndex] != undefined)
    {
        EntitySharedData.splice(SharedDataIndex, 1);
    }

})

mp.events.add("playerReady", () => {

    mp.players.forEach(player => {

        player.getBigVariable = (name) => {

            return DataHandler_GetSharedData(player.remoteId, 'player', name);

        }
        
    });

});


mp.events.add('playerJoin', (player) => {

    player.getBigVariable = (name) => {

        return DataHandler_GetSharedData(player.remoteId, 'player', name);

    }

});



var BigDataHandlers = [];
mp.events.addBigDataHandler = (dataName, callBack) => {

    BigDataHandlers.push({
        name:dataName,
        func:callBack
    })

}









// mp.events.add('GetBigData', (BigJSONData, args1, argg2) => {
//     mp.gui.chat.push(`Data: ${BigJSONData['Tops']['Male']['NONE'][0].name} - Type: ${typeof(BigJSONData)}`);
//     mp.gui.chat.push(`Data: ${args1} - Type: ${typeof(args1)}`);
//     mp.gui.chat.push(`Data: ${argg2} - Type: ${typeof(argg2)}`);

//     /* var playerClothes = mp.players.local.getVariable('clothes')
//     mp.gui.chat.push(`Data: ${playerClothes['Tops']['Male']['NONE'][0].name} - Type: ${typeof(clothes)}`); */
    
// })


/* mp.events.addBigDataHandler('clothes', (entityId, type, oldData, newData) => {

    mp.gui.chat.push(`Entity ID: ${entityId}`);
    mp.gui.chat.push(`Entity Type: ${type}`);
    mp.gui.chat.push(`OldData: ${JSON.stringify(oldData)}`);
    mp.gui.chat.push(`NewData: ${JSON.stringify(newData)}`);


    setTimeout(() => {

        var Clothes = mp.players.local.getBigVariable('clothes');
        mp.gui.chat.push(`NewData: ${typeof(Clothes)}`);
        mp.gui.chat.push(`NewData: ${JSON.stringify(Clothes)}`);
        
    }, 2000);

}) */




/* mp.events.callBigRemote = async (eventName, Data) => {

    if(typeof(Data) == (dataTypes.DATA_JSON || dataTypes.DATA_ARRAY))
    {
        var DataArray = chunkString(escape(JSON.stringify(Data)), 4096);
        var DataID = makeid(32);
        mp.events.callRemote('DataSender:Init', DataID, 'object', eventName)

        var DataSender = new mp.Event('DataSender:InitSuccess', async (id) => {

            if(id == DataID)
            {
                for(const DataChunk of DataArray)
                {
                    if(DataArray.indexOf(DataChunk) == DataArray.length - 1)
                    {
                        mp.events.callRemote('DataSender:Receive', DataID, DataChunk, 1)
                        DataSender.destroy();
                    }
                    else
                    {
                        mp.events.callRemote('DataSender:Receive', DataID, DataChunk, 0)
                    }

                    await timer(50);
                }
            }
        })
    }
    else if(typeof(Data) == dataTypes.DATA_STRING)
    {
        var DataArray = chunkString(Data, 4096);
        var DataID = makeid(32);
        mp.events.callRemote('DataSender:Init', DataID, 'string', eventName)

        var DataSender = new mp.Event('DataSender:InitSuccess', async (id) => {

            if(id == DataID)
            {
                for(const DataChunk of DataArray)
                {
                    if(DataArray.indexOf(DataChunk) == DataArray.length - 1)
                    {
                        mp.events.callRemote('DataSender:Receive', DataID, DataChunk, 1)
                        DataSender.destroy();
                    }
                    else
                    {
                        mp.events.callRemote('DataSender:Receive', DataID, DataChunk, 0)
                    }

                    await timer(50);
                }
            }
        })
    }
    else
    {
        throw new Error('Datatype is not defined')
    }

} */


/* function DataHandler_CreateJSONFromBucket(BucketArray, callback)
{
    var JSONString = '';
    for(const chunk of BucketArray)
    {
        JSONString += chunk;
    }
    
    callback(JSON.parse(JSONString))
} */

function DataHandler_CreateDataStructure(BucketArray, callback)
{
    var DataString = '';
    var BucketClone = BucketArray

    BucketClone.sort((a, b) => {
        return parseInt(a.index) - parseInt(b.index)
    })

    for(const chunk of BucketClone)
    {
        DataString += chunk.data;
    }
    
    callback(JSON.parse(DataString))
}


function DataHadnler_DoesEntityOfTypeHasData(entityId, entityType, dataName)
{
    for(const PlayerDataObject of EntitySharedData)
    {
        mp.gui.chat.push(`Data IN FUNCTION: ${PlayerDataObject.id} - ${PlayerDataObject.type} - ${PlayerDataObject.name}`);
        if(PlayerDataObject.id == entityId && PlayerDataObject.type == entityType && PlayerDataObject.name == dataName)
        {
            return EntitySharedData.indexOf(PlayerDataObject);
        }
    }

    return -1;
}


function DataHandler_GetSharedData(id, type, name)
{
    for(const PlayerDataObject of EntitySharedData)
    {
        if(PlayerDataObject.id == id && PlayerDataObject.type == type && PlayerDataObject.name == name)
        {
            return PlayerDataObject.data;
        }
    }

    return undefined;
}

/* function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
 
 function chunkString(str, length) {
     return str.match(new RegExp('.{1,' + length + '}', 'g'));
 }
 
 const timer = ms => new Promise(res => setTimeout(res, ms)) */
