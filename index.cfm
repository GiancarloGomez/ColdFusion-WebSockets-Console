<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
	<title>WS : Console</title>
	<link rel="icon" href="favicon.png">
	<link rel="author" href="humans.txt" />
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@3.4.1/dist/css/bootstrap.min.css" integrity="sha256-bZLfwXAP04zRMK2BjiO8iu9pf4FbLqX6zitd+tIvLhE=" crossorigin="anonymous">
	<link rel="stylesheet" href="styles.css" />
</head>
<body>
	<div class="container-fluid top-20">

		<div class="well well-sm text-center" id="action-buttons">
			<button type="button" id="open" class="btn btn-success">Open Socket</button>
			<button type="button" id="stop" class="btn btn-danger">Stop Socket</button>
			<button type="button" id="check" class="btn btn-warning">Check Socket</button>
			<button type="button" id="getSubscribers" class="btn btn-info">Get Subscribers</button>
			<button type="button" id="getSubscriptions" class="btn btn-info">Get Subscriptions</button>
			<button type="button" id="clear" class="btn btn-default">Clear Log</button>
		</div>

		<div class="flex-row">
			<div class="col">
				<form name="f" role="form">
					<div class="well well-sm">
						<div class="form-group">
							<label for="username" class="control-label">
								Authentication
								<small class="help-block" style="margin:0; font-weight:400;">Use this if the channel you want to join requires it</small>
							</label>
							<input id="username" name="username" class="form-control" type="text" value="" placeholder="Username" />
						</div>
						<div class="form-group">
							<input id="password" name="password" class="form-control" type="password" value="" placeholder="Password" />
						</div>
						<div class="form-group" style="margin-bottom:0;">
							<button id="authenticate" class="btn btn-primary btn-block" type="button">Authenticate</button>
						</div>
					</div>
					<div class="well well-sm">
						<div class="form-group">
							<table class="table table-striped table-condensed table-bordered" style="margin-bottom:0; background-color:white;" id="customHeader">
								<thead>
									<th colspan="2" style="vertical-align:middle;">Custom Headers</th>
									<th>
										<button type="button" class="btn btn-sm btn-success" data-role="add">&plus;</button>
									</th>
								</thead>
								<tbody>
									<tr>
										<td><input type="text" name="customHeaderKey" value="" class="form-control" placeholder="key" /></td>
										<td><input type="text" name="customHeaderValue" value="" class="form-control" placeholder="value" /></td>
										<td></td>
									</tr>
								</tbody>
							</table>
							<small class="help-block">Custom header key=>values for subscribing or publishing</small>
						</div>
						<div class="form-group">
							<label for="channelname" class="control-label">Channel</label>
							<input id="channelname" name="channelname" class="form-control" type="text" value="" placeholder="Channel Name" list="channels" />
							<small class="help-block">Enter the channel name to subscribe, unsubscribe or publish to</small>
						</div>
						<div class="form-group flex-buttons">
							<button id="subscribe" class="btn btn-primary btn-block" type="button">Subscribe</button>
							<button id="unsubscribe" class="btn btn-danger btn-block" type="button">Unsubscribe</button>
						</div>
						<div class="form-group">
							<label for="msg" class="control-label">Message</label>
							<textarea id="msg" class="form-control" placeholder="Enter Message" rows="4"></textarea>
						</div>
						<div class="form-group" style="margin-bottom:0;">
							<button id="publish" type="button" class="btn btn-block btn-success">Publish</button>
						</div>
					</div>
					<div class="well well-sm" style="margin-bottom:0;">
						<div class="form-group">
							<label for="msg" class="control-label">Component</label>
							<input id="cfcname" class="form-control" name="cfcname" type="text" value="" placeholder="CFC Name" list="cfcs" />
							<small class="help-block">Enter the name of the CFC to invoke (dot syntax)</small>
						</div>
						<div class="form-group">
							<label for="fnname" class="control-label">Function</label>
							<input id="fnname" class="form-control" name="fnname" type="text" value="" placeholder="CFC Function" list="functions" />
							<small class="help-block">Enter the name of the function to invoke</small>
						</div>
						<div class="form-group flex-buttons" style="margin-bottom:0;">
							<button id="invoke" type="button" class="btn btn-success btn-block">Invoke</button>
							<button id="invokeAndPublish" type="button" class="btn btn-primary btn-block">Invoke And Publish</button>
						</div>
					</div>
				</form>
			</div>
			<div class="col">
				<div class="well well-small" id="output">
					<ul id="_console" class="list-unstyled">
					</ul>
				</div>
			</div>
		</div>
	</div>
	<cfoutput>
		<datalist id="channels">
			<cfloop array="#WSGetAllChannels()#" index="channel">
				<option value="#channel#">
			</cfloop>
		</datalist>
		<!--- edit this for your own service files that you want to test --->
		<datalist id="cfcs">
			<option value="services.communicate">
		</datalist>
		<datalist id="functions">
			<option value="publish">
			<option value="p2p">
		</datalist>
	</cfoutput>
	<script src="https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@3.4.1/dist/js/bootstrap.min.js" integrity="sha256-nuL8/2cJ5NDSSwnKD8VqreErSWHtnEP9E7AySL+1ev4=" crossorigin="anonymous"></script>
	<script src="https://cdn.jsdelivr.net/npm/javascript.validation@1.4.0/dist/validation.min.js" integrity="sha256-5qaV59r5QeKBF0cklUsOXKWaTR4pg55q3RmFADaWhro=" crossorigin="anonymous"></script>
	<script src="scripts.js"></script>

	<!--- Remember to remove the cgi.server_port_secure check if using proxy --->
	<cfwebsocket 	name="ws"
					onMessage="onMessage"
					onOpen="onOpen"
					onError="onError" />
</body>
</html>