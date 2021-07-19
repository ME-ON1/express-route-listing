# Express-route-listing

Express-route-listing is a minimal, lightweight,  route logger package to log or write (Or Both) express APIs in a file, which helps in documenting the stuff for newer people who will/are contributing their efforts to your repo.

Express-route-listing currently helps in logging PARAMS , METHODS , MIDDLEWARE AND PATH.

It has option to `printToConsole` or `writeToFile`. To Show routes info in console.  Or show them into as md table in Route.md ( in the directory where package.json is present )

Example :

#### Using this package in ES6 module &nbsp;

	import AccquireRoute from "./index.mjs" 
	const OPTIONS = { 
		printToConsole : BOOLEAN (default true ), 
		writeToFile : BOOLEAN (default false ) 
	} 
	AccquireRoute(app , { 
			OPTIONS 
			}) 


#### Using this package in CommonJs Module ( [require dynamic importing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#dynamic_imports) )

	const modulePath = PATH
	const OPTIONS = {
		printToConsole : BOOLEAN, // (default true )
		writeToFile : BOOLEAN // (default false )
	}
	import(modulePath).then(routeLog => {
		routeLog.AccquireRoute(app , OPTIONS)
			})
			
#### Test Case Example 

	app.route('/')
        .get((req, res) => {
                res.end()
        })
        .all((req, res) => {
                res.end()
        })
        .post((req, res) => {
                res.end()
        })

	app.route('/testing')
        	.all((req, res) => {
                res.end()
        	})
        	.delete((req, res) => {
                	res.end()
        	})
	app.route('/testing')
        	.all((req, res) => {
                	res.end()
        	})
        	.delete((req, res) => {
                	res.end()
	        })
 
	router.route('/')
        	.get((req, res) => {
                	res.end()
        	})
        	.all((req, res) => {
                	res.end()
        	})
        	.post((req, res) => {
                	res.end()
        	})
	
	function mid(req, res, next ){
        next()
	}

	function mid1(req, res, next)
	{
        	next()
	}

	function mid2(req,res ,next)
	{
        	next()
	}
	app.get('/testing1/:id?something ', mid , mid1 , mid2 , (req,res,next)=>{
        	console.log("this is a working example for query and params")
	})
##### Output in console

	[
 	 {
	    path: '/',
	    middleware: [],
	    methods: [ 'GET', '_ALL', 'POST' ],
	    params: [],
	    query: []
	  },
	  {
	    path: '/testing',
	    middleware: [],
	    methods: [ '_ALL', 'DELETE' ],
	    params: [],
	    query: []
	  },
	  {
	    path: '/testing',
	    middleware: [],
	    methods: [ '_ALL', 'DELETE' ],
	    params: [],
	    query: []
	  },
	  {
	    path: '/testing1/:id?somthing ',
	    middleware: [ { name: 'mid' }, { name: 'mid1' }, { name: 'mid2' } ],
	    methods: [ 'GET' ],
	    params: [ { name: 'id' } ],
	    query: [ { name: 'somthing ' } ]
	  }
	]



##### Output in Route.md 

| path                    | methods | middleware | params | query     |
| ----------------------- | ------- | ---------- | ------ | --------- |
| /                       |         |            |        |           |
|                         | GET     |            |        |           |
|                         | _ALL    |            |        |           |
|                         | POST    |            |        |           |
| /testing                |         |            |        |           |
|                         | _ALL    |            |        |           |
|                         | DELETE  |            |        |           |
| /testing                |         |            |        |           |
|                         | _ALL    |            |        |           |
|                         | DELETE  |            |        |           |
| /testing1/:id?somthing  |         |            |        |           |
|                         | GET     | mid        | id     | somthing  |
|                         |         | mid1       |        |           |
|                         |         | mid2       |        |           |


