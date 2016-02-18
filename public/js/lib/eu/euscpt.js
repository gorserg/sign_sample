//=============================================================================

var EU_ONE_MB = 1024 * 1024;
var EU_MAX_DATA_SIZE_MB = ((typeof EU_MAX_DATA_SIZE_MB) != 'undefined') ? 
	EU_MAX_DATA_SIZE_MB : (isMobileBrowser() ? 2 : 5);
var EU_LIBRARY_STACK_MB = 5;
var EU_LIBRARY_MEMORY_MB = 5;

var EU_MAX_P7S_CONTAINER_SIZE = 100 * EU_ONE_MB;
var EU_MAX_P7E_CONTAINER_SIZE = 100 * EU_ONE_MB;

//-----------------------------------------------------------------------------

var EU_DEFAULT_LANG		 	= 0;
var EU_UA_LANG				= 1;
var EU_RU_LANG				= 2;
var EU_EN_LANG				= 3;

//-----------------------------------------------------------------------------

var EU_CERT_KEY_TYPE_UNKNOWN	= 0x00;
var EU_CERT_KEY_TYPE_DSTU4145	= 0x01;
var EU_CERT_KEY_TYPE_RSA		= 0x02;

//-----------------------------------------------------------------------------

var EU_KEY_USAGE_UNKNOWN			= 0x0000;
var EU_KEY_USAGE_DIGITAL_SIGNATURE	= 0x0001;
var EU_KEY_USAGE_KEY_AGREEMENT		= 0x0010;

//-----------------------------------------------------------------------------

var EU_RECIPIENT_APPEND_TYPE_BY_ISSUER_SERIAL = 1;
var EU_RECIPIENT_APPEND_TYPE_BY_KEY_ID = 2;

//-----------------------------------------------------------------------------

var EU_RECIPIENT_INFO_TYPE_ISSUER_SERIAL = 1;
var EU_RECIPIENT_INFO_TYPE_KEY_ID = 2;

//-----------------------------------------------------------------------------

var EU_CTX_HASH_ALGO_UNKNOWN = 0;
var EU_CTX_HASH_ALGO_GOST34311 = 1;
var EU_CTX_HASH_ALGO_SHA160 = 2;
var EU_CTX_HASH_ALGO_SHA224 = 3;
var EU_CTX_HASH_ALGO_SHA256 = 4;

//-----------------------------------------------------------------------------

var EU_CTX_SIGN_UNKNOWN = 0;
var EU_CTX_SIGN_DSTU4145_WITH_GOST34311 = 1;
var EU_CTX_SIGN_RSA_WITH_SHA = 2;

//-----------------------------------------------------------------------------

var EU_ERROR_NONE = 0x0000;
var EU_ERROR_UNKNOWN = 0xFFFF;
var EU_ERROR_NOT_SUPPORTED = 0xFFFE;

var EU_ERROR_NOT_INITIALIZED = 0x0001;
var EU_ERROR_BAD_PARAMETER = 0x0002;
var EU_ERROR_LIBRARY_LOAD = 0x0003;
var EU_ERROR_READ_SETTINGS = 0x0004;
var EU_ERROR_TRANSMIT_REQUEST = 0x0005;
var EU_ERROR_MEMORY_ALLOCATION = 0x0006;
var EU_WARNING_END_OF_ENUM = 0x0007;
var EU_ERROR_PROXY_NOT_AUTHORIZED = 0x0008;
var EU_ERROR_NO_GUI_DIALOGS = 0x0009;
var EU_ERROR_DOWNLOAD_FILE = 0x000A;
var EU_ERROR_WRITE_SETTINGS = 0x000B;
var EU_ERROR_CANCELED_BY_GUI = 0x000C;
var EU_ERROR_OFFLINE_MODE = 0x000D;

var EU_ERROR_KEY_MEDIAS_FAILED = 0x0011;
var EU_ERROR_KEY_MEDIAS_ACCESS_FAILED = 0x0012;
var EU_ERROR_KEY_MEDIAS_READ_FAILED = 0x0013;
var EU_ERROR_KEY_MEDIAS_WRITE_FAILED = 0x0014;
var EU_WARNING_KEY_MEDIAS_READ_ONLY = 0x0015;
var EU_ERROR_KEY_MEDIAS_DELETE = 0x0016;
var EU_ERROR_KEY_MEDIAS_CLEAR = 0x0017;
var EU_ERROR_BAD_PRIVATE_KEY = 0x0018;

var EU_ERROR_PKI_FORMATS_FAILED = 0x0021;
var EU_ERROR_CSP_FAILED = 0x0022;
var EU_ERROR_BAD_SIGNATURE = 0x0023;
var EU_ERROR_AUTH_FAILED = 0x0024;
var EU_ERROR_NOT_RECEIVER = 0x0025;

var EU_ERROR_STORAGE_FAILED = 0x0031;
var EU_ERROR_BAD_CERT = 0x0032;
var EU_ERROR_CERT_NOT_FOUND = 0x0033;
var EU_ERROR_INVALID_CERT_TIME = 0x0034;
var EU_ERROR_CERT_IN_CRL = 0x0035;
var EU_ERROR_BAD_CRL = 0x0036;
var EU_ERROR_NO_VALID_CRLS = 0x0037;

var EU_ERROR_GET_TIME_STAMP = 0x0041;
var EU_ERROR_BAD_TSP_RESPONSE = 0x0042;
var EU_ERROR_TSP_SERVER_CERT_NOT_FOUND = 0x0043;
var EU_ERROR_TSP_SERVER_CERT_INVALID = 0x0044;

var EU_ERROR_GET_OCSP_STATUS = 0x0051;
var EU_ERROR_BAD_OCSP_RESPONSE = 0x0052;
var EU_ERROR_CERT_BAD_BY_OCSP = 0x0053;
var EU_ERROR_OCSP_SERVER_CERT_NOT_FOUND = 0x0054;
var EU_ERROR_OCSP_SERVER_CERT_INVALID = 0x0055;

var EU_ERROR_LDAP_ERROR = 0x0061;

var EU_ERROR_JS_ERRORS = 0x10000;
var EU_ERROR_JS_BROWSER_NOT_SUPPORTED = 0x10001;
var EU_ERROR_JS_LIBRARY_NOT_INITIALIZED = 0x10002;
var EU_ERROR_JS_LIBRARY_LOAD = 0x10003;
var EU_ERROR_JS_LIBRARY_ERROR = 0x10004;

var EU_ERROR_JS_OPEN_FILE = 0x10010;
var EU_ERROR_JS_READ_FILE = 0x10011;
var EU_ERROR_JS_WRITE_FILE = 0x10012;

//=============================================================================

var EU_SYSTEMTIME_SIZE = 16;

var EU_CERT_OWNER_INFO_SIZE = 72;
var EU_SIGN_INFO_SIZE = 96;
var EU_SENDER_INFO_SIZE = 96;
var EU_CRL_INFO_SIZE = 48;
var EU_CERT_INFO_SIZE = 228;
var EU_CRL_DETAILED_INFO_SIZE = 60;
var EU_TIME_INFO_SIZE = 8 + EU_SYSTEMTIME_SIZE;

var EU_KEY_MEDIA_SIZE = 73;
var EU_USER_INFO_SIZE = 1536;

var EU_PASS_MAX_LENGTH = 65;
var EU_PATH_MAX_LENGTH = 257;

