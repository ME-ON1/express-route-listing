# express-route-listing

express-route-listing is a package to log or write (Or Both) in file.


Express-route-listing currently helps in logging PARAMS , METHODS , MIDDLEWARE AND ROUTE.

Currently it has option to `printToConsole` or `writeToFile` or Both.
All the route infomation is presented as a table in a md file ( with the help of markdownTable package as a sole dependencies  )

Currently due to supports ES6 modules


Example
Using this package in ES6 module
`
	import AccquireRoute from "./index.mjs"
	const OPTIONS = {
		printToConsole : BOOLEAN (default true ),
		writeToFile : BOOLEAN (default false )
	}
	AccquireRoute(app , {
			OPTIONS
			})
`

OR

Using this package in CommonJS module

use dynamic importing

`
	const modulePath = PATH
	const OPTIONS = {
		printToConsole : BOOLEAN, // (default true )
		writeToFile : BOOLEAN // (default false )
	}
	import(modulePath).then(routeLog => {
		routeLog.AccquireRoute(app , OPTIONS)
			})
`

