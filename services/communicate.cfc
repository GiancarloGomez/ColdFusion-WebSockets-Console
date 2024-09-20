component {
	remote function publish( string message = "", numeric delay = 0 ) {
		var response = "communicate.publish()";
		if ( arguments.delay ){
			// make sure the delay is not more than 10 seconds
			arguments.delay = min( arguments.delay, 10 );
			sleep( arguments.delay * 1000 );
			response &= " : delayed ( " & arguments.delay & " ) ";
		}
		if ( len( trim( arguments.message ) ) )
			response &= " : message > " & arguments.message;
		return response;
	}

	remote function p2p() {
		thread name="backToInvoker_#createUUID()#" action="run"{
			for ( var i = 1; i <= 10; i++ ){
				sleep( 1000 );
				wsSendMessage( i & " of 10 : I am only returning this to the P2P Client" );
			}
		}
		return "communicate.p2p()";
	}
}