loadXML = function(xmlFile){
	var xmlDoc=null;
	//�ж������������
	//֧��IE�����
	if(!window.DOMParser && window.ActiveXObject){
		var xmlDomVersions = ['MSXML.2.DOMDocument.6.0','MSXML.2.DOMDocument.3.0','Microsoft.XMLDOM'];
		for(var i=0;i<xmlDomVersions.length;i++){
			try{
				xmlDoc = new ActiveXObject(xmlDomVersions[i]);
				break;
			}catch(e){
			}
		}
	}
	//֧��Mozilla�����
	else if(document.implementation && document.implementation.createDocument){
		try{
			/* document.implementation.createDocument('','',null); �������������˵��
			 * ��һ�������ǰ��ĵ���ʹ�õ�����ռ�URI���ַ� 
			 * �ڶ��������ǰ��ĵ���Ԫ����Ƶ��ַ� 
			 * �����������Ҫ�������ĵ����ͣ�Ҳ��Ϊdoctype��
			 */
			xmlDoc = document.implementation.createDocument('','',null);
		}catch(e){
		}
	}
	else{
		return null;
	}

	if(xmlDoc!=null){
		xmlDoc.async = false;
		xmlDoc.load(xmlFile);
	}
	return xmlDoc;
}
parseXML = function(xmlString){
	var xmlDoc=null;
	//�ж������������
	//֧��IE����� 
	if(!window.DOMParser && window.ActiveXObject){   //window.DOMParser �ж��Ƿ��Ƿ�ie�����
		var xmlDomVersions = ['MSXML.2.DOMDocument.6.0','MSXML.2.DOMDocument.3.0','Microsoft.XMLDOM'];
		for(var i=0;i<xmlDomVersions.length;i++){
			try{
				xmlDoc = new ActiveXObject(xmlDomVersions[i]);
				xmlDoc.async = false;
				xmlDoc.loadXML(xmlString); //loadXML��������xml�ַ�
				break;
			}catch(e){
			}
		}
	}
	//֧��Mozilla�����
	else if(window.DOMParser && document.implementation && document.implementation.createDocument){
		try{
			/* DOMParser ������� XML �ı�������һ�� XML Document ����
			 * Ҫʹ�� DOMParser��ʹ�ò������Ĺ��캯����ʵ����Ȼ������� parseFromString() ����
			 * parseFromString(text, contentType) ����text:Ҫ������ XML ��� ����contentType�ı�����������
			 * ������ "text/xml" ��"application/xml" �� "application/xhtml+xml" �е�һ����ע�⣬��֧�� "text/html"��
			 */
			domParser = new  DOMParser();
			xmlDoc = domParser.parseFromString(xmlString, 'text/xml');
		}catch(e){
		}
	}
	else{
		return null;
	}

	return xmlDoc;
}