var EU_COMMON_NAME_MAX_LENGTH = 65;
var EU_LOCALITY_MAX_LENGTH = 129;
var EU_STATE_MAX_LENGTH = 129;
var EU_ORGANIZATION_MAX_LENGTH = 65;
var EU_ORG_UNIT_MAX_LENGTH = 65;
var EU_TITLE_MAX_LENGTH = 65;
var EU_STREET_MAX_LENGTH = 129;
var EU_PHONE_MAX_LENGTH = 33;
var EU_SURNAME_MAX_LENGTH = 41;
var EU_GIVENNAME_MAX_LENGTH = 33;
var EU_EMAIL_MAX_LENGTH = 129;
var EU_ADDRESS_MAX_LENGTH = 257;
var EU_EDRPOU_MAX_LENGTH = 11;
var EU_DRFO_MAX_LENGTH = 11;
var EU_NBU_MAX_LENGTH = 7;
var EU_SPFM_MAX_LENGTH = 7;
var EU_O_CODE_MAX_LENGTH = 33;
var EU_OU_CODE_MAX_LENGTH = 33;
var EU_USER_CODE_MAX_LENGTH = 33;
var EU_UPN_MAX_LENGTH = 257;

var EU_KEYS_TYPE_NONE = 0;
var EU_KEYS_TYPE_DSTU_AND_ECDH_WITH_GOST = 1;
var EU_KEYS_TYPE_RSA_WITH_SHA = 2;

var EU_KEYS_LENGTH_DS_UA_191 = 1;
var EU_KEYS_LENGTH_DS_UA_257 = 2;
var EU_KEYS_LENGTH_DS_UA_307 = 3;

var EU_KEYS_LENGTH_KEP_UA_257 = 1;
var EU_KEYS_LENGTH_KEP_UA_431 = 2;
var EU_KEYS_LENGTH_KEP_UA_571 = 3;

var EU_KEYS_LENGTH_DS_RSA_1024 = 1;
var EU_KEYS_LENGTH_DS_RSA_2048 = 2;
var EU_KEYS_LENGTH_DS_RSA_3072 = 3;
var EU_KEYS_LENGTH_DS_RSA_4096 = 4;

var EU_CONTENT_ENC_ALGO_TDES_CBC = 4;
var EU_CONTENT_ENC_ALGO_AES_256_CBC = 7;

//=============================================================================

var EU_CTX_SIGN_DSTU4145_WITH_GOST34311 = 1;
var EU_CTX_SIGN_RSA_WITH_SHA = 2;

//=============================================================================

var EU_RESOLVE_OIDS_PARAMETER = 'ResolveOIDs'
var EU_MAKE_PKEY_PFX_CONTAINER_PARAMETER = 'MakePKeyPFXContainer'

var UA_OID_EXT_KEY_USAGE_STAMP = "1.2.804.2.1.1.1.3.9";

var EU_CHECK_PRIVATE_KEY_CONTEXT_PARAMETER = "CheckPrivateKey";
var EU_RESOLVE_OIDS_CONTEXT_PARAMETER = "ResolveOIDs";
var EU_EXPORATABLE_CONTEXT_CONTEXT_PARAMETER = "ExportableContext";

//=============================================================================

var CP1251Table = {0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, 
	10: 10, 11: 11, 12: 12, 13: 13, 14: 14, 15: 15, 16: 16, 17: 17, 18: 18, 19: 19,
	20: 20, 21: 21, 22: 22, 23: 23, 24: 24, 25: 25, 26: 26, 27: 27, 28: 28, 29: 29, 
	30: 30, 31: 31, 32: 32, 33: 33, 34: 34, 35: 35, 36: 36, 37: 37, 38: 38, 39: 39, 
	40: 40, 41: 41, 42: 42, 43: 43, 44: 44, 45: 45, 46: 46, 47: 47, 48: 48, 49: 49, 
	50: 50, 51: 51, 52: 52, 53: 53, 54: 54, 55: 55, 56: 56, 57: 57, 58: 58, 59: 59,
	60: 60, 61: 61, 62: 62, 63: 63, 64: 64, 65: 65, 66: 66, 67: 67, 68: 68, 69: 69, 
	70: 70, 71: 71, 72: 72, 73: 73, 74: 74, 75: 75, 76: 76, 77: 77, 78: 78, 79: 79, 
	80: 80, 81: 81, 82: 82, 83: 83, 84: 84, 85: 85, 86: 86, 87: 87, 88: 88, 89: 89,
	90: 90, 91: 91, 92: 92, 93: 93, 94: 94, 95: 95, 96: 96, 97: 97, 98: 98, 99: 99, 
	100: 100, 101: 101, 102: 102, 103: 103, 104: 104, 105: 105, 106: 106, 107: 107, 108: 108, 109: 109, 
	110: 110, 111: 111, 112: 112, 113: 113, 114: 114, 115: 115, 116: 116, 117: 117, 118: 118, 119: 119, 
	120: 120, 121: 121, 122: 122, 123: 123, 124: 124, 125: 125, 126: 126, 127: 127, 1027: 129, 8225: 135, 
	1046: 198, 8222: 132, 1047: 199, 1168: 165, 1048: 200, 1113: 154, 1049: 201, 1045: 197, 1050: 202, 
	1028: 170, 160: 160, 1040: 192, 1051: 203, 164: 164, 166: 166, 167: 167, 169: 169, 171: 171, 172: 172, 
	173: 173, 174: 174, 1053: 205, 176: 176, 177: 177, 1114: 156, 181: 181, 182: 182, 183: 183, 8221: 148, 
	187: 187, 1029: 189, 1056: 208, 1057: 209, 1058: 210, 8364: 136, 1112: 188, 1115: 158, 1059: 211, 
	1060: 212, 1030: 178, 1061: 213, 1062: 214, 1063: 215, 1116: 157, 1064: 216, 1065: 217, 1031: 175, 
	1066: 218, 1067: 219, 1068: 220, 1069: 221, 1070: 222, 1032: 163, 8226: 149, 1071: 223, 1072: 224, 
	8482: 153, 1073: 225, 8240: 137, 1118: 162, 1074: 226, 1110: 179, 8230: 133, 1075: 227, 1033: 138, 
	1076: 228, 1077: 229, 8211: 150, 1078: 230, 1119: 159, 1079: 231, 1042: 194, 1080: 232, 1034: 140, 
	1025: 168, 1081: 233, 1082: 234, 8212: 151, 1083: 235, 1169: 180, 1084: 236, 1052: 204, 1085: 237, 
	1035: 142, 1086: 238, 1087: 239, 1088: 240, 1089: 241, 1090: 242, 1036: 141, 1041: 193, 1091: 243, 
	1092: 244, 8224: 134, 1093: 245, 8470: 185, 1094: 246, 1054: 206, 1095: 247, 1096: 248, 8249: 139, 
	1097: 249, 1098: 250, 1044: 196, 1099: 251, 1111: 191, 1055: 207, 1100: 252, 1038: 161, 8220: 147,
	1101: 253, 8250: 155, 1102: 254, 8216: 145, 1103: 255, 1043: 195, 1105: 184, 1039: 143, 1026: 128, 
	1106: 144, 8218: 130, 1107: 131, 8217: 146, 1108: 186, 1109: 190}

