/**
 * Enhanced Version of example code found at
 * https://helpx.adobe.com/coldfusion/developing-applications/coldfusion-and-html-5/using-coldfusion-websocket/using-websocket-to-broadcast-messages.html
 */
const canDebug = new URLSearchParams( location.search ).has('debug') && window.console;

const WebSocketConsole = {
    debugStyle    : 'color:#001C58; font-weight:400; ',
    authenticated : { username : null },
    fields        : {
        cfcName      : document.getElementById( 'cfcName' ),
        channel      : document.getElementById( 'channel' ),
        functionName : document.getElementById( 'functionName' ),
        message      : document.getElementById( 'message' ),
        password     : document.getElementById( 'password' ),
        username     : document.getElementById( 'username' ),
    },
    ui : {
        arguments     : document.querySelector( '#arguments > tbody' ),
        customOptions : document.querySelector( '#custom-options > tbody' ),
        log           : document.querySelector( '#log' ),
        modal         : new bootstrap.Modal('#modal', {}),
    },
    init() {
        this.doLog( '%cWebSocketConsole.init', this.debugStyle, this );
        this.setupListeners();
    },
    authenticate() {
        this.doLog( '%cWebSocketConsole.authenticate', this.debugStyle );

        let username = this.fields.username.value.toString().trim(),
            password = this.fields.password.value.toString().trim();

        if ( username === '' ) {
            this.showError( 'Enter credentials to authenticate' );
        }
        else {
            this.authenticated.username = username;
            ws.authenticate( username, password );
        }
    },
    buildArguments() {
        this.doLog('%cWebSocketConsole.buildArguments', this.debugStyle);

        return Array.from( this.ui.arguments.querySelectorAll( 'input[name="argument"]' ) )
                        .map( input => input.value.toString().trim() );
    },
    buildCustomOptions() {
        this.doLog( '%cWebSocketConsole.buildCustomOptions', this.debugStyle );

        let options = {},
            keys    = Array.from( this.ui.customOptions.querySelectorAll( 'input[name="optionKey"]' ) ),
            values  = Array.from( this.ui.customOptions.querySelectorAll( 'input[name="optionValue"]' ) );

        keys.forEach( ( key, index ) => {
            let label = key.value.toString().trim();
            if ( label.length )
                options[ label ] = values[ index ].value.toString().trim();
        });

        return options;
    },
    checkSocket() {
        this.doLog( '%cWebSocketConsole.checkSocket', this.debugStyle );
        if ( ws.isConnectionOpen() )
            this.write( '<strong>SOCKET IS OPEN</strong>', 'alert-success' );
        else
            this.write( '<strong>SOCKET IS CLOSED</strong>', 'alert-danger' );

    },
    checkSocketAccess() {
        this.doLog( '%cWebSocketConsole.checkSocketAccess', this.debugStyle );
        let allowed = ws.isConnected();

        if ( !allowed )
            this.write( '<strong>SOCKET IS NOT CONNECTED</strong><br><small>Function could not be processed</small>', 'alert-danger' );

        return allowed;
    },
    clearLog() {
        this.doLog( '%cWebSocketConsole.clearLog', this.debugStyle );
        this.ui.log.innerHTML = '';
    },
    getSubscriberCount() {
        this.doLog( '%cWebSocketConsole.getSubscribers', this.debugStyle );

        let channel = this.fields.channel.value.toString().trim()

        if ( channel === '' )
            this.showError( 'A channel is required to get subscribers' );
        else if ( this.checkSocketAccess() )
            ws.getSubscriberCount( channel );
    },
    getSubscriptions() {
        this.doLog( '%cWebSocketConsole.getSubscriptions', this.debugStyle );

        if ( this.checkSocketAccess() )
            ws.getSubscriptions();
    },
    invoke() {
        this.doLog( '%cWebSocketConsole.invoke', this.debugStyle );

        let cfcName      = this.fields.cfcName.value.toString().trim(),
            functionName = this.fields.functionName.value.toString().trim(),
            arguments;

        if ( cfcName === '' || functionName === '' ) {
            this.showError( 'A component and function name is required to invoke' );
        }
        else if ( this.checkSocketAccess() ) {
            arguments = this.buildArguments();

            ws.invoke( cfcName, functionName, arguments );
        }
    },
    invokeAndPublish() {
        this.doLog( '%cWebSocketConsole.invokeAndPublish', this.debugStyle );

        let channel      = this.fields.channel.value.toString().trim(),
            cfcName      = this.fields.cfcName.value.toString().trim(),
            functionName = this.fields.functionName.value.toString().trim(),
            arguments,
            customOptions;

        if ( channel === '' || cfcName === '' || functionName === '' ) {
            this.showError( 'A channel, component name, and function name is required to invokeAndPublish' );
        }
        else if ( this.checkSocketAccess() ) {
            arguments     = this.buildArguments();
            customOptions = this.buildCustomOptions();

            ws.invokeAndPublish( channel, cfcName, functionName, arguments, customOptions );
        }
    },
    onError( error  ) {
        // reference to WebSocketConsole due to callback from ws object
        const self = WebSocketConsole;

        self.doLog( '%cWebSocketConsole.onError', self.debugStyle, { error } );

        self.write( error, 'alert-danger' );

        if ( error.type === 'subscribe' ) {
            self.showError( 'The channel you requested required authentication', true );
        }
        else if ( error.type === 'response' && ( error.reqType || '' ) === 'authenticate' ) {
            self.authenticated.username = null;
        }
    },
    onMessage( message ) {
        // reference to WebSocketConsole due to callback from ws object
        const self = WebSocketConsole;

        self.doLog( '%cWebSocketConsole.onMessage', self.debugStyle, { message } );

        self.write( message, message.type !== 'data' ? 'alert-info' : '' );
    },
    onOpen() {
        // reference to WebSocketConsole due to callback from ws object
        const self = WebSocketConsole;

        self.doLog( '%cWebSocketConsole.onOpen', self.debugStyle );

        self.write( '<strong>OPEN HANDLER INVOKED</strong>', 'alert-success' );
    },
    openSocket() {
        this.doLog( '%cWebSocketConsole.openSocket', this.debugStyle );

        if ( !ws.isConnected() ) {
            this.write( '<strong>OPENING SOCKET</strong>', 'alert-success' );
            ws.openConnection();
        }
    },
    parse( response ) {
        this.doLog( '%cWebSocketConsole.parse', this.debugStyle, { response } );

        if ( typeof response === 'object' ){
            response = JSON.stringify( response, null, 2 )
                        .replace( /\n/g, '<br>' )
                        .replace( /\s/g, '&nbsp;' );
        }

        return response;
    },
    publish() {
        this.doLog( '%cWebSocketConsole.publish', this.debugStyle );

        let channel = this.fields.channel.value.toString().trim(),
            message = this.fields.message.value.toString().trim(),
            customOptions;

        if ( channel === '' || message === '' ) {
            this.showError( 'A channel and message is required to publish' );
        }
        else {
            customOptions = this.buildCustomOptions();
            ws.publish( channel, message, customOptions );
            this.fields.message.value = '';
        }
    },
    rowAdd( type ) {
        this.doLog( '%cWebSocketConsole.rowAdd', this.debugStyle );

        if ( ['arguments','customOptions'].includes( type ) ){

            let tr = document.createElement('tr');
            tr.innerHTML = type == 'arguments' ?
                            `<td>
                                <input type="text" name="argument" class="form-control form-control-sm" placeholder="argument">
                            </td>
                            <td>
                                <button type="button" class="btn btn-danger btn-sm" data-action="argument-delete">
                                    <i class="fa-solid fa-fw fa-xmark"></i>
                                </button>
                            </td>` :
                            `<td>
                                <input type="text" name="optionKey" class="form-control form-control-sm" placeholder="key">
                            </td>
                            <td>
                                <input type="text" name="optionValue" class="form-control form-control-sm" placeholder="value">
                            </td>
                            <td>
                                <button type="button" class="btn btn-danger btn-sm" data-action="option-delete">
                                    <i class="fa-solid fa-fw fa-xmark"></i>
                                </button>
                            </td>`;
            this.ui[ type ].appendChild( tr );
        }
    },
    rowDelete( button ) {
        this.doLog( '%cWebSocketConsole.rowDelete', this.debugStyle, button );
        // this.ui.customOptions.removeChild(  );
        button.closest('tr').remove();
    },
    setupListeners() {
        this.doLog( '%cWebSocketConsole.setupListeners', this.debugStyle );

        // all buttons
        document.body.addEventListener('click', event => {
            let button = event.target.closest('button');

            if ( button ) {
                const   action = button.dataset.action,
                        actionMap = {
                            'argument-add'     : () => this.rowAdd( 'arguments' ),
                            'argument-delete'  : () => this.rowDelete( button ),
                            'authenticate'     : this.authenticate,
                            'check-socket'     : this.checkSocket,
                            'clear-log'        : this.clearLog,
                            'invoke'           : this.invoke,
                            'invokeAndPublish' : this.invokeAndPublish,
                            'open-socket'      : this.openSocket,
                            'option-add'       : () => this.rowAdd( 'customOptions' ),
                            'option-delete'    : () => this.rowDelete( button ),
                            'publish'          : this.publish,
                            'stop-socket'      : this.stopSocket,
                            'subscribe'        : this.subscribe,
                            'subscribers'      : this.getSubscriberCount,
                            'subscriptions'    : this.getSubscriptions,
                            'unsubscribe'      : this.unsubscribe,
                        };

                if ( actionMap[action] )
                    actionMap[action].call( this );
            }
        });
    },
    showError( message, delay = false ) {
        this.doLog( '%cWebSocketConsole.showError', this.debugStyle, { message } );

        this.ui.modal._element.querySelector('.modal-body').innerHTML = message;

        // small delay to allow for log scroll animation to complete
        if ( delay )
            setTimeout( () => this.ui.modal.show(), 250 );
        else
            this.ui.modal.show();
    },
    stopSocket() {
        this.doLog( '%cWebSocketConsole.stopSocket', this.debugStyle );

        if ( this.checkSocketAccess() ) {
            this.write( '<strong>CLOSING SOCKET</strong>', 'alert-danger' );
            ws.closeConnection();
        }
    },
    subscribe() {
        this.doLog( '%cWebSocketConsole.subscribe', this.debugStyle );

        let channel = this.fields.channel.value.toString().trim(),
            customOptions;

        if ( channel === '' ) {
            this.showError( 'Enter a channel to subscribe' );
        }
        else if ( this.checkSocketAccess() ) {
            customOptions = this.buildCustomOptions();

            if ( this.authenticated.username )
                customOptions.username = this.authenticated.username;

            ws.subscribe( channel, customOptions );
        }

    },
    unsubscribe() {
        this.doLog( '%cWebSocketConsole.unsubscribe', this.debugStyle );

        let channel = this.fields.channel.value.toString().trim();

        if ( channel === '' )
            this.showError( 'Enter a channel to unsubscribe' );
        else if ( this.checkSocketAccess() )
            ws.unsubscribe( channel );

    },
    write( message, classes ) {
        this.doLog( '%cWebSocketConsole.write', this.debugStyle, { message, classes } );

        let elem = document.createElement( 'div' );

        classes = ( classes || 'alert-primary' ).split(' ');
        classes.unshift( 'alert' );

        elem.classList.add( ...classes );
        elem.innerHTML = this.parse( message );
        this.ui.log.appendChild( elem );
        elem.scrollIntoView( { behavior: 'smooth', block:'nearest' } );
    },
    // for debugging
    doLog : (
        canDebug ?
        console.log.bind( window.console ) :
        function() {}
    )
};

WebSocketConsole.init();
