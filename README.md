# Express-route-listing

Express-route-listing is a minimal, lightweight,  route logger package to log or write (Or Both) express APIs in a file, which helps in documenting the stuff for newer people who will/are contributing their efforts to your repo.

Express-route-listing currently helps in logging PARAMS , METHODS , MIDDLEWARE AND PATH.

It has option to `printToConsole` or `writeToFile`. To Show routes info in console.  Or show them into as md table in Route.md ( in the directory where package.json is present )

Example :

#### Using this package in ES6 module &nbsp;

	import AccquireRoute from "./index.mjs" &nbsp;
	const OPTIONS = { &nbsp;
		printToConsole : BOOLEAN (default true ), &nbsp;
		writeToFile : BOOLEAN (default false ) &nbsp;
	} &nbsp;
	AccquireRoute(app , { &nbsp;
			OPTIONS &nbsp;
			}) &nbsp;


#### Using this package in CommonJs Module ( [require dynamic importing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#dynamic_imports) )

	const modulePath = PATH
	const OPTIONS = {
		printToConsole : BOOLEAN, // (default true )
		writeToFile : BOOLEAN // (default false )
	}
	import(modulePath).then(routeLog => {
		routeLog.AccquireRoute(app , OPTIONS)
			})