var UTF8Table = unescape(
	"%u0402%u0403%u201A%u0453%u201E%u2026%u2020%u2021%u20AC%u2030%u0409%u2039%u040A%u040C%u040B%u040F"+
	"%u0452%u2018%u2019%u201C%u201D%u2022%u2013%u2014%u0000%u2122%u0459%u203A%u045A%u045C%u045B%u045F"+
	"%u00A0%u040E%u045E%u0408%u00A4%u0490%u00A6%u00A7%u0401%u00A9%u0404%u00AB%u00AC%u00AD%u00AE%u0407"+
	"%u00B0%u00B1%u0406%u0456%u0491%u00B5%u00B6%u00B7%u0451%u2116%u0454%u00BB%u0458%u0405%u0455%u0457")

//=============================================================================

var EU_ERRORS_STRINGS = [];
var EU_ERRORS_STRINGS_UA = [];
var EU_ERRORS_STRINGS_RU = [];
var EU_ERRORS_STRINGS_EN = [];

EU_ERRORS_STRINGS_UA[EU_ERROR_JS_LIBRARY_LOAD] = 'Виникла помилка при завантаженні криптографічної бібліотеки';
EU_ERRORS_STRINGS_UA[EU_ERROR_JS_BROWSER_NOT_SUPPORTED] = 'Браузер не підтримується';
EU_ERRORS_STRINGS_UA[EU_ERROR_JS_LIBRARY_NOT_INITIALIZED] = 'Криптографічна бібліотека не ініціалізована';
EU_ERRORS_STRINGS_UA[EU_ERROR_JS_LIBRARY_ERROR] = 'Виникла помилка при взаємодії з криптографічною бібліотекою. Будь ласка, перезавантажте веб-сторінку';
EU_ERRORS_STRINGS_UA[EU_ERROR_JS_OPEN_FILE] = 'Виникла помилка при відкритті файлу';
EU_ERRORS_STRINGS_UA[EU_ERROR_JS_READ_FILE] = 'Виникла помилка при зчитуванні файлу';
EU_ERRORS_STRINGS_UA[EU_ERROR_JS_WRITE_FILE] = 'Виникла помилка при записі файлу';

EU_ERRORS_STRINGS_RU[EU_ERROR_JS_LIBRARY_LOAD] = 'Возникла ошибка при загрузке криптографической библиотеки';
EU_ERRORS_STRINGS_RU[EU_ERROR_JS_BROWSER_NOT_SUPPORTED] = 'Браузер не поддерживается';
EU_ERRORS_STRINGS_RU[EU_ERROR_JS_LIBRARY_NOT_INITIALIZED] = 'Криптографическая библиотека не инициализирована';
EU_ERRORS_STRINGS_RU[EU_ERROR_JS_LIBRARY_ERROR] = 'Возникла ошибка при взаимодействии с криптографической библиотекой. Пожалуйста, перезагрузите веб-страницу';
EU_ERRORS_STRINGS_RU[EU_ERROR_JS_OPEN_FILE] = 'Возникла ошибка при открытии файла';
EU_ERRORS_STRINGS_RU[EU_ERROR_JS_READ_FILE] = 'Возникла ошибка при чтении файла';
EU_ERRORS_STRINGS_RU[EU_ERROR_JS_WRITE_FILE] = 'Возникла ошибка при записи файла';

EU_ERRORS_STRINGS_EN[EU_ERROR_JS_LIBRARY_LOAD] = 'Error at cryptographic library load';
EU_ERRORS_STRINGS_EN[EU_ERROR_JS_BROWSER_NOT_SUPPORTED] = 'Browser is not supported';
EU_ERRORS_STRINGS_EN[EU_ERROR_JS_LIBRARY_NOT_INITIALIZED] = 'Cryptographic library not initialized';
EU_ERRORS_STRINGS_EN[EU_ERROR_JS_LIBRARY_ERROR] = 'Error at comunication with cryptographic library. Please, reload web page';
EU_ERRORS_STRINGS_EN[EU_ERROR_JS_OPEN_FILE] = 'Error at open file';
EU_ERRORS_STRINGS_EN[EU_ERROR_JS_READ_FILE] = 'Error at read file';
EU_ERRORS_STRINGS_EN[EU_ERROR_JS_WRITE_FILE] = 'Error at write file';

EU_ERRORS_STRINGS[EU_DEFAULT_LANG] = EU_ERRORS_STRINGS_UA;
EU_ERRORS_STRINGS[EU_UA_LANG] = EU_ERRORS_STRINGS_UA;
EU_ERRORS_STRINGS[EU_RU_LANG] = EU_ERRORS_STRINGS_RU;
EU_ERRORS_STRINGS[EU_EN_LANG] = EU_ERRORS_STRINGS_EN;

//=============================================================================

function isMobileBrowser() {
	return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

//=============================================================================

function StringToArray(s) {
	var utf8 = unescape(encodeURIComponent(s));

	var arr = [];
	for (var i = 0; i < utf8.length; i++) {
		arr.push(utf8.charCodeAt(i));
	}
	return arr;
}

function ArrayToString(arr) {
	var ret = [];
	
	var length = arr.length;
	if (length > 0 && 
		arr[length - 1] == 0) {
		length -= 1;
	}
	
	for (var i = 0; i < length; i++) {
		var chr = arr[i];
		if (chr > 0xFF) {
			chr &= 0xFF;
		}

		ret.push(String.fromCharCode(chr));
	}

	return  decodeURIComponent(escape(ret.join('')));
}

function UTF8ToCP1251Array(s) {
	var L = [];
	for (var i = 0; i < s.length; i++) {
		var ord = s.charCodeAt(i);
		if (!(ord in CP1251Table))
			throw "Character " + s.charAt(i) + " isn't supported by win1251!";
		L.push(CP1251Table[ord]);
	}

	L.push(0);

	return L;
}

function CP1251PointerToUTF8(ptr) {
	var t;
	var i = 0;
	var ret = '';

	var code2char = function(code) {
		if(code >= 0xC0 && code <= 0xFF)
			return String.fromCharCode(code - 0xC0 + 0x0410);
		if(code >= 0x80 && code <= 0xBF) 
			return UTF8Table.charAt(code - 0x80);
		return String.fromCharCode(code);
	};

	while (1) {
		t = HEAPU8[(((ptr)+(i))|0)];
		if (t == 0) 
			break;
		ret += code2char(t);
		i++;
	}

	return ret;
}


function StringToUTF16LEArray(str, zero) {
	var L = [];
	var c;

	for (var i = 0; i < str.length; i++) {
		c = str.charCodeAt(i);
		L.push(c & 0xFF);
		L.push((c & 0xFF00) >> 8);
	}
	
	if (zero) {
		L.push(0);
		L.push(0);
	}
	
	return L;
}

function UTF16LEArrayToString(arr) {
	var t1, t2;
	var i = 0;
	var ret = '';
	var length;

	if ((arr.length%2) != 0)
		return null;

	length = arr.length;
	if (length > 0 && 
		arr[length - 2] == 0 && 
		arr[length - 1] == 0) {
		length -= 2;
	}
		
	while (i < length) {
		ret += String.fromCharCode(arr[i] | (arr[i+1] << 8)); 
		i += 2;
	}

	return ret;
}

//=============================================================================

var StringEncoder = function (charset, javaCompliant) {
	this.charset = charset;
	this.javaCompliant = javaCompliant;
	
	if (!StringEncoder.isSupported(charset))
		throw exeption ("String charset not supported");
	
	if (charset == "UTF-16LE") {
		this.encode = function(str) {
			return StringToUTF16LEArray(str, !javaCompliant);
		};
		this.decode = UTF16LEArrayToString;
	} else if (charset == "UTF-8") {
		if (javaCompliant)
			this.encode = StringToArray;
		else {
			this.encode = function(str) {
				var arr = StringToArray(str);
				arr.push(0);
			}
		}
		this.decode = ArrayToString;
	}
}

StringEncoder.isSupported = function(charset) {
	if (charset != "UTF-16LE" && 
		charset != "UTF-8") {
		return false;
	}

	return true;
}

//=============================================================================

function SetClassID(className, classVersion, classPtr) {
	classPtr['Vendor'] = 'JSC IIT';
	classPtr['ClassVersion'] = classVersion;
	classPtr['ClassName'] = className;
}

String.prototype.capitalize = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
}

