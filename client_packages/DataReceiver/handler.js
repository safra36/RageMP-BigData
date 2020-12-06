

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

mp.players.local.privateData = {};

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

                DataHandler_CreateDataStructure(ChuckBucket).then((StringData) => {
                    mp.events.call(eventName, ...StringData);
                    mp.events.callRemote('DataSender:End', id, eventName)
                }).catch((errorCode) => {
                    mp.events.callRemote('DataSender:Failed', id, eventName, errorCode)
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

                DataHandler_CreateDataStructure(ChuckBucket).then((StringData) => {

                    mp.events.callRemote('DataSender:End', id, dataName)
                    var SharedDataIndex = DataHadnler_DoesEntityOfTypeHasData(entityId, type, dataName);
                    // mp.gui.chat.push(`Shared Data Index: ${SharedDataIndex} - ${entityId} - ${type} - ${dataName}`);
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
                        
                        // Object.assign(EntitySharedData[SharedDataIndex].data, StringData.data)
                        delete EntitySharedData[SharedDataIndex].data;
                        EntitySharedData[SharedDataIndex].data = StringData.data;
                    }

                }).catch((errorCode) => {
                    mp.events.callRemote('DataSender:Failed', id, dataName, errorCode)
                })
                
                DataHandler.destroy();
            }
        }
        
    })

})



mp.events.add('DataReceiver:PrivateData:Init', (id, dataName) => {

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

                DataHandler_CreateDataStructure(ChuckBucket).then((StringData) => {

                    mp.events.callRemote('DataSender:End', id, dataName)

                    for(const DataHandlerObject of PrivateDataHandler)
                    {
                        var functionExec = DataHandlerObject.func;
                        functionExec(mp.players.local.privateData[dataName], StringData);
                    }

                    if(mp.players.local.privateData[dataName] == undefined)
                    {
                        mp.players.local.privateData[dataName] = StringData;
                    }
                    else
                    {
                        delete mp.players.local.privateData[dataName];
                        mp.players.local.privateData[dataName] = StringData;
                    }
                    

                }).catch((errorCode) => {
                    mp.events.callRemote('DataSender:Failed', id, dataName, errorCode)
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


mp.events.add('DataReceiver:PrivateData:Delete', (dataName) => {

    if(mp.players.local.privateData[dataName] != undefined) delete mp.players.local.privateData[dataName];

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



var PrivateDataHandler = [];
mp.events.addPrivateDataHandler = (dataName, callBack) => {

    PrivateDataHandler.push({
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

function DataHandler_CreateDataStructure(BucketArray)
{
    return new Promise(async (resolve, reject) => {

        var DataString = '';
        /* var BucketClone = BucketArray

        BucketClone.sort((a, b) => {
            return parseInt(a.index) - parseInt(b.index)
        }) */

        try
        {
            var BucketClone = await DataHandler_Sort(BucketArray);


            for(const chunk of BucketClone)
            {
                DataString += chunk.data;
            }


            try
            {
                var returnData = JSON.parse(DataString)
                // mp.game.graphics.notify(`return Data: ${returnData}`);
                resolve(returnData)
            }
            catch(e)
            {
                reject(-1);
                mp.game.graphics.notify(`Error Parsing Data!`);
            }
        }
        catch(e)
        {
            mp.game.graphics.notify(`Error! Received Data Is Not Final!`);
            reject(-2)
        }

    })
    
    
}

async function DataHandler_Sort(BucketArray)
{
    return new Promise((resolve, reject) => {

        var sortedArray = [];
        var lastIndex = -1;

        // mp.game.graphics.notify(`Array: ${BucketArray}`);

        var BucketClone = BucketArray;
        BucketClone.sort((a, b) => {
            return parseInt(a.index) - parseInt(b.index);
        })

        // mp.game.graphics.notify(`Clone: ${BucketClone}`);

        for(const arrayObject of BucketClone)
        {
            // mp.game.graphics.notify(`ArrayObject: ${arrayObject} - ${arrayObject.index} - ${lastIndex} - ${(arrayObject.index - 1)}`);
            if((arrayObject.index - 1) == lastIndex)
            {
                sortedArray.push(arrayObject);
                lastIndex = BucketClone.indexOf(arrayObject);
            }
            else
            {
                // mp.game.graphics.notify(`Rejected`);
                reject();
                return;
            }
        }

        // mp.game.graphics.notify(`Resolved: ${sortedArray}`);
        resolve(sortedArray);

    })
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


/* mp.events.addBigDataHandler('clothes', (entity, type, oldData, newData) => {

    mp.gui.chat.push(`Data IN FUNCTION: ${entity} - ${type} - ${oldData} - ${newData}`);
    mp.gui.chat.push(`Data IN NAME: ${newData['Tops']['Male']['NONE'][0].name}`);

    

})


mp.events.add('GetBigData', (data) => {
    mp.gui.chat.push(`Data IN NAME: ${data['Tops']['Male']['NONE'][0].name}`);
    // mp.gui.chat.push(`Data IN NAME: ${JSON.stringify(data)}`);
}) */


// mp.events.addPrivateDataHandler('clothes', (oldData, newData) => {
//     mp.gui.chat.push(`${typeof(oldData)} - ${typeof(newData)}`);
// })


// mp.events.add('TestPrivateData', () => {
//     mp.gui.chat.push(`Data IN NAME: ${mp.players.local.privateData['clothes']['Tops']['Male']['NONE'][0].name}`);
// })