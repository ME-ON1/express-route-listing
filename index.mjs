import fs from "fs"
import {markdownTable as mdTable} from "markdown-table"
import util from 'util'
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

const QUERY_REGEX = "(?:\\/([]+?))"
const PARAM_REGEX = "(?:([^\\/]+?))"
// \/([^\/]+?))?
const replaceTokens = (path, keys) => {
	return keys.reduce((memo, key) => {
		if(key.optional)
		{
			return  memo.replace("(?:\\/([^\\/]+?))", `/:${key.name}`)
			tmp_str.substr(tmp_str.indexOf(key.name) + key.name.length +1,key.offset)
		}
		else
		{
			return memo.replace(PARAM_REGEX, `:${key.name}`);
		}
	}, path.toString());
};

const cleanRegEx = (path) => {
	var out = String(path) || ''
	out = out.replace(/\\\//g, '/'); // escaped slashes
	out = out.replace(/\^\//g, ''); // beginning of route
	out = out.replace(/(\/\?\(\?\=\/\|\$\)\/\i)/, ''); // stack route end
	if(out.match(/^\/\?\$\/\i$/)) out = '/';
	else out = out.replace(/\/\?\$\/\i/, ''); // route end
	return out;
};



export const AccquireRoute = (app, {printToConsole = true , writeToFile = false } ) => {
	const {stack} = app._router ;
	let r_routeInfoList = [] ;
	let baseUrl = ""

	for(let val of stack )
	{
		if(isUndefined(val, 'router') && (val.name === 'router' || val.name === 'bound dispatch') )
		{
			r_LayerHdl(val , r_routeInfoList , baseUrl + cleanRegEx(replaceTokens(val.regexp, val.keys))) ;
		}

	}

	if(typeof printToConsole === "boolean" && printToConsole )
	{
		console.log(util.inspect(r_routeInfoList , {showHidden : false , depth : null }))
	}else
	{
		throw new Error(`printToConsole needs to be Boolean , found to be ${typeof printToConsole} `)
	}
	if(typeof writeToFile === "boolean" && writeToFile)
	{
		const r_mdTableData = r_mdTableHdl(r_routeInfoList)
		fileWriteHdl(r_mdTableData)
	}
}

const r_LayerHdl = (r_ILog, r_routeInfoList , baseUrl) => {
	if(r_ILog.name === 'bound dispatch')
	{
		let r_LogObj = {};
		if(!isUndefined(r_ILog , 'route'))
		{
			routePathHdl(r_ILog.route, r_LogObj, baseUrl ) ;
			if(!isUndefined(r_ILog.route , 'stack'))
			{
				routeMiddlewareHdl(r_ILog.route.stack, r_LogObj) ;
			}
		}
		if(!isUndefined(r_ILog.route , 'methods'))
		{
			routeMethodHdl(r_ILog.route, r_LogObj) ;
		}
		if(!isUndefined(r_ILog , 'keys'))
		{
			routeParamHdl(r_ILog.keys, r_LogObj, r_ILog.regexp) ;
		}
		r_routeInfoList.push(r_LogObj)
	}
	if(isUndefined(r_ILog, 'route') && r_ILog.name === 'router')
	{
		for(const stk of r_ILog.handle.stack)
		{
			r_LayerHdl(stk , r_routeInfoList, baseUrl +""+ cleanRegEx(replaceTokens(stk.regexp, stk.keys)))
		}
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
	let ar = ['path' , 'methods' , 'middleware', 'params', 'query'];
	r_mdTableSingleRoute.push(ar)

	r_routeInfoList.map((val , index ) => {
		r_mdTableSingleRoute.push([val.path, '', '' , '','' ])

		mdTableDataHdl(val ,ar ).map(r_Data =>{
			r_mdTableSingleRoute.push(r_Data)
		})
	})
	return r_mdTableSingleRoute;
}

/*
 * itr over methods, params, middleware
 * concurren list them in table
 * wrt to path
 * */
function mdTableDataHdl(r_routeInfoObj)
{
	let ar = []
	let len_method = r_routeInfoObj['methods'].length , len_middw = r_routeInfoObj['middleware'].length , len_params = r_routeInfoObj['params'].length , len_query = r_routeInfoObj['query'].length ;

	let itr_method = 0 , itr_middw = 0, itr_params = 0 , itr_query = 0  ;

	while(itr_method < len_method || itr_middw < len_middw || itr_params < len_params || itr_query < len_query )
	{
		ar.push([null , ar_Hdl(len_method , itr_method++ ,r_routeInfoObj, 'methods'), ar_Hdl(len_middw , itr_middw++, r_routeInfoObj, 'middleware') , ar_Hdl(len_params, itr_params++ , r_routeInfoObj , 'params'), ar_Hdl(len_query , itr_query++ ,r_routeInfoObj, 'query')])
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
	fs.writeFile("./Route.md", mdTable(r_DataWrite), (Er)=>{
		if(Er )
		{
			//console.log(Er)
			throw "Cannot write to the File"
		}else
		{
			console.log("written")
		}
	})
}

function routeParamHdl(r_paramsObj, r_LogObj, r_regexExp )
{
	let r_paramsList = [] ;
	let r_queryList = [] ;
	for(let r_paramVal of r_paramsObj )
	{
		let r_param = {} ;
		let r_query = {} ;
		if(r_paramVal.optional )
		{
			r_query.name = paramsQueryHdl(r_paramVal, r_regexExp, r_LogObj )
			r_queryList.push(r_query) ;
		}
		r_param.name = r_paramVal.name
		r_paramsList.push(r_param) ;
	}
	r_LogObj.params = r_paramsList ;
	r_LogObj.query = r_queryList ;
}

function paramsQueryHdl(r_paramObj , r_regexString, r_LogObj)
{
	return r_LogObj.path.substr(r_LogObj.path.indexOf(r_paramObj.name) + r_paramObj.name.length +1 , r_paramObj.offset - 2)
}

function routePathHdl(r_routeObj , r_LogObj, baseUrl)
{
	r_LogObj.path = baseUrl
	return;
}

function routeMethodHdl(r_Route, r_routeInfoObj, baseUrl )
{
	let r_routeMethodList = []
	Object.keys(r_Route.methods).map((val)=>{
		r_routeMethodList.push(val.toUpperCase())
	})

	r_routeInfoObj.methods = r_routeMethodList
	return ;
}

function routeMiddlewareHdl(r_mwObj , r_LogObj, baseUrl)
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

export function isUndefined(objectCheck, checkProperty )
{
	if(typeof objectCheck[checkProperty] === 'undefined' )
	{
		return true ;
	}else
	{
		return false ;
	}
}
