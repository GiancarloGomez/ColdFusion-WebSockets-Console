 // Enhanced Version of example code found at
 // https://helpx.adobe.com/coldfusion/developing-applications/coldfusion-and-html-5/using-coldfusion-websocket/using-websocket-to-broadcast-messages.html
const UI = {
        console     : document.getElementById("_console"),
        output      : document.getElementById("output"),
        channelname : document.getElementById("channelname"),
        username    : document.getElementById("username"),
        password    : document.getElementById("password"),
        customHeader: document.getElementById("customHeader"),
        message     : document.getElementById("msg"),
        cfcname     : document.getElementById("cfcname"),
        fnname      : document.getElementById("fnname"),
        buttons     : {
            authenticate        : document.getElementById("authenticate"),
            subscribe           : document.getElementById("subscribe"),
            unsubscribe         : document.getElementById("unsubscribe"),
            getSubscribers      : document.getElementById("getSubscribers"),
            getSubscriptions    : document.getElementById("getSubscriptions"),
            publish             : document.getElementById("publish"),
            invoke              : document.getElementById("invoke"),
            invokeAndPublish    : document.getElementById("invokeAndPublish"),
            stop                : document.getElementById("stop"),
            open                : document.getElementById("open"),
            check               : document.getElementById("check"),
            clear               : document.getElementById("clear")
        },
        authenticated : {
            username: null
        }
};

// register click events for each button
UI.buttons.authenticate.addEventListener("click",authenticateMe);
UI.buttons.subscribe.addEventListener("click",subscribeMe);
UI.buttons.unsubscribe.addEventListener("click",unsubscribeMe);
UI.buttons.getSubscribers.addEventListener("click",getSubscribers);
UI.buttons.getSubscriptions.addEventListener("click",getSubscriptions);
UI.buttons.publish.addEventListener("click",publish);
UI.buttons.invoke.addEventListener("click",invoke);
UI.buttons.invokeAndPublish.addEventListener("click",invokeAndPublish);
UI.buttons.stop.addEventListener("click",stopSocket);
UI.buttons.stop.addEventListener("click",stopSocket);
UI.buttons.open.addEventListener("click",openSocket);
UI.buttons.check.addEventListener("click",checkSocket);
UI.buttons.clear.addEventListener("click",clearLog);

UI.customHeader.addEventListener("click",function(event){
    if (event.target.type && event.target.type === 'button'){
        var button = event.target;
        if (button.dataset.role === 'add')
            addCustomHeaderRow()
        else
            deleteCustomHeaderRow(button);
        event.preventDefault();
    }
});

function authenticateMe(e){
    e.target.blur();
    if ( UI.username.value.toString().trim() === '' ){
        openDialog({
            message: '<div class="text-center">Enter credentials to authenticate</div>'
        });
        writeToConsole('Enter credentials to authenticate','alert alert-danger');
    }
    else {
        UI.authenticated.username = UI.username.value;
        ws.authenticate(UI.username.value,UI.password.value);
    }
}

function addCustomHeaderRow(){
    var tr = document.createElement('tr');
    tr.innerHTML = `
    <td><input type="text" name="customHeaderKey" value="" class="form-control" placeholder="key" /></td>
    <td><input type="text" name="customHeaderValue" value="" class="form-control" placeholder="value" /></td>
    <td class="text-nowrap">
        <button type="button" class="btn btn-danger btn-sm" data-role="delete">&times;</button>
    </td>
    `;
    UI.customHeader.querySelector('tbody').appendChild(tr);
}

function buildCustomHeader(){
    var header = {},
        keys = Array.from(UI.customHeader.querySelectorAll('input[name=customHeaderKey]'))
        values = Array.from(UI.customHeader.querySelectorAll('input[name=customHeaderValue]'));

    keys.forEach(function(key,index){
        var label = key.value.toString().trim();
        if (label.length)
            header[label] = values[index].value.toString().trim();
    });
    return header;
}