function intArrayFromStrings(strArr) {
	if (strArr.length == 0)
		return [0, 0];

	var resArray = [];
	for (var i = 0; i < strArr.length; i++) {
		var cp1251Arr = UTF8ToCP1251Array(strArr[i])
		resArray = resArray.concat(cp1251Arr);
	}

	resArray.push(0);

	return resArray;
}

function SystemTimeToDate(time) {
	function getWord() {
		var wordVal = Module.getValue(time, "i16");
		time += 2;
		return wordVal;
	}

	var year = getWord();
	var month = getWord() - 1 ;
	var dayOfWeek = getWord();
	var day = getWord();
	var hour = getWord();
	var minute = getWord();
	var second = getWord();
	var milliseconds = getWord();

	return new Date(year, month, day,
		hour, minute, second, milliseconds);
}

function IsStructureFilled(classPtr, structPtr, variables) {
	return (Module.getValue(
		structPtr, "i32") == EU_TRUE) ? true : false;
}

function ClassSetDefaultValues(classPtr, variables) {
	for (var key in variables) {
		var funcName = key.capitalize();
		if (variables[key] != 'boolean')
			funcName = "Get" + funcName;
		var funcBody = Function("return this." + key + ";");
		classPtr[funcName] = funcBody;

		if (variables[key] == 'string') {
			classPtr[key] = "";
		} else if (variables[key] == 'word' || 
			variables[key] == 'int' || 
			variables[key] == 'long') {
			classPtr[key] = 0
		} else if (variables[key] == 'boolean') {
			classPtr[key] = false
		} else {
			classPtr[key] = null;
		}
	}
}

function StructureToClass(classPtr, structPtr, variables) {
	try {
		for (var key in variables) {
			var funcName = key.capitalize();
			if (variables[key] != 'boolean')
				funcName = "Get" + funcName;
			var funcBody = Function("return this." + key + ";");
			classPtr[funcName] = funcBody;

			if (variables[key] == 'string') {
				classPtr[key] = CP1251PointerToUTF8(
					Module.getValue(structPtr, "i8*"));
				structPtr+=EU_PTR_SIZE;
			} else if (variables[key] == 'word') {
				classPtr[key] = Module.getValue(structPtr, "i16") | 0;
				structPtr+=2;
			} else if (variables[key] == 'int') {
				classPtr[key] = Module.getValue(structPtr, "i32") | 0;
				structPtr+=4;
			} else if (variables[key] == 'long') {
				classPtr[key] = Module.getValue(structPtr, "i32") | 0;
				structPtr+=4;
			} else if (variables[key] == 'boolean') {
				classPtr[key] = (Module.getValue(
					structPtr, "i32") == EU_TRUE) ? true : false;
				structPtr+=4;
			} else if (variables[key] == 'time') {
				classPtr[key] = SystemTimeToDate(structPtr);
				structPtr += EU_SYSTEMTIME_SIZE;
			} else if (variables[key] == 'ownerInfo') {
				classPtr[key] = new EndUserOwnerInfo(structPtr);
				structPtr += EU_CERT_OWNER_INFO_SIZE;
			} else if (variables[key] == 'timeInfo') {
				classPtr[key] = new EndUserTimeInfo(structPtr);
				structPtr += EU_TIME_INFO_SIZE;
			} else {
				alert("Invalid type: " + variables[key] + 
					"for key: " + key);
			}
		}
	} catch(e) {
		console.error("Error: function: %s class: %s ex: %s", 
			"StructureToClass", className, e.toString());
		this.isFilled = false;
	}
}

//-----------------------------------------------------------------------------

var MakeClass = function() {
	return function( args ) {
		if( this instanceof arguments.callee ) {
			if( typeof this.__construct == "function" ) 
				this.__construct.apply( this, args );
		}
		else return new arguments.callee( arguments );
	};
}

var NewClass = function( variables, constructor, functions ) {
	var retn = MakeClass();
	for( var key in variables ) {
		retn.prototype[key] = variables[key];
	}
	for( var key in functions ) {
		retn.prototype[key] = functions[key];
	}
	retn.prototype.__construct = constructor;
	return retn;
}

//=============================================================================

function GetTransferableObject(object, unconertableFieldsIDs) {
	var unconertableFields = [];
	var transferableObject = null;
	var length = unconertableFieldsIDs.length;
	var fieldID;

	if (unconertableFieldsIDs != null) {
		for (var i = 0; i < length; i++) {
			fieldID = unconertableFieldsIDs[i];
			unconertableFields.push(object[fieldID]);
			object[fieldID] = null;
		}
	}

	try {
		transferableObject = 
			JSON.parse(JSON.stringify(object));
	} catch (e) {
	
	}

	for (var i = 0; i < length; i++) {
		fieldID = unconertableFieldsIDs[i];
		object[fieldID] = unconertableFields[i];
		if (transferableObject != null) {
			transferableObject[fieldID] = unconertableFields[i];
		}
	}
	
	return transferableObject;
}

//-----------------------------------------------------------------------------

function TransferableObjectToClass(classPtr, obj, variables, hasSetters) {
	try {
		for (var key in variables) {
			var funcName = key.capitalize();

			var getter = (variables[key] != 'boolean') ? 
				('Get' + funcName) : funcName;
			var getterBody = Function("return this." + key + ";");

			classPtr[getter] = getterBody;
			if (variables[key] == 'time') {
				classPtr[key] = new Date(obj[key]);
			} else if (variables[key] == 'ownerInfo') {
				classPtr[key] = new EndUserOwnerInfo(null);
				classPtr[key].SetTransferableObject(obj[key]);
			} else if (variables[key] == 'timeInfo') {
				classPtr[key] = new EndUserTimeInfo(null);
				classPtr[key].SetTransferableObject(obj[key]);
			} else {
				classPtr[key] = obj[key];
			}

			if (hasSetters) {
				var setter = (variables[key] != 'boolean') ? 
					('Set' + funcName) : funcName;
				var setterBody = Function("value", "this." + key + " = value;");
				classPtr[setter] = setterBody;
			}
		}
	} catch(e) {
		console.error("Error: function: %s class: %s ex: %s", 
			"TransferableObjectToClass", className, e.toString());
		this.isFilled = false;
	}
}

//=============================================================================

var EndUserFileFields = {
	"file": "File",
	"data": "array"
};

//-----------------------------------------------------------------------------

var EndUserFile = function() {
	SetClassID('EndUserFile', '1.0.1', this);
}

//-----------------------------------------------------------------------------

