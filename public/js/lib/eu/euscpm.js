//=============================================================================

var EU_PTR_SIZE				=4;
var EU_INT_SIZE				=4;
var EU_DWORD_SIZE			=4;
var EU_BOOL_SIZE			=4;

var EU_TRUE 				= 1;
var EU_FALSE 				= 0;

//=============================================================================

var XMLHTTPProxyService = "";

//=============================================================================

function EUSignCPException(errorCode, message) {
	this.errorCode = errorCode;
	this.message = message;
	
	this.toString = function() {
		return this.message + "(" + errorCode + ")";
	};
	
	this.GetErrorCode = function() {
		return this.errorCode;
	};
	
	this.GetMessage = function() {
		return this.message;
	};
}

//=============================================================================

function EUPointerConstructor(size, isArray, moduleFreeFunc, context) {
	this.ptr = Module._malloc(size);
	Module.setValue(this.ptr, 0);

	this.isArray = isArray;
	if (isArray) {
		this.lengthPtr = Module._malloc(EU_PTR_SIZE);
		Module.setValue(this.lengthPtr, 0);
	} else {
		this.lengthPtr = 0;
	}

	this.moduleFreeFunc = moduleFreeFunc;
	this.context = context;

	this.toPtr = function() {
		var pPtr = 0;
		try {
			pPtr = Module.getValue(this.ptr, "i8*");
		} catch(e) {}

		this.free();

		return pPtr;
	};
	this.toNumber = function() {
		var number = null;
		try {
			number = Module.getValue(this.ptr, "i32");
		} catch(e) {}

		this.free();

		return number;
	};
	this.toBoolean = function() {
		return (this.toNumber() != EU_FALSE);
	};
	this.toString = function() {
		var string = null;
		try {
			var strPtr = this.toPtr();
			if (strPtr | 0) {
				string = CP1251PointerToUTF8(strPtr);
				if (context != null)
					Module._EUCtxFreeMemory(context|0, strPtr);
				else
					Module._EUFreeMemory(strPtr);
			}
		} catch(e) {}

		this.free();

		return string;
	};
	this.toStringArray = function() {
		var strings = null;
		try {
			var strPtr = this.toPtr();
			if (strPtr | 0) {
				strings = [];
				while (1) {
					var str = CP1251PointerToUTF8(strPtr);
					strings.push(str);
					if (HEAPU8[((strPtr + str.length + 1)|0)] == 0)
						break;
					strPtr += ((strPtr + str.length + 1)|0);
				}

				if (context != null)
					Module._EUCtxFreeMemory(context|0, strPtr);
				else
					Module._EUFreeMemory(strPtr);
			}
		} catch(e) {}

		this.free();

		return strings;
	};
	this.toArray = function() {
		var array = null;
		try {
			var arrPtr = Module.getValue(this.ptr, "i8*");
			var arrLength = Module.getValue(this.lengthPtr, "i32");
			var arrBuffer = new ArrayBuffer(arrLength);

			array = new Uint8Array(arrBuffer);
			array.set(new Uint8Array(Module.HEAPU8.buffer, arrPtr, arrLength));

			if (context != null)
				Module._EUCtxFreeMemory(context|0, arrPtr|0);
			else
				Module._EUFreeMemory(arrPtr|0);
		} catch(e) {
		}

		this.free();

		return array;
	};
	this.free = function() {
		try {
			if (this.moduleFreeFunc != null)
				this.moduleFreeFunc(this);

			if (this.ptr != 0)
				Module._free(this.ptr);
			if (this.lengthPtr != 0)
				Module._free(this.lengthPtr);
		} catch (e) {}

		this.ptr = 0;
		this.lengthPtr = 0;
		this.moduleFreeFunc = null;
	};
}

function EUPointer(context) {
	if (context === undefined)
		context = null;

	return new EUPointerConstructor(EU_PTR_SIZE, false, null, context);
}

function EUPointerBool() {
	return new EUPointerConstructor(EU_BOOL_SIZE, false, null, null);
}

function EUPointerInt() {
	return new EUPointerConstructor(EU_INT_SIZE, false, null, null);
}

function EUPointerDWORD() {
	return new EUPointerConstructor(EU_DWORD_SIZE, false, null, null);
}

function EUPointerArray(context) {
	if (context === undefined)
		context = null;

	return new EUPointerConstructor(EU_PTR_SIZE, true, null, context);
}

function EUPointerStaticArray(array) {
	var arrayLength = array.length;
	var pPtr = new EUPointerConstructor(
		arrayLength, false, null, null);

	try {
		Module.writeArrayToMemory(array, pPtr.ptr | 0);
		pPtr.toArray = function() {
			var array = null;
			try {
				var arrBuffer = new ArrayBuffer(arrayLength);
				array = new Uint8Array(arrBuffer);
				array.set(new Uint8Array(Module.HEAPU8.buffer, this.ptr, arrayLength));
			} catch (e) {
			}

			this.free();

			return array;
		};
	} catch (e) {
		pPtr.free();
		return null;
	}

	return pPtr;
}

function EUPointerCertOwnerInfo(context) {
	if (context === undefined)
		context = null;

	return new EUPointerConstructor(
			EU_CERT_OWNER_INFO_SIZE, false, 
			function (pPtr) {
				if ((pPtr.ptr | 0) != 0)
				{
					if (context != null)
					{
						Module._EUCtxFreeCertOwnerInfo(
							context | 0, pPtr.ptr);
					}
					else
						Module._EUFreeCertOwnerInfo(pPtr.ptr);
				}
			}, 
			context);
}

function EUPointerSignerInfo(context) {
	if (context === undefined)
		context = null;

	return new EUPointerConstructor(
			EU_SIGN_INFO_SIZE, false, 
			function (pPtr) {
				if ((pPtr.ptr | 0) != 0)
				{
					if (context != null)
					{
						Module._EUCtxFreeSignerInfo(
							context | 0, pPtr.ptr);
					}
					else
						Module._EUFreeSignerInfo(pPtr.ptr);
				}
			},
			context);
}

function EUPointerSenderInfo(context) {
	if (context === undefined)
		context = null;

	return new EUPointerConstructor(
			EU_SENDER_INFO_SIZE, false, 
			function (pPtr) {
				if ((pPtr.ptr | 0) != 0)
				{
					if (context != null)
					{
						Module._EUCtxFreeSenderInfo(
							context | 0, pPtr.ptr);
					}
					else
						Module._EUFreeSenderInfo(pPtr.ptr);
				}
			}, 
			context);
}

function EUPointerCertificateInfo() {
	return new EUPointerConstructor(
			EU_CERT_INFO_SIZE, false, 
			function (pPtr) {
				if ((pPtr.ptr | 0) != 0)
					Module._EUFreeCertInfo(pPtr.ptr);
			},
			null);
}

function EUPointerKeyMedia(typeIndex, devIndex, password) {
	var pPtr = new EUPointerConstructor(
			EU_KEY_MEDIA_SIZE, false, null, null);

	try {
		var pCurPtr = pPtr.ptr | 0;
		
		Module.setValue(pCurPtr, typeIndex | 0, "i32");
		pCurPtr+= EU_INT_SIZE;
		Module.setValue(pCurPtr, devIndex | 0, "i32");
		pCurPtr+= EU_INT_SIZE;
		
		var strArr = UTF8ToCP1251Array(password);
		if (strArr.length > EU_PASS_MAX_LENGTH)
			throw { message: "Invalid parameter"}
		Module.writeArrayToMemory(strArr, pCurPtr);
	} catch (e) {
		pPtr.free();
		return null;
	}

	return pPtr;
}

function EUPointerEndUserInfo(euInfo) {
	var pPtr = new EUPointerConstructor(
			EU_USER_INFO_SIZE, false, null, null);

	try {
		var pCurPtr = pPtr.ptr | 0;

		var SetString = function(str, strMaxLength) {
			var strArr = UTF8ToCP1251Array(str);
			if (strArr.length > strMaxLength) {
				throw { message: "Invalid parameter"}
			}

			Module.writeArrayToMemory(strArr, pCurPtr);
			pCurPtr += strMaxLength;
		};

		Module.setValue(pCurPtr, euInfo.version | 0, "i32");
		pCurPtr += EU_INT_SIZE;

		SetString(euInfo.commonName, EU_COMMON_NAME_MAX_LENGTH);
		SetString(euInfo.locality, EU_LOCALITY_MAX_LENGTH);
		SetString(euInfo.state, EU_STATE_MAX_LENGTH);
		SetString(euInfo.organiztion, EU_ORGANIZATION_MAX_LENGTH);
		SetString(euInfo.orgUnit, EU_ORG_UNIT_MAX_LENGTH);
		SetString(euInfo.title, EU_TITLE_MAX_LENGTH);
		SetString(euInfo.street, EU_STREET_MAX_LENGTH);
		SetString(euInfo.phone, EU_PHONE_MAX_LENGTH);
		SetString(euInfo.surname, EU_SURNAME_MAX_LENGTH);
		SetString(euInfo.givenname, EU_GIVENNAME_MAX_LENGTH);
		SetString(euInfo.eMail, EU_EMAIL_MAX_LENGTH);
		SetString(euInfo.dns, EU_ADDRESS_MAX_LENGTH);
		SetString(euInfo.edrpouCode, EU_EDRPOU_MAX_LENGTH);
		SetString(euInfo.drfoCode, EU_DRFO_MAX_LENGTH);
		SetString(euInfo.nbuCode, EU_NBU_MAX_LENGTH);
		SetString(euInfo.spfmCode, EU_SPFM_MAX_LENGTH);
		SetString(euInfo.oCode, EU_O_CODE_MAX_LENGTH);
		SetString(euInfo.ouCode, EU_OU_CODE_MAX_LENGTH);
		SetString(euInfo.userCode, EU_USER_CODE_MAX_LENGTH);
		SetString(euInfo.upn, EU_UPN_MAX_LENGTH);
	} catch (e) {
		pPtr.free();
		return null;
	}

	return pPtr;
}

function EUPointerMemory(size) {
	return new EUPointerConstructor(
			size, false, null, null);
}

function EUArrayFromArrayOfArray(array) {
	this.count = array.length;
	this.arraysPtr = 0;
	this.arraysLengthPtr = 0;

	try {
		this.arraysPtr = Module._malloc(EU_PTR_SIZE * array.length);
		this.arraysLengthPtr = Module._malloc(EU_INT_SIZE * array.length);

		for (var i = 0; i < array.length; i++) {
			Module.setValue((this.arraysPtr + i * EU_PTR_SIZE) | 0, 0);
		}

		for (var i = 0; i < array.length; i++) {
			var pCurPtr = (this.arraysPtr + i * EU_PTR_SIZE) | 0;

			var buffer = _malloc(array[i].length);
			Module.writeArrayToMemory(array[i], buffer);

			setValue(pCurPtr, buffer, "i32*");
			setValue(this.arraysLengthPtr + i * EU_INT_SIZE,
				array[i].length, "i32");
		}
	} catch (e) {
		this.free();
	}

	this.free = function() {
		if (this.arraysPtr == 0)
			return;

		try {
			for (var i = 0; i < this.count; i++) {
				var pCurPtr = Module.getValue(
					(this.arraysPtr + i * EU_PTR_SIZE) | 0, "i32*");
				if (pCurPtr != 0)
					Module._free(pCurPtr);
			}

			Module._free(this.arraysPtr);
			Module._free(this.arraysLengthPtr);
		} catch (e) {}
		
		this.count = 0;
		this.arraysPtr = 0;
		this.arraysLengthPtr = 0;
	};
}

function EUPointerIntArray(array) {
	var pPtr = new EUPointerConstructor(
			EU_INT_SIZE * array.length, false, null, null);

	try {
		var pCurPtr = pPtr.ptr | 0;
		
		for (var i = 0; i < array.length; i++) {
			Module.setValue(pCurPtr, array[i] | 0, "i32");
			pCurPtr+= EU_INT_SIZE;
		}
	} catch (e) {
		pPtr.free();
		return null;
	}

	return pPtr;
}


function IntFromBool(boolValue) {
	return (boolValue == true) ? 1 : 0;
}

function ParseServersArray(serversArray) {
	var servers = {
		addresses: [],
		ports:[]
	};

	var length = serversArray.length;
	for (var i = 0; i < length; i++) {
		var res = serversArray[i].split(":");
		if (res.length == 2) {
			servers.addresses.push(res[0]);
			servers.ports.push(res[1]);
		} else {
			servers.addresses.push(serversArray[i]);
			servers.ports.push("80");
		}
	}

	return servers;
}

function IsFileSyncSupported() {
	try {
		return (!!FileReaderSync);
	}
	catch (e) {
		return false;
	}
}

function IsFileASyncSupported() {
	try {
		return (!!FileReader);
	}
	catch (e) {
		return false;
	}
}

//=============================================================================

var EU_MODULE_INITIALIZE_ON_LOAD = 
	((typeof EU_MODULE_INITIALIZE_ON_LOAD) != 'undefined') ? 
		EU_MODULE_INITIALIZE_ON_LOAD : true;

//-----------------------------------------------------------------------------

function EUSignCPModuleInitialize() {
	Module.setStatus.last = null;
	Module['setStatus']('(ініціалізація...)');
	setTimeout(function() {
		var isInitialized = false;
		try {
			var error = Module._EUInitialize();
			if (error != EU_ERROR_NONE)
				Module.setStatus('(не ініціалізовано)');
			else {
				Module.setStatus('(ініціалізовано)');
				isInitialized = true;
			}
		} catch(e) {
			Module.setStatus('(не ініціалізовано)');
		}
		
		try {
			if (typeof(EUSignCPModuleInitialized) == "function")
				EUSignCPModuleInitialized(isInitialized);
		} catch (e) {
		}
	}, 100);
}

//-----------------------------------------------------------------------------

