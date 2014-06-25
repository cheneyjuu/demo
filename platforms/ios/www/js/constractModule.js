var constractModule = angular.module('starter.ConstractModule', []);
constractModule.factory('Constract', function($filter) {
    var constractObj = {};
    var contractList;

    function requestServer() {
        contractList = new Array();
        var a = ['{'];
        var _attr = {};
        var _data = {};
        _attr["projectName"] = "spesmobile";
        _attr["methodName"] = "queryPendingApprovalInfo";
        _attr["serviceName"] = "PLMSMOBILE";

        _data["jobNumber"] = "100157";

        a.push("attr", ':', formatNative(_attr));
        a.push(',');
        a.push("data", ':', formatNative(_data));
        a.push('}');
        var _jsonxml = a.join('');
        EiCommunicator4m.sendWebService("http://202.101.47.84/iPlatMBS/AgentService", _jsonxml, callBack);
    }

    var callBack = {
        onSuccess: function(data) {
            if (data != null) {
                var xmlDataResult = window.parseXML(data);

                var mapArray = xmlDataResult.getElementsByTagName("map");
                var entryArray;
                var entryKey, entryValue;

                for (var i = 0; i < mapArray.length; i++) {
                    entryArray = mapArray[i].getElementsByTagName("entry");
                    var str = new String('{');

                    for (var k = 0; k < entryArray.length; k++) {
                        entryKey = entryArray[k].getElementsByTagName("string")[0].textContent;
                        entryValue = entryArray[k].getElementsByTagName("string")[1].textContent;
                        if (k < entryArray.length - 1) {
                            str += "\"" + entryKey + "\" : \"" + entryValue + "\",";
                        } else {
                            str += "\"" + entryKey + "\" : \"" + entryValue + "\"}";
                        }
                    }

                    var obj = angular.fromJson(str);
                    contractList.push(obj);
                }
            }
        },
        onFail: function() {
            alert("fail");
        }
    };

    requestServer();
    constractObj.allList = function() {
        return contractList;
    };
    constractObj.reloadData = function() {
        requestServer();
        return contractList;
    }
    return constractObj;
}).factory('PendingResult', function($location, $ionicLoading) {
    var pendingObj = {};
    pendingObj.requestServer = function(obj, opinion, flag) {
        
        $ionicLoading.show({
          template: 'Loading...'
        });

        var params_begin = "<list><map>";
        var params_entry = "<entry><string>APPROVE_USER_ID</string>" + "<string>100157</string></entry>" +
            "<entry><string>BUSINESS_TYPE_CONTRACT</string>" + "<string>" + obj.BUSINESS_TYPE_CONTRACT + "</string></entry>" +
            "<entry><string>APPROVE_OPINION</string>" + "<string>" + opinion + "</string></entry>" +
            "<entry><string>APPROVE_FLAG</string><string>" + flag + "</string></entry>" +
            "<entry><string>SEG_NO</string><string>" + obj.SEG_NO + "</string></entry>" +
            "<entry><string>LAST_VERSION</string><string>" + obj.LAST_VERSION + "</string></entry>" +
            "<entry><string>PCONTRACT_ID</string><string>" + obj.PCONTRACT_ID + "</string></entry>";
        var params_end = "</map></list>";
        var params = params_begin + params_entry + params_end;



        var a = ['{'];
        var _attr = {};
        var _data = {};
        _attr["projectName"] = "spesmobile";
        _attr["methodName"] = "getPendingResultInfo";
        _attr["serviceName"] = "PLMSMOBILE";

        _data["result"] = params;

        a.push("attr", ':', formatNative(_attr));
        a.push(',');
        a.push("data", ':', formatNative(_data));
        a.push('}');
        var _jsonxml = a.join('');
        EiCommunicator4m.sendWebService("http://202.101.47.84/iPlatMBS/AgentService", _jsonxml, callBack);
    };
    var callBack = {
        onSuccess: function(data) {
            $ionicLoading.hide();
            if (data.length == 1) {
                alert("审批成功");
                $location.path("#/list");
            } else {
                alert(data.substring(2, data.length));
            }
        },
        onFail: function() {
            alert("fail");
        }
    };
    return pendingObj;
});
