/**
 *URL通用的语法格式： <scheme>://<user>:<password>@<host>:<port>/<path>;<params>?<query>#<frag> 
 */
var URLParser  = {
	url : '',
	_checkLegality : function (url, callback) {
	   if ( !this.isLegalURL(url ? url : this.url) ) {
	   	  return;
	   }
	   callback && callback(url);
	},
	isLegalURL : function (url) {
		var url = ( url ? url : this.url );
		//URL通用语法格式的正则匹配
		
		
		return isLegal;
	},
	getScheme : function (url) {
		var scheme = '';
		this._checkLegality(url, function(url){
			
		});
		return scheme;	
	},
	getHost : function (url) {
		var host = '';
		this._checkLegality(url, function(url){
			
		});
		return host;	
	},
	getPort : function (url) {
		var port = '';
		this._checkLegality(url, function(url){
			
		});
		return port;	
	},
	getPath : function (url) {
		var path = '';
		this._checkLegality(url, function(url){
			
		});
		return path;	
	},
	getQuery : function (url) {
		var query = '';
		this._checkLegality(url, function(url){
			
		});
		return query;	
	},
	getFrag : function (url) {
		var fragment = '';
		this._checkLegality(url, function(url){
			
		});
		return fragment;	
	},
	parseQueryToJSON : function (url) {
		var params = {};
		if(query = this.getQuery(url)) {
			var paramsMapStr = query  //sff=sfdd= & sdfdsf==sdf=sf &
			
			/(\?([\w\.\$!\*;@`~{}\|\/\^\<>()\[\]\{\}"%\\\-;:]*=[\w\.\$!\*=;@`~{}\|\/\^\<>()\[\]\{\}"%\\\-;:]*&)?)?/
		}
		return params;	
	}
};



// url : 
URLParameterParser.parse(window.location.search);

  	var getRequestParams = function () {   
	    var url = location.search, reqParams = {};   
	    if(url.indexOf("?") != -1) {   
			  var urlParams = url.substr(1);   
		      paramList = urlParams.split("&");  
			  _.each(paramList , function(param) {
			      temp = param.split("=");
				  if(temp.length >= 2){
				    var firstIndex = param.indexOf('=');
				     reqParams[temp[0]]=unescape(param.substring(firstIndex+1));
				  }			       
			  });  
		}   
		return reqParams;   
 	}; 