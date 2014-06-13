var constractModule = angular.module('starter.ConstractModule', []);

constractModule.factory('Constract', function($filter){
	var constractObj = {};
	var contractList = [];
	function requestServer () {
		var a = ['{'];
            var _attr = {};
            var _data = {};
            _attr["projectName"] = "spesmobile";
            _attr["methodName"] = "queryPendingApprovalInfo";
            _attr["serviceName"] = "PLMSMOBILE";

            _data["jobNumber"] = "100157";

            a.push( "attr", ':', formatNative( _attr ));
            a.push(',');
            a.push( "data", ':', formatNative( _data ));
            a.push('}');
            var _jsonxml = a.join('');
            EiCommunicator4m.sendWebService("http://202.101.47.84/iPlatMBS/AgentService", _jsonxml, callBack );
	}
	
	var callBack = {
            onSuccess : function(data){
                var xmlDataResult = window.parseXML(data);

                var mapArray = xmlDataResult.getElementsByTagName("map");
                var entryArray;
                var entryKey, entryValue;

                for (var i=0; i<mapArray.length; i++){
                    entryArray = mapArray[i].getElementsByTagName("entry");
					var str = new String('{');

                    for (var k=0;k<entryArray.length;k++){
                        entryKey = entryArray[k].getElementsByTagName("string")[0].textContent;
                        entryValue = entryArray[k].getElementsByTagName("string")[1].textContent;
                        if (k < entryArray.length - 1){
							str += "\"" + entryKey +"\" : \"" + entryValue + "\",";
                        } else {
                        	str += "\"" + entryKey +"\" : \"" + entryValue + "\"}";
                        }
                    }

                    var obj = angular.fromJson(str);
                    contractList.push(obj);
                }
            },
            onFail : function(){
                alert("fail");
            }
        };

        requestServer();
        constractObj.allList = function() {
        	return contractList;
        };
        return constractObj;
});