function checkSocket(e){
    e.target.blur();
    if (ws.isConnectionOpen())
        writeToConsole('SOCKET IS OPEN','alert alert-success');
    else
        writeToConsole('SOCKET IS CLOSED','alert alert-danger');
}

function checkSocketAccess(){
    if (ws.isConnected()){
        return true;
    } else {
        writeToConsole('SOCKET IS NOT CONNECTED - FUNCTION COULD NOT BE PROCESSED','alert alert-danger');
        return false;
    }
}

function clearLog(e){
    UI.console.innerHTML = '';
    e.target.blur();
}

function deleteCustomHeaderRow(button){
    UI.customHeader.querySelector('tbody').removeChild(button.parentNode.parentNode);
}

function getSubscribers(e){
    e.target.blur();
    if(checkSocketAccess())
        ws.getSubscriberCount(UI.channelname.value);
}

function getSubscriptions(e){
    e.target.blur();
    if(checkSocketAccess())
        ws.getSubscriptions();
}

function invoke(e){
    e.target.blur();
    if(checkSocketAccess())
        ws.invoke(UI.cfcname.value, UI.fnname.value);
}

function invokeAndPublish(e){
    e.target.blur();
    if(checkSocketAccess())
        ws.invokeAndPublish(UI.channelname.value, UI.cfcname.value, UI.fnname.value);
}

// invoked when a socket error occurs
function onError(messageobj) {
    if ( messageobj.type === 'subscribe' ){
        openDialog({
            message: '<div class="text-center">The channel you requested required authentication</div>'
        });
    }
    else if ( messageobj.type === 'response' && ( messageobj.reqType || '' ) === 'authenticate' ){
        openDialog({
            message: '<div class="text-center">Invalid user</div>'
        });
        UI.authenticated.username = null;
    }
    writeToConsole(parseJSONResponse(messageobj),'alert alert-danger');
}

// recieves all the messages from websocket
function onMessage(messageobj) {
    writeToConsole(parseJSONResponse(messageobj), messageobj.type !== 'data' ? 'alert alert-info' : '');
}

// invoked when socket connection is
function onOpen(){
    writeToConsole('OPEN HANDLER INVOKED','alert alert-success');
}

function openSocket(e){
    e.target.blur();
    writeToConsole('OPENING SOCKET','alert alert-success');
    ws.openConnection();
}

function parseJSONResponse(message){
    if ( typeof message.data === 'string' )
        message.data = message.data.replace(/\t|\n/g,'');
    return JSON.stringify(message)
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/,"/g,',<br />&nbsp;&nbsp;"')
        .replace('{','{<br />&nbsp;&nbsp;')
        .replace('}','<br />}');
}

function publish(e){
    e.target.blur();
    if(checkSocketAccess()){
        if (UI.message.value !== ''){
            var header = buildCustomHeader();
            ws.publish(UI.channelname.value,UI.message.value,header);
            UI.message.value = '';
        } else {
            writeToConsole('Enter a message to publish','alert alert-danger');
        }
    }
}

function stopSocket(e){
    e.target.blur();
    writeToConsole('CLOSING SOCKET','alert alert-danger');
    ws.closeConnection();
}

function subscribeMe(e){
    var header = buildCustomHeader();
    e.target.blur();
    if(checkSocketAccess()){
        if ( UI.channelname.value.toString().trim() === '' )
            openDialog({ message:'<div class="text-center">Please supply a channel name to subscribe</div>'});
        else {
            if ( UI.authenticated.username )
            header.username = UI.authenticated.username;
            ws.subscribe(UI.channelname.value,header);
        }
    }
}

function unsubscribeMe(e){
    e.target.blur();
    if(checkSocketAccess())
        ws.unsubscribe(UI.channelname.value);
}

function writeToConsole(message,classname){
    var _li = document.createElement('li');
    _li.setAttribute('class', classname || 'default');
    _li.innerHTML = message;
    UI.console.appendChild(_li);
    _li.scrollIntoView({
        behavior: 'smooth'
    });
}