EndUserFile.prototype.SetTransferableObject = function(obj) {
	TransferableObjectToClass(this, obj,  EndUserFileFields);
}

//-----------------------------------------------------------------------------

EndUserFile.prototype.GetTransferableObject = function() {
	return GetTransferableObject(this, ['file', 'data']);
}

//=============================================================================

var EndUserOwnerInfoFields = {
	"isFilled": "boolean",
	"issuer": "string",
	"issuerCN": "string",
	"serial": "string",
	"subject": "string",
	"subjCN": "string",
	"subjOrg": "string",
	"subjOrgUnit": "string",
	"subjTitle": "string",
	"subjState": "string",
	"subjLocality": "string",
	"subjFullName": "string",
	"subjAddress": "string",
	"subjPhone": "string",
	"subjEMail": "string",
	"subjDNS": "string",
	"subjEDRPOUCode": "string",
	"subjDRFOCode": "string"
};

//-----------------------------------------------------------------------------

var EndUserOwnerInfo = function(pInfo) {
	SetClassID('EndUserOwnerInfo', '1.0.1', this);

	if (!pInfo)
		return;

	if (IsStructureFilled(this, pInfo, EndUserOwnerInfoFields))
		StructureToClass(this, pInfo, EndUserOwnerInfoFields);
	else
		ClassSetDefaultValues(this, EndUserOwnerInfoFields);
}

//-----------------------------------------------------------------------------

EndUserOwnerInfo.prototype.SetTransferableObject = function(obj) {
	TransferableObjectToClass(this, obj,  EndUserOwnerInfoFields);
}

//-----------------------------------------------------------------------------

EndUserOwnerInfo.prototype.GetTransferableObject = function() {
	return GetTransferableObject(this, []);
}

//=============================================================================

var EndUserTimeInfoFields = {
	"isTimeAvail": "boolean",
	"isTimeStamp": "boolean",
	"time": "time"
};

//-----------------------------------------------------------------------------

var EndUserTimeInfo = function(pInfo) {
	SetClassID('EndUserTimeInfo', '1.0.1', this);

	if (!pInfo)
		return;

	if (IsStructureFilled(this, pInfo, EndUserTimeInfoFields))
		StructureToClass(this, pInfo, EndUserTimeInfoFields);
	else
		ClassSetDefaultValues(this, EndUserTimeInfoFields);
}

//-----------------------------------------------------------------------------

EndUserTimeInfo.prototype.SetTransferableObject = function(obj) {
	TransferableObjectToClass(this, obj,  EndUserTimeInfoFields);
}

//-----------------------------------------------------------------------------

EndUserTimeInfo.prototype.GetTransferableObject = function() {
	return GetTransferableObject(this, []);
}

//=============================================================================

var EndUserSignInfoFields = {
	"ownerInfo": "ownerInfo",
	"timeInfo": "timeInfo"
};

//-----------------------------------------------------------------------------

var EndUserSignInfo = function(pInfo, data) {
	SetClassID('EndUserSignInfo', '1.0.1', this);

	if (!pInfo)
		return;

	if (IsStructureFilled(this, pInfo, EndUserSignInfoFields))
		StructureToClass(this, pInfo, EndUserSignInfoFields);
	else
		ClassSetDefaultValues(this, EndUserSignInfoFields);

	this.data = data;

	this.GetData = function() {
		return this.data;
	};
}

//-----------------------------------------------------------------------------

EndUserSignInfo.prototype.SetTransferableObject = function(obj) {
	TransferableObjectToClass(this, obj,  EndUserSignInfoFields);

	this.data = obj.data;

	this.GetData = function() {
		return this.data;
	};
}

//-----------------------------------------------------------------------------

EndUserSignInfo.prototype.GetTransferableObject = function() {
	return GetTransferableObject(this, ['data']);
}

//=============================================================================

function EndUserSenderInfo(pInfo, data){
	SetClassID('EndUserSenderInfo', '1.0.1', this);

	this.ownerInfo = new EndUserOwnerInfo(pInfo);
	pInfo += EU_CERT_OWNER_INFO_SIZE;
	this.timeInfo = new EndUserTimeInfo(pInfo);
	this.data = data;

	this.GetOwnerInfo = function() {
		return this.ownerInfo;
	};

	this.GetTimeInfo = function() {
		return this.timeInfo;
	};

	this.GetData = function() {
		return this.data;
	};
}

//-----------------------------------------------------------------------------

var EndUserCertificateInfoFields = {
	"isFilled": "boolean",

	"version": "long",
	
	"issuer" : "string",
	"issuerCN" : "string",
	"serial" : "string",
	
	"subject" : "string",
	"subjCN" : "string",
	"subjOrg" : "string",
	"subjOrgUnit" : "string",
	"subjTitle" : "string",
	"subjState" : "string",
	"subjLocality" : "string",
	"subjFullName" : "string",
	"subjAddress" : "string",
	"subjPhone" : "string",
	"subjEMail" : "string",
	"subjDNS" : "string",
	"subjEDRPOUCode" : "string",
	"subjDRFOCode" : "string",
	
	"subjNBUCode" : "string",
	"subjSPFMCode" : "string",
	"subjOCode" : "string",
	"subjOUCode" : "string",
	"subjUserCode" : "string",
	
	"certBeginTime" : "time",
	"certEndTime" : "time",
	"isPrivKeyTimesAvail" : "boolean",
	"privKeyBeginTime" : "time",
	"privKeyEndTime" : "time",
	
	"publicKeyBits" : "long",
	"publicKey" : "string",
	"publicKeyID" : "string",
	
	"isECDHPublicKeyAvail" : "boolean",
	"ECDHPublicKeyBits" : "long",
	"ECDHPublicKey" : "string",
	"ECDHPublicKeyID" : "string",
	
	"issuerPublicKeyID" : "string",
	
	"keyUsage" : "string",
	"extKeyUsages" : "string",
	"policies" : "string",
	
	"crlDistribPoint1" : "string",
	"crlDistribPoint2" : "string",
	
	"isPowerCert" : "boolean",
	
	"isSubjTypeAvail" : "boolean",
	"isSubjCA" : "boolean"
};

//-----------------------------------------------------------------------------

function EndUserCertificateInfo(pInfo){
	SetClassID('EndUserCertificateInfo', '1.0.1', this);
	
	if (IsStructureFilled(this, pInfo, EndUserCertificateInfoFields))
		StructureToClass(this, pInfo, EndUserCertificateInfoFields);
	else
		ClassSetDefaultValues(this, EndUserCertificateInfoFields);
}

//-----------------------------------------------------------------------------

