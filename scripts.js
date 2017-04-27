 // Enhanced Version of example code found at
 // https://helpx.adobe.com/coldfusion/developing-applications/coldfusion-and-html-5/using-coldfusion-websocket/using-websocket-to-broadcast-messages.html

 var UI = {
        console     : document.getElementById("_console"),
        output      : document.getElementById("output"),
        channelname : document.getElementById("channelname"),
        username    : document.getElementById("username"),
        message     : document.getElementById("msg"),
        cfcname     : document.getElementById("cfcname"),
        fnname      : document.getElementById("fnname"),
        buttons     : {
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
        }
};

// register click events for each button
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

function parseJSONResponse(message){
    return JSON.stringify(message)
        .replace(/,"/g,',<br />&nbsp;&nbsp;"')
        .replace('{','{<br />&nbsp;&nbsp;')
        .replace('}','<br />}');
}

function writeToConsole(message,classname){
    var _li = document.createElement('li');
    _li.setAttribute('class', classname || 'default');
    _li.innerHTML = message;
    UI.console.appendChild(_li);
    // animate scroll
    if (_li.offsetTop + _li.offsetHeight > UI.output.offsetHeight)
        scrollTo(UI.output, (_li.offsetTop + _li.offsetHeight + 11) - UI.output.offsetHeight, 250);
}

function clearLog(e){
    UI.console.innerHTML = '';
    e.target.blur();
}

//messagehandler recieves all the messages from websocket
function messageHandler(messageobj) {
    writeToConsole(parseJSONResponse(messageobj), messageobj.type !== 'data' ? 'alert alert-info' : '');
}

//openhandler is invoked when socket connection is
function openHandler(){
    writeToConsole('OPEN HANDLER INVOKED','alert alert-success');
}

//openhandler is invoked when a socket error occurs
function errorHandler(messageobj) {
    writeToConsole(parseJSONResponse(messageobj),'alert alert-warning');
}

function subscribeMe(e){
    e.target.blur();
    if(checkSocketAccess()){
        if (UI.channelname.value === 'chat'){
            if (UI.username.value !== ''){
                mywsobj.authenticate(UI.username.value,'');
                mywsobj.subscribe(UI.channelname.value,{username:UI.username.value});
            } else {
                writeToConsole('Username required when attempting to connect to chat room','alert alert-warning');
            }
        } else {
            mywsobj.subscribe(UI.channelname.value);
        }

    }
}

function getSubscribers(e){
    e.target.blur();
    if(checkSocketAccess())
        mywsobj.getSubscriberCount(UI.channelname.value);
}

function unsubscribeMe(e){
    e.target.blur();
    if(checkSocketAccess())
        mywsobj.unsubscribe(UI.channelname.value);
}

function publish(e){
    e.target.blur();
    if(checkSocketAccess()){
        if (UI.message.value !== ''){
            mywsobj.publish(UI.channelname.value,UI.message.value);
            UI.message.value = '';
        } else {
            writeToConsole('Enter a message to publish','alert alert-danger');
        }
    }
}

function getSubscriptions(e){
    e.target.blur();
    if(checkSocketAccess())
        mywsobj.getSubscriptions();
}

function invokeAndPublish(e){
    e.target.blur();
    if(checkSocketAccess())
        mywsobj.invokeAndPublish(UI.channelname.value, UI.cfcname.value, UI.fnname.value);
}

function invoke(e){
    e.target.blur();
    if(checkSocketAccess())
        mywsobj.invoke(UI.cfcname.value, UI.fnname.value);
}

function openSocket(e){
    e.target.blur();
    writeToConsole('OPENING SOCKET','alert alert-success');
    mywsobj.openConnection();
}

function stopSocket(e){
    e.target.blur();
    writeToConsole('CLOSING SOCKET','alert alert-danger');
    mywsobj.closeConnection();
}

function checkSocket(e){
    e.target.blur();
    if (mywsobj.isConnectionOpen())
        writeToConsole('SOCKET IS OPEN','alert alert-success');
    else
        writeToConsole('SOCKET IS CLOSED','alert alert-danger');
}

function checkSocketAccess(){
    if (mywsobj.isConnected()){
        return true;
    } else {
        writeToConsole('SOCKET IS NOT CONNECTED - FUNCTION COULD NOT BE PROCESSED','alert alert-danger');
        return false;
    }
}

// https://gist.github.com/andjosh/6764939
    function scrollTo(element, to, duration) {
        var start = element.scrollTop,
            change = to - start,
            currentTime = 0,
            increment = 20;

        var animateScroll = function(){
            currentTime += increment;
            var val = Math.easeInOutQuad(currentTime, start, change, duration);
            element.scrollTop = val;
            if(currentTime < duration) {
                setTimeout(animateScroll, increment);
            }
        };
        animateScroll();
    }
    //t = current time
    //b = start value
    //c = change in value
    //d = duration
    Math.easeInOutQuad = function (t, b, c, d) {
      t /= d/2;
        if (t < 1) return c/2*t*t + b;
        t--;
        return -c/2 * (t*(t-2) - 1) + b;
    };