var Module = {
	preRun: [],
	postRun: [
		function() {
			setTimeout(function() {
				try {
					if (typeof(EUSignCPModuleLoaded) == "function")
						EUSignCPModuleLoaded();
					if (EU_MODULE_INITIALIZE_ON_LOAD)
						EUSignCPModuleInitialize();
				} catch (e) {
				}
			}, 100);
		}
	],
	print: (function() {
		return function(text) {
			text = Array.prototype.slice.call(arguments).join(' ');
		};
	})(),
	printErr: function(text) {
		text = Array.prototype.slice.call(arguments).join(' ');
		if (0) {
			dump(text + '\n');
		} else {
		}
	},
	setStatus: function(text) {
		if (text == '')
			return;

		try {
			if (!Module.setStatus.last) 
				Module.setStatus.last = { time: Date.now(), text: '' };

			if (text === Module.setStatus.text)
				return;

			var m = text.match(/([^(]+)\((\d+(\.\d+)?)\/(\d+)\)/);
			var now = Date.now();
			if (m && now - Date.now() < 30)
				return; 

			var statusElement = document.getElementById('status');
			var progressElement = document.getElementById('progress');
			if (!statusElement || !progressElement)
				return;

			if (m) {
				text = m[1];
				progressElement.value = parseInt(m[2])*100;
				progressElement.max = parseInt(m[4])*100;
				progressElement.hidden = false;
				statusElement.hidden = false;
			} else {
				progressElement.value = 0;
				progressElement.max = 100;
				progressElement.hidden = true;
			}

			statusElement.innerHTML = text;
		} catch(e) {}
	},
	totalDependencies: 0,
	monitorRunDependencies: function(left) {
		this.totalDependencies = Math.max(this.totalDependencies, left);
		Module.setStatus(left ? 
			'Підготовка... (' + (this.totalDependencies-left) + 
				'/' + this.totalDependencies + ')' :
			'Всі завантаження завершено.');
	},
	MAX_DATA_SIZE: EU_MAX_DATA_SIZE_MB * EU_ONE_MB,
	LIBRARY_STACK: EU_LIBRARY_STACK_MB * EU_ONE_MB,
	LIBRARY_MEMORY: EU_LIBRARY_MEMORY_MB * EU_ONE_MB,
	TOTAL_STACK: (EU_MAX_DATA_SIZE_MB + EU_LIBRARY_STACK_MB) * EU_ONE_MB,
	TOTAL_MEMORY: (EU_LIBRARY_STACK_MB + EU_LIBRARY_MEMORY_MB + 
		EU_MAX_DATA_SIZE_MB * 8) * EU_ONE_MB
};

//=============================================================================

var EUSignCP = NewClass({
	"Vendor": "JSC IIT",
	"ClassVersion": "1.0.3",
	"ClassName": "EUSignCP",
	"errorLangCode": EU_DEFAULT_LANG,
	"privKeyOwnerInfo": null,
	"isFileSyncAPISupported": false,
	"isFileASyncAPISupported": false,
	"stringEncoder": new StringEncoder("UTF-8", false)
},
function() {
},
{
//-----------------------------------------------------------------------------
	GetErrorDescription: function(errorCode, langCode) {
		try {
			if ((errorCode & EU_ERROR_JS_ERRORS) == EU_ERROR_JS_ERRORS){
				if (arguments.length == 2) {
					return EU_ERRORS_STRINGS[langCode][errorCode];
				} else {
					return EU_ERRORS_STRINGS[this.errorLangCode][errorCode];
				}
			}

			var strPtr = 0;

			if (arguments.length == 2) {
				strPtr = Module._EUGetErrorLangDesc(
					errorCode, langCode);
			} else {
				strPtr = Module._EUGetErrorLangDesc(
					errorCode, this.errorLangCode);
			}

			return CP1251PointerToUTF8(strPtr);
		} catch (e) {
			return null;
		}
	},
	MakeError: function(errorCode) {
		var errorMsg = this.GetErrorDescription(errorCode);
		if (errorMsg == null)
			errorMsg = '';

		return new EUSignCPException(errorCode, errorMsg);
	},
	RaiseError: function(errorCode) {
		throw this.MakeError(errorCode);
	},
//-----------------------------------------------------------------------------
	Initialize: function() {
		var error;

		try {
			this.isFileSyncAPISupported =
				IsFileSyncSupported() & EUFS.staticInit();;
			this.isFileASyncAPISupported = IsFileASyncSupported();

			error = Module._EUInitialize();
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE)
			this.RaiseError(error);

		return EU_ERROR_NONE;
	},
	Finalize: function() {
		var error;

		try {
			Module._EUFinalize();
			error = EU_ERROR_NONE;
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		this.privKeyOwnerInfo = null;

		if (error != EU_ERROR_NONE)
			this.RaiseError(error);

		return EU_ERROR_NONE;
	},
	IsInitialized: function() {
		var isInitialized;
		
		try {
			isInitialized = 
				(Module._EUIsInitialized() != EU_FALSE);
		} catch (e) {
			isInitialized = false;
		}
		
		return isInitialized;
	},
	SetErrorMessageLanguage: function(langCode) {
		this.errorLangCode = langCode;
	},
	GetErrorDesc: function (errorCode, langCode) {
		var errorDesc = this.GetErrorDescription(errorCode, langCode);

		if (errorDesc == null)
			this.RaiseError(EU_ERROR_JS_LIBRARY_LOAD);

		return errorDesc;
	},
//-----------------------------------------------------------------------------
	CheckMaxDataSize: function(data) {
		if (data.length > Module.MAX_DATA_SIZE)
			this.RaiseError(EU_ERROR_BAD_PARAMETER);
	},
	Base64Encode: function(data) {
		this.CheckMaxDataSize(data);

		var strPtr = EUPointer();
		var error;

		try {
			error = Module.ccall('EUBASE64Encode',
				'number',
				['array', 'number', 'number'],
				[data, data.length, strPtr.ptr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			strPtr.free();
			this.RaiseError(error);
		}
		
		return strPtr.toString();
	}, 
	Base64Decode: function(data) {
		this.CheckMaxDataSize(data);

		var arrPtr = EUPointerArray();
		var error;

		try {
			error = Module.ccall('EUBASE64Decode',
				'number',
				['string', 'number', 'number'],
				[data, arrPtr.ptr, arrPtr.lengthPtr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}
		
		if (error != EU_ERROR_NONE) {
			arrPtr.free();
			this.RaiseError(error);
		}
		
		return arrPtr.toArray();
	},
	SetJavaStringCompliant: function(compliant) {
		this.stringEncoder = new StringEncoder(
			this.stringEncoder.charset,
			compliant);
	},
	SetCharset: function(charset) {
		try {
			var encoder = new StringEncoder(
				charset,
				this.stringEncoder.javaCompliant);
			this.stringEncoder = encoder;
		} catch (e) {
			this.RaiseError(EU_BAD_PARAMETER);
		}
	},
	GetCharset: function() {
		if (this.stringEncoder == null)
			this.RaiseError(EU_BAD_PARAMETER);

		return this.stringEncoder.charset;
	},
	StringToArray: function(data) {
		try {
			return this.stringEncoder.encode(data);
		} catch (e) {
			this.RaiseError(EU_ERROR_BAD_PARAMETER);
		}
	},
	ArrayToString: function(data) {
		try {
			return this.stringEncoder.decode(data);
		} catch (e) {
			this.RaiseError(EU_ERROR_BAD_PARAMETER);
		}
	},
	ReadFile: function(file, onSuccess, onError) {
		var pThis = this;
		if (file == null) {
			onError(pThis.MakeError(EU_ERROR_BAD_PARAMETER));
			return;
		}

		if (!pThis.isFileSyncAPISupported && 
			!pThis.isFileASyncAPISupported) {
			onError(pThis.MakeError(EU_ERROR_NOT_SUPPORTED));
			return;
		}

		function _onSuccess(evt) {
			if (evt.target.readyState != FileReader.DONE)
				return;

			try {
				var loadedFile = new EndUserFile();

				loadedFile.SetTransferableObject({
					'file': file, 'data': new Uint8Array(evt.target.result)
				});

				onSuccess(loadedFile);
			} catch (e) {
				onError(pThis.MakeError(EU_ERROR_JS_READ_FILE));
			}
		};

		function _onError(e) {
			onError(pThis.MakeError(EU_ERROR_JS_READ_FILE));
		}

		if (pThis.isFileSyncAPISupported) {
			var fileReader = new FileReaderSync();
			try {
				var fileData = fileReader.readAsArrayBuffer(file);
				var loadedFile = new EndUserFile();

				loadedFile.SetTransferableObject({
					'file': file, 'data': new Uint8Array(fileData)
				});

				onSuccess(loadedFile);
			} catch (e) {
				onError(pThis.MakeError(EU_ERROR_JS_READ_FILE));
			}
		} else {
			var fileReader = new FileReader();
			fileReader.onloadend = _onSuccess;
			fileReader.onerror = _onError;
			fileReader.readAsArrayBuffer(file);
		}
	},
	ReadFiles: function (files, onSuccess, onError) {
		var pThis = this;

		if (files.length <= 0) {
			onError(pThis.MakeError(EU_ERROR_BAD_PARAMETER));
			return;
		}

		var curIndex = 0;
		var processedFiles = [];

		var _onSuccess = function(readedFile) {
			processedFiles.push(readedFile);
			curIndex++;
			
			if (curIndex < files.length) {
				pThis.ReadFile(files[curIndex], _onSuccess, onError);
				return;
			}

			onSuccess(processedFiles);
		};

		pThis.ReadFile(files[curIndex], _onSuccess, onError);
	},
	LoadDataFromServer: function(path, onSuccess, onError, asByteArray) {
		var pThis = this;
		try {
			var httpRequest;
			var url;

			if (XMLHttpRequest)
				httpRequest = new XMLHttpRequest();
			else
				httpRequest = new ActiveXObject("Microsoft.XMLHTTP");

			httpRequest.onload = function() {
				if (httpRequest.readyState != 4)
					return;

				if (httpRequest.status == 200) {
					if (asByteArray) {
						onSuccess(new Uint8Array(this.response));
					} else {
						onSuccess(httpRequest.responseText);
					}
				}
				else {
					onError(pThis.MakeError(EU_ERROR_DOWNLOAD_FILE));
				}
			};

			httpRequest.onerror = function() {
				onError(pThis.MakeError(EU_ERROR_DOWNLOAD_FILE));
			};

			if (path.indexOf('http://') != 0) {
				if (!location.origin) {
					location.origin = location.protocol + 
						"//" + location.hostname + 
						(location.port ? ':' + location.port: '');
				}
				url = location.origin + path;
			} else {
				url = path;
			}

			httpRequest.open("GET", url, true);
			if (asByteArray)
				httpRequest.responseType = 'arraybuffer';
			httpRequest.send();
		} catch (e) {
			onError(pThis.MakeError(EU_ERROR_DOWNLOAD_FILE));
		}
	},
//-----------------------------------------------------------------------------
	DoesNeedSetSettings: function() {
		try {
			return (Module._EUDoesNeedSetSettings() != EU_FALSE);
		} catch (e) {
			this.RaiseError(EU_ERROR_UNKNOWN);
		}
	},
	SetXMLHTTPProxyService: function(proxyServicePath) {
		XMLHTTPProxyService = proxyServicePath;
	},
	CreateFileStoreSettings:function() {
		return EndUserFileStoreSettings("/certificates", 
			false, false, false, false, false, false, 3600);
	},
	SetFileStoreSettings: function(settings) {
		var error;
		
		try {
			error = Module.ccall('EUSetFileStoreSettings',
				'number',
				['array', 'number', 'number', 'number', 'number',
					'number', 'number', 'number'],
				[UTF8ToCP1251Array(settings.path),
					IntFromBool(settings.checkCRLs),
					IntFromBool(settings.autoRefresh),
					IntFromBool(settings.ownCRLsOnly),
					IntFromBool(settings.fullAndDeltaCRLs),
					IntFromBool(settings.autoDownloadCRLs),
					IntFromBool(settings.saveLoadedCerts),
					settings.expireTime]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE)
			this.RaiseError(error);
	},
	CreateProxySettings:function() {
		return EndUserProxySettings(false, true,
			"", "3128", "", "", false);
	},
	SetProxySettings:function(settings) {
		var error;
		
		try {
			error = Module.ccall('EUSetProxySettings',
				'number',
				['number', 'number', 'string', 'string',
					'string', 'string', 'number'],
				[IntFromBool(settings.useProxy),
					IntFromBool(settings.anonymous),
					settings.address, settings.port,
					settings.user, settings.password,
					IntFromBool(settings.savePassword)]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE)
			this.RaiseError(error);
	},
	CreateTSPSettings:function() {
		return EndUserTSPSettings(false,
			"", "80");
	},
	SetTSPSettings:function(settings) {
		var error;
		
		try {
			error = Module.ccall('EUSetTSPSettings',
				'number',
				['number', 'string', 'string'],
				[IntFromBool(settings.getStamps),
					settings.address, settings.port]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE)
			this.RaiseError(error);
	},
	CreateOCSPSettings:function() {
		return EndUserOCSPSettings(false, false,
			"", "80");
	},
	SetOCSPSettings:function(settings) {
		var error;
		
		try {
			error = Module.ccall('EUSetOCSPSettings',
				'number',
				['number', 'number', 'string', 'string'],
				[IntFromBool(settings.useOCSP),
					IntFromBool(settings.beforeStore),
					settings.address, settings.port]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE)
			this.RaiseError(error);
	},
	CreateCMPSettings:function() {
		return EndUserCMPSettings(false, "", "80", "");
	},
	SetCMPSettings:function(settings) {
		var error;
		
		try {
			error = Module.ccall('EUSetCMPSettings',
				'number',
				['number', 'string', 'string', 'string'],
				[IntFromBool(settings.useCMP),
					settings.address, settings.port,
					settings.commonName]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE)
			this.RaiseError(error);
	},
	CreateLDAPSettings:function() {
		return EndUserLDAPSettings(false, "", "80",
			true, "", "");
	},
	SetLDAPSettings:function(settings) {
		var error;
		
		try {
			error = Module.ccall('EUSetLDAPSettings',
				'number',
				['number', 'string', 'string',
					'number', 'string', 'string'],
				[IntFromBool(settings.useLDAP),
					settings.address, settings.port,
					IntFromBool(settings.anonymous),
					settings.user, settings.password]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE)
			this.RaiseError(error);
	},
	CreateModeSettings:function() {
		return EndUserModeSettings(false);
	},
	SetModeSettings:function(settings) {
		var error;
		
		try {
			error = Module.ccall('EUSetModeSettings',
				'number',
				['number'],
				[IntFromBool(settings.offlineMode)]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE)
			this.RaiseError(error);
	},
	CreateOCSPAccessInfoModeSettings:function() {
		return EndUserOCSPAccessInfoModeSettings(false);
	},
	SetOCSPAccessInfoModeSettings:function(settings) {
		var error;
		
		try {
			error = Module.ccall('EUSetOCSPAccessInfoModeSettings',
				'number',
				['number'],
				[IntFromBool(settings.enabled)]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE)
			this.RaiseError(error);
	},
	CreateOCSPAccessInfoSettings:function() {
		return EndUserOCSPAccessInfoSettings("", "", "");
	},
	SetOCSPAccessInfoSettings:function(settings) {
		var error;
		
		try {
			error = Module.ccall('EUSetOCSPAccessInfoSettings',
				'number',
				['array', 'string', 'string'],
				[UTF8ToCP1251Array(settings.issuerCN),
					settings.address, settings.port]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE)
			this.RaiseError(error);
	},
	SetRuntimeParameter: function(name, value) {
		var error;
		var intPtr = EUPointerBool();
		if (typeof value != 'boolean') {
			this.RaiseError(EU_ERROR_BAD_PARAMETER);
		}
		
		try {
			Module.setValue(intPtr.ptr,
				IntFromBool(value) | 0, "i32");

			error = Module.ccall('EUSetRuntimeParameter',
				'number',
				['string', 'number', 'number'],
				[name, intPtr.ptr, EU_BOOL_SIZE]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
			intPtr.free();
		}

		if (error != EU_ERROR_NONE) {
			this.RaiseError(error);
		}

		intPtr.free();
	},
//-----------------------------------------------------------------------------
	SaveCertificate: function(certificate) {
		var error;

		this.CheckMaxDataSize(certificate);

		try {
			error = Module.ccall('EUSaveCertificate',
				'number',
				['array', 'number'],
				[certificate, certificate.length]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE)
			this.RaiseError(error);
	},
	SaveCertificates: function(certificates) {
		var error;

		this.CheckMaxDataSize(certificates);

		try {
			error = Module.ccall('EUSaveCertificates',
				'number',
				['array', 'number'],
				[certificates, certificates.length]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE)
			this.RaiseError(error);
	},
	SaveCRL: function(isFullCRL, crl) {
		var error;

		this.CheckMaxDataSize(crl);

		try {
			error = Module.ccall('EUSaveCRL',
				'number',
				['number', 'array', 'number'],
				[IntFromBool(isFullCRL), 
					crl, crl.length]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE)
			this.RaiseError(error);
	},
	GetCertificate: function(issuer, serial, asBase64String) {
		var pPtr = asBase64String ? 
			EUPointer() : EUPointerArray();
		var error;

		try {
			error = Module.ccall('EUGetCertificate',
				'number',
				['array', 'array', 'number', 'number', 'number'],
				[UTF8ToCP1251Array(issuer), 
				 UTF8ToCP1251Array(serial), 
					asBase64String ? pPtr.ptr : 0,
					!asBase64String ? pPtr.ptr : 0,
					!asBase64String ? pPtr.lengthPtr : 0]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			pPtr.free();
			this.RaiseError(error);
		}

		if (asBase64String)
			return pPtr.toString();
		else 
			return pPtr.toArray();
	},
	GetCertificatesByKeyInfo: function(keyInfo, cmpServers) {
		this.CheckMaxDataSize(keyInfo);

		var pPtr = EUPointerArray();
		var error;

		var servers = ParseServersArray(cmpServers);
		var addressesArray = intArrayFromStrings(servers.addresses);
		var portsArray = intArrayFromStrings(servers.ports);

		try {
			error = Module.ccall('EUGetCertificatesByKeyInfo',
				'number',
				['array', 'number', 'array', 'array', 'number', 'number'],
				[keyInfo, keyInfo.length, 
					addressesArray, portsArray,
					pPtr.ptr, pPtr.lengthPtr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			pPtr.free();
			this.RaiseError(error);
		}

		return pPtr.toArray();
	},
	ParseCertificate: function(certificate) {
		this.CheckMaxDataSize(certificate);

		var infoPtr = EUPointerCertificateInfo();
		var error;

		try {
			error = Module.ccall('EUParseCertificate',
				'number',
				['array', 'number', 'number'],
				[certificate, certificate.length, infoPtr.ptr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}
		
		if (error != EU_ERROR_NONE) {
			infoPtr.free();
			this.RaiseError(error);
		}

		var info = new EndUserCertificateInfo(infoPtr.ptr);
		infoPtr.free();

		return info;
	},
	CheckCertificate: function(certificate) {
		this.CheckMaxDataSize(certificate);

		var infoPtr = EUPointerCertificateInfo();
		var error;

		try {
			error = Module.ccall('EUCheckCertificate',
				'number',
				['array', 'number'],
				[certificate, certificate.length]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			infoPtr.free();
			this.RaiseError(error);
		}

		return true;
	},
//-----------------------------------------------------------------------------
	IsPrivateKeyReaded: function() {
		var error = EU_ERROR_NONE;
		var isReaded;
		
		try {
			isReaded = (Module._EUIsPrivateKeyReaded() != EU_FALSE);
			error = EU_ERROR_NONE;
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
			isReaded = false;
		}
		
		if (error != EU_ERROR_NONE) {
			this.RaiseError(error);
		}

		return isReaded;
	},
	ReadPrivateKeyBinary: function(privateKey, password) {
		this.CheckMaxDataSize(privateKey);

		var infoPtr = EUPointerCertOwnerInfo();
		var error;

		try {
			error = Module.ccall('EUReadPrivateKeyBinary',
				'number',
				['array', 'number', 'array', 'number'],
				[privateKey, privateKey.length,
					UTF8ToCP1251Array(password), infoPtr.ptr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			infoPtr.free();
			this.RaiseError(error);
		}

		this.privKeyOwnerInfo = new EndUserOwnerInfo(infoPtr.ptr);
		infoPtr.free();

		return this.privKeyOwnerInfo;
	},
	ResetPrivateKey: function() {
		try {
			Module.ccall('EUResetPrivateKey', "",
				[], []);
		} catch (e) {
		}

		this.privKeyOwnerInfo = null;
	},
	GetPrivateKeyOwnerInfo: function() {
		var error = EU_ERROR_NONE;
		try {
			if (Module._EUIsPrivateKeyReaded() == EU_FALSE) {
				this.privKeyOwnerInfo = null;
				error = EU_ERROR_UNKNOWN;
			}
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}
		
		if (error != EU_ERROR_NONE) {
			this.RaiseError(error);
		}
		
		return this.privKeyOwnerInfo;
	},
	GetKeyInfoBinary: function (privateKey, password) {
		this.CheckMaxDataSize(privateKey);

		var arrPtr = EUPointerArray();
		var error;

		try {
			error = Module.ccall('EUGetKeyInfoBinary',
				'number',
				['array', 'number', 'array', 'number', 'number'],
				[privateKey, privateKey.length, 
					UTF8ToCP1251Array(password), 
					arrPtr.ptr, arrPtr.lengthPtr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			arrPtr.free();
			this.RaiseError(error);
		}

		return arrPtr.toArray();
	},
	EnumOwnCertificates: function(index) {
		var pPtr = EUPointer();
		var error;

		try {
			error = Module.ccall('EUEnumOwnCertificates',
				'number',
				['number', 'number'],
				[index, pPtr.ptr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			pPtr.free();
			
			if (error == EU_WARNING_END_OF_ENUM)
				return null;

			this.RaiseError(error);
		}

		infoPtr = pPtr.toPtr();
		var info = new EndUserCertificateInfoEx(infoPtr);
		Module._EUFreeCertificateInfoEx(infoPtr);

		return info;
	},
	GeneratePrivateKey: function(password,
		uaKeysType, uaDSKeysSpec, useDSKeyAsKEP, uaKEPKeysSpec,
		internationalKeysType, internationalKeysSpec, 
		userInfo, extKeyUsages) {

		var kmPtr = EUPointerKeyMedia(0, 0, password);
		if (kmPtr == null)
			this.RaiseError(EU_ERROR_BAD_PARAMETER);

		var userInfoPtr = null;
		if (userInfo != null) {
			userInfoPtr = EUPointerEndUserInfo(userInfo);
			if (userInfoPtr == null) {
				kmPtr.free();
				this.RaiseError(EU_ERROR_BAD_PARAMETER);
			}
		}

		var pkPtr = EUPointerArray();
		var pkInfoPtr = EUPointerArray();

		var uaReqPtr = null, uaReqNamePtr = null, 
			uaKEPReqPtr = null, uaKEPReqNamePtr = null;
		if (uaKeysType != EU_KEYS_TYPE_NONE) {
			uaReqPtr = EUPointerArray();
			uaReqNamePtr = EUPointerMemory(EU_PATH_MAX_LENGTH);

			if (!useDSKeyAsKEP) {
				uaKEPReqPtr = EUPointerArray();
				uaKEPReqNamePtr = EUPointerMemory(EU_PATH_MAX_LENGTH);
			}
		}

		var intReqPtr = null, intReqNamePtr = null;
		if (internationalKeysType != EU_KEYS_TYPE_NONE) {
			intReqPtr = EUPointerArray();
			intReqNamePtr = EUPointerMemory(EU_PATH_MAX_LENGTH);
		}

		var _free = function() {
			kmPtr.free();
			pkPtr.free();
			pkInfoPtr.free();
			if (userInfoPtr != null)
				userInfoPtr.free();
			if (uaReqPtr != null)
				uaReqPtr.free();
			if (uaReqNamePtr != null)
				uaReqNamePtr.free();
			if (uaKEPReqPtr != null)
				uaKEPReqPtr.free();
			if (uaKEPReqNamePtr != null)
				uaKEPReqNamePtr.free();
			if (intReqPtr != null)
				intReqPtr.free();
			if (intReqNamePtr != null)
				intReqNamePtr.free();
		}

		try {
			error = Module.ccall('EUGeneratePrivateKeyEx',
				'number',
				['number', 'number', 
				 'number', 'number', 'number', 'number',
				  'number', 'number', 'number',
				  'number', 'number',
				  'number', 'number',
				  'number', 'number',
				  'number', 'number', 'number',
				  'number', 'number', 'number',
				  'number', 'number', 'number',],
				[kmPtr.ptr, EU_FALSE, 
				 uaKeysType, uaDSKeysSpec, uaKEPKeysSpec, null,
				 internationalKeysType, internationalKeysSpec, null,
				 (userInfo != null) ? 
					userInfoPtr.ptr : null, 
				 (extKeyUsages != null) ? 
					UTF8ToCP1251Array(extKeyUsages) : null,
				 pkPtr.ptr, pkPtr.lengthPtr,
				 pkInfoPtr.ptr, pkInfoPtr.lengthPtr,
				 (uaReqPtr != null) ? uaReqPtr.ptr : null,
				 (uaReqPtr != null) ? uaReqPtr.lengthPtr : null,
				 (uaReqNamePtr != null) ? uaReqNamePtr.ptr : null, 
				 (uaKEPReqPtr != null) ? uaKEPReqPtr.ptr : null,
				 (uaKEPReqPtr != null) ? uaKEPReqPtr.lengthPtr : null,
				 (uaKEPReqNamePtr != null) ? uaKEPReqNamePtr.ptr : null,
				 (intReqPtr != null) ? intReqPtr.ptr : null,
				 (intReqPtr != null) ? intReqPtr.lengthPtr : null,
				 (intReqNamePtr != null) ? intReqNamePtr.ptr : null]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			_free();
			this.RaiseError(error);
		}

		var _toString = function(strPtr) {
			var str = CP1251PointerToUTF8(strPtr);
			var lastInd = str.lastIndexOf("/");
			if (lastInd <= 0)
				return str;

			return str.substring(lastInd + 1, str.length);
		}
		
		var euPrivateKey = EndUserPrivateKey(
			pkPtr.toArray(), pkInfoPtr.toArray(),
			(uaReqPtr != null) ? uaReqPtr.toArray() : null,
			(uaReqNamePtr != null) ? _toString(uaReqNamePtr.ptr) : null,
			(uaKEPReqPtr != null) ? uaKEPReqPtr.toArray() : null,
			(uaKEPReqNamePtr != null) ? _toString(uaKEPReqNamePtr.ptr) : null,
			(intReqPtr != null) ? intReqPtr.toArray() : null,
			(intReqNamePtr != null) ? _toString(intReqNamePtr.ptr) : null);

		_free();

		return euPrivateKey;
	},
	ChangeSoftwarePrivateKeyPassword: function(
		privateKey, oldPassword, newPassword) {
		this.CheckMaxDataSize(privateKey);

		var arrPtr = EUPointerArray();
		var error;

		try {
			error = Module.ccall('EUChangeSoftwarePrivateKeyPassword',
				'number',
				['array', 'number', 'array', 'array', 'number', 'number'],
				[privateKey, privateKey.length, 
					UTF8ToCP1251Array(oldPassword), 
					UTF8ToCP1251Array(newPassword), 
					arrPtr.ptr, arrPtr.lengthPtr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			arrPtr.free();
			this.RaiseError(error);
		}

		return arrPtr.toArray();
	},
	CtxReadPrivateKeyBinary: function(context, privateKey, password) {
		this.CheckMaxDataSize(privateKey);

		var pkCtxPtr = EUPointer(); 
		var infoPtr = EUPointerCertOwnerInfo(context.GetContext());
		var error;

		try {
			error = Module.ccall('EUCtxReadPrivateKeyBinary',
				'number',
				['number', 'array', 'number', 'array', 'number', 'number'],
				[context.GetContext(), privateKey, privateKey.length,
					UTF8ToCP1251Array(password), 
					pkCtxPtr.ptr, infoPtr.ptr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			pkCtxPtr.free();
			infoPtr.free();
			this.RaiseError(error);
		}

		var privateKeyContext = EndUserPrivateKeyContext(
			pkCtxPtr.toPtr(), new EndUserOwnerInfo(infoPtr.ptr));
		infoPtr.free();

		return privateKeyContext;
	},
	CtxFreePrivateKey: function(privateKeyContext) {
		try {
			Module._EUCtxFreePrivateKey(
				privateKeyContext.GetContext()|0);
		} catch (e) {
		}
	},
	CtxGetOwnCertificate: function(
		privateKeyContext, certKeyType, keyUsage) {
		var pkCtx = privateKeyContext.GetContext();
		var pCertInfoExPtr = EUPointer();
		var certArrPtr = EUPointerArray(pkCtx);
		var error;

		try {
			error = Module.ccall('EUCtxGetOwnCertificate',
				'number',
				['number', 'number', 'number', 
					'number', 'number', 'number'],
				[pkCtx, certKeyType, keyUsage, pCertInfoExPtr.ptr,
					certArrPtr.ptr, certArrPtr.lengthPtr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			pCertInfoExPtr.free();
			certArrPtr.free();

			this.RaiseError(error);
		}

		var certInfoExPtr, certInfoEx;

		certInfoExPtr = pCertInfoExPtr.toPtr();
		certInfoEx = new EndUserCertificateInfoEx(certInfoExPtr);
		Module._EUCtxFreeCertificateInfoEx(pkCtx|0, certInfoExPtr);

		return EndUserCertificate(certInfoEx, certArrPtr.toArray());
	},
	CtxEnumOwnCertificates: function(privateKeyContext, index) {
		var pkCtx = privateKeyContext.GetContext();
		var pCertInfoExPtr = EUPointer();
		var certArrPtr = EUPointerArray(pkCtx);
		var error;

		try {
			error = Module.ccall('EUCtxEnumOwnCertificates',
				'number',
				['number', 'number', 'number', 'number', 'number'],
				[pkCtx, index, pCertInfoExPtr.ptr, 
					certArrPtr.ptr, certArrPtr.lengthPtr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			pCertInfoExPtr.free();
			certArrPtr.free();

			if (error == EU_WARNING_END_OF_ENUM)
				return null;

			this.RaiseError(error);
		}

		var certInfoExPtr, certInfoEx;

		certInfoExPtr = pCertInfoExPtr.toPtr();
		certInfoEx = new EndUserCertificateInfoEx(certInfoExPtr);
		Module._EUCtxFreeCertificateInfoEx(pkCtx|0, certInfoExPtr);

		return EndUserCertificate(certInfoEx, certArrPtr.toArray());
	},
	CtxEnumPrivateKeyInfo: function(privateKeyContext, index) {
		var dwordKeyTypePtr = EUPointerDWORD();
		var dwordKeyUsagePtr = EUPointerDWORD();
		var dwordKeyIDsCountPtr = EUPointerDWORD();
		var keyIDsPtr = EUPointer(privateKeyContext.GetContext());
		var error;

		try {
			error = Module.ccall('EUCtxEnumPrivateKeyInfo',
				'number',
				['number', 'number',
					'number', 'number', 'number', 'number'],
				[privateKeyContext.GetContext() | 0, index,
					dwordKeyTypePtr.ptr, dwordKeyUsagePtr.ptr, 
					dwordKeyIDsCountPtr.ptr, keyIDsPtr.ptr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}
		
		if (error != EU_ERROR_NONE) {
			dwordKeyTypePtr.free();
			dwordKeyUsagePtr.free();
			dwordKeyIDsCountPtr.free();
			keyIDsPtr.free();
			
			if (error == EU_WARNING_END_OF_ENUM)
				return null;
			
			this.RaiseError(error);
		}

		var keyType = dwordKeyTypePtr.toNumber();
		var keyUsage = dwordKeyUsagePtr.toNumber();
		var keyIDsCount = dwordKeyIDsCountPtr.toNumber();
		var keyIDs = keyIDsPtr.toStringArray();
		if (keyIDsCount != keyIDs.length)
			this.RaiseError(EU_ERROR_BAD_PARAMETER);

		return EndUserPrivateKeyInfo(
			keyType, keyUsage, keyIDs);
	},
	CtxExportPrivateKeyContainer: function(privateKeyContext, 
		password, keyID, asBase64String) {
		var pPtr = EUPointerArray(
			privateKeyContext.GetContext());
		var error;

		try {
			error = Module.ccall('EUCtxExportPrivateKeyContainer',
				'number',
				['number', 'array', 'array', 
					'number', 'number'],
				[privateKeyContext.GetContext(), 
					UTF8ToCP1251Array(password),
					UTF8ToCP1251Array(keyID),
					pPtr.ptr, pPtr.lengthPtr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			pPtr.free();
			this.RaiseError(error);
		}

		if (asBase64String)
			return this.Base64Encode(pPtr.toArray());
		else
			return pPtr.toArray();
	},
	CtxExportPrivateKeyPFXContainer: function(privateKeyContext,
		password, exportCerts, trustedKeyIDs, keyIDs, asBase64String) {
		var pPtr = EUPointerArray(
			privateKeyContext.GetContext());
		var error;

		var trustedKeyIDsArray = [];
		for (var i = 0; i < trustedKeyIDs.length; i++) {
			trustedKeyIDsArray.push(IntFromBool(exportCerts));
		}
		
		try {
			var trustedKeyIDsPtr = 
				EUPointerIntArray(trustedKeyIDsArray);
			error = Module.ccall('EUCtxExportPrivateKeyPFXContainer',
				'number',
				['number', 'array', 'number', 'number', 'number', 
					'array', 'number', 'number'],
				[privateKeyContext.GetContext(), 
					UTF8ToCP1251Array(password),
					IntFromBool(exportCerts),
					keyIDs.length,
					trustedKeyIDsPtr.ptr,
					intArrayFromStrings(keyIDs),
					pPtr.ptr, pPtr.lengthPtr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			pPtr.free();
			this.RaiseError(error);
		}

		if (asBase64String)
			return this.Base64Encode(pPtr.toArray());
		else
			return pPtr.toArray();
	},
	CtxGetCertificateFromPrivateKey: function(
		privateKeyContext, keyID) {
		var pCertInfoExPtr = EUPointer();
		var certArrPtr = EUPointerArray(
			privateKeyContext.GetContext());
		var error;

		try {
			error = Module.ccall('EUCtxGetCertificateFromPrivateKey',
				'number',
				['number', 'array',
					'number', 'number', 'number'],
				[privateKeyContext.GetContext(), 
					UTF8ToCP1251Array(password),
					pCertInfoExPtr.ptr, 
					certArrPtr.ptr, certArrPtr.lengthPtr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			pCertInfoExPtr.free();
			certArrPtr.free();

			this.RaiseError(error);
		}

		var certInfoExPtr, certInfoEx;

		certInfoExPtr = pCertInfoExPtr.toPtr();
		certInfoEx = new EndUserCertificateInfoEx(certInfoExPtr);
		Module._EUCtxFreeCertificateInfoEx(
			privateKeyContext.GetContext()|0, certInfoExPtr);

		return EndUserCertificate(certInfoEx, certArrPtr.toArray());
	},
//-----------------------------------------------------------------------------
	HashData: function(data, asBase64String) {
		if ((typeof data) == 'string')
			data = this.StringToArray(data);

		this.CheckMaxDataSize(data);

		var pPtr = asBase64String ? 
			EUPointer() : EUPointerArray();
		var error;

		try {
			error = Module.ccall('EUHashData',
				'number',
				['array', 'number', 'number', 'number', 'number'],
				[data, data.length, 
					asBase64String ? pPtr.ptr : 0,
					!asBase64String ? pPtr.ptr : 0,
					!asBase64String ? pPtr.lengthPtr : 0]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}
		
		if (error != EU_ERROR_NONE) {
			pPtr.free();
			this.RaiseError(error);
		}
		
		if (asBase64String)
			return pPtr.toString();
		else 
			return pPtr.toArray();
	},
	CtxHashData: function(context, hashAlgo, 
		certificate, data, asBase64String) {
		if ((typeof data) == 'string')
			data = this.StringToArray(data);

		if (certificate != null)
			this.CheckMaxDataSize(certificate);
		this.CheckMaxDataSize(data);

		var pPtr = EUPointerArray(context.GetContext());
		var error;

		try {
			error = Module.ccall('EUCtxHashData',
				'number',
				['number', 'number', 'array', 'number', 
					'array', 'number', 'number', 'number'],
				[context.GetContext(), hashAlgo, 
					(certificate != null) ? certificate : 0,
					(certificate != null) ? certificate.length : 0,
					data, data.length, pPtr.ptr, pPtr.lengthPtr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			pPtr.free();
			this.RaiseError(error);
		}

		if (asBase64String)
			return this.Base64Encode(pPtr.toArray());
		else
			return pPtr.toArray();
	},
	CtxHashDataBegin: function(context, hashAlgo, certificate) {
		if (certificate != null)
			this.CheckMaxDataSize(certificate);

		var hashCtxPtr = EUPointer();
		var error;

		try {
			error = Module.ccall('EUCtxHashDataBegin',
				'number',
				['number', 'number', 'array', 'number', 'number'],
				[context.GetContext(), hashAlgo, 
					(certificate != null) ? certificate : 0,
					(certificate != null) ? certificate.length : 0,
					hashCtxPtr.ptr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			hashCtxPtr.free();
			this.RaiseError(error);
		}

		return EndUserHashContext(hashCtxPtr.toPtr());
	},
	CtxHashDataContinue: function(hashContext, data) {
		if ((typeof data) == 'string')
			data = this.StringToArray(data);

		this.CheckMaxDataSize(data);

		var error;

		try {
			error = Module.ccall('EUCtxHashDataContinue',
				'number',
				['number', 'array', 'number'],
				[hashContext.GetContext(), data, data.length]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			this.RaiseError(error);
		}
	},
	CtxHashDataEnd: function(hashContext, asBase64String) {
		var pPtr = EUPointerArray(hashContext.GetContext());
		var error;

		try {
			error = Module.ccall('EUCtxHashDataEnd',
				'number',
				['number', 'number', 'number'],
				[hashContext.GetContext(), pPtr.ptr, pPtr.lengthPtr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			pPtr.free();
			this.RaiseError(error);
		}

		if (asBase64String)
			return this.Base64Encode(pPtr.toArray());
		else
			return pPtr.toArray();
	},
	CtxFreeHash: function(hashContext) {
		try {
			Module._EUCtxFreeHash(hashContext.GetContext()|0);
		} catch (e) {
		}
	},
//-----------------------------------------------------------------------------
	IsDataInSignedDataAvailable: function(sign) {
		this.CheckMaxDataSize(sign);

		var isSignStr = ((typeof sign) == 'string');
		var intPtr = EUPointerInt();
		var error;

		try {
			error = Module.ccall('EUIsDataInSignedDataAvailable',
				'number',
				['string', 'array', 'number', 'number'],
				[isSignStr ? sign : 0,
					!isSignStr ? sign : 0,
					!isSignStr ? sign.length : 0,
					intPtr.ptr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}
		
		if (error != EU_ERROR_NONE) {
			intPtr.free();
			this.RaiseError(error);
		}

		return intPtr.toBoolean();
	},
	GetDataFromSignedData: function(signedData) {
		this.CheckMaxDataSize(signedData);

		var isSignStr = ((typeof signedData) == 'string');
		var arrPtr = EUPointerArray();
		var error;

		try {
			error = Module.ccall('EUGetDataFromSignedData',
				'number',
				['string', 'array', 'number', 'number', 'number'],
				[isSignStr ? signedData : 0,
					!isSignStr ? signedData : 0,
					!isSignStr ? signedData.length : 0, 
					arrPtr.ptr, arrPtr.lengthPtr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}
		
		if (error != EU_ERROR_NONE) {
			arrPtr.free();
			this.RaiseError(error);
		}

		return arrPtr.toArray();
	},
	SignData: function(data, asBase64String) {
		if ((typeof data) == 'string')
			data = this.StringToArray(data);

		this.CheckMaxDataSize(data);

		var pPtr = asBase64String ? 
			EUPointer() : EUPointerArray();
		var error;

		try {
			error = Module.ccall('EUSignData',
				'number',
				['array', 'number', 'number', 'number', 'number'],
				[data, data.length, 
					asBase64String ? pPtr.ptr : 0,
					!asBase64String ? pPtr.ptr : 0,
					!asBase64String ? pPtr.lengthPtr : 0]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}
		
		if (error != EU_ERROR_NONE) {
			pPtr.free();
			this.RaiseError(error);
		}

		if (asBase64String)
			return pPtr.toString();
		else 
			return pPtr.toArray();
	},
	VerifyData: function(data, sign) {
		if ((typeof data) == 'string')
			data = this.StringToArray(data);

		this.CheckMaxDataSize(data);
		this.CheckMaxDataSize(sign);

		var isSignStr = ((typeof sign) == 'string');
		var infoPtr = EUPointerSignerInfo();
		var error;

		try {
			error = Module.ccall('EUVerifyData',
				'number',
				['array', 'number', 'string', 'array', 'number', 'number'],
				[data, data.length,
					isSignStr ? sign : 0,
					!isSignStr ? sign : 0,
					!isSignStr ? sign.length : 0,
					infoPtr.ptr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}
		
		if (error != EU_ERROR_NONE) {
			infoPtr.free();
			this.RaiseError(error);
		}

		var info = new EndUserSignInfo(infoPtr.ptr, data);
		infoPtr.free();

		return info;
	},
	SignDataInternal: function(appendCert, data, asBase64String) {
		if ((typeof data) == 'string')
			data = this.StringToArray(data);

		this.CheckMaxDataSize(data);

		var pPtr = asBase64String ? 
			EUPointer() : EUPointerArray();
		var error;

		try {
			error = Module.ccall('EUSignDataInternal',
				'number',
				['number', 'array', 'number', 'number', 'number', 'number'],
				[IntFromBool(appendCert),
					data, data.length, 
					asBase64String ? pPtr.ptr : 0,
					!asBase64String ? pPtr.ptr : 0,
					!asBase64String ? pPtr.lengthPtr : 0]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}
		
		if (error != EU_ERROR_NONE) {
			pPtr.free();
			this.RaiseError(error);
		}

		if (asBase64String)
			return pPtr.toString();
		else 
			return pPtr.toArray();
	},
	VerifyDataInternal: function(sign) {
		this.CheckMaxDataSize(sign);

		var isSignStr = ((typeof sign) == 'string');
		var infoPtr = EUPointerSignerInfo();
		var arrPtr = EUPointerArray();
		var error;

		try {
			error = Module.ccall('EUVerifyDataInternal',
				'number',
				['string', 'array', 'number', 'number', 'number', 'number'],
				[isSignStr ? sign : 0,
					!isSignStr ? sign : 0,
					!isSignStr ? sign.length : 0, 
					arrPtr.ptr, arrPtr.lengthPtr, infoPtr.ptr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}
		
		if (error != EU_ERROR_NONE) {
			infoPtr.free();
			arrPtr.free();
			this.RaiseError(error);
		}

		var info = new EndUserSignInfo(infoPtr.ptr, arrPtr.toArray());
		infoPtr.free();

		return info;
	},
	SignHash: function (hash, asBase64String) {
		this.CheckMaxDataSize(hash);

		var isHashStr = ((typeof hash) == 'string');
		var pPtr = asBase64String ? 
			EUPointer() : EUPointerArray();
		var error;

		try {
			error = Module.ccall('EUSignHash',
				'number',
				['string', 'array', 'number', 'number', 'number', 'number'],
				[isHashStr ? hash : 0, 
					!isHashStr ? hash : 0, 
					!isHashStr ? hash.length : 0, 
					asBase64String ? pPtr.ptr : 0,
					!asBase64String ? pPtr.ptr : 0,
					!asBase64String ? pPtr.lengthPtr : 0]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			pPtr.free();
			this.RaiseError(error);
		}

		if (asBase64String)
			return pPtr.toString();
		else 
			return pPtr.toArray();
	},
	VerifyHash: function (hash, sign) {
		this.CheckMaxDataSize(hash);
		this.CheckMaxDataSize(sign);

		var isHashStr = ((typeof hash) == 'string');
		var isSignStr = ((typeof sign) == 'string');
		var infoPtr = EUPointerSignerInfo();
		var error;

		try {
			error = Module.ccall('EUVerifyHash',
				'number',
				['string', 'array', 'number',
					'string', 'array', 'number', 'number'],
				[isHashStr ? hash : 0, 
					!isHashStr ? hash : 0, 
					!isHashStr ? hash.length : 0,
					isSignStr ? sign : 0,
					!isSignStr ? sign : 0,
					!isSignStr ? sign.length : 0,
					infoPtr.ptr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}
		
		if (error != EU_ERROR_NONE) {
			infoPtr.free();
			this.RaiseError(error);
		}

		var info = new EndUserSignInfo(infoPtr.ptr, null);
		infoPtr.free();

		return info;
	},
	SignDataRSA: function(data, appendCert, 
		externalSgn, asBase64String) {
		if ((typeof data) == 'string')
			data = this.StringToArray(data);

		this.CheckMaxDataSize(data);

		var pPtr = asBase64String ? 
			EUPointer() : EUPointerArray();
		var error;

		try {
			error = Module.ccall('EUSignDataRSA',
				'number',
				['array', 'number', 'number', 'number', 
				 'number', 'number', 'number'],
				[data, data.length, 
					IntFromBool(appendCert),
					IntFromBool(externalSgn),
					asBase64String ? pPtr.ptr : 0,
					!asBase64String ? pPtr.ptr : 0,
					!asBase64String ? pPtr.lengthPtr : 0]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}
		
		if (error != EU_ERROR_NONE) {
			pPtr.free();
			this.RaiseError(error);
		}

		if (asBase64String)
			return pPtr.toString();
		else 
			return pPtr.toArray();
	},
	IsDataInSignedFileAvailable: function(signedFile, onSuccess, onError) {
		var pThis = this;

		if (pThis.isFileSyncAPISupported) {
			if (!EUFS.link(signedFile)) {
				onError(pThis.MakeError(EU_ERROR_JS_READ_FILE));
				return;
			}

			var intPtr = EUPointerInt();
			var error;

			try {
				error = Module.ccall('EUIsDataInSignedFileAvailable',
					'number',
					['string', 'number'],
					[EUFS.getFilePath(signedFile), intPtr.ptr]);
			} catch (e) {
				error = EU_ERROR_UNKNOWN;
			}

			if (error != EU_ERROR_NONE) {
				intPtr.free();
				EUFS.unlink(signedFile);

				onError(pThis.MakeError(error));
				return;
			}

			EUFS.unlink(signedFile);

			onSuccess(intPtr.toBoolean());
		} else {
			var _onSuccess = function(fileReaded) {
				try {
					var isAvailable = pThis.IsDataInSignedDataAvailable(
						fileReaded.data);
					onSuccess(isAvailable);
				} catch (e) {
					onError(e);
				}
			};

			pThis.ReadFile(signedFile, _onSuccess, onError);
		}
	},
	GetDataFromSignedFile: function(signedFile, onSuccess, onError) {
		var pThis = this;

		if (pThis.isFileSyncAPISupported) {
			var file = signedFile.name + (new Date()).toString();

			if (!EUFS.link(signedFile)) {
				onError(pThis.MakeError(EU_ERROR_JS_READ_FILE));
				return;
			} 

			if (!EUFS.link(file)) {
				EUFS.unlink(signedFile);

				onError(pThis.MakeError(EU_ERROR_JS_READ_FILE));
				return;
			} 

			var error;

			try {
				error = Module.ccall('EUGetDataFromSignedFile',
					'number',
					['string', 'string'],
					[EUFS.getFilePath(signedFile), EUFS.getFilePath(file)]);
			} catch (e) {
				error = EU_ERROR_UNKNOWN;
			}

			if (error != EU_ERROR_NONE) {
				EUFS.unlink(file);
				EUFS.unlink(signedFile);

				onError(pThis.MakeError(error));
				return;
			}

			var data = EUFS.readFileAsUint8Array(file);

			EUFS.unlink(file);
			EUFS.unlink(signedFile);

			onSuccess(data);
		} else {
			var _onSuccess = function(fileReaded) {
				try {
					var data = pThis.GetDataFromSignedData(
						fileReaded.data);

					onSuccess(data);
				} catch (e) {
					onError(e);
				}
			};

			pThis.ReadFile(signedFile, _onSuccess, onError);
		}
	},
	VerifyFileWithExternalSign: function(file, fileWithSign, onSuccess, onError) {
		var pThis = this;

		if (pThis.isFileSyncAPISupported) {
			if (!EUFS.link(file)) {
				onError(pThis.MakeError(EU_ERROR_JS_READ_FILE));
				return;
			}

			if (!EUFS.link(fileWithSign)) {
				EUFS.unlink(file);

				onError(pThis.MakeError(EU_ERROR_JS_READ_FILE));
				return;
			}

			var infoPtr = EUPointerSignerInfo();
			var error;

			try {
				error = Module.ccall('EUVerifyFile',
					'number',
					['string', 'string', 'number'],
					[EUFS.getFilePath(fileWithSign), 
						EUFS.getFilePath(file), infoPtr.ptr]);
			} catch (e) {
				error = EU_ERROR_UNKNOWN;
			}

			if (error != EU_ERROR_NONE) {
				EUFS.unlink(fileWithSign);
				EUFS.unlink(file);

				onError(pThis.MakeError(error));
				return;
			}

			EUFS.unlink(fileWithSign);
			EUFS.unlink(file);

			var info = new EndUserSignInfo(infoPtr.ptr, null);
			infoPtr.free();

			onSuccess(info);
		} else {
			var _onSuccess= function(files) {
				try {
					var info = pThis.VerifyData(
						files[0].data, files[1].data);
					info.data = null;

					onSuccess(info);
				} catch (e) {
					onError(e);
				}
			};

			pThis.ReadFiles([file, fileWithSign], 
				_onSuccess, onError);
		}
	},
	VerifyFileWithInternalSign: function(signedFile, dataFile, onSuccess, onError) {
		var pThis = this;

		if (pThis.isFileSyncAPISupported) {
			var file;

			file = (dataFile != null) ? 
				dataFile : 
				(signedFile.name + (new Date()).toString());

			if (!EUFS.link(file, (dataFile == null))) {
				onError(pThis.MakeError(EU_ERROR_JS_READ_FILE));
				return;
			}

			if (!EUFS.link(signedFile)) {
				EUFS.unlink(file);

				onError(pThis.MakeError(EU_ERROR_JS_READ_FILE));
				return;
			}

			var infoPtr = EUPointerSignerInfo();
			var error;

			try {
				error = Module.ccall('EUVerifyFile',
					'number',
					['string', 'string', 'number'],
					[EUFS.getFilePath(signedFile),
						EUFS.getFilePath(file), infoPtr.ptr]);
			} catch (e) {
				error = EU_ERROR_UNKNOWN;
			}

			if (error != EU_ERROR_NONE) {
				EUFS.unlink(signedFile);
				EUFS.unlink(file);

				onError(pThis.MakeError(error));
				return;
			}

			var data = (dataFile != null) ?
				EUFS.readFileAsUint8Array(file) :
				null;

			EUFS.unlink(file);
			EUFS.unlink(signedFile);

			var info = new EndUserSignInfo(infoPtr.ptr, data);
			infoPtr.free();

			onSuccess(info);
		} else {
			var _onSuccess = function(fileReaded) {
				try {
					var info = pThis.VerifyDataInternal(fileReaded.data);
					
					if (dataFile == null)
						info.data = null;

					onSuccess(info);
				} catch (e) {
					onError(e);
				}
			};

			pThis.ReadFile(signedFile, _onSuccess, onError);
		}
	},
	CreateEmptySign: function (data, asBase64String) {
		if (isInternalSign)
			this.CheckMaxDataSize(data);

		var isInternalSign = (data != null);
		if (isInternalSign) {
			if ((typeof data) == 'string')
				data = this.StringToArray(data);
		}

		var signPtr = asBase64String ? 
			EUPointer() : EUPointerArray();
		var error;

		try {
			error = Module.ccall('EUCreateEmptySign',
				'number',
				['array','number',
					'number', 'number', 'number'],
				[isInternalSign ? data : 0, 
					isInternalSign ? data.length : 0,
					asBase64String ? signPtr.ptr : 0,
					!asBase64String ? signPtr.ptr : 0,
					!asBase64String ? signPtr.lengthPtr : 0]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}
		
		if (error != EU_ERROR_NONE) {
			signPtr.free();
			this.RaiseError(error);
		}

		if (asBase64String)
			return signPtr.toString();
		else
			return signPtr.toArray();
	},
	CreateSigner: function (hash, asBase64String) {
		this.CheckMaxDataSize(hash);

		var isHashStr = ((typeof hash) == 'string');
		var signerPtr = asBase64String ? 
			EUPointer() : EUPointerArray();
		var error;

		try {
			error = Module.ccall('EUCreateSigner',
				'number',
				['string', 'array','number',
					'number', 'number', 'number'],
				[isHashStr ? hash : 0, 
					!isHashStr ? hash : 0,
					!isHashStr ? hash.length : 0,
					asBase64String ? signerPtr.ptr : 0,
					!asBase64String ? signerPtr.ptr : 0,
					!asBase64String ? signerPtr.lengthPtr : 0]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}
		
		if (error != EU_ERROR_NONE) {
			signerPtr.free();
			this.RaiseError(error);
		}

		if (asBase64String)
			return signerPtr.toString();
		else
			return signerPtr.toArray();
	},
	AppendSigner: function (signer, certificate, prevSign, asBase64String) {
		this.CheckMaxDataSize(signer);
		if (certificate != null)
			this.CheckMaxDataSize(certificate);
		this.CheckMaxDataSize(prevSign);

		var isSignerStr = ((typeof signer) == 'string');
		var isPrevSignStr = ((typeof prevSign) == 'string');
		var signPtr = asBase64String ? 
			EUPointer() : EUPointerArray();

		try {
			error = Module.ccall('EUAppendSigner',
				'number',
				['string', 'array', 'number',
					'array', 'number', 
					'string', 'array', 'number',
					'number', 'number', 'number'],
				[isSignerStr ? signer : 0, 
					!isSignerStr ? signer : 0,
					!isSignerStr ? signer.length : 0,
					(certificate != null) ? certificate : 0,
					(certificate != null) ? certificate.length : 0,
					isPrevSignStr ? prevSign : 0, 
					!isPrevSignStr ? prevSign : 0,
					!isPrevSignStr ? prevSign.length : 0,
					asBase64String ? signPtr.ptr : 0,
					!asBase64String ? signPtr.ptr : 0,
					!asBase64String ? signPtr.lengthPtr : 0]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			signPtr.free();
			this.RaiseError(error);
		}

		if (asBase64String)
			return signPtr.toString();
		else
			return signPtr.toArray();
	},
	RawSignData: function(data, asBase64String) {
		if ((typeof data) == 'string')
			data = this.StringToArray(data);

		this.CheckMaxDataSize(data);

		var pPtr = asBase64String ? 
			EUPointer() : EUPointerArray();
		var error;

		try {
			error = Module.ccall('EURawSignData',
				'number',
				['array', 'number', 'number', 'number', 'number'],
				[data, data.length, 
					asBase64String ? pPtr.ptr : 0,
					!asBase64String ? pPtr.ptr : 0,
					!asBase64String ? pPtr.lengthPtr : 0]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			pPtr.free();
			this.RaiseError(error);
		}

		if (asBase64String)
			return pPtr.toString();
		else 
			return pPtr.toArray();
	},
	RawVerifyDataEx: function(cert, data, sign) {
		if ((typeof data) == 'string')
			data = this.StringToArray(data);

		if (cert != null)
			this.CheckMaxDataSize(cert);

		this.CheckMaxDataSize(data);
		this.CheckMaxDataSize(sign);

		var isSignStr = ((typeof sign) == 'string');
		var infoPtr = EUPointerSignerInfo();
		var error;

		try {
			error = Module.ccall('EURawVerifyDataEx',
				'number',
				['array', 'number', 'array', 'number', 
					'string', 'array', 'number', 'number'],
				[(cert != null) ? cert : 0,
					(cert != null) ? cert.length : 0, 
					data, data.length,
					isSignStr ? sign : 0,
					!isSignStr ? sign : 0,
					!isSignStr ? sign.length : 0,
					infoPtr.ptr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			infoPtr.free();
			this.RaiseError(error);
		}

		var info = new EndUserSignInfo(infoPtr.ptr, data);
		infoPtr.free();

		return info;
	},
	RawSignHash: function (hash, asBase64String) {
		this.CheckMaxDataSize(hash);

		var isHashStr = ((typeof hash) == 'string');
		var pPtr = asBase64String ? 
			EUPointer() : EUPointerArray();
		var error;

		try {
			error = Module.ccall('EURawSignHash',
				'number',
				['string', 'array', 'number', 
					'number', 'number', 'number'],
				[isHashStr ? hash : 0, 
					!isHashStr ? hash : 0, 
					!isHashStr ? hash.length : 0, 
					asBase64String ? pPtr.ptr : 0,
					!asBase64String ? pPtr.ptr : 0,
					!asBase64String ? pPtr.lengthPtr : 0]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			pPtr.free();
			this.RaiseError(error);
		}

		if (asBase64String)
			return pPtr.toString();
		else 
			return pPtr.toArray();
	},
	RawVerifyHash: function (hash, sign) {
		this.CheckMaxDataSize(hash);
		this.CheckMaxDataSize(sign);

		var isHashStr = ((typeof hash) == 'string');
		var isSignStr = ((typeof sign) == 'string');
		var infoPtr = EUPointerSignerInfo();
		var error;

		try {
			error = Module.ccall('EURawVerifyHash',
				'number',
				['string', 'array', 'number',
					'string', 'array', 'number', 'number'],
				[isHashStr ? hash : 0, 
					!isHashStr ? hash : 0, 
					!isHashStr ? hash.length : 0,
					isSignStr ? sign : 0,
					!isSignStr ? sign : 0,
					!isSignStr ? sign.length : 0,
					infoPtr.ptr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}
		
		if (error != EU_ERROR_NONE) {
			infoPtr.free();
			this.RaiseError(error);
		}

		var info = new EndUserSignInfo(infoPtr.ptr, null);
		infoPtr.free();

		return info;
	},
	CtxSignHash: function (privateKeyContext, signAlgo, 
		hashContext, appendCert, asBase64String) {
		var pPtr = EUPointerArray(
			privateKeyContext.GetContext());
		var error;

		try {
			error = Module.ccall('EUCtxSignHash',
				'number',
				['number', 'number', 'number', 'number',
					'number', 'number'],
				[privateKeyContext.GetContext(), signAlgo,
					hashContext.GetContext(), 
					IntFromBool(appendCert),
					pPtr.ptr, pPtr.lengthPtr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			pPtr.free();
			this.RaiseError(error);
		}

		if (asBase64String)
			return this.Base64Encode(pPtr.toArray());
		else 
			return pPtr.toArray();
	},
	CtxVerifyHash: function (hashContext, signIndex, sign) {
		this.CheckMaxDataSize(sign);

		if ((typeof sign) == 'string')
			sign = this.Base64Decode(sign);

		var infoPtr = EUPointerSignerInfo(
			hashContext.GetContext());
		var error;

		try {
			error = Module.ccall('EUCtxVerifyHash',
				'number',
				['number', 'number', 'array', 'number', 'number'],
				[hashContext.GetContext(), signIndex,
					sign, sign.length, infoPtr.ptr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}
		
		if (error != EU_ERROR_NONE) {
			infoPtr.free();
			this.RaiseError(error);
		}

		var info = new EndUserSignInfo(infoPtr.ptr, null);
		infoPtr.free();

		return info;
	},
	CtxSignHashValue: function (privateKeyContext, signAlgo, 
		hash, appendCert, asBase64String) {
		if ((typeof hash) == 'string')
			hash = this.Base64Decode(hash);

		var pPtr = EUPointerArray(
			privateKeyContext.GetContext());
		var error;

		try {
			error = Module.ccall('EUCtxSignHashValue',
				'number',
				['number', 'number', 'array', 'number', 'number',
					'number', 'number'],
				[privateKeyContext.GetContext(), signAlgo,
					hash, hash.length, IntFromBool(appendCert),
					pPtr.ptr, pPtr.lengthPtr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			pPtr.free();
			this.RaiseError(error);
		}

		if (asBase64String)
			return this.Base64Encode(pPtr.toArray());
		else 
			return pPtr.toArray();
	},
	CtxVerifyHashValue: function (context, hash, signIndex, sign) {
		this.CheckMaxDataSize(hash);
		this.CheckMaxDataSize(sign);

		if ((typeof hash) == 'string')
			hash = this.Base64Decode(hash);

		if ((typeof sign) == 'string')
			sign = this.Base64Decode(sign);

		var infoPtr = EUPointerSignerInfo(context.GetContext());
		var error;

		try {
			error = Module.ccall('EUCtxVerifyHashValue',
				'number',
				['number', 'array', 'number', 'number',
					'array', 'number', 'number'],
				[context.GetContext(), hash, hash.length, signIndex,
					sign, sign.length, infoPtr.ptr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}
		
		if (error != EU_ERROR_NONE) {
			infoPtr.free();
			this.RaiseError(error);
		}

		var info = new EndUserSignInfo(infoPtr.ptr, null);
		infoPtr.free();

		return info;
	},
	CtxSignData: function(privateKeyContext, signAlgo, 
		data, external, appendCert, asBase64String) {
		if ((typeof data) == 'string')
			data = this.StringToArray(data);

		this.CheckMaxDataSize(data);

		var pPtr = EUPointer(
			privateKeyContext.GetContext());
		var error;

		try {
			error = Module.ccall('EUCtxSignData',
				'number',
				['number', 'number', 'array', 'number',
					'number', 'number', 'number', 'number'],
				[privateKeyContext.GetContext(), signAlgo,
					data, data.length, IntFromBool(external),
					IntFromBool(appendCert),
					pPtr.ptr, pPtr.lengthPtr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			pPtr.free();
			this.RaiseError(error);
		}

		if (asBase64String)
			return this.Base64Encode(pPtr.toArray());
		else 
			return pPtr.toArray();
	},
	CtxVerifyData: function(context, data, signIndex, sign) {
		if ((typeof data) == 'string')
			data = this.StringToArray(data);

		this.CheckMaxDataSize(data);
		this.CheckMaxDataSize(sign);

		if ((typeof sign) == 'string')
			sign = this.Base64Decode(sign);

		var infoPtr = EUPointerSignerInfo(context.GetContext());
		var error;

		try {
			error = Module.ccall('EUCtxVerifyData',
				'number',
				['number', 'array', 'number', 
					'number', 'array', 'number', 'number'],
				[context.GetContext(), data, data.length,
					signIndex, sign, sign.length,
					infoPtr.ptr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}
		
		if (error != EU_ERROR_NONE) {
			infoPtr.free();
			this.RaiseError(error);
		}

		var info = new EndUserSignInfo(infoPtr.ptr, data);
		infoPtr.free();

		return info;
	},
	CtxVerifyDataInternal: function(context, signIndex, sign) {
		this.CheckMaxDataSize(sign);

		if ((typeof sign) == 'string')
			sign = this.Base64Decode(sign);

		var arrPtr = EUPointerArray(context.GetContext());
		var infoPtr = EUPointerSignerInfo(context.GetContext());
		var error;

		try {
			error = Module.ccall('EUCtxVerifyDataInternal',
				'number',
				['number', 'number', 'array', 'number',
					'number', 'number', 'number'],
				[context.GetContext(), signIndex, sign, sign.length,
					arrPtr.ptr, arrPtr.lengthPtr, infoPtr.ptr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}
		
		if (error != EU_ERROR_NONE) {
			arrPtr.free();
			infoPtr.free();
			this.RaiseError(error);
		}

		var info = new EndUserSignInfo(infoPtr.ptr, arrPtr.toArray());
		infoPtr.free();

		return info;
	},
	CtxIsAlreadySigned: function(privateKeyContext, signAlgo, sign) {
		this.CheckMaxDataSize(sign);

		if ((typeof sign) == 'string')
			sign = this.Base64Decode(sign);

		var intPtr = EUPointerInt();
		var error;

		try {
			error = Module.ccall('EUCtxIsAlreadySigned',
				'number',
				['number', 'number', 'array', 'number', 'number'],
				[privateKeyContext.GetContext(), signAlgo,
					sign, sign.length, intPtr.ptr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			intPtr.free();
			this.RaiseError(error);
		}

		return intPtr.toBoolean();
	},
	CtxAppendSignHash: function (privateKeyContext, signAlgo, 
		hashContext, previousSign, appendCert, asBase64String) {
		this.CheckMaxDataSize(previousSign);

		if ((typeof previousSign) == 'string')
			previousSign = this.Base64Decode(previousSign);

		var pPtr = EUPointerArray(
			privateKeyContext.GetContext());
		var error;

		try {
			error = Module.ccall('EUCtxAppendSignHash',
				'number',
				['number', 'number', 'number', 'array', 'number',
					'number', 'number', 'number'],
				[privateKeyContext.GetContext(), signAlgo,
					hashContext.GetContext(),
					previousSign, previousSign.length,
					IntFromBool(appendCert),
					pPtr.ptr, pPtr.lengthPtr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			pPtr.free();
			this.RaiseError(error);
		}

		if (asBase64String)
			return this.Base64Encode(pPtr.toArray());
		else 
			return pPtr.toArray();
	},
	CtxAppendSignHashValue: function (privateKeyContext, signAlgo, 
		hash, previousSign, appendCert, asBase64String) {
		this.CheckMaxDataSize(hash);
		this.CheckMaxDataSize(previousSign);

		if ((typeof hash) == 'string')
			hash = this.Base64Decode(hash);

		if ((typeof previousSign) == 'string')
			previousSign = this.Base64Decode(previousSign);

		var pPtr = EUPointerArray(privateKeyContext.GetContext());
		var error;

		try {
			error = Module.ccall('EUCtxAppendSignHashValue',
				'number',
				['number', 'number', 'array', 'number', 
					'array', 'number', 'number', 'number', 'number'],
				[privateKeyContext.GetContext(), signAlgo,
					hash, hash.length, 
					previousSign, previousSign.length, 
					IntFromBool(appendCert),
					pPtr.ptr, pPtr.lengthPtr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			pPtr.free();
			this.RaiseError(error);
		}

		if (asBase64String)
			return this.Base64Encode(pPtr.toArray());
		else 
			return pPtr.toArray();
	},
	CtxAppendSign: function(privateKeyContext, signAlgo, 
		data, previousSign, appendCert, asBase64String) {
		if ((data != null) && (typeof data) == 'string')
			data = this.StringToArray(data);

		if (data != null)
			this.CheckMaxDataSize(data);
		this.CheckMaxDataSize(previousSign);

		if ((typeof previousSign) == 'string')
			previousSign = this.Base64Decode(previousSign);

		var pPtr = EUPointer(privateKeyContext.GetContext());
		var error;

		try {
			error = Module.ccall('EUCtxAppendSign',
				'number',
				['number', 'number', 'array', 'number',
					'array', 'number', 'number', 'number', 'number'],
				[privateKeyContext.GetContext(), signAlgo,
					(data != null) ? data : 0,
					(data != null) ? data.length : 0,
					previousSign, previousSign.length,
					IntFromBool(appendCert),
					pPtr.ptr, pPtr.lengthPtr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			pPtr.free();
			this.RaiseError(error);
		}

		if (asBase64String)
			return this.Base64Encode(pPtr.toArray());
		else 
			return pPtr.toArray();
	},
	CtxCreateEmptySign: function(context, signAlgo, 
		data, certificate, asBase64String) {
		if ((data != null) && (typeof data) == 'string')
			data = this.StringToArray(data);

		if (data != null)
			this.CheckMaxDataSize(data);
		this.CheckMaxDataSize(certificate);

		var pPtr = EUPointer(context.GetContext());
		var error;

		try {
			error = Module.ccall('EUCtxCreateEmptySign',
				'number',
				['number', 'number', 'array', 'number',
					'array', 'number', 'number', 'number'],
				[context.GetContext(), signAlgo,
					(data != null) ? data : 0,
					(data != null) ? data.length : 0,
					certificate, certificate.length,
					pPtr.ptr, pPtr.lengthPtr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			pPtr.free();
			this.RaiseError(error);
		}

		if (asBase64String)
			return this.Base64Encode(pPtr.toArray());
		else 
			return pPtr.toArray();
	},
	CtxCreateSigner: function(privateKeyContext, signAlgo, 
		hash, asBase64String) {
		this.CheckMaxDataSize(hash);

		if ((typeof hash) == 'string')
			hash = this.Base64Decode(hash);

		var pPtr = EUPointer(privateKeyContext.GetContext());
		var error;

		try {
			error = Module.ccall('EUCtxCreateSigner',
				'number',
				['number', 'number', 'array', 'number',
					'number', 'number'],
				[privateKeyContext.GetContext(), signAlgo,
					hash, hash.length,
					pPtr.ptr, pPtr.lengthPtr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			pPtr.free();
			this.RaiseError(error);
		}

		if (asBase64String)
			return this.Base64Encode(pPtr.toArray());
		else 
			return pPtr.toArray();
	},
	CtxAppendSigner: function(context, signAlgo, 
		signer, certificate, previousSign, asBase64String) {
		this.CheckMaxDataSize(signer);
		if (certificate != null)
			this.CheckMaxDataSize(certificate);
		this.CheckMaxDataSize(previousSign);

		if ((typeof signer) == 'string')
			signer = this.Base64Decode(signer);

		if ((typeof previousSign) == 'string')
			previousSign = this.Base64Decode(previousSign);

		var pPtr = EUPointer(context.GetContext());
		var error;

		try {
			error = Module.ccall('EUCtxAppendSigner',
				'number',
				['number', 'number', 'array', 'number',
					'array', 'number', 'array', 'number',
					'number', 'number'],
				[context.GetContext(), signAlgo,
					signer, signer.length,
					(certificate != null) ? certificate : 0,
					(certificate != null) ? certificate.length : 0,
					previousSign, previousSign.length,
					pPtr.ptr, pPtr.lengthPtr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			pPtr.free();
			this.RaiseError(error);
		}

		if (asBase64String)
			return this.Base64Encode(pPtr.toArray());
		else 
			return pPtr.toArray();
	},
	CtxGetSignsCount: function(context, sign) {
		this.CheckMaxDataSize(sign);

		if ((typeof sign) == 'string')
			sign = this.Base64Decode(sign);

		var intPtr = EUPointerDWORD();
		var error;

		try {
			error = Module.ccall('EUCtxGetSignsCount',
				'number',
				['number', 'array', 'number', 'number'],
				[context.GetContext(), sign, sign.length,
					intPtr.ptr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			intPtr.free();
			this.RaiseError(error);
		}

		return intPtr.toNumber();
	},
	CtxGetSignerInfo: function(context, signIndex, sign) {
		this.CheckMaxDataSize(sign);

		if ((typeof sign) == 'string')
			sign = this.Base64Decode(sign);

		var pCertInfoExPtr = EUPointer();
		var certArrPtr = EUPointerArray(context.GetContext());
		var error;

		try {
			error = Module.ccall('EUCtxGetSignerInfo',
				'number',
				['number', 'number', 'array', 'number',
					'number', 'number', 'number'],
				[context.GetContext(), signIndex, sign, sign.length,
					pCertInfoExPtr.ptr, 
					certArrPtr.ptr, certArrPtr.lengthPtr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			pCertInfoExPtr.free();
			certArrPtr.free();

			this.RaiseError(error);
		}

		var certInfoExPtr, certInfoEx;

		certInfoExPtr = pCertInfoExPtr.toPtr();
		certInfoEx = new EndUserCertificateInfoEx(certInfoExPtr);
		Module._EUCtxFreeCertificateInfoEx(
			context.GetContext()|0, certInfoExPtr);

		return EndUserCertificate(certInfoEx, certArrPtr.toArray());
	},
//-----------------------------------------------------------------------------
	EnvelopDataEx: function (recipientCertIssuers, recipientCertSerials, 
		signData, data, asBase64String) {
		if ((typeof data) == 'string')
			data = this.StringToArray(data);

		this.CheckMaxDataSize(data);

		var envDataPtr = asBase64String ? 
			EUPointer() : EUPointerArray();
		var issuers = intArrayFromStrings(recipientCertIssuers);
		var serials = intArrayFromStrings(recipientCertSerials);
		var error;

		try {
			error = Module.ccall('EUEnvelopDataEx',
				'number',
				['array', 'array', 'number', 'array', 'number', 
					'number', 'number', 'number'],
				[issuers, serials, IntFromBool(signData),
					(data != null) ? data : [],
					data != null ? data.length : 0,
					asBase64String ? envDataPtr.ptr : 0,
					!asBase64String ? envDataPtr.ptr : 0,
					!asBase64String ? envDataPtr.lengthPtr : 0]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}
		
		if (error != EU_ERROR_NONE) {
			envDataPtr.free();
			this.RaiseError(error);
		}

		if (asBase64String)
			return envDataPtr.toString();
		else
			return envDataPtr.toArray();
	},
	DevelopData: function(data) {
		this.CheckMaxDataSize(data);

		var isDataStr = ((typeof data) == 'string');
		var devDataPtr = EUPointerArray();
		var infoPtr = EUPointerSenderInfo();
		var error;

		try {
			error = Module.ccall('EUDevelopData',
				'number',
				['string', 'array', 'number', 'number', 'number', 'number'],
				[isDataStr ? data : 0,
					!isDataStr ? data : 0,
					!isDataStr ? data.length : 0,
					devDataPtr.ptr, devDataPtr.lengthPtr, infoPtr.ptr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}
		
		if (error != EU_ERROR_NONE) {
			devDataPtr.free();
			infoPtr.free();
			this.RaiseError(error);
		}

		var info = new EndUserSenderInfo(infoPtr.ptr, devDataPtr.toArray());
		devDataPtr.free();

		return info;
	},
	EnvelopDataToRecipientsWithDynamicKey: function(
		recipientCertificates, signData, appendCert, data, asBase64String) {
		if ((typeof data) == 'string')
			data = this.StringToArray(data);

		this.CheckMaxDataSize(data);

		var envDataPtr = asBase64String ? 
			EUPointer() : EUPointerArray();

		var recipientCertsArray = 
			new EUArrayFromArrayOfArray(recipientCertificates);
		var error;

		try {
			error = Module.ccall('EUEnvelopDataToRecipientsWithDynamicKey',
				'number',
				['number', 'number', 'number', 'number', 'number', 
					'array', 'number', 'number', 'number', 'number'],
				[recipientCertsArray.count,
					recipientCertsArray.arraysPtr,
					recipientCertsArray.arraysLengthPtr,
					IntFromBool(signData),
					IntFromBool(appendCert),
					data, data.length, 
					asBase64String ? envDataPtr.ptr : 0,
					!asBase64String ? envDataPtr.ptr : 0,
					!asBase64String ? envDataPtr.lengthPtr : 0]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}
		
		if (error != EU_ERROR_NONE) {
			recipientCertsArray.free();
			envDataPtr.free();
			this.RaiseError(error);
		}

		recipientCertsArray.free();

		if (asBase64String)
			return envDataPtr.toString();
		else
			return envDataPtr.toArray();
	},
	EnvelopDataRSAEx: function (contentEncAlgoType, 
		recipientCertIssuers, recipientCertSerials, 
		signData, data, asBase64String) {
		if ((typeof data) == 'string')
			data = this.StringToArray(data);

		this.CheckMaxDataSize(data);

		var envDataPtr = asBase64String ? 
			EUPointer() : EUPointerArray();
		var issuers = intArrayFromStrings(recipientCertIssuers);
		var serials = intArrayFromStrings(recipientCertSerials);
		var error;

		try {
			error = Module.ccall('EUEnvelopDataRSAEx',
				'number',
				['number', 'array', 'array', 'number', 'array', 'number', 
					'number', 'number', 'number'],
				[contentEncAlgoType, issuers, serials, IntFromBool(signData),
					(data != null) ? data : [],
					data != null ? data.length : 0,
					asBase64String ? envDataPtr.ptr : 0,
					!asBase64String ? envDataPtr.ptr : 0,
					!asBase64String ? envDataPtr.lengthPtr : 0]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}
		
		if (error != EU_ERROR_NONE) {
			envDataPtr.free();
			this.RaiseError(error);
		}

		if (asBase64String)
			return envDataPtr.toString();
		else
			return envDataPtr.toArray();
	},
	CtxEnvelopData: function (privateKeyContext,
		recipientCertificates, recipientAppendType,
		signData, appendCert, data, asBase64String) {
		if ((typeof data) == 'string')
			data = this.StringToArray(data);

		this.CheckMaxDataSize(data);

		var pPtr = EUPointer(privateKeyContext.GetContext());
		var recipientCertsArray = 
			new EUArrayFromArrayOfArray(recipientCertificates);
		var error;

		try {
			error = Module.ccall('EUCtxEnvelopData',
				'number',
				['number', 'number', 'number', 'number',
					'number', 'number', 'number',
					'array', 'number', 'number', 'number'],
				[privateKeyContext.GetContext(),
					recipientCertsArray.count,
					recipientCertsArray.arraysPtr,
					recipientCertsArray.arraysLengthPtr,
					recipientAppendType, 
					IntFromBool(signData), IntFromBool(appendCert),
					data, data.length, pPtr.ptr, pPtr.lengthPtr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}
		
		if (error != EU_ERROR_NONE) {
			recipientCertsArray.free();
			pPtr.free();
			this.RaiseError(error);
		}

		recipientCertsArray.free();
		
		if (asBase64String)
			return this.Base64Encode(pPtr.toArray());
		else 
			return pPtr.toArray();
	},
	CtxDevelopData: function (privateKeyContext,
		envelopedData, senderCert) {
		this.CheckMaxDataSize(envelopedData);
		if (senderCert != null)
			this.CheckMaxDataSize(senderCert);

		var isEnvDataStr = ((typeof envelopedData) == 'string');
		var devDataPtr = EUPointer(privateKeyContext.GetContext());
		var infoPtr = EUPointerSenderInfo();
		var error;

		try {
			error = Module.ccall('EUCtxDevelopData',
				'number',
				['number', 'string', 'array', 'number', 'array', 'number',
					'number', 'number', 'number'],
				[privateKeyContext.GetContext(),
					isEnvDataStr ? envelopedData : 0,
					!isEnvDataStr ? envelopedData : 0,
					!isEnvDataStr ? envelopedData.length : 0,
					(senderCert != null) ? senderCert : 0,
					(senderCert != null) ? senderCert.length : 0,
					devDataPtr.ptr, devDataPtr.lengthPtr, infoPtr.ptr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}
		
		if (error != EU_ERROR_NONE) {
			devDataPtr.free();
			infoPtr.free();
			this.RaiseError(error);
		}
		
		var info = new EndUserSenderInfo(infoPtr.ptr, devDataPtr.toArray());
		devDataPtr.free();

		return info;
	},
	CtxGetSenderInfo: function(context, envelopedData, recipientCert) {
		this.CheckMaxDataSize(envelopedData);

		if ((typeof envelopedData) == 'string')
			envelopedData = this.Base64Decode(envelopedData);

		var isDynamicKeyPtr = EUPointerInt();
		var pCertInfoExPtr = EUPointer();
		var certArrPtr = EUPointerArray(context.GetContext());
		var error;

		try {
			error = Module.ccall('EUCtxGetSenderInfo',
				'number',
				['number', 'array', 'number', 'array', 'number',
					'number', 'number', 'number', 'number'],
				[context.GetContext(), envelopedData, envelopedData.length,
					recipientCert, recipientCert.length,
					isDynamicKeyPtr.ptr, pCertInfoExPtr.ptr,
					certArrPtr.ptr, certArrPtr.lengthPtr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			isDynamicKeyPtr.free();
			pCertInfoExPtr.free();
			certArrPtr.free();

			this.RaiseError(error);
		}

		var certInfoExPtr, certInfoEx;

		certInfoExPtr = pCertInfoExPtr.toPtr();
		certInfoEx = new EndUserCertificateInfoEx(certInfoExPtr);
		Module._EUCtxFreeCertificateInfoEx(
			context.GetContext()|0, certInfoExPtr);

		return EndUserSenderInfoEx(
			isDynamicKeyPtr.toBoolean(),
			certInfoEx, certArrPtr.toArray());
	},
	CtxGetRecipientsCount: function(context, envelopedData) {
		this.CheckMaxDataSize(envelopedData);

		if ((typeof envelopedData) == 'string')
			envelopedData = this.Base64Decode(envelopedData);

			var intPtr = EUPointerDWORD();
		var error;

		try {
			error = Module.ccall('EUCtxGetRecipientsCount',
				'number',
				['number', 'array', 'number', 'number'],
				[context.GetContext(), envelopedData,
					envelopedData.length, intPtr.ptr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			intPtr.free();

			this.RaiseError(error);
		}

		return intPtr.toNumber();
	},
	CtxGetRecipientInfo: function(context, 
		recipientIndex, envelopedData) {
		this.CheckMaxDataSize(envelopedData);

		if ((typeof envelopedData) == 'string')
			envelopedData = this.Base64Decode(envelopedData);

		var infoTypePtr = EUPointerDWORD();
		var pIssuerPtr = EUPointer(context.GetContext());
		var pSerialPtr = EUPointer(context.GetContext());
		var pPublicKeyIDPtr = EUPointer(context.GetContext());
		var error;

		try {
			error = Module.ccall('EUCtxGetRecipientInfo',
				'number',
				['number', 'number', 'array', 'number',
					'number', 'number', 'number', 'number'],
				[context.GetContext(), recipientIndex,
					envelopedData, envelopedData.length,
					infoTypePtr.ptr,
					pIssuerPtr.ptr, pSerialPtr.ptr,
					pPublicKeyIDPtr.ptr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			infoTypePtr.free();
			pIssuerPtr.free();
			pSerialPtr.free();
			pPublicKeyIDPtr.free();

			this.RaiseError(error);
		}

		return EndUserRecipientInfo(
			infoTypePtr.toNumber(),
			pIssuerPtr.toString(), pSerialPtr.toString(),
			pPublicKeyIDPtr.toString());
	},
//-----------------------------------------------------------------------------
	ClientSessionCreateStep1: function(expireTime) {
		var pPtr = EUPointer();
		var error;

		var dataPtr = EUPointerArray();

		try {
			error = Module.ccall('EUClientSessionCreateStep1',
				'number',
				['number', 'number', 'number', 'number'],
				[expireTime, pPtr.ptr, dataPtr.ptr, dataPtr.lengthPtr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			pPtr.free();
			dataPtr.free();
			this.RaiseError(error);
		}

		return new EndUserSession(pPtr.toPtr(),
			dataPtr.toArray());
	},
	ServerSessionCreateStep1: function(expireTime, clientData) {
		var pPtr = EUPointer();
		var error;

		var dataPtr = EUPointerArray();

		try {
			error = Module.ccall('EUServerSessionCreateStep1',
				'number',
				['number', 'array', 'number', 
					'number', 'number', 'number'],
				[expireTime, clientData, clientData.length, 
					pPtr.ptr, dataPtr.ptr, dataPtr.lengthPtr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			pPtr.free();
			dataPtr.free();
			this.RaiseError(error);
		}

		return new EndUserSession(pPtr.toPtr(),
			dataPtr.toArray());
	},
	ClientSessionCreateStep2: function(session, serverData) {
		var error;

		var dataPtr = EUPointerArray();

		try {
			error = Module.ccall('EUClientSessionCreateStep2',
				'number',
				['number', 'array', 'number', 
					'number', 'number'],
				[session.GetHandle()|0, serverData, serverData.length, 
					dataPtr.ptr, dataPtr.lengthPtr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			dataPtr.free();
			this.RaiseError(error);
		}

		session.SetData(dataPtr.toArray());
	},
	ServerSessionCreateStep2: function(session, clientData) {
		var error;

		try {
			error = Module.ccall('EUServerSessionCreateStep2',
				'number',
				['number', 'array', 'number'],
				[session.GetHandle()|0, 
					clientData, clientData.length]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			this.RaiseError(error);
		}
	},
	SessionClose: function(session) {
		var error = EU_ERROR_NONE;

		try {
			Module.ccall('EUSessionDestroy',
				'number',
				['number'],
				[session.GetHandle()|0]);
			error = EU_ERROR_NONE;
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			this.RaiseError(error);
		}
	},
	SessionIsInitialized: function(session) {
		var isInitialized;
		var error = EU_ERROR_NONE;

		try {
			isInitialized = Module.ccall('EUSessionIsInitialized',
				'number',
				['number'],
				[session.GetHandle()|0]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			this.RaiseError(error);
		}
		
		return (isInitialized != EU_FALSE);
	},
	SessionCheckCertificates: function(session) {
		var error = EU_ERROR_NONE;

		try {
			error = Module.ccall('EUSessionCheckCertificates',
				'number',
				['number'],
				[session.GetHandle()|0]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			this.RaiseError(error);
		}
		
		return true;
	},
	SessionGetPeerCertificateInfo: function(session) {
		var infoPtr = EUPointerCertificateInfo();
		var error;

		try {
			error = Module.ccall('EUSessionGetPeerCertificateInfo',
				'number',
				['number', 'number'],
				[session.GetHandle()|0, infoPtr.ptr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}
		
		if (error != EU_ERROR_NONE) {
			infoPtr.free();
			this.RaiseError(error);
		}

		var info = new EndUserCertificateInfo(infoPtr.ptr);
		infoPtr.free();

		return info;
	},
	SessionSave: function(session) {
		var error;

		var dataPtr = EUPointerArray();

		try {
			error = Module.ccall('EUSessionSave',
				'number',
				['number', 'number', 'number'],
				[session.GetHandle()|0, 
					dataPtr.ptr, dataPtr.lengthPtr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			dataPtr.free();
			this.RaiseError(error);
		}
		
		return dataPtr.toArray();
	},
	SessionLoad: function(sessionData) {
		var pPtr = EUPointer();
		var error;

		try {
			error = Module.ccall('EUSessionLoad',
				'number',
				['array', 'number', 'number'],
				[sessionData, sessionData.length, pPtr.ptr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			pPtr.free();
			this.RaiseError(error);
		}

		return new EndUserSession(pPtr.toPtr(), null);
	},
	ClientDynamicKeySessionCreate: function(
		expireTime, serverCertIssuer, serverCertSerial) {
		var isCertData = arguments.length == 2;

		var pPtr = EUPointer();
		var error;

		var dataPtr = EUPointerArray();

		try {
			error = Module.ccall('EUClientDynamicKeySessionCreate',
				'number',
				['number',
					isCertData ? 'number' : 'array', 
					isCertData ? 'number' : 'array', 
					isCertData ? 'array': 'number', 'number',
					'number', 'number', 'number'],
				[expireTime, 
					isCertData ? 0 : UTF8ToCP1251Array(serverCertIssuer), 
					isCertData ? 0 : UTF8ToCP1251Array(serverCertSerial),
					isCertData ? serverCertIssuer : 0,
					isCertData ? serverCertIssuer.length : 0,
					pPtr.ptr, dataPtr.ptr, dataPtr.lengthPtr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			pPtr.free();
			dataPtr.free();
			this.RaiseError(error);
		}

		return new EndUserSession(pPtr.toPtr(),
			dataPtr.toArray());
	},
	ServerDynamicKeySessionCreate: function(
		expireTime, clientData) {
		var pPtr = EUPointer();
		var error;

		var dataPtr = EUPointerArray();

		try {
			error = Module.ccall('EUServerDynamicKeySessionCreate',
				'number',
				['number', 'array', 'number',
					'number', 'number', 'number'],
				[expireTime, clientData, clientData.length, 
					pPtr.ptr, dataPtr.ptr, dataPtr.lengthPtr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			pPtr.free();
			dataPtr.free();
			this.RaiseError(error);
		}

		return new EndUserSession(pPtr.toPtr(),
			dataPtr.toArray());
	},
	SessionEncrypt: function(session, data, asBase64String) {
		if ((typeof data) == 'string')
			data = this.StringToArray(data);

		this.CheckMaxDataSize(data);

		var pPtr = EUPointerArray();
		var error;

		try {
			error = Module.ccall('EUSessionEncrypt',
				'number',
				['number', 'array', 'number', 'number', 'number'],
				[session.GetHandle()|0,
					data, data.length, pPtr.ptr, pPtr.lengthPtr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}
		
		if (error != EU_ERROR_NONE) {
			pPtr.free();
			this.RaiseError(error);
		}

		if (asBase64String)
			return this.Base64Encode(pPtr.toArray());
		else 
			return pPtr.toArray();
	},
	SessionDecrypt: function(session, encryptedData) {
		if ((typeof encryptedData) == 'string')
			encryptedData = this.Base64Decode(encryptedData);

		this.CheckMaxDataSize(encryptedData);

		var pPtr = EUPointerArray();
		var error;

		try {
			error = Module.ccall('EUSessionDecrypt',
				'number',
				['number', 'array', 'number', 'number', 'number'],
				[session.GetHandle()|0,
					encryptedData, encryptedData.length, 
					pPtr.ptr, pPtr.lengthPtr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}
		
		if (error != EU_ERROR_NONE) {
			pPtr.free();
			this.RaiseError(error);
		}

		return pPtr.toArray();
	},
	SessionEncryptContinue: function(session, data, asBase64String) {
		if ((typeof data) == 'string')
			data = this.StringToArray(data);

		this.CheckMaxDataSize(data);

		var pPtr = EUPointerStaticArray(data);
		var error;

		try {
			error = Module.ccall('EUSessionEncryptContinue',
				'number',
				['number', 'number', 'number'],
				[session.GetHandle()|0, pPtr.ptr, pPtr.lengthPtr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}
		
		if (error != EU_ERROR_NONE) {
			pPtr.free();
			this.RaiseError(error);
		}

		if (asBase64String)
			return this.Base64Encode(pPtr.toArray());
		else 
			return pPtr.toArray();
	},
	SessionDecryptContinue: function(session, encryptedData) {
		if ((typeof encryptedData) == 'string')
			encryptedData = this.Base64Decode(encryptedData);

		this.CheckMaxDataSize(encryptedData);

		var pPtr = EUPointerStaticArray(encryptedData);
		var error;

		try {
			error = Module.ccall('EUSessionDecryptContinue',
				'number',
				['number', 'number', 'number'],
				[session.GetHandle()|0,
					pPtr.ptr, pPtr.lengthPtr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE) {
			pPtr.free();
			this.RaiseError(error);
		}

		return pPtr.toArray();
	},
//-----------------------------------------------------------------------------
	CtxCreate: function() {
		var pPtr = EUPointer();
		var error;

		try {
			error = Module.ccall('EUCtxCreate',
				'number',
				['number'],
				[pPtr.ptr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}
		
		if (error != EU_ERROR_NONE) {
			pPtr.free();
			this.RaiseError(error);
		}
		
		var context = EndUserContext(pPtr.toPtr());

		return context;
	},
	CtxFree: function(context) {
		try {
			Module._EUCtxFree(context.GetContext()|0);
		} catch (e) {
		}
	},
	CtxSetParameter: function(context, name, value) {
		var error;
		var intPtr = EUPointerBool();
		if (typeof value != 'boolean') {
			this.RaiseError(EU_ERROR_BAD_PARAMETER);
		}
		
		try {
			Module.setValue(intPtr.ptr,
				IntFromBool(value) | 0, "i32");

			error = Module.ccall('EUCtxSetParameter',
				'number',
				['number', 'string', 'number', 'number'],
				[context.GetContext()|0, name, intPtr.ptr, EU_BOOL_SIZE]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
			intPtr.free();
		}

		if (error != EU_ERROR_NONE) {
			this.RaiseError(error);
		}

		intPtr.free();
	},
//-----------------------------------------------------------------------------
	ProtectDataByPassword: function(data, password, asBase64String) {
		if ((typeof data) == 'string')
			data = UTF8ToCP1251Array(data);

		this.CheckMaxDataSize(data);

		var protDataPtr = asBase64String ? 
			EUPointer() : EUPointerArray();
		var error;

		try {
			error = Module.ccall('EUProtectDataByPassword',
				'number',
				['array', 'number', 'array',
					'number', 'number', 'number'],
				[data, data.length, 
					(password != null) ? 
						UTF8ToCP1251Array(password) : 0,
					asBase64String ? protDataPtr.ptr : 0,
					!asBase64String ? protDataPtr.ptr : 0,
					!asBase64String ? protDataPtr.lengthPtr : 0]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}
		
		if (error != EU_ERROR_NONE) {
			protDataPtr.free();
			this.RaiseError(error);
		}

		if (asBase64String)
			return protDataPtr.toString();
		else
			return protDataPtr.toArray();
	},
	UnprotectDataByPassword: function(data, password, asString) {
		this.CheckMaxDataSize(data);

		var isDataStr = ((typeof data) == 'string');
		var unprotDataPtr = EUPointerArray();
		var error;

		try {
			error = Module.ccall('EUUnprotectDataByPassword',
				'number',
				['string', 'array', 'number', 'array',
					'number', 'number'],
				[isDataStr ? data : 0,
					!isDataStr ? data : 0,
					!isDataStr ? data.length : 0,
					(password != null) ? 
						UTF8ToCP1251Array(password) : 0,
					unprotDataPtr.ptr, unprotDataPtr.lengthPtr]);
		} catch (e) {
			error = EU_ERROR_UNKNOWN;
		}
		
		if (error != EU_ERROR_NONE) {
			unprotDataPtr.free();
			infoPtr.free();
			this.RaiseError(error);
		}

		if (asString) {
			return unprotDataPtr.toString();
		} else {
			return unprotDataPtr.toArray();
		}
	},
//-----------------------------------------------------------------------------
	QRCodeEncode: function(data) {
		var arrPtr = null;
		var arrLenPtr = null;
		var imgArray = null;
		var error = EU_ERROR_NONE;

		this.CheckMaxDataSize(data);

		var _free = function() {
			try {
				if (arrPtr != null)
					Module._free(arrPtr);

				if (arrLenPtr != null)
					Module._free(arrLenPtr);
			} catch (e) {
			}
		};

		try {
			arrPtr = Module._malloc(4);
			arrLenPtr = Module._malloc(4);

			Module.setValue(arrPtr, 0);
			Module.setValue(arrLenPtr, 0);

			var isSuccess = Module.ccall('QRCodeEncode',
				'number',
				['array', 'number', 'number', 'number'],
				[data, data.length, arrPtr, arrLenPtr]);
			if (isSuccess) {
				var imgData = Module.getValue(arrPtr, "i8*");
				var imgDataLength = Module.getValue(arrLenPtr, "i32");
				var imgBuffer = new ArrayBuffer(imgDataLength);

				imgArray = new Uint8Array(imgBuffer);
				imgArray.set(new Uint8Array(
					Module.HEAPU8.buffer, imgData, imgDataLength));

				Module._QRCodeFreeMemory(imgData);
			} else {
				error = EU_ERROR_BAD_PARAMETER;
			}
			
			_free();
		} catch (e) {
			_free();
			error = EU_ERROR_UNKNOWN;
		}

		if (error != EU_ERROR_NONE)
			this.RaiseError(error);

		return imgArray;
	}
});

//=============================================================================