var EndUserCertificateInfoExFields = {
	"isFilled": "boolean",
	
	"version": "long",
	
	"issuer" : "string",
	"issuerCN" : "string",
	"serial" : "string",
	
	"subject" : "string",
	"subjCN" : "string",
	"subjOrg" : "string",
	"subjOrgUnit" : "string",
	"subjTitle" : "string",
	"subjState" : "string",
	"subjLocality" : "string",
	"subjFullName" : "string",
	"subjAddress" : "string",
	"subjPhone" : "string",
	"subjEMail" : "string",
	"subjDNS" : "string",
	"subjEDRPOUCode" : "string",
	"subjDRFOCode" : "string",
	
	"subjNBUCode" : "string",
	"subjSPFMCode" : "string",
	"subjOCode" : "string",
	"subjOUCode" : "string",
	"subjUserCode" : "string",
	
	"certBeginTime" : "time",
	"certEndTime" : "time",
	"isPrivKeyTimesAvail" : "boolean",
	"privKeyBeginTime" : "time",
	"privKeyEndTime" : "time",
	
	"publicKeyBits" : "long",
	"publicKey" : "string",
	"publicKeyID" : "string",
	
	"issuerPublicKeyID" : "string",
	
	"keyUsage" : "string",
	"extKeyUsages" : "string",
	"policies" : "string",
	
	"crlDistribPoint1" : "string",
	"crlDistribPoint2" : "string",
	
	"isPowerCert" : "boolean",
	
	"isSubjTypeAvail" : "boolean",
	"isSubjCA" : "boolean",
	"chainLength" : "int",
	
	"UPN" : "string",
	
	"publicKeyType" : "long",
	"keyUsageType" : "long",
	
	"RSAModul" : "string",
	"RSAExponent" : "string",
	
	"OCSPAccessInfo" : "string",
	"issuerAccessInfo" : "string",
	"TSPAccessInfo" : "string",
	
	"isLimitValueAvailable" : "boolean",
	"limitValue" : "long",
	"limitValueCurrency" : "string"
};

//-----------------------------------------------------------------------------

function EndUserCertificateInfoEx(pInfo){
	SetClassID('EndUserCertificateInfoEx', '1.0.1', this);
	
	if (IsStructureFilled(this, pInfo, EndUserCertificateInfoExFields))
		StructureToClass(this, pInfo, EndUserCertificateInfoExFields);
	else
		ClassSetDefaultValues(this, EndUserCertificateInfoExFields);
}

//-----------------------------------------------------------------------------

var EndUserFileStoreSettings = NewClass({
	"Vendor": "JSC IIT",
	"ClassVersion": "1.0.0",
	"ClassName": "EndUserFileStoreSettings",
	"path": "",
	"checkCRLs": "false",
	"autoRefresh": "false",
	"ownCRLsOnly": "false",
	"fullAndDeltaCRLs": "false",
	"autoDownloadCRLs": "false",
	"saveLoadedCerts": "false",
	"expireTime": "3600"
},
function(path, checkCRLs, autoRefresh,
	ownCRLsOnly, fullAndDeltaCRLs,
	autoDownloadCRLs, saveLoadedCerts, expireTime) {
	this.path = path;
	this.checkCRLs = checkCRLs;
	this.autoRefresh = autoRefresh;
	this.ownCRLsOnly = ownCRLsOnly;
	this.fullAndDeltaCRLs = fullAndDeltaCRLs;
	this.autoDownloadCRLs = autoDownloadCRLs;
	this.saveLoadedCerts = saveLoadedCerts;
	this.expireTime = expireTime;
},
{
	GetPath: function() {
		return this.path;
	},
	SetPath: function(path) {
		this.path = path;
	},
	GetCheckCRLs: function() {
		return this.checkCRLs;
	},
	SetCheckCRLs: function(checkCRLs) {
		this.checkCRLs = checkCRLs;
	},
	GetAutoRefresh: function() {
		return this.autoRefresh;
	},
	SetAutoRefresh:function(autoRefresh) {
		this.autoRefresh = autoRefresh;
	},
	GetOwnCRLsOnly: function() {
		return this.ownCRLsOnly;
	},
	SetOwnCRLsOnly: function(ownCRLsOnly) {
		this.ownCRLsOnly = ownCRLsOnly;
	},
	GetFullAndDeltaCRLs: function() {
		return this.fullAndDeltaCRLs;
	},
	SetFullAndDeltaCRLs: function(fullAndDeltaCRLs) {
		this.fullAndDeltaCRLs = fullAndDeltaCRLs;
	},
	GetAutoDownloadCRLs: function() {
		return this.autoDownloadCRLs;
	},
	SetAutoDownloadCRLs: function(autoDownloadCRLs) {
		this.autoDownloadCRLs = autoDownloadCRLs;
	},
	GetSaveLoadedCerts: function() {
		return this.saveLoadedCerts;
	},
	SetSaveLoadedCerts: function(saveLoadedCerts) {
		this.saveLoadedCerts = saveLoadedCerts;
	},
	GetExpireTime: function() {
		return this.expireTime;
	},
	SetExpireTime: function(expireTime) {
		this.expireTime = expireTime;
	}
});

//-----------------------------------------------------------------------------

var EndUserProxySettings = NewClass({
	"Vendor": "JSC IIT",
	"ClassVersion": "1.0.0",
	"ClassName": "EndUserProxySettings",
	"useProxy": "false",
	"anonymous": "true",
	"address": "",
	"port": "3128",
	"user": "",
	"password": "",
	"savePassword": "false"
},
function(useProxy, anonymous, address,
	port, user, password, savePassword) {
	this.useProxy = useProxy;
	this.anonymous = anonymous;
	this.address = address;
	this.port = port;
	this.user = user;
	this.password = password;
	this.savePassword = savePassword;
},
{
	GetUseProxy: function() {
		return this.useProxy;
	},
	SetUseProxy: function(useProxy) {
		this.useProxy = useProxy;
	},
	GetAnonymous: function() {
		return this.anonymous;
	},
	SetAnonymous: function(anonymous) {
		this.anonymous = anonymous;
	},
	GetAddress: function() {
		return this.address;
	},
	SetAddress: function(address) {
		this.address = address;
	},
	GetPort: function() {
		return this.port;
	},
	SetPort: function(port) {
		this.port = port;
	},
	GetUser: function() {
		return this.user;
	},
	SetUser: function(user) {
		this.user = user;
	},
	GetPassword: function() {
		return this.password;
	},
	SetPassword: function(password) {
		this.password = password;
	},
	GetSavePassword: function() {
		return this.savePassword;
	},
	SetSavePassword: function(savePassword) {
		this.savePassword = savePassword;
	}
});

//-----------------------------------------------------------------------------

var EndUserTSPSettings = NewClass({
	"Vendor": "JSC IIT",
	"ClassVersion": "1.0.0",
	"ClassName": "EndUserTSPSettings",
	"getStamps": "false",
	"address": "",
	"port": "80"
},
function(getStamps, address, port) {
	this.getStamps = getStamps;
	this.address = address;
	this.port = port;
},
{
	GetGetStamps: function() {
		return this.getStamps;
	},
	SetGetStamps: function(getStamps) {
		this.getStamps = getStamps;
	},
	GetAddress: function() {
		return this.address;
	},
	SetAddress: function(address) {
		this.address = address;
	},
	GetPort: function() {
		return this.port;
	},
	SetPort: function(port) {
		this.port = port;
	}
});

//-----------------------------------------------------------------------------

var EndUserOCSPSettings = NewClass({
	"Vendor": "JSC IIT",
	"ClassVersion": "1.0.0",
	"ClassName": "EndUserOCSPSettings",
	"useOCSP": "false",
	"beforeStore": "false",
	"address": "",
	"port": "80"
},
function(useOCSP, beforeStore, address, port) {
	this.useOCSP = useOCSP;
	this.beforeStore = beforeStore;
	this.address = address;
	this.port = port;
},
{
	GetUseOCSP: function() {
		return this.useOCSP;
	},
	SetUseOCSP: function(useOCSP) {
		this.useOCSP = useOCSP;
	},
	GetBeforeStore: function() {
		return this.beforeStore;
	},
	SetBeforeStore: function(beforeStore) {
		this.beforeStore = beforeStore;
	},
	GetAddress: function() {
		return this.address;
	},
	SetAddress: function(address) {
		this.address = address;
	},
	GetPort: function() {
		return this.port;
	},
	SetPort: function(port) {
		this.port = port;
	}
});

