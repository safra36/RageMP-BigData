require('./DataReceiver/handler.js')



mp.events.add('GetBigData', (BigData) => {
    mp.gui.chat.push('BIG DATA EVENT CALLED');
    var Data = JSON.parse(BigData)
    mp.gui.chat.push(`Using Data: ${Data["Tops"]["Male"]["NONE"][0].name}`);
})


mp.keys.bind(0x71, true, function() {
    mp.gui.chat.push('Requested Big Data');
    mp.events.callRemote('GetBigData');
});