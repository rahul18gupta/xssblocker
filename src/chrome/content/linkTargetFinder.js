Components.utils.import("resource://gre/modules/NetUtil.jsm");  
Components.utils.import("resource://gre/modules/FileUtils.jsm"); 

var Gpoststr = "";
var threshold = 10;
var enable_extension = false;


var linkTargetFinder = function () {
	var prefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
	return {
		init : function () {
			//alert("Hello World init");
		},

		run : function () {
			enable_extension = !enable_extension;
			if(enable_extension){
				document.getElementById('link-target-finder-toolbar-button').style.listStyleImage = 'url("chrome://linktargetfinder/skin/toolbar-large-enabled.png")';
			} else {
				document.getElementById('link-target-finder-toolbar-button').style.listStyleImage = 'url("chrome://linktargetfinder/skin/toolbar-large-disabled.png")';
			}
			//alert(enable_extension);
		}
	};
}();

function CCIN (cName, ifaceName)
{
	return Cc[cName].createInstance (Ci[ifaceName]);
}

Encoder = {

	// When encoding do we convert characters into html or numerical entities
	EncodeType : "entity",  // entity OR numerical

	isEmpty : function(val)
	{
		if (val)
		{
			return ((val === null) || (val.length == 0) || /^\s+$/.test(val));
		}
		else
		{
			return true;
		}
	},
	
	// arrays for conversion from HTML Entities to Numerical values
	arr1: ['&nbsp;','&iexcl;','&cent;','&pound;','&curren;','&yen;','&brvbar;','&sect;','&uml;','&copy;','&ordf;','&laquo;','&not;','&shy;','&reg;','&macr;','&deg;','&plusmn;','&sup2;','&sup3;','&acute;','&micro;','&para;','&middot;','&cedil;','&sup1;','&ordm;','&raquo;','&frac14;','&frac12;','&frac34;','&iquest;','&Agrave;','&Aacute;','&Acirc;','&Atilde;','&Auml;','&Aring;','&AElig;','&Ccedil;','&Egrave;','&Eacute;','&Ecirc;','&Euml;','&Igrave;','&Iacute;','&Icirc;','&Iuml;','&ETH;','&Ntilde;','&Ograve;','&Oacute;','&Ocirc;','&Otilde;','&Ouml;','&times;','&Oslash;','&Ugrave;','&Uacute;','&Ucirc;','&Uuml;','&Yacute;','&THORN;','&szlig;','&agrave;','&aacute;','&acirc;','&atilde;','&auml;','&aring;','&aelig;','&ccedil;','&egrave;','&eacute;','&ecirc;','&euml;','&igrave;','&iacute;','&icirc;','&iuml;','&eth;','&ntilde;','&ograve;','&oacute;','&ocirc;','&otilde;','&ouml;','&divide;','&oslash;','&ugrave;','&uacute;','&ucirc;','&uuml;','&yacute;','&thorn;','&yuml;','&quot;','&amp;','&lt;','&gt;','&OElig;','&oelig;','&Scaron;','&scaron;','&Yuml;','&circ;','&tilde;','&ensp;','&emsp;','&thinsp;','&zwnj;','&zwj;','&lrm;','&rlm;','&ndash;','&mdash;','&lsquo;','&rsquo;','&sbquo;','&ldquo;','&rdquo;','&bdquo;','&dagger;','&Dagger;','&permil;','&lsaquo;','&rsaquo;','&euro;','&fnof;','&Alpha;','&Beta;','&Gamma;','&Delta;','&Epsilon;','&Zeta;','&Eta;','&Theta;','&Iota;','&Kappa;','&Lambda;','&Mu;','&Nu;','&Xi;','&Omicron;','&Pi;','&Rho;','&Sigma;','&Tau;','&Upsilon;','&Phi;','&Chi;','&Psi;','&Omega;','&alpha;','&beta;','&gamma;','&delta;','&epsilon;','&zeta;','&eta;','&theta;','&iota;','&kappa;','&lambda;','&mu;','&nu;','&xi;','&omicron;','&pi;','&rho;','&sigmaf;','&sigma;','&tau;','&upsilon;','&phi;','&chi;','&psi;','&omega;','&thetasym;','&upsih;','&piv;','&bull;','&hellip;','&prime;','&Prime;','&oline;','&frasl;','&weierp;','&image;','&real;','&trade;','&alefsym;','&larr;','&uarr;','&rarr;','&darr;','&harr;','&crarr;','&lArr;','&uArr;','&rArr;','&dArr;','&hArr;','&forall;','&part;','&exist;','&empty;','&nabla;','&isin;','&notin;','&ni;','&prod;','&sum;','&minus;','&lowast;','&radic;','&prop;','&infin;','&ang;','&and;','&or;','&cap;','&cup;','&int;','&there4;','&sim;','&cong;','&asymp;','&ne;','&equiv;','&le;','&ge;','&sub;','&sup;','&nsub;','&sube;','&supe;','&oplus;','&otimes;','&perp;','&sdot;','&lceil;','&rceil;','&lfloor;','&rfloor;','&lang;','&rang;','&loz;','&spades;','&clubs;','&hearts;','&diams;'],
	arr2: ['&#160;','&#161;','&#162;','&#163;','&#164;','&#165;','&#166;','&#167;','&#168;','&#169;','&#170;','&#171;','&#172;','&#173;','&#174;','&#175;','&#176;','&#177;','&#178;','&#179;','&#180;','&#181;','&#182;','&#183;','&#184;','&#185;','&#186;','&#187;','&#188;','&#189;','&#190;','&#191;','&#192;','&#193;','&#194;','&#195;','&#196;','&#197;','&#198;','&#199;','&#200;','&#201;','&#202;','&#203;','&#204;','&#205;','&#206;','&#207;','&#208;','&#209;','&#210;','&#211;','&#212;','&#213;','&#214;','&#215;','&#216;','&#217;','&#218;','&#219;','&#220;','&#221;','&#222;','&#223;','&#224;','&#225;','&#226;','&#227;','&#228;','&#229;','&#230;','&#231;','&#232;','&#233;','&#234;','&#235;','&#236;','&#237;','&#238;','&#239;','&#240;','&#241;','&#242;','&#243;','&#244;','&#245;','&#246;','&#247;','&#248;','&#249;','&#250;','&#251;','&#252;','&#253;','&#254;','&#255;','&#34;','&#38;','&#60;','&#62;','&#338;','&#339;','&#352;','&#353;','&#376;','&#710;','&#732;','&#8194;','&#8195;','&#8201;','&#8204;','&#8205;','&#8206;','&#8207;','&#8211;','&#8212;','&#8216;','&#8217;','&#8218;','&#8220;','&#8221;','&#8222;','&#8224;','&#8225;','&#8240;','&#8249;','&#8250;','&#8364;','&#402;','&#913;','&#914;','&#915;','&#916;','&#917;','&#918;','&#919;','&#920;','&#921;','&#922;','&#923;','&#924;','&#925;','&#926;','&#927;','&#928;','&#929;','&#931;','&#932;','&#933;','&#934;','&#935;','&#936;','&#937;','&#945;','&#946;','&#947;','&#948;','&#949;','&#950;','&#951;','&#952;','&#953;','&#954;','&#955;','&#956;','&#957;','&#958;','&#959;','&#960;','&#961;','&#962;','&#963;','&#964;','&#965;','&#966;','&#967;','&#968;','&#969;','&#977;','&#978;','&#982;','&#8226;','&#8230;','&#8242;','&#8243;','&#8254;','&#8260;','&#8472;','&#8465;','&#8476;','&#8482;','&#8501;','&#8592;','&#8593;','&#8594;','&#8595;','&#8596;','&#8629;','&#8656;','&#8657;','&#8658;','&#8659;','&#8660;','&#8704;','&#8706;','&#8707;','&#8709;','&#8711;','&#8712;','&#8713;','&#8715;','&#8719;','&#8721;','&#8722;','&#8727;','&#8730;','&#8733;','&#8734;','&#8736;','&#8743;','&#8744;','&#8745;','&#8746;','&#8747;','&#8756;','&#8764;','&#8773;','&#8776;','&#8800;','&#8801;','&#8804;','&#8805;','&#8834;','&#8835;','&#8836;','&#8838;','&#8839;','&#8853;','&#8855;','&#8869;','&#8901;','&#8968;','&#8969;','&#8970;','&#8971;','&#9001;','&#9002;','&#9674;','&#9824;','&#9827;','&#9829;','&#9830;'],
		
	// Convert HTML entities into numerical entities
	HTML2Numerical : function(s)
	{
		return this.swapArrayVals(s,this.arr1,this.arr2);
	},	

	// Convert Numerical entities into HTML entities
	NumericalToHTML : function(s)
	{
		return this.swapArrayVals(s,this.arr2,this.arr1);
	},

	// Numerically encodes all unicode characters
	numEncode : function(s)
	{	
		if(this.isEmpty(s)) return "";
		var e = "";
		for (var i = 0; i < s.length; i++)
		{
			var c = s.charAt(i);
			if (c < " " || c > "~")
			{
				c = "&#" + c.charCodeAt() + ";";
			}
			e += c;
		}
		return e;
	},
	
	// HTML Decode numerical and HTML entities back to original values
	htmlDecode : function(s)
	{
		var c,m,d = s;	
		if(this.isEmpty(d)) return "";
		
		// convert HTML entites back to numerical entites first
		d = this.HTML2Numerical(d);
		
		// look for numerical entities &#34;
		arr = d.match(/&#[0-9]{1,5};/g);
		
		// if no matches found in string then skip
		if (arr != null)
		{
			for(var x=0;x<arr.length;x++)
			{
				m = arr[x];
				c = m.substring(2,m.length-1); //get numeric part which is refernce to unicode character
				// if its a valid number we can decode
				if(c >= -32768 && c <= 65535)
				{
					// decode every single match within string
					d = d.replace(m, String.fromCharCode(c));
				}
				else
				{
					d = d.replace(m, ""); //invalid so replace with nada
				}
			}			
		}
		return d;
	},		

	// encode an input string into either numerical or HTML entities
	htmlEncode : function(s,dbl)
	{	
		if(this.isEmpty(s)) return "";

		// do we allow double encoding? E.g will &amp; be turned into &amp;amp;
		dbl = dbl || false; //default to prevent double encoding
		
		// if allowing double encoding we do ampersands first
		if(dbl)
		{
			if(this.EncodeType=="numerical")
			{
				s = s.replace(/&/g, "&#38;");
			}
			else
			{
				s = s.replace(/&/g, "&amp;");
			}
		}

		// convert the xss chars to numerical entities ' " < >
		s = this.XSSEncode(s,false);
		
		if(this.EncodeType=="numerical" || !dbl)
		{
			// Now call function that will convert any HTML entities to numerical codes
			s = this.HTML2Numerical(s);
		}

		// Now encode all chars above 127 e.g unicode
		s = this.numEncode(s);

		// now we know anything that needs to be encoded has been converted to numerical entities we
		// can encode any ampersands & that are not part of encoded entities
		// to handle the fact that I need to do a negative check and handle multiple ampersands &&&
		// I am going to use a placeholder

		// if we don't want double encoded entities we ignore the & in existing entities
		if(!dbl)
		{
			s = s.replace(/&#/g,"##AMPHASH##");
			if(this.EncodeType=="numerical")
			{
				s = s.replace(/&/g, "&#38;");
			}
			else
			{
				s = s.replace(/&/g, "&amp;");
			}

			s = s.replace(/##AMPHASH##/g,"&#");
		}
		
		// replace any malformed entities
		s = s.replace(/&#\d*([^\d;]|$)/g, "$1");

		if(!dbl)
		{
			// safety check to correct any double encoded &amp;
			s = this.correctEncoding(s);
		}

		// now do we need to convert our numerical encoded string into entities
		if(this.EncodeType == "entity")
		{
			s = this.NumericalToHTML(s);
		}

		return s;					
	},

	// Encodes the basic 4 characters used to malform HTML in XSS hacks
	XSSEncode : function(s,en)
	{
		if(!this.isEmpty(s))
		{
			en = en || true;
			// do we convert to numerical or html entity?
			if(en)
			{
				s = s.replace(/\'/g,"&#39;"); //no HTML equivalent as &apos is not cross browser supported
				s = s.replace(/\"/g,"&quot;");
				s = s.replace(/</g,"&lt;");
				s = s.replace(/>/g,"&gt;");
			}
			else
			{
				s = s.replace(/\'/g,"&#39;"); //no HTML equivalent as &apos is not cross browser supported
				s = s.replace(/\"/g,"&#34;");
				s = s.replace(/</g,"&#60;");
				s = s.replace(/>/g,"&#62;");
			}
			return s;
		}
		else
		{
			return "";
		}
	},
	
    scriptEncode  : function(s)
	{
		if(!this.isEmpty(s))
		{
			//s=s.replace(/\./g,"\\.");
			s=s.replace(/\;/g,"&#59");
			s=s.replace(/\,/g,"&#44");
			s=s.replace(/\"/g,"&#34");
			s=s.replace(/\'/g,"&#39");
			s=s.replace(/\(/g,"&#40");
			s=s.replace(/\)/g,"&#41");
			//s=s.replace(/\./g,"&#46");
			return s;
		}
		else return "";           
	},

	// returns true if a string contains html or numerical encoded entities
	hasEncoded : function(s)
	{
		if(/&#[0-9]{1,5};/g.test(s))
		{
			return true;
		}
		else if(/&[A-Z]{2,6};/gi.test(s))
		{
			return true;
		}
		else
		{
			return false;
		}
	},

	// will remove any unicode characters
	stripUnicode : function(s)
	{
		return s.replace(/[^\x20-\x7E]/g,"");	
	},

	// corrects any double encoded &amp; entities e.g &amp;amp;
	correctEncoding : function(s)
	{
		return s.replace(/(&amp;)(amp;)+/,"$1");
	},

	// Function to loop through an array swaping each item with the value from another array e.g swap HTML entities with Numericals
	swapArrayVals : function(s,arr1,arr2)
	{
		if(this.isEmpty(s)) return "";
		var re;
		if(arr1 && arr2)
		{
			//ShowDebug("in swapArrayVals arr1.length = " + arr1.length + " arr2.length = " + arr2.length)
			// array lengths must match
			if(arr1.length == arr2.length)
			{
				for(var x=0,i=arr1.length;x<i;x++)
				{
					re = new RegExp(arr1[x], 'g');
					s = s.replace(re,arr2[x]); //swap arr1 item with matching item from arr2	
				}
			}
		}
		return s;
	},

	inArray : function( item, arr ) 
	{
		for ( var i = 0, x = arr.length; i < x; i++ )
		{
			if ( arr[i] === item )
			{
				return i;
			}
		}
		return -1;
	}

}

var aConsoleService = Components.classes["@mozilla.org/consoleservice;1"].getService (Components.interfaces.nsIConsoleService);

function TracingListener ()
{
	this.originalListener = null;
	this.prev_data = "";
}

TracingListener.prototype =
{
	onDataAvailable:function (request, context, inputStream, offset, count)
	{
		if(enable_extension){
			if(request.contentType == "text/html"){
				var ScriptInputStream = CCIN ("@mozilla.org/scriptableinputstream;1", "nsIScriptableInputStream");
				ScriptInputStream.init(inputStream);
				// Copy received data as they come.
				//var data = binaryInputStream.readBytes (count);
				var data = ScriptInputStream.read(count);
				this.prev_data += data;
			}
			else{
				this.originalListener.onDataAvailable (request, context,inputStream, offset, count);
			}
		} else {
			this.originalListener.onDataAvailable (request, context,inputStream, offset, count);
		}
	},
	
	onStartRequest:function (request, context)
	{
		// intialize the arrays corresponding to html and script parameters in mat_h and mat_s
		this.mat_h = [];
		this.mat_s = [];
		
		if(request.contentType == "text/html"){		
			var url = request.name;
			var ind1 = url.indexOf("?",0);
			if (ind1 == -1) url = url + "?" + Gpoststr;
			url = url.replace(/\+/g, " ");
		 
			url = unescape(url);
			
			// after the occurence of # in the url, nothing is sent to the server so it is neglected for reflected xss
			var ind = url.indexOf("#",0);
			if(ind != -1) url = url.substring(0,ind);
			
			this.par = [];
			ind1 = url.indexOf("?",0);
			if(ind1 != -1) 
			
			// filling the array this.par with all the parameters
			while(1)
			{
				var ind2 = url.indexOf("=",ind1+1);
				if(ind2 == -1) break;
				var ind3 = url.indexOf("&",ind2+1);
				if(ind3 == -1)
				{
					var val = url.substring(ind2+1,url.length);
					this.par.push(val);
					break;
				}
				else var val = url.substring(ind2+1,ind3);
				this.par.push(val);
				ind1 = ind3;
			}  
	   
			// dividing the parameters into html and script types
			var par_string = "";
			for(var i=0;i<this.par.length;i++)
			{
				Encoder.EncodeType = "entity";
				par_string += "\n" + (i + 1) + ") " + this.par[i];
				var a = this.par[i];
				var b = this.par[i];
				a = Encoder.htmlEncode(a);
	            b =  Encoder.scriptEncode(b);
	        
				// the parameter is of html type
				if(a != this.par[i] && b == this.par[i])
				{
					this.mat_h.push(this.par[i]);        	
				} 
				// the parameter is of type script
				else if(b != this.par[i] && a == this.par[i])
				{
					this.mat_s.push(this.par[i]);       					
				} 
				// the parameter is of both types, we need to split the parameter in script and html types separately
				else if(a != this.par[i] && b != this.par[i])
				{
					this.par[i] = html_script_mix_param (this.par[i]);
					split_sp(this.par[i], this.mat_h, this.mat_s);       
				}
	        }
			mat_h_string = "";
			mat_s_string = "";
			for (i=0;i<this.mat_h.length;i++)
			{
				mat_h_string += "\n" + (i+1) + ") " + this.mat_h[i];
			}
			for (i=0;i<this.mat_s.length;i++)
			{
				mat_s_string += "\n" + (i+1) + ") " + this.mat_s[i];
			}
			//Firebug.Console.log("parameters are " + par_string + "\n\nmat_h is " + mat_h_string + "\n\nmat_s is " + mat_s_string);
			aConsoleService.logStringMessage("stored HTML parameters are: " + this.mat_h);  
			aConsoleService.logStringMessage("stored Script parameters are: " + this.mat_s);
	     			
			this.receivedData = [];
			final = "";
		}
		this.originalListener.onStartRequest (request, context);		
	},
	
	onStopRequest:function (request, context, statusCode)
	{
		if(enable_extension){
			if(request.contentType == "text/html"){
				var data = this.prev_data;
				var storageStream = CCIN ("@mozilla.org/storagestream;1", "nsIStorageStream");
				//8192 is the segment size in bytes, count is the maximum size of the stream in bytes
				storageStream.init (8192,data.length+1000, null);	

				var binaryOutputStream = CCIN ("@mozilla.org/binaryoutputstream;1", "nsIBinaryOutputStream");
				binaryOutputStream.setOutputStream (storageStream.getOutputStream (0));
				
				mat_h_status = "";
				mat_s_status = "";
				var beg = 0;
				for (var i = 0; i < this.mat_h.length; i++)
				{
					// used length of matching parameter heuristic 
					if (this.mat_h[i].length < threshold) 
					{
						mat_h_status += "\n" + (i+1) + ") " + this.mat_h[i] + " -- length less than threshold";
						continue;
					}
					while ((beg = data.indexOf(this.mat_h[i])) != -1)
					{
						mat_h_status += "\n" + (i+1) + ") " + this.mat_h[i] + " -- encoded";
						Encoder.EncodeType = "entity";
						var a = Encoder.htmlEncode(this.mat_h[i]);
						data=data.replace(this.mat_h[i],a);
					}
				}
				parser=new DOMParser();
				xmlDoc=parser.parseFromString(data,"text/html");
				// check for occurence of reflected xss separately for script entities
				scripts = xmlDoc.getElementsByTagName("script");
				for(var key in scripts){
					if(typeof scripts[key].innerHTML == 'undefined') continue;
					mat_s_status += "\nScript {"+key+"} contains parameters ";
					var matched_len = 0;
					for (var i = 0; i < this.mat_s.length; i++)
					{
						if((beg = scripts[key].innerHTML.indexOf(this.mat_s[i])) != -1){
							matched_len += this.mat_s[i].length;
							mat_s_status += "["+this.mat_s[i]+"], ";
						}
						// used length of matching parameter heuristic
					}
					
					if (matched_len < threshold)
					{
						mat_s_status += " -- length less than threshold";
						continue;
					} else {
						mat_s_status += " -- length greater than threshold. Length is "+matched_len;
						for (var i = 0; i < this.mat_s.length; i++)
						{
							if((beg = scripts[key].innerHTML.indexOf(this.mat_s[i])) != -1){
								Encoder.EncodeType = "entity";
								var a = Encoder.scriptEncode(this.mat_s[i]);
								var regx = new RegExp(this.mat_s[i].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
								scripts[key].innerHTML = scripts[key].innerHTML.replace(regx,a);
							}
						}
					}
				}
				/*for (i = 0; i < this.mat_s.length; i++)
				{
					// used length of matching parameter heuristic 
					if (this.mat_s[i].length < threshold) 
					{
						mat_s_status += "\n" + (i+1) + ") " + this.mat_s[i] + " -- length less than threshold";
						continue;
					}
					for(var key in scripts){
						if(typeof scripts[key].innerHTML != 'undefined' && (beg = scripts[key].innerHTML.indexOf(this.mat_s[i])) != -1)
						{
							mat_s_status += "\n" + (i+1) + ") " + this.mat_s[i] + " -- encoded";
							Encoder.EncodeType = "entity";
							var a = Encoder.scriptEncode(this.mat_s[i]);
							var regx = new RegExp(this.mat_s[i].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
							scripts[key].innerHTML = scripts[key].innerHTML.replace(regx,a);
						}
					}
				}*/
				data = xmlDoc.documentElement.outerHTML;
				aConsoleService.logStringMessage("mat_h status is " + mat_h_status + "\nmat_s status is " + mat_s_status);
				//this.receivedData.push (data);
				binaryOutputStream.writeBytes (data, data.length);
				//Pass it on down the chain
				this.originalListener.onDataAvailable (request, context, storageStream.newInputStream (0), 0, data.length);	
			}
			this.originalListener.onStopRequest (request, context, statusCode);
		} else {
			this.originalListener.onStopRequest (request, context, statusCode);
		}
	},
	
	QueryInterface:function (aIID)
	{
		if (aIID.equals (Ci.nsIStreamListener) || aIID.equals (Ci.nsISupports))
		{
			return this;
		}
		throw Components.results.NS_NOINTERFACE;
	}
}

var httpResponseObserver =
{
	// HTTP Request Interceptor 	
	observe: function(subject, topic, data)
	{
		if (topic == "http-on-examine-response") 
		{
			var httpChannel = subject.QueryInterface(Components.interfaces.nsIHttpChannel);  
			var newListener = new TracingListener();
			subject.QueryInterface(Ci.nsITraceableChannel);
			newListener.originalListener = subject.setNewListener(newListener);
       	}
	},

	QueryInterface : function (aIID)
    {
		if (aIID.equals(Ci.nsIObserver) || aIID.equals(Ci.nsISupports))
        {
            return this;
        }
        throw Components.results.NS_NOINTERFACE;
    },
   
	get observerService() 
	{
		return Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
	},

	register: function()
	{
		this.observerService.addObserver(this, "http-on-examine-response", false);
	},

	unregister: function()
	{
		this.observerService.removeObserver(this, "http-on-examine-response");
	}
};

var httpRequestObserver =
{
	// HTTP Request Interceptor 	
	observe: function(subject, topic, data)
	{
		if (topic == "http-on-modify-request") 
		{       
			var httpChannel = subject.QueryInterface(Components.interfaces.nsIHttpChannel);
			if(httpChannel.requestMethod == "POST") 
			{
				var uploadChannel = httpChannel.QueryInterface(Components.interfaces.nsIUploadChannel);
				var uploadChannelStream = uploadChannel.uploadStream;
				uploadChannelStream.QueryInterface(Components.interfaces.nsISeekableStream).seek(Components.interfaces.nsISeekableStream.NS_SEEK_SET, 0);
				var stream = Components.classes["@mozilla.org/binaryinputstream;1"].createInstance(Components.interfaces.nsIBinaryInputStream);
				stream.setInputStream(uploadChannelStream);
				var postBytes = stream.readByteArray(stream.available());
				uploadChannelStream.QueryInterface(Components.interfaces.nsISeekableStream).seek(Components.interfaces.nsISeekableStream.NS_SEEK_SET, 0);
				var poststr = String.fromCharCode.apply(null, postBytes);
				Gpoststr = poststr
				// so we have the parameters send via post in the string Gpoststr
			}
        }
	},

	QueryInterface : function (aIID)
    {
        if (aIID.equals(Ci.nsIObserver) || aIID.equals(Ci.nsISupports))
        {
            return this;
        }
        throw Components.results.NS_NOINTERFACE;
    },
   
	get observerService() 
	{
		return Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
	},

	register: function()
	{
		this.observerService.addObserver(this, "http-on-modify-request", false);
	},

	unregister: function()
	{
		this.observerService.removeObserver(this, "http-on-modify-request");
	}
};

//redundant functions
function htmlEncode(value)
{
	return  $('<div/>').text(value).html();
}
//redundant functions
function htmlDecode(value)
{
	return $('<div/>').html(value).text();
}

function getLocalDirectory()
{  
	var directoryService = Cc["@mozilla.org/file/directory_service;1"].getService(Ci.nsIProperties);  
	// this is a reference to the profile dir (ProfD) now.  
	var localDir = directoryService.get("ProfD", Ci.nsIFile);  
	localDir.append("Xspec");  
	if (!localDir.exists() || !localDir.isDirectory()) 
	{  
		// read and write permissions to owner and group, read-only for others.  
		localDir.create(Ci.nsIFile.DIRECTORY_TYPE, 0777);  
	}  
	return localDir;  
}

// used to get the scripts on a page
function get_scripts(data)
{  
	var re = /<script\b[^>]*>([\s\S]*?)<\/script>/gm;
	var res = "";
	var match;
	while (match = re.exec(data)) {
	  // full match is in match[0], whereas captured groups are in ...[1], ...[2], etc.
	  res += " " + match[1];
	}
	
	/*alert("same as before");
	var patt1 = /\< *?script *?\>((.|\n)*?)\< *?\/ *?script/gi; //looking for only inline scripts
	//var patt1 = /\<script[^<]*\<\/script\>/gi;
	var p = data.match(patt1);
	patt1 = /\< *?script *?\>((.|\n)*?)\< *?\/ *?script/i;
	res = "";
	if(p != null) for(i=0;i<p.length;i++) res+=" "+p[i].match(patt1)[1];
	//if(p != null) for(i=0;i<p.length;i++) res+=" "+p[i];
	*/
	//alert (res);
	return res;
}

// this function deals with special characters which sometimes behave as html and sometimes as script for example, <form name = "information"> and <script>alert("hi")</script>
function html_script_mix_param (par)
{
	var d_quot = /\"/g;
	var s_quot = /\'/g;
	var comma = /,/g;
	var l_round = /\(/g;
	var r_round = /\)/g;
	var semicolon = /;/g;
	var h_open = /</g;
	var h_close = />/g;
	html_open = /</;
	html_close = />/;
	var result = "";
	while(1)
	{
		i_open = par.search(html_open);
		i_close = par.search(html_close);
		if (i_open == -1)
		{
			// evrything of javascript type
			temp = par;
			temp = temp.replace(d_quot, "\"s");
			temp = temp.replace(s_quot, "\'s");
			temp = temp.replace(comma, ",s");
			temp = temp.replace(l_round, "\(s");
			temp = temp.replace(r_round, "\)s");
			temp = temp.replace(semicolon, ";s");
			result += temp;
			break;
		}
		if (i_close == -1)
		{
			// evrything of javascript type
			temp = par;
			temp = temp.replace(d_quot, "\"s");
			temp = temp.replace(s_quot, "\'s");
			temp = temp.replace(comma, ",s");
			temp = temp.replace(l_round, "\(s");
			temp = temp.replace(r_round, "\)s");
			temp = temp.replace(semicolon, ";s");
			result += temp;
			break;
		}
		temp = par.substring(0,i_open);
		temp = temp.replace(d_quot, "\"s");
		temp = temp.replace(s_quot, "\'s");
		temp = temp.replace(comma, ",s");
		temp = temp.replace(l_round, "\(s");
		temp = temp.replace(r_round, "\)s");
		temp = temp.replace(semicolon, ";s");
		result += temp;
		if (i_close < i_open)
		{
			par = par.substring(i_open);
			continue;
		}
		else
		{
			temp = par.substring(i_open,i_close+1);
			temp = temp.replace(d_quot, "\"h");
			temp = temp.replace(s_quot, "\'h");
			temp = temp.replace(comma, ",h");
			temp = temp.replace(l_round, "\(h");
			temp = temp.replace(r_round, "\)h");
			temp = temp.replace(semicolon, ";h");
			result += temp;
			par = par.substring(i_close+1);
			continue;
		}
	}
	result = result.replace(h_open, "<h");
	result = result.replace(h_close, ">h");
	return result;
}

// if the parameter contains both html and script type parameters, this function splits them up in proper manner and stores them in mat_h and mat_s arrays
//problem with the output 
function split_sp(par,mat_h,mat_s)
{
	var d_quot_h = /\"h/g;
	var s_quot_h = /\'h/g;
	var comma_h = /,h/g;
	var l_round_h = /\(h/g;
	var r_round_h = /\)h/g;
	var semicolon_h = /;h/g;
	var d_quot_s = /\"s/g;
	var s_quot_s = /\'s/g;
	var comma_s = /,s/g;
	var l_round_s = /\(s/g;
	var r_round_s = /\)s/g;
	var semicolon_s = /;s/g;
	var h_open = /<h/g;
	var h_close = />h/g;
	cur=2;
	cur_str = "";
	sp1 = /<h|>h|\"h|\'h|;h|\(h|\)h|\,h/;
	sp2 = /;s|\'s|\(s|\)s|\,s|\"s/;
	cur_ind = 0;
	while(1)
	{
		org = par;
		par = par.substring(cur_ind);
		var1 = par.search(sp1);
		var2 = par.search(sp2);
		if(var2 == -1)
		{
			if(cur == 0 || cur == 2)
			{
				cur_str += org.substring(cur_ind);
				mat_h.push(cur_str);
				break;
			}
			else
			{
				mat_s.push(cur_str);
				cur_str = org.substring(cur_ind);
				mat_h.push(cur_str);
				break;	
			}
		}
		else if(var1 == -1)
		{
			if(cur == 1 || cur == 2)
			{
				cur_str += org.substring(cur_ind);
				mat_s.push(cur_str);
				break;
			}
			else
			{
				mat_h.push(cur_str);
				cur_str = org.substring(cur_ind);
				mat_s.push(cur_str);
				break;
			}
		}
		else if(var1<var2)
		{
			if(cur==0||cur==2)
			{
	 			temp = par.substring(0,var1+2);
				cur_str += temp;
				cur_ind = var1+2;
				cur = 0;
			}
			else
			{
				mat_s.push(cur_str);
				cur_ind = var1+2;
				cur_str = par.substring(0,var1+2);//replaced var1 with 0
				cur = 0;
			}
		}
		else if(var1 > var2)
		{
			if(cur == 1 || cur == 2)
			{
				cur_str += par.substring(0,var2+2);
				cur_ind = var2+2;
				cur = 1;
			}
			else
			{
				mat_h.push(cur_str);
				cur_ind = var2+2;
				cur_str = par.substring(0,var2+2);//replaced var2 with 0
				cur = 1;
			}
		}
	}
	
	for (var i = 0; i < mat_h.length; i++)
	{
		mat_h[i] = mat_h[i].replace(d_quot_h, "\"");
		mat_h[i] = mat_h[i].replace(s_quot_h, "\'");
		mat_h[i] = mat_h[i].replace(comma_h, "\,");
		mat_h[i] = mat_h[i].replace(semicolon_h, ";");
		mat_h[i] = mat_h[i].replace(l_round_h, "\(");
		mat_h[i] = mat_h[i].replace(r_round_h, "\)");
		mat_h[i] = mat_h[i].replace(h_open, "<");
		mat_h[i] = mat_h[i].replace(h_close, ">");
	}
	for (i = 0; i < mat_s.length; i++)
	{
		mat_s[i] = mat_s[i].replace(d_quot_s, "\"");
		mat_s[i] = mat_s[i].replace(s_quot_s, "\'");
		mat_s[i] = mat_s[i].replace(comma_s, "\,");
		mat_s[i] = mat_s[i].replace(semicolon_s, ";");
		mat_s[i] = mat_s[i].replace(l_round_s, "\(");
		mat_s[i] = mat_s[i].replace(r_round_s, "\)");
	}
}

window.addEventListener("load", function (){
	var url = content.location.href;
	httpRequestObserver.register();
	httpResponseObserver.register();				
	},false);