//-----------------------------------------------------------------------------

var EndUserCMPSettings = NewClass({
	"Vendor": "JSC IIT",
	"ClassVersion": "1.0.0",
	"ClassName": "EndUserCMPSettings",
	"useCMP": "false",
	"address": "",
	"port": "80",
	"commonName": ""
},
function(useCMP, address,
	port, commonName) {
		this.useCMP = useCMP;
		this.address = address;
		this.port = port;
		this.commonName = commonName;
},
{
	GetUseCMP: function() {
		return this.useCMP;
	},
	SetUseCMP: function(useCMP) {
		this.useCMP = useCMP;
	},
	GetAddress: function() {
		return this.address;
	},
	SetAddress: function(address) {
		this.address = address;
	},
	GetPort: function() {
		return this.port;
	},
	SetPort: function(port) {
		this.port = port;
	},
	GetCommonName: function() {
		return this.commonName;
	},
	SetCommonName: function(commonName) {
		this.commonName = commonName;
	}
});

//-----------------------------------------------------------------------------

var EndUserLDAPSettings = NewClass({
	"Vendor": "JSC IIT",
	"ClassVersion": "1.0.0",
	"ClassName": "EndUserLDAPSettings",
	"useLDAP": "false",
	"address": "",
	"port": "80",
	"anonymous": "true",
	"user": "",
	"password": ""
},
function(useLDAP, address, port,
	anonymous, user, password) {
	this.useLDAP = useLDAP;
	this.address = address;
	this.port = port;
	this.anonymous = anonymous;
	this.user = user;
	this.password = password;
},
{
	GetUseLDAP: function() {
		return this.useLDAP;
	},
	SetUseLDAP: function(useLDAP) {
		this.useLDAP = useLDAP;
	},
	GetAddress: function() {
		return this.address;
	},
	SetAddress: function(address) {
		this.address = address;
	},
	GetPort: function() {
		return this.port;
	},
	SetPort: function(port) {
		this.port = port;
	},
	GetAnonymous: function() {
		return this.anonymous;
	},
	SetAnonymous: function(anonymous) {
		this.anonymous = anonymous;
	},
	GetUser: function() {
		return this.user;
	},
	SetUser: function(user) {
		this.user = user;
	},
	GetPassword: function() {
		return this.password;
	},
	SetPassword: function(password) {
		this.password = password;
	}
});

//-----------------------------------------------------------------------------

var EndUserModeSettings = NewClass({
	"Vendor": "JSC IIT",
	"ClassVersion": "1.0.0",
	"ClassName": "EndUserModeSettings",
	"offlineMode": "false"
},
function(offlineMode) {
	this.offlineMode = offlineMode;
},
{
	GetOfflineMode: function() {
		return this.offlineMode;
	},
	SetOfflineMode: function(offlineMode) {
		this.offlineMode = offlineMode;
	}
});

//-----------------------------------------------------------------------------

var EndUserOCSPAccessInfoModeSettings = NewClass({
	"Vendor": "JSC IIT",
	"ClassVersion": "1.0.0",
	"ClassName": "EndUserOCSPAccessInfoModeSettings",
	"enabled": "false"
},
function(enabled) {
	this.enabled = enabled;
},
{
	GetEnabled: function() {
		return this.enabled;
	},
	SetEnabled: function(enabled) {
		this.enabled = enabled;
	}
});

//-----------------------------------------------------------------------------

var EndUserOCSPAccessInfoSettings = NewClass({
	"Vendor": "JSC IIT",
	"ClassVersion": "1.0.0",
	"ClassName": "EndUserOCSPAccessInfoSettings",
	"issuerCN": "",
	"address": "",
	"port": ""
},
function(issuerCN, address, port) {
	this.issuerCN = issuerCN;
	this.address = address;
	this.port = port;
},
{
	GetIssuerCN: function() {
		return this.issuerCN;
	},
	SetIssuerCN: function(issuerCN) {
		this.issuerCN = issuerCN;
	},
	GetAddress: function() {
		return this.address;
	},
	SetAddress: function(address) {
		this.address = address;
	},
	GetPort: function() {
		return this.port;
	},
	SetPort: function(port) {
		this.port = port;
	}
});

//=============================================================================

var EndUserInfo = NewClass({
	"Vendor": "JSC IIT",
	"ClassVersion": "1.0.0",
	"ClassName": "EndUserInfo",
	"version": "1",
	"commonName": "",
	"locality": "",
	"state": "",
	"organiztion": "",
	"orgUnit": "",
	"title": "",
	"street": "",
	"phone": "",
	"surname": "",
	"givenname": "",
	"eMail": "",
	"dns": "",
	"edrpouCode": "",
	"drfoCode": "",
	"nbuCode": "",
	"spfmCode": "",
	"oCode": "",
	"ouCode": "",
	"userCode": "",
	"upn": "",
},
function() {
},
{
	GetCommonName: function() {
		return this.commonName;
	},
	SetCommonName: function(commonName) {
		this.commonName = commonName;
	},
	GetLocality: function() {
		return this.locality;
	},
	SetLocality: function(locality) {
		this.locality = locality;
	},
	GetState: function() {
		return this.state;
	},
	SetState: function(state) {
		this.state = state;
	},
	GetOrganiztion: function() {
		return this.organiztion;
	},
	SetOrganiztion: function(organiztion) {
		this.organiztion = organiztion;
	},
	GetOrgUnit: function() {
		return this.orgUnit;
	},
	SetOrgUnit: function(orgUnit) {
		this.orgUnit = orgUnit;
	},
	GetTitle: function() {
		return this.title;
	},
	SetTitle: function(title) {
		this.title = title;
	},
	GetStreet: function() {
		return this.street;
	},
	SetStreet: function(street) {
		this.street = street;
	},
	GetPhone: function() {
		return this.phone;
	},
	SetPhone: function(phone) {
		this.phone = phone;
	},
	GetSurname: function() {
		return this.surname;
	},
	SetSurname: function(surname) {
		this.surname = surname;
	},
	GetGivenname: function() {
		return this.givenname;
	},
	SetGivenname: function(givenname) {
		this.givenname = givenname;
	},
	GetEMail: function() {
		return this.eMail;
	},
	SetEMail: function(eMail) {
		this.eMail = eMail;
	},
	GetDNS: function() {
		return this.dns;
	},
	SetDNS: function(dns) {
		this.dns = dns;
	},
	GetEDRPOUCode: function() {
		return this.edrpouCode;
	},
	SetEDRPOUCode: function(edrpouCode) {
		this.edrpouCode = edrpouCode;
	},
	GetDRFOCode: function() {
		return this.drfoCode;
	},
	SetDRFOCode: function(drfoCode) {
		this.drfoCode = drfoCode;
	},
	GetNBUCode: function() {
		return this.nbuCode;
	},
	SetNBUCode: function(nbuCode) {
		this.nbuCode = nbuCode;
	},
	GetSPFMCode: function() {
		return this.spfmCode;
	},
	SetSPFMCode: function(spfmCode) {
		this.spfmCode = spfmCode;
	},
	GetOCode: function() {
		return this.oCode;
	},
	SetOCode: function(oCode) {
		this.oCode = oCode;
	},
	GetOUCode: function() {
		return this.ouCode;
	},
	SetOUCode: function(ouCode) {
		this.ouCode = ouCode;
	},
	GetUserCode: function() {
		return this.userCode;
	},
	SetUserCode: function(userCode) {
		this.userCode = userCode;
	},
	GetUPN: function() {
		return this.upn;
	},
	SetUPN: function(upn) {
		this.upn = upn;
	}
});

