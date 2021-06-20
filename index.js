//const app = new  require("../testDoc/app");
const fs = require("fs") ;
const {log} = require("util");

/*
 * OPTIONS - params
 * methods
 * middleware
 * post in file
 * or log
 *
 * **/


const METHODS = {
	post 	: 'POST' ,
	get  	: 'GET',
	patch 	: 'PATCH',
	options : 'OPTIONS',
	update  : 'UPDATE' ,
	put 	: 'PUT'
}



exports.AccquireRoute = (app  , options ) => {
	const {
		writeToFile ,
		printToConsole ,
	} = options
	const {stack} = app._router ;
	let r_routeInfoList = [] ;
	for(val of stack )
	{
		let r_LogObj = {}
		if(!isUndefined(val, 'name') && val.name == 'bound dispatch')
		{
			if(!isUndefined(val , 'route'))
			{
				routePathHdl(val.route, r_LogObj) ;
				if(!isUndefined(val.route , 'stack'))
				{
					routeMiddlewareHdl(val.route.stack, r_LogObj) ;
				}
			}
			if(!isUndefined(val , 'methods'))
			{
				routeMethodHdl(val.route, r_LogObj) ;
			}
			if(!isUndefined(val , 'keys'))
			{
				routeParamHdl(val.keys, r_LogObj) ;
			}
			if(!isUndefined(val , 'regexp'))
			{
				routeRegexpHdl(val.regexp, r_LogObj) ;
			}

		}
		if(typeof printToConsole === "boolean" && printToConsole )
		{
			console.log(r_LogObj)
		}else
		{
			throw new Error(`printToConsole needs to be Boolean , found to be ${typeof printToConsole} `)
		}
		r_routeInfoList.push(r_LogObj)
	}
	if(typeof writeToFile === 'boolean' && writeToFile)
	{

	}else {
		throw new Error(`writeToFile needs to be boolean, found to be ${typeof writeToFile}` )
	}
}


function routeParamHdl(r_paramsObj, r_LogObj)
{
	if( r_paramsObj.length === 0 )
	{
		return ;
	}else {
		let r_paramsList = [] ;
		for(r_paramVal of r_paramsObj )
		{
			let r_param = {} ;
			r_param.name = r_paramVal.name
			r_paramsList.push(r_param) ;
		}
		r_LogObj.params = r_paramsList ;

	}
}

function routePathHdl(r_routeObj , r_LogObj)
{
	r_LogObj.path = r_routeObj.path
	return ;
}

function routeMethodHdl(r_Route, r_routeInfoObj)
{
	const ar = Object.keys(r_Route.methods)
	r_routeInfoObj.methods = ar[0].toUpperCase();
	return ;
}

function routeMiddlewareHdl(r_mwObj , r_LogObj)
{
	let r_mwList = []
	for(r_mwVal of r_mwObj)
	{
		let l_mwObj = {}
		if(r_mwVal.name !== '<anonymous>')
		{
			l_mwObj.name = r_mwVal.name
			r_mwList.push(l_mwObj)
		}
	}
	r_LogObj.middleware = r_mwList
	return ;
}

function routeRegexpHdl(r_regexpObj , r_LogObj)
{
	r_LogObj.regexp = r_regexpObj
	return ;
}

function isUndefined(objectCheck, checkProperty )
{
	if(typeof objectCheck[checkProperty] === 'undefined' )
	{
		return true ;
	}
}


//AccquireRoute(app) ;
