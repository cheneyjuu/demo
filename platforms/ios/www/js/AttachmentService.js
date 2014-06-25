var attachmentService = angular.module('starter.attachmentService', []);
attachmentService.factory('Attachment', function($location) {
    var attchment = {};
    attchment.show = function(url) {
        var gmInfo = new EiInfo();
        var block = new EiBlock("inqu_status");
        gmInfo.addBlock(block);

        var blockMeta = new EiBlockMeta();
        var meta = new EiColumn("appDeviceType");
        meta.pos = 0;
        blockMeta.addMeta(meta);

        gmInfo.set("projectName", "FileService");
        gmInfo.set("methodName", "");
        gmInfo.set("serviceName", "");
        gmInfo.set("fileurl", url + "&name=xxxx.doc");
        EiCommunicator4m.callService("http://mobile.baosteel.com/iPlatMBS/AgentService", gmInfo, callback);
    }

    var callback = {
        onSuccess: function(eiInfo) {
            if (eiInfo != null){
                var _jsonEi = EiInfo2Json.prototype.EiInfo2JsonString(eiInfo);
                attchment.fileurl = eiInfo.get("fileurl");
            } else {
                attchment.fileurl = null;
            }
            // attchment.fileurl = eiInfo.get("fileurl");
        },
        onFail: function(eMsg) {
            alert("failure");
        }
    };
    return attchment;
})
