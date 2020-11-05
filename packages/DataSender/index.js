


var BigData = require('./Clothes.json')

/* var dataTypes = {
    "DATA_JSON":"object",
    "DATA_ARRAY":"object",
    "DATA_NUMBER":"number",
    "DATA_STRING":"string",
    "DATA_FLOAT":"number"
} */

/* mp.events.add('GetBigData', (player) => {

    player.callBig('GetBigData', [BigData, 'Some Other Test Arguments', 3]);

}) */



mp.players.callBig = (eventName, Data) => {
    mp.players.forEach(_player => {
        _player.callBig(eventName, Data)
    });
}

mp.events.add('playerReady', (player) => {

    player.callBig = (eventName, Data) => {


        var DataArray = chunkString(JSON.stringify(Data), 10024);
        // var DataArray = chunkString(escape(Data), 65550);
        var DataID = makeid(32);
        player.call('DataReceiver:Init', [DataID, 'string', eventName])
    
        var DataSender = new mp.Event('DataSender:InitSuccess', (_player, id) => {
    
            if(id == DataID)
            {
                for(const DataChunk of DataArray)
                {
                    // console.log(`Seding Data Chunk: ${DataChunk}`)
                    if(DataArray.indexOf(DataChunk) == DataArray.length - 1)
                    {
                        _player.call('DataReceiver:Receive', [DataID, DataChunk, 1, DataArray.indexOf(DataChunk)])
                        DataSender.destroy();
                        break;
                    }
                    else
                    {
                        _player.call('DataReceiver:Receive', [DataID, DataChunk, 0, DataArray.indexOf(DataChunk)])
                    }
    
                    // await timer(50);
                }
            }
        })
    
    }

    /* player.setBigVariable = () => {

    } */
})




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

function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
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