//-----------------------------------------------------------------------------

var EndUserPrivateKey = NewClass({
	"Vendor": "JSC IIT",
	"ClassVersion": "1.0.0",
	"ClassName": "EndUserPrivateKey",
	"privateKey": null,
	"privateKeyName": "Key-6.dat",
	"privateKeyInfo": null,
	"privateKeyInfoName": "Key-11.dat",
	"uaRequest": null,
	"uaRequestName": "",
	"uaKEPRequest": null,
	"uaKEPRequestName": "",
	"internationalRequest": null,
	"internationalRequestName": ""
},
function(privateKey, privateKeyInfo,
	uaRequest, uaRequestName, uaKEPRequest, uaKEPRequestName,
	internationalRequest, internationalRequestName) {
	this.privateKey = privateKey;
	this.privateKeyInfo = privateKeyInfo;
	this.uaRequest = uaRequest;
	this.uaRequestName = uaRequestName;
	this.uaKEPRequest = uaKEPRequest;
	this.uaKEPRequestName = uaKEPRequestName;
	this.internationalRequest = internationalRequest;
	this.internationalRequestName = internationalRequestName;
},
{
	GetPrivateKey: function() {
		return this.privateKey;
	},
	GetPrivateKeyName: function() {
		return this.privateKeyName;
	},
	GetPrivateKeyInfo: function() {
		return this.privateKeyInfo;
	},
	GetPrivateKeyInfoName: function() {
		return this.privateKeyInfoName;
	},
	GetUARequest: function() {
		return this.uaRequest;
	},
	GetUARequestName: function() {
		return this.uaRequestName;
	},
	GetUAKEPRequest: function() {
		return this.uaKEPRequest;
	},
	GetUAKEPRequestName: function() {
		return this.uaKEPRequestName;
	},
	GetInternationalRequest: function() {
		return this.internationalRequest;
	},
	GetInternationalRequestName: function() {
		return this.internationalRequestName;
	}
});

//=============================================================================

var EndUserContext = NewClass({
	"Vendor": "JSC IIT",
	"ClassVersion": "1.0.0",
	"ClassName": "EndUserContext",
	"context": ""
},
function(context) {
	this.context = context;
},
{
	GetContext: function() {
		return this.context;
	}
});

//-----------------------------------------------------------------------------

var EndUserPrivateKeyContext = NewClass({
	"Vendor": "JSC IIT",
	"ClassVersion": "1.0.0",
	"ClassName": "EndUserPrivateKeyContext",
	"context": 0,
	"ownerInfo": 0
},
function(context, ownerInfo) {
	this.context = context;
	this.ownerInfo = ownerInfo;
},
{
	GetContext: function() {
		return this.context;
	},
	GetOwnerInfo: function() {
		return this.ownerInfo;
	}
});

//-----------------------------------------------------------------------------

var EndUserPrivateKeyInfo = NewClass({
	"Vendor": "JSC IIT",
	"ClassVersion": "1.0.0",
	"ClassName": "EndUserPrivateKeyInfo",
	"keyType": 0,
	"keyUsage": 0,
	"keyIDs": [],
	"isTrustedKeyIDs": false
},
function(keyType, keyUsage, keyIDs) {
	this.keyType = keyType;
	this.keyUsage = keyUsage;
	this.keyIDs = keyIDs;
	this.isTrustedKeyIDs = (keyIDs.length == 1);
},
{
	GetKeyType: function() {
		return this.keyType;
	},
	GetKeyUsage: function() {
		return this.keyUsage;
	},
	GetKeyIDs: function() {
		return this.keyIDs;
	},
	GetIsTrustedKeyIDs: function() {
		return this.isTrustedKeyIDs;
	}
});

//-----------------------------------------------------------------------------

var EndUserHashContext = NewClass({
	"Vendor": "JSC IIT",
	"ClassVersion": "1.0.0",
	"ClassName": "EndUserHashContext",
	"context": 0
},
function(context) {
	this.context = context;
},
{
	GetContext: function() {
		return this.context;
	}
});

//-----------------------------------------------------------------------------

var EndUserCertificate = NewClass({
	"Vendor": "JSC IIT",
	"ClassVersion": "1.0.0",
	"ClassName": "EndUserCertificate",
	"infoEx": 0,
	"data": 0
},
function(infoEx, data) {
	this.infoEx = infoEx;
	this.data = data;
},
{
	GetInfoEx: function() {
		return this.infoEx;
	},
	GetData: function() {
		return this.data;
	}
});

//-----------------------------------------------------------------------------

var EndUserSenderInfoEx = NewClass({
	"Vendor": "JSC IIT",
	"ClassVersion": "1.0.0",
	"ClassName": "EndUserSenderInfoEx",
	"isDynamicKey": 0,
	"certInfoEx": 0,
	"certificate": 0
},
function(isDynamicKey, certInfoEx, certificate) {
	this.isDynamicKey = isDynamicKey;
	this.certInfoEx = certInfoEx;
	this.certificate = certificate;
},
{
	GetIsDynamic: function() {
		return this.isDynamicKey;
	},
	GetCertInfoEx: function() {
		return this.certInfoEx;
	},
	GetCertificate: function() {
		return this.certificate;
	}
});

//-----------------------------------------------------------------------------

var EndUserRecipientInfo = NewClass({
	"Vendor": "JSC IIT",
	"ClassVersion": "1.0.0",
	"ClassName": "EndUserRecipientInfo",
	"infoType": 0,
	"issuer": 0,
	"serial": 0,
	"publicKeyID": 0
},
function(infoType, issuer, serial, publicKeyID) {
	this.infoType = infoType;
	this.issuer = issuer;
	this.serial = serial;
	this.publicKeyID = publicKeyID;
},
{
	GetInfoType: function() {
		return this.infoType;
	},
	GetIssuer: function() {
		return this.issuer;
	},
	GetSerial: function() {
		return this.serial;
	},
	GetPublicKeyID: function() {
		return this.publicKeyID;
	}
});

//=============================================================================

var EndUserSessionFields = {
	"handle": "number",
	"data": "array"
};

//-----------------------------------------------------------------------------

var EndUserSession = function(handle, data) {
	SetClassID('EndUserSession', '1.0.1', this);

	this.handle = handle;
	this.data = data;

	this.GetHandle = function() {
		return this.handle;
	};

	this.GetData = function() {
		return this.data;
	};

	this.SetData = function(data) {
		this.data = data;
	};
}

//-----------------------------------------------------------------------------

EndUserSession.prototype.SetTransferableObject = function(obj) {
	TransferableObjectToClass(this, obj,  EndUserSessionFields);
}

//-----------------------------------------------------------------------------

EndUserSession.prototype.GetTransferableObject = function() {
	return GetTransferableObject(this, ['data']);
}

//=============================================================================
