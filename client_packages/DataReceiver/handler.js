

var dataTypes = {
    "DATA_JSON":"object",
    "DATA_ARRAY":"object",
    "DATA_NUMBER":"number",
    "DATA_STRING":"string",
    "DATA_FLOAT":"number"
}

// I was going to make typing for this but i think strings will conver all so i just leave it here
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
                })
                
                DataHandler.destroy();
            }
        }
        
    })

});





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
