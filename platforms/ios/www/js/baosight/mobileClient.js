function JSON2String(obj){
	if (typeof obj == "number"){
		return isFinite(obj) ? String(obj) : "null";
	}
	if (typeof obj == "boolean"){
		return String(obj);
	}
	if (typeof obj == "date"){
		function f(n) {
            return n < 10 ? '0' + n : n;
        }
        return '"' + obj.getFullYear() + '-' +
                f(obj.getMonth() + 1) + '-' +
                f(obj.getDate()) + 'T' +
                f(obj.getHours()) + ':' +
                f(obj.getMinutes()) + ':' +
                f(obj.getSeconds()) + '"';
	}
	if (typeof obj == "array" || obj instanceof Array){
		var a = ['['],  // The array holding the text fragments.
            b,          // A boolean indicating that a comma is required.
            i,          // Loop counter.
            l = obj.length,
            v;          // The value to be stringified.

        function pa(s) {
            if (b) {
                a.push(',');
            }
            a.push(s);
            b = true;
        }
        for (i = 0; i < l; i += 1) {
            v = obj[i];
            switch (typeof v) {
            case 'undefined':
            case 'function':
            case 'unknown':
                break;
            case 'object':
            default:
                pa(JSON2String(v));
            }
        }
        a.push(']');
        return a.join('');
	}
	if (typeof obj == "string" || obj instanceof String){
		var m = {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        };
		if (/["\\\x00-\x1f]/.test(obj)) {
	        return '"' + obj.replace(/([\x00-\x1f\\"])/g, function(a, b) {
	            var c = m[b];
	            if (c) {
	                return c;
	            }
	            c = b.charCodeAt();
	            return '\\u00' +
	                Math.floor(c / 16).toString(16) +
	                (c % 16).toString(16);
	        }) + '"';
	    }
	    return '"' + obj + '"';
	}
	if (typeof obj == "object"){
		var a = ['{'],  // The array holding the text fragments.
            b,          // A boolean indicating that a comma is required.
            k,          // The current key.
            v;          // The current value.

        function p(s) {
            if (b) {
                a.push(',');
            }
            a.push(JSON2String(k), ':', s);
            b = true;
        }
        for (k in obj) {
            if (obj.hasOwnProperty(k)) {
                v = obj[k];
                switch (typeof v) {
                case 'undefined':
                case 'function':
                case 'unknown':
                    break;
                case 'object':
                default:
                    p(JSON2String(v));
                }
            }
        }
        a.push('}');
        return a.join('');
	}
}

function  IsInteger(strInteger)  {  
	var   newPar =/^(-|\+)?\d+$/;   
	return   newPar.test(strInteger);  
}

function GetServiceUrl(tar){
	return "/POR/" + tar;
}

//function AjaxJsonPost(target,service,method,json,callback){
//	var u = GetServiceUrl(target);
//	$.ajax({
//		type: "POST",
//		async: false,
//		url: u,
//		data: "service="+service+"&method="+method+"&param=" + json,
//		dataType: json,
//		success: function(msg){
//			callback.onSuccess(msg);
//		},
//		error: function(msg){
//			callback.onFail(msg);
//		}
//	});
//}

function GetJSONBlock(eiinfo,name){
	return eiinfo.getBlock(name);
}

function GetJSONData(eiinfo,name){
	return GetJSONBlock(eiinfo,name).getRows();
}

function GetJSONColDefine(eiinfo,name){
	var metas = eiinfo.getBlock(name).getBlockMeta().getMetas();
	columns = [];
	for (var key in metas ){
		var eiCol = metas[key];
		var col = {};
		col.key = key;
		col.name = eiCol.getName();
		col.descName = eiCol.getDescName();
		col.primaryKey = eiCol.isPrimaryKey();
		col.isNotNull = eiCol.isNotNull();
		col.maxLength = eiCol.getMaxLength();
		col.editor = eiCol.getEditor();
		col.regex = eiCol.getRegex();
		col.formatter = eiCol.getFormatter();
		col.type = eiCol.getType();
		col.multiService = eiCol.get("multiselectservice");
		col.multiCol = eiCol.get("multiselectcol");
		col.list = eiCol.get("list");
		col.helpMessage = eiCol.get("HELP");
		this.columns.push(col);
	}
	return columns;
	
//	return GetJSONBlock(eiinfo,name).blockMeta.metas;
//	var col = getJSONBlock(json,name).columns;
//	var colDef = col.columnList;
//	var pos = col.columnPos;
//	var defs = [];
//	for(var i=0;i<colDef.length;i++){
//		var def = {};
//		def = colDef[i]
//		for(var j=0;j<pos.length;j++){
//			var idx = pos[j][def.name];
//			if (idx){
//				defs[idx] = def;
//			}
//		}
//	}
//	return defs;
}

function GetJSONParam(eiinfo,name){
	return GetJSONBlock(eiinfo,name).attributes;
}
/**
 * Set Context Path
 */
var CONTEXT_PATH = CONTEXT_PATH?CONTEXT_PATH:".";

/**
 * ���� AbstractEi ����.
 * @class EiInfo ����  
 * eiblock,eiinfo,eicolumn,eiblockmeta���̳��ڴ���
 * @constructor
 * @return A new AbstractEi
 */
function AbstractEi() {
  /**
   * AbstractEi �������
   * @type Object
   * @private
   */
  this.extAttr = {};	
};
/**
 * ���������õ�����ֵ
 * @param 	{String} prop	:	������
 * @return  {Object} 		:	�������Ӧ��ֵ
 */
AbstractEi.prototype.get = function ( prop ) {
	return this.extAttr[prop];	
};	
/**
 * ��������ֵ
 * @param {Object} prop		:	������
 * @param {Object} value	��	�������Ӧ��ֵ
 */
AbstractEi.prototype.set = function( prop, value ) {
	this.extAttr[prop] = value;	
};
/**
 * ȡ�����Զ���
 * @return {Object}	:	���Զ���
 */
AbstractEi.prototype.getAttr = function(){
	return this.extAttr;	
};
/**
 * �������Զ���
 * @param {Object} sAttr	:	Ҫ���õ����Զ���
 */
AbstractEi.prototype.setAttr = function(sAttr){
	this.extAttr = sAttr;	
};
/**
 * EiColumn����
 * @class EiColumn �๹�캯��
 * @extends AbstractEi
 * @constructor
 * @param {Object} name	: 	eicolumn ���
 * @see AbstractEi AbstractEi is the base class for this
 */
function EiColumn( name ) {
	/**
	 * @private
	 */
    this.pos = -1;
	/**
	 * @private
	 */	
	this.name = name;
	/**
	 * @private
	 */	
	this.descName = "";
	/**
	 * @private
	 */	
	this.type = "C"; 
	/**
	 * @private
	 */              
	this.regex = null; 
	/**
	 * @private
	 */              
	this.formatter = null;    
	/**
	 * @private
	 */       
	this.editor = "text";  
	/** 
	 * @private
	 */           
	this.minLength = 0;    
	/**
	 * @private
	 */       
	this.maxLength = Number.MAX_VALUE;       
	/**
	 * @private
	 */    
	this.primaryKey = false;      
	/**
	 * @private
	 */   
	this.nullable = true;     
	/**
	 * @private
	 */   
	this.visible = true;     
	/** 
	 * @private
	 */        
	this.readonly = false;   
	/**
	 * @private
	 */        
	this.displayType = "text"; 
	/**
	 * @private
	 */
	this.errorPrompt = null;    
	/**
	 * @private
	 */    
	this.dateFormat = null;    
	/**
	 * @private
	 */    
	this.defaultValue = "";     
	/**
	 * @private
	 */ 
	this.validateType = null;     
	/**
	 * @private
	 */
	this.width = 96;  
	/**
	 * @private
	 */
	this.height = 18;   
	/**
	 * @private
	 */
	this.align = "left";   
	/**
	 * @private
	 */   
	this.blockName = null; 
	/**
	 * @private
	 */
	this.sourceName = null; 
	/**
	 * @private
	 */
	this.labelProperty = null; 
	/**
	 * @private
	 */   
	this.valueProperty = null; 
	/**
	 * @private
	 */

	this.extAttr = {};	
};

EiColumn.prototype = new AbstractEi;
/**
 * EiBlockMeta��ͷ��
 * @class EiBlockMeta �๹�캯��
 * @extends AbstractEi
 * @constructor
 * @param {String} sBlockId	: 	blockId
 * @see AbstractEi AbstractEi is the base class for this
 */
function EiBlockMeta(sBlockId){
	/**
	 * @private
	 */
	this.blockId = sBlockId;
	/**
	 * @private
	 */
	this.metas = {};
	/**
	 * @private
	 */
	this.extAttr = {};
	/**
	 * @private
	 */
	this.colCount = 0;
}
EiBlockMeta.prototype = new AbstractEi;
/**
 * ����EiBlockMeta��ͷ�������
 * @param {String} sDesc	����ͷ������Ϣ
 */
EiBlockMeta.prototype.setDesc = function(sDesc){
	this.desc=sDesc;
};	
/**
 * ȡ����ͷ������Ϣ
 * @return {String}	:	��ͷ����
 */
EiBlockMeta.prototype.getDesc = function(){
	return this.desc;
};
/**
 * �����ͷ��Ϣ
 * @param {EiColumn} sEiColumn	:	����Ϣ
 * @throws	Error�쳣
 */
EiBlockMeta.prototype.addMeta = function(sEiColumn){
  if ( sEiColumn instanceof EiColumn )	{
		this.metas[sEiColumn.name]=sEiColumn;
		this.colCount++;
  } else {
  	throw new Error("Can NOT add as an EiColumn");
  } 	
};
/**
 * ȡ������Ϣ
 * @param {String} sName	:	�����
 * @return {EiColumn}	:	����Ϣ
 * @exception	���쳣�׳�
 */
EiBlockMeta.prototype.getMeta = function(sName){	
	return this.metas[sName];
};
/**
 * ȡ����ͷ���ڵ�blockId
 * @return {String}	:	���ڵ�blockId
 */
EiBlockMeta.prototype.getBlockId = function(){	
	return this.blockId;
};
/**
 * ȡ����ͷ���е�����Ϣ
 * @return {Object}	:	��ͷ���е�����Ϣ
 */
EiBlockMeta.prototype.getMetas = function(){	
	return this.metas;
};

/**
 * EiBlock �����캯��
 * @class	EiBlock��
 * @constructor
 * @extends AbstractEi
 * @param {String} blockId	:	block��ID
 * @see AbstractEi AbstractEi is the base class for this
 */
function EiBlock(blockId) {	
  if( typeof blockId == "string" ){
  	/**
  	 * @private
  	 */
		this.meta = new EiBlockMeta(blockId);
  } else if ( blockId instanceof EiBlockMeta ){
  	/**
  	 * @private
  	 */
  	this.meta = blockId;
	}	else {
		 throw new Error("Can NOT create block");
	};	
	/**
	 * @private
	 */
	this.rows = new Array();
	/**
	 * @private
	 */
	this.colCount = 0;
	/**
	 * @private
	 */
	this.extAttr = {};
};

EiBlock.prototype = new AbstractEi;
/**
 * ȡ��block�����е���ͷ��Ϣ
 * @return {Object} ����block����ͷ��Ϣ
 */
EiBlock.prototype.getBlockMeta = function(){	
	return this.meta;
};
/**
 * ����block�����е���ͷ��Ϣ
 * @param {Object} sBlockMeta	:	block�����е���ͷ��Ϣ
 * 
 */
EiBlock.prototype.setBlockMeta = function(sBlockMeta){	
	this.meta = sBlockMeta;
};
/**
 * ��block��������������
 * @param {Object} sRow	:	�����
 */
EiBlock.prototype.addRow = function(sRow){		
	if ( sRow == null ){
		this.rows.push({});
//	  	this.rows[this.rows.length] = {};
	} else {
//		this.rows[this.rows.length] = sRow;
		this.rows.push(sRow);
	}		
};
/**
 * ȡ��block���������
 * @return {Object}	:	����block�������
 */
EiBlock.prototype.getRows = function(){
	return this.rows;
};	
/**
 * ���ָ���кż�����,�趨�����ֵ.
 * @param {Object} sRowNo	���к�
 * @param {Object} sColName	������
 * @param {String} sValue	�����ֵ
 */
EiBlock.prototype.setCell = function(sRowNo, sColName, sValue){
    var pos = this.getBlockMeta().getMeta(sColName).pos;
    while (typeof(this.rows[sRowNo]) == "undefined") this.addRow(null);
	this.rows[sRowNo][pos] = sValue;
};
/**
 * ���ָ���кš�����ȡ�����ֵ
 * @param {Object} sRowNo	���к�
 * @param {Object} sColName	������
 * @return {String} value	: ���ֵ
 */
EiBlock.prototype.getCell = function(sRowNo, sColName){
    var column = this.getBlockMeta().getMeta(sColName);
    if (column) {
	    var pos = this.getBlockMeta().getMeta(sColName).pos;
		return this.rows[sRowNo][pos];
	} else {
		return "";
	}
};
/**
 * ����кš��кţ�ȡ�����ֵ
 * @param {Object} sRowNo	���к�
 * @param {Object} sColPos	���к�
 * @return {String} value	: ���ֵ 
 */
EiBlock.prototype.getCellByPos = function(sRowNo, sColPos){
	return this.rows[sRowNo][sColPos];
};	
/**
 * @private
 * @param {Object} obj
 */
EiBlock.prototype.getMappedArray = function(obj){
  var cols = this.getBlockMeta().getMetas(); 
  var row = new Array();
  for( var col in cols ){
    var pos = this.getBlockMeta().getMeta(col).pos;
    row[pos] = obj[col];
  } 
  return row;
};	
/**
 * @private
 * @param {Object} row
 */
EiBlock.prototype.getMappedObject = function(row){
  var cols = this.getBlockMeta().getMetas();  
  var t = new Object();
  for(  var key in cols ){
    var col = cols[key];
	t[col.name] = row[col.pos];
  }
  return t;
};	
/**
 * @private
 */
EiBlock.prototype.getMappedRows = function(){  
  var ret = new Array();
  for(  var i = 0; i < this.rows.length; i++ ){
    var row = this.rows[i];
	var m = this.getMappedObject(row);
	ret.push(m);
  }
  return ret;
};
/**
 * @private
 */
EiBlock.prototype.clone = function(){
    return this;
}
/**
 * EiInfo �����캯��
 * @class	EiInfo��
 * @constructor
 * @extends AbstractEi
 * @param {String} sName	:	EiInfo���
 * @see AbstractEi AbstractEi is the base class for this
 */
function EiInfo(sName) {
	/**
	 * @private
	 */
	this.name = null;
	/**
	 * @private
	 */  	
	this.msg = null;
	/**
	 * @private
	 */ 
	this.msgKey = null;
	/**
	 * @private
	 */
	this.status = null;
	/**
	 * @private
	 */  	
    this.descName = null;
	/**
	 * @private
	 */	
	this.blocks = {};
	/**
	 * @private
	 */
	this.extAttr = {};	
  if( typeof sName == "string" ){
		this.name = sName;
  }  
}

EiInfo.prototype = new AbstractEi;
/**
 * ȡ��EiInfo ���
 * @return {String} :	EiInfo���
 */
EiInfo.prototype.getName = function(){
	return this.name;
};
/**
 * ����EiInfo ���
 * @param {Object} sName	��EiInfo���
 */
EiInfo.prototype.setName = function(sName){
	this.name=sName;
};
/**
 * ����EiInfo��Ϣ��Ϣ
 * @param {String} sMsg	����Ϣ��Ϣ
 */
EiInfo.prototype.setMsg = function(sMsg){
	this.msg = sMsg;
};
/**
 * ȡ��EiInfo��Ϣ��Ϣ
 * @return {String} :	��Ϣ��Ϣ
 */
EiInfo.prototype.getMsg = function(){
	return this.msg;
};
/**
 * ����EiInfo��Ϣ��Ϣ��
 * @param {Object} sMsgKey
 */
EiInfo.prototype.setMsgKey = function(sMsgKey){
	this.msgKey = sMsgKey;
};
/**
 * ȡ��EiInfo��Ϣ��Ϣ��
 * @return {Object}	:	��Ϣ��Ϣ��
 */
EiInfo.prototype.getMsgKey = function(){
	return this.msgKey;
};
/**
 * ����EiInfo����ϸ��Ϣ
 * @param {Object} sMsg	:	��ϸ��Ϣ
 */
EiInfo.prototype.setDetailMsg = function(sMsg){
	this.detailMsg = sMsg;
};
/**
 * ȡ��EiInfo����ϸ��Ϣ
 * @return	{Object}	:	��ϸ��Ϣ
 */
EiInfo.prototype.getDetailMsg = function(){
	return this.detailMsg;
};
/**
 * ����EiInfo ״̬
 * @param {Object} s	��	״̬
 */
EiInfo.prototype.setStatus = function(s){
	this.status = s;
};
/**
 * ȡ��EiInfo״̬
 * @return {Object}	:	״̬
 */
EiInfo.prototype.getStatus = function(){
	return this.status;
};
/**
 * ����EiInfo������Ϣ
 * @param {Object} sDescName	��������Ϣ
 */
EiInfo.prototype.setDescName = function(sDescName){
	this.descName = sDescName;
};
/**
 * ȡ��EiInfo������Ϣ
 * @return {Object}	:	������Ϣ
 */
EiInfo.prototype.getDescName = function(){
	return this.descName;
};
/**
 * ��EiInfo���EiBlock��
 * @param {Object} sBlock
 * @see EiBlock
 */
EiInfo.prototype.addBlock = function(sBlock){
	this.blocks[sBlock.getBlockMeta().getBlockId()] = sBlock;
};
/**
 * ���BlockId��EiInfoȡ��EiBlock��
 * @param {Object} sBlockId
 * @return {EiBlock} :	EiBlock��
 * @see	EiBlock
 */
EiInfo.prototype.getBlock = function(sBlockId){
	return this.blocks[sBlockId];
};
/**
 * ȡ��EiInfo���е�EiBlock��
 * @return {Object}	:	EiBlock��
 */
EiInfo.prototype.getBlocks = function(){
	return this.blocks;
};
/**
 * ���key��,���տ����кš����������'-'�ָ���������ֵ.
 * @return null
 */
EiInfo.prototype.set = function() {
//���տ����кš��������ʽ�������
  if (arguments.length == 2) {
    //����eiinfo������ֵ
    AbstractEi.prototype.set.apply( this, arguments);
    return;
  }
  //debugger;
  var sBlock = arguments[0];
  if (typeof(this.blocks[sBlock]) == "undefined") {
  	  this.blocks[sBlock] = new EiBlock(sBlock);
  }
  if (arguments.length == 3) {
    //����eiblock������ֵ
    this.blocks[sBlock].set(arguments[1], arguments[2]);
    return;
  }
  if (arguments.length == 4) {
    //����eiblock���С���ֵ
    if (typeof(this.blocks[sBlock].getBlockMeta().getMeta(arguments[2]))  == "undefined") {
	  var cc = new EiColumn( arguments[2] );
	  
	  cc.pos = this.blocks[sBlock].colCount ++;	

      this.blocks[sBlock].getBlockMeta().addMeta(cc);
    }
    this.blocks[sBlock].setCell(arguments[1], arguments[2], arguments[3]);
    return;
  }
}
/**
 * ���DOM��ID����ֵ���õ�EiInfo��Ӧ��EiBlock����
 * ID���տ����кš����������'-'�ָ�
 * @param {Object} id_in	:	DOM��ID
 */
EiInfo.prototype.setById = function(id_in) {
	this.setByNameValue( id_in, ef.get(id_in).value );
}
/**
 * ���key��,���տ����кš����������'-'�ָ���������ֵ.
 * @param {Object} id_in	: key��
 * @param {Object} v	��	�����õ�ֵ
 */
EiInfo.prototype.setByNameValue = function(id_in, v) {

  var idArray = id_in.split("-");
  if ( idArray.length == 3) return this.set(idArray[0], idArray[1], idArray[2], v);
  if ( idArray.length == 2) return this.set(idArray[0], idArray[1], v);
  if ( idArray.length == 1) return this.set(idArray[0], v);
}
/**
 * ��DOM�ڵ��Լ������ӽڵ�ֵ�����ID�����õ�EiInfo��ȥ
 * ID���տ����кš����������'-'�ָ�
 * @param {Object} node_id_in	:	DOM�ڵ��Ӧ��ID
 */
EiInfo.prototype.setByNode = function(node_id_in) 
{
	this.setByNodeObject( ef.get(node_id_in) );
}
/**
 * @private
 * @param {Object} node_in
 */
EiInfo.prototype.setByNodeObject = function( node_in )
{
  	var nodes = node_in.getElementsByTagName("input");
  	for ( var i = 0; i < nodes.length; i++ )   
  	{
		if ((nodes[i].type == "radio" || nodes[i].type == "checkbox") && !nodes[i].checked)
			continue;
			
    	this.setByNameValue(nodes[i].name, nodes[i].value );
  	}
	   
	nodes = node_in.getElementsByTagName("select");
  	for ( var i = 0; i < nodes.length; i++ )   
  	{	   
  		if(nodes[i].options.length>0)
    		this.setByNameValue( nodes[i].name, nodes[i].options[nodes[i].selectedIndex].value );
  	}
  	var nodes = node_in.getElementsByTagName("textarea");
  	for(var i = 0;i<nodes.length;i++){
  		this.setByNameValue(nodes[i].name, nodes[i].value );
  	}  	
}

/* EiInfo 2 Json  */
/**
 * @private
 * @ignore
 */
var EiInfoJsonConstants = {
	ATTRIBUTES                	: "attr",
	EIINFO_NAME                	: "name",
	EIINFO_DESC_NAME           	: "descName",
	EIINFO_MESSAGE             	: "msg",
	EIINFO_MESSAGE_KEY          : "msgKey",
	EIINFO_DETAIL_MESSAGE       : "detailMsg",
	EIINFO_STATUS             	: "status",
	EIINFO_BLOCKS              	: "blocks",
	BLOCK_META                 	: "meta",	
	BLOCK_META_DESC            	: "desc",
	BLOCK_META_COLUMNLIST      	: "columns",
	BLOCK_META_COLUMNPOS       	: "columnPos",
	BLOCK_DATA                 	: "rows"
};
/**
 * @ignore
 * @param {Object} obj
 */
function formatNative(obj){
	var str = JSON2String(obj);
	//��δ�����Ҫ��Ϊ�˽��ajax��data���ַ�ķ�ʽ�ύʱ+��%����Ĺ������� 
	//����ajax��data�Զ���ʽ�ύͬʱҲ������������� ������Ҫ����δ���ע�͵�
	//if(undefined != str)
	//	return str.replace(/\%/g,'%25').replace(/\+/g, '%2B');
	//else
	return str;
}	

/**
 * �ж�ĳһ�����Ƿ�Ϊ�ա�
 * @param {Object} obj	:	��Ҫ�жϵĶ���
 * @return {boolean}	:	��objΪ�ն���(null��undefined)���ǿ��ַ�("")��
 * ����false�����򷵻�true��
 * @exception ���쳣�׳�
 */
function isAvailable(obj)
{	
	if ( obj === undefined ){ return false; };
	if ( obj === null ){ return false; }
	if ( obj === "" ){ return false; };
	return true;
}	
/**
 * @private
 */
function EiInfo2Json(){
};	
/**
 * @private
 * @param {Object} sEiInfo
 */
EiInfo2Json.prototype.EiInfo2JsonString = function(sEiInfo){	
	var a = ['{'];
	var appendComma;
	
	if ( isAvailable( sEiInfo.getName() ) ){		
	  a.push( EiInfoJsonConstants.EIINFO_NAME, ':', formatNative( sEiInfo.getName() ));
	  appendComma = true;
	}
	if ( isAvailable( sEiInfo.getDescName() ) ){
		if (appendComma){ a.push(','); };
	  a.push( EiInfoJsonConstants.EIINFO_DESC_NAME, ':', formatNative( sEiInfo.getDescName())  );
	  appendComma = true;  
	}
	
	if ( isAvailable( sEiInfo.getAttr() ) ){  
		if (appendComma){ a.push(','); };
	  a.push( EiInfoJsonConstants.ATTRIBUTES, ':', formatNative(sEiInfo.getAttr()));
	  appendComma = true;
	}
	
  if (appendComma){ a.push(','); };
	a.push( EiInfoJsonConstants.EIINFO_BLOCKS, ':{');
	
	
	var blocks = sEiInfo.getBlocks();
	var b;
	for( var iKey in blocks ){
		var block = blocks[iKey];
		if (b) { a.push(','); }
		a.push( iKey, ':', EiInfo2Json.prototype.EiBlock2JsonString(block) );
		b = true;
	}	  
	a.push('}}');
  return a.join('');
};
/**
 * @private
 * @param {Object} sBlock
 */
EiInfo2Json.prototype.EiBlock2JsonString = function(sBlock){	
	var a = ['{'];	
	
	a.push( EiInfoJsonConstants.ATTRIBUTES, ':', formatNative(sBlock.getAttr()));
	a.push( ',', EiInfoJsonConstants.BLOCK_META, ':', EiInfo2Json.prototype.EiBlockMeta2JsonString( sBlock.getBlockMeta() ) );
	
	a.push( ',', EiInfoJsonConstants.BLOCK_DATA, ':[');
	
	var rows = sBlock.getRows();
	var b;
	for( var i = 0; i < rows.length; i++ ){
		var row = rows[i];
		if (b) { a.push(','); }
		a.push('[');
		var columns = sBlock.getBlockMeta().getMetas();
		var c;
		for( var jKey in columns ){
			var column = columns[jKey];
			if ( c ){ a.push(','); };
			a.push( formatNative(row[column.pos]) );
			c = true;
		}
		b = true;
		c = false
		a.push(']');
	}  
	
	a.push(']}');
  return a.join('');
};
/**
 * @private
 * @param {Object} sBlockMeta
 */
EiInfo2Json.prototype.EiBlockMeta2JsonString = function(sBlockMeta){	
	var a = ['{'];	
	var appendComma;
	if ( isAvailable( sBlockMeta.getDesc() ) ){
	  a.push( EiInfoJsonConstants.BLOCK_META_DESC, ':', formatNative(sBlockMeta.getDesc()));
	  appendComma = true;
	}
	if ( isAvailable( sBlockMeta.getAttr() ) ){  
		if (appendComma){ a.push(','); };
	  a.push( EiInfoJsonConstants.ATTRIBUTES, ':', formatNative(sBlockMeta.getAttr()));
	  appendComma = true;
	}
  if (appendComma){ a.push(','); };  
	a.push( EiInfoJsonConstants.BLOCK_META_COLUMNLIST, ':[');
	
	var columns = sBlockMeta.getMetas();
	var b;
	for( var iKey in columns ){
		var column = columns[iKey];
		if (b) { a.push(','); }
		a.push( EiInfo2Json.prototype.EiColumn2JsonString(column) );
		b = true;
	}  
	
	a.push(']}');
  return a.join('');
};
/**
 * @private
 * @param {Object} sColumn
 */
EiInfo2Json.prototype.EiColumn2JsonString = function(sColumn){	
	var a = ['{'];	
	
	a.push( 'name', ':', formatNative(sColumn.name));
	a.push( ',' );
	a.push( 'descName', ':', formatNative(sColumn.descName));
	
	a.push('}');
  return a.join('');
}
/**
 * @private
 */
function Json2EiInfo(){
};	
/**
 * @private
 * @param {Object} sJson
 */
Json2EiInfo.prototype.parseString = function(sJson){
	var eiJson = eval( "("+ sJson +")" );
	Json2EiInfo.prototype.parseJson(eiJson);
}	

/**
 * @private
 * @param {Object} eiJson
 */
Json2EiInfo.prototype.parseJsonObject = function(eiJson){    
    var eiInfo = new EiInfo();
    
    var value = eiJson[EiInfoJsonConstants.EIINFO_NAME];
    if ( isAvailable( value ) ){
    	eiInfo.setName( value );
    }	
    
    var value = eiJson[EiInfoJsonConstants.EIINFO_DESC_NAME];
    if ( isAvailable( value ) ){
    	eiInfo.setDescName( value );
    }
    
    var value = eiJson[EiInfoJsonConstants.EIINFO_MESSAGE];
    if ( isAvailable( value ) ){
    	eiInfo.setMsg( value );
    }
	
	var value = eiJson[EiInfoJsonConstants.EIINFO_MESSAGE_KEY];
    if ( isAvailable( value ) ){
    	eiInfo.setMsgKey( value );
    }
	
	var value = eiJson[EiInfoJsonConstants.EIINFO_DETAIL_MESSAGE];
    if ( isAvailable( value ) ){
    	eiInfo.setDetailMsg( value );
    }
	
	var value = eiJson[EiInfoJsonConstants.EIINFO_STATUS];
    if ( isAvailable( value ) ){
    	eiInfo.setStatus( value );
    }
    
    var value = eiJson[EiInfoJsonConstants.ATTRIBUTES];
    if ( isAvailable( value ) ){
    	eiInfo.setAttr( value );
    }   
    
    var value = eiJson[EiInfoJsonConstants.EIINFO_BLOCKS];
    if ( isAvailable( value ) ){
    	for( var bIds in value ) 	{    		 
    		 var block = Json2EiInfo.prototype.parseBlock( bIds, value[bIds] );
    		 eiInfo.addBlock( block );
    	}	
    }
    
    return eiInfo;
};

/**
 * @private
 * @param {Object} sId
 * @param {Object} blockJson
 */

Json2EiInfo.prototype.parseBlock = function(sId, blockJson){
	
	var block;
	var value = blockJson[EiInfoJsonConstants.BLOCK_META];
	if ( isAvailable( value ) ){
		var blockMeta = Json2EiInfo.prototype.parseBlockMeta(sId, value);
		block = new EiBlock(blockMeta);
	} else {	
	  block = new EiBlock(sId);
	}
	
	var value = blockJson[EiInfoJsonConstants.ATTRIBUTES];
  if ( isAvailable( value ) ){
    	block.setAttr( value );
  }  
  
  var value = blockJson[EiInfoJsonConstants.BLOCK_DATA];
  if ( isAvailable( value ) ){

//ֱ�Ӹ�ֵ
    block.rows = value;

  }  
  return block;
}
/**
 * @private
 * @param {Object} sId
 * @param {Object} blockJson
 */
Json2EiInfo.prototype.parseBlockMeta = function(sId, blockJson){
	var blockMeta = new EiBlockMeta(sId);
	var value = blockJson[EiInfoJsonConstants.BLOCK_META_DESC];
	if ( isAvailable( value ) ){
		blockMeta.setDesc(value);
	}
	var value = blockJson[EiInfoJsonConstants.ATTRIBUTES];
	if ( isAvailable( value ) ){
		blockMeta.setAttr(value);
	}
	var value = blockJson[EiInfoJsonConstants.BLOCK_META_COLUMNLIST];
    if ( isAvailable( value )){		// value should be Array
    	for( var i = 0; i < value.length; i++ ){
    		 var column = Json2EiInfo.prototype.parseColumn( value[i] );
    		 blockMeta.addMeta( column );
    	}	
    }	
	return blockMeta;
}
/**
 * @private
 * @param {Object} blockJson
 */
Json2EiInfo.prototype.parseColumn = function(blockJson){

	var column = new EiColumn(blockJson.name);
	
    for( var iKey in blockJson ){
		var columnValue = blockJson[iKey];
		if (columnValue.replace)
			columnValue = columnValue.replace(/'/g, "&#39;");
			
		eval("column." + iKey + "='" + columnValue + "'");
	}  
   
	return column;
}



Global = {
	parameter_usertokenid : '',
	parameter_userid : ''
};

EiCommunicator4m = {
	login : function(sUrl, sEiInfo, sCallback) {
		var jsonEi = EiInfo2Json.prototype.EiInfo2JsonString(sEiInfo);
		$.support.cors = true;
		$.ajax({
			type : "POST",
			async : false,
			url : sUrl,
			data : {
				"parameter_postdata" : "",
				"parameter_userid" : document.getElementById("textinput4").value,
				"parameter_password" : document.getElementById("textinput4").value,
				"parameter_deviceid" : "1111111",
				"parameter_clienttypeid" : "iPhone2,1",
				"APP_CLUSTER_CODE" : "BGGM",
				"network" : "nonetwork",
				"resolution1" : "960.0000",
				"resolution2" : "640.0000",
				"osVersion" : "5.3.3",
				"parameter_clienidtversion" : "1",
				"appcode" : "iplatmbs"
			},
			dataType : "json",
			success : function(msg) {
				ajaxEi = Json2EiInfo.prototype.parseJsonObject(msg);
				sCallback.onSuccess(ajaxEi);
			},
			error : function(xmlR, status, e) {
				sCallback.onFail(xmlR, status, e);
			}
		});
	},
	callService : function(sUrl, sEiInfo, sCallback) {
		var jsonEi = EiInfo2Json.prototype.EiInfo2JsonString(sEiInfo);
        $.support.cors = true;
		$.ajax({
					type : "POST",
					async : false,
					url : sUrl,
					data : {
						"parameter_encryptdata" : "false",
						"parameter_usertokenid" : Global.parameter_usertokenid,
						"parameter_userid" : Global.parameter_userid,
						"parameter_compressdata" : "false",
						"parameter_postdata" : jsonEi
					},
					dataType : "json",
					success : function(msg) {
						if (msg == null){
							ajaxEi = null;
						} else {
							ajaxEi = Json2EiInfo.prototype.parseJsonObject(msg);
						}
						
						sCallback.onSuccess(ajaxEi);
					},
					error : function(xmlR, status, e) {
						sCallback.onFail(xmlR, status, e);
					}
				});
	},

	sendWebService   :   function(sUrl, jsonxml, sCallback) {
    $.support.cors = true;
	  $.ajax({
		 type:     "POST",
		 async:    false,
		 url:      sUrl,
		 data:      { 
						"parameter_encryptdata": "false", 
						"parameter_usertokenid":Global.parameter_usertokenid,
						"parameter_compressdata": "false", 
						"parameter_deviceid":"yefei",
						"datatype":"json/xml",
						"parameter_postdata": jsonxml },
		 dataType: "json",
		 success:  function (msg) {
			sCallback.onSuccess(msg.data);
		 },
		 error:    function ( xmlR, status, e ){
		   sCallback.onFail(xmlR, status, e);
		  }
		});
	}  			     
};



function getParam(paramName) {
	paramValue = "";
	isFound = false;
	if (this.location.search.indexOf("?") == 0
			&& this.location.search.indexOf("=") > 1) {
		arrSource = unescape(this.location.search).substring(1,
				this.location.search.length).split("&");
		i = 0;
		while (i < arrSource.length && !isFound) {
			if (arrSource[i].indexOf("=") > 0) {
				if (arrSource[i].split("=")[0].toLowerCase() == paramName
						.toLowerCase()) {
					paramValue = arrSource[i].split("=")[1];
					isFound = true;
				}
			}
			i++;
		}
	}
	return paramValue;
}
