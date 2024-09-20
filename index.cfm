<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
	<title>ColdFusion WebSockets Console</title>
	<link rel="icon" href="assets/favicon.png">
	<link rel="author" href="humans.txt">
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.6.0/css/fontawesome.min.css" integrity="sha256-XfA0ppGOANs88Ds+9FqVLy3xIGzT/25K/VLmRRxE9ow=" crossorigin="anonymous">
	<link rel="stylesheet" href="assets/app.css">
</head>
<body>
	<main class="d-flex gap-2 p-md-2">
		<div class="offcanvas-md offcanvas-start" id="console-form">
			<div class="offcanvas-header pb-0">
				<h5 class="offcanvas-title" id="offcanvasLabel">
					WebSockets Console
				</h5>
				<button type="button" class="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#console-form" aria-label="Close"></button>
			</div>
			<div class="offcanvas-body">
				<form role="form" class="w-100">
					<div class="bg-light border p-2 mb-2">
						<div class="mb-2">
							<label for="username" class="form-label">
								Authentication
							</label>
							<div class="d-flex gap-2">
								<input type="text" id="username" class="form-control" placeholder="Username">
								<input type="password" id="password" class="form-control" placeholder="Password">
							</div>
							<small class="form-text">Use this if the channel you want to join requires it</small>
						</div>
						<button type="button" class="btn btn-primary w-100" data-action="authenticate">
							Authenticate
						</button>
					</div>
					<div class="bg-light border p-2 mb-2">
						<div class="mb-2">
							<label for="channel" class="form-label">Channel</label>
							<input id="channel" class="form-control" type="text" placeholder="Channel Name" list="channels">
							<small class="form-text">
								Enter the channel name to subscribe, unsubscribe or publish to
							</small>
						</div>
						<div class="mb-2">
							<table class="table table-striped table-sm align-middle  mb-1" id="custom-options">
								<colgroup>
									<col width="50%">
									<col width="50%">
									<col>
								</colgroup>
								<thead>
									<th colspan="2" class="bg-transparent p-0 fw-normal align-middle">
										Custom Options
									</th>
									<th class="bg-transparent ">
										<button type="button" class="btn btn-sm btn-success" data-action="option-add">
											<i class="fa-solid fa-fw fa-plus"></i>
										</button>
									</th>
								</thead>
								<tbody></tbody>
							</table>
							<small class="form-text">
								Custom options for subscribing and/or publishing
							</small>
						</div>
						<div class="mb-2 d-flex gap-2">
							<button type="button" class="btn btn-primary w-50" data-action="subscribe">
								Subscribe
							</button>
							<button type="button" class="btn btn-danger w-50" data-action="unsubscribe">
								Unsubscribe
							</button>
						</div>
						<div class="mb-2">
							<label for="message" class="form-label">Message</label>
							<textarea id="message" class="form-control" placeholder="Enter Message" rows="4"></textarea>
						</div>
						<button type="button" class="btn btn-success w-100" data-action="publish">
							Publish
						</button>
					</div>
					<div class="bg-light border p-2">
						<div class="mb-2">
							<label for="cfcName" class="form-label">Component &amp; Function Name</label>
							<div class="d-flex gap-2">
								<input type="text" id="cfcName" class="form-control" placeholder="Component Name" list="cfcs">
								<input type="text" id="functionName" class="form-control" placeholder="Function Name" list="functions">
							</div>
							<small class="form-text">
								Enter the name of the <code>cfc</code> ( dot syntax ) and <code>function</code> to invoke
							</small>
						</div>
						<div class="mb-2">
							<table class="table table-striped table-sm align-middle mb-1" id="arguments">
								<colgroup>
									<col width="100%">
									<col>
								</colgroup>
								<thead>
									<th class="bg-transparent p-0 fw-normal align-middle">
										Arguments
									</th>
									<th class="bg-transparent">
										<button type="button" class="btn btn-sm btn-success" data-action="argument-add">
											<i class="fa-solid fa-fw fa-plus"></i>
										</button>
									</th>
								</thead>
								<tbody></tbody>
							</table>
							<small class="form-text">
								Arguments are passed as an array, based on position
							</small>
						</div>
						<div class="d-flex gap-2">
							<button type="button" class="btn btn-success w-50" data-action="invokeAndPublish">
								Invoke And Publish
							</button>
							<button type="button" class="btn btn-secondary w-50" data-action="invoke">
								Invoke
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
		<div class="flex-grow-1 bg-light-subtle d-flex flex-column" id="console">
			<nav class="navbar bg-body-tertiary border-bottom justify-content-start gap-1 p-1 flex-nowrap">
				<button type="button" class="btn btn-sm btn-outline-primary border-0 d-md-none" data-bs-toggle="offcanvas" data-bs-target="#console-form" aria-controls="console-form">
					<i class="fa-solid fa-fw fa-bars"></i>
				</button>
				<div class="d-flex gap-1 flex-wrap justify-content-md-center justify-content-start flex-grow-1">
					<button type="button" class="btn btn-sm btn-outline-success" data-action="open-socket">
						Open
					</button>
					<button type="button" class="btn btn-sm btn-outline-danger" data-action="stop-socket">
						Close
					</button>
					<button type="button" class="btn btn-sm btn-outline-primary" data-action="check-socket">
						Check
					</button>
					<button type="button" class="btn btn-sm btn-outline-primary" data-action="subscribers">
						Subscribers
					</button>
					<button type="button" class="btn btn-sm btn-outline-primary" data-action="subscriptions">
						Subscriptions
					</button>
					<button type="button" class="btn btn-sm btn-outline-dark" data-action="clear-log">
						Clear
					</button>
				</div>
			</nav>
			<div id="log" class="p-2 flex-grow-1 pb-0"></div>
		</div>
	</main>

	<div class="modal fade" id="modal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="modal-label" aria-hidden="true">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
			<div class="modal-header">
				<h1 class="modal-title fs-5" id="modal-label">Attention</h1>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
			<div class="modal-body text-center text-danger"></div>
			<div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Ok</button>
			</div>
			</div>
		</div>
	</div>

	<script src="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.6.0/js/all.min.js" integrity="sha256-qq1ob4lpAizCQs1tkv5gttMXUlgpiHyvG3JcCIktRvs=" crossorigin="anonymous"></script>
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
	<script src="assets/app.js"></script>

	<cfoutput>
		<datalist id="channels">
			<cfloop array="#wsGetAllChannels()#" index="channel">
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

	<!--- Remember to remove the cgi.server_port_secure check if using proxy --->
	<cfwebsocket name      = "ws"
				 onMessage = "WebSocketConsole.onMessage"
				 onOpen    = "WebSocketConsole.onOpen"
				 onError   = "WebSocketConsole.onError"
				 secure    = "#cgi.server_port_secure#">
</body>
</html>