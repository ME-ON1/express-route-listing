import fs from "fs"
import {markdownTable as mdTable} from "markdown-table"
/*
 * OPTIONS - params
 * methods
 * middleware
 * post in file
 * or log
 * **/

const METHODS = {
	post 	: 'POST' ,
	get  	: 'GET',
	patch 	: 'PATCH',
	options : 'OPTIONS',
	update  : 'UPDATE' ,
	put 	: 'PUT'
}

export const AccquireRoute = (app, options   ) => {
	const {
		writeToFile ,
		printToConsole ,
	} = options
	const {stack} = app._router ;
	console.log(JSON.stringify(stack,null ,2  ))
	let r_routeInfoList = [] ;
	for(let val of stack )
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
			if(!isUndefined(val.route , 'methods'))
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
		if(Object.keys(r_LogObj).length !== 0)
		{
			r_routeInfoList.push(r_LogObj)
		}
	}
	if(typeof writeToFile === "boolean" && writeToFile)
	{
		const r_mdTableData = r_mdTableHdl(r_routeInfoList)
		fileWriteHdl(r_mdTableData)
	}
}

/**
 * add table heading
 * and make path
 * and itr over ar of methods , mw and params
 **/
function r_mdTableHdl(r_routeInfoList)
{
	let r_mdTableSingleRoute = []
	let ar = ['path' , 'methods' , 'middleware', 'params'];
	r_mdTableSingleRoute.push(ar)
	r_routeInfoList.map((val , index ) => {
		r_mdTableSingleRoute.push([val.path, '', '' , '' ])
		r_mdTableData(val ,ar ).map(r_Data =>{
			r_mdTableSingleRoute.push(r_Data)
		})
	})
	console.log(r_mdTableSingleRoute)
	return r_mdTableSingleRoute;
}

/*
 * itr over methods, params, middleware
 * concurren list them in table
 * wrt to path
 * */
function r_mdTableData(r_routeInfoObj , r_tableHeading)
{
	let ar = []
	let len_method = r_routeInfoObj['methods'].length , len_middw = r_routeInfoObj['middleware'].length , len_params = r_routeInfoObj['params'].length
	let itr_method = 0 , itr_middw = 0, itr_params = 0  ;
	while(itr_method < len_method || itr_middw < len_middw || itr_params < len_params)
	{
		ar.push([null , ar_Hdl(len_method , itr_method++ ,r_routeInfoObj, 'methods'), ar_Hdl(len_middw , itr_middw++, r_routeInfoObj, 'middleware') , ar_Hdl(len_params, itr_params++ , r_routeInfoObj , 'params')])
	}
	return ar;
}

/**
 * handle diff data to add in ar
 *
 * */

function ar_Hdl(len , itr , r_routeInfoObj, key)
{
	if(itr < len )
	{
		return (key === "methods" ? r_routeInfoObj[key][itr] : r_routeInfoObj[key][itr]['name']);
	}else
	{
		return null;
	}
}

function fileWriteHdl(r_DataWrite)
{
	fs.writeFile("./Rob.md", mdTable(r_DataWrite), (Er)=>{
		if(Er )
		{
			console.log(Er)
		}else
		{
			console.log("written")
		}
	})
}

function routeParamHdl(r_paramsObj, r_LogObj)
{
	let r_paramsList = [] ;
	for(let r_paramVal of r_paramsObj )
	{
		let r_param = {} ;
		r_param.name = r_paramVal.name
		r_paramsList.push(r_param) ;
	}
	r_LogObj.params = r_paramsList ;
}

function routePathHdl(r_routeObj , r_LogObj)
{
	r_LogObj.path = r_routeObj.path
	return ;
}

function routeMethodHdl(r_Route, r_routeInfoObj)
{
	let r_routeMethodList = []
	Object.keys(r_Route.methods).map((val)=>{
		r_routeMethodList.push(val.toUpperCase())
	})

	r_routeInfoObj.methods = r_routeMethodList
	return ;
}

function routeMiddlewareHdl(r_mwObj , r_LogObj)
{
	let r_mwList = []
	for(let r_mwVal of r_mwObj)
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
	}else
	{
		return false ;
	}
}
