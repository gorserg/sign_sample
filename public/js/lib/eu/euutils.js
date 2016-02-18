//=============================================================================

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

var EU_PERSISTENT_FS_SIZE = 10 * 1024 * 1024;

var Utils = NewClass({
	"Vendor": "JSC IIT",
	"ClassVersion": "1.0.0",
	"ClassName": "Utils",
	"euSign": null
},
function (euSign) {
	this.euSign = euSign;
},
{
	//-----------------------------------------------------------------------------
	HandleErrorFileSystem: function (e) {
		var msg = "Виникла помилка: ";

		switch (e.code) {
			case FileError.NOT_FOUND_ERR:
				msg += "Файл або директорію не знайдено";
				break;

			case FileError.NOT_READABLE_ERR:
				msg += "Файл або директорія не читабельні";
				break;

			case FileError.PATH_EXISTS_ERR:
				msg += "Файл або директорія наразі відсутні";
				break;

			case FileError.TYPE_MISMATCH_ERR:
				msg += "Некоректний тип файлу";
				break;

			default:
				msg += "Невідома помилка";
				break;
		};

		console.log(msg);
	},
	IsFileSystemSupported: function () {
		window.requestFileSystem = window.requestFileSystem ||
			window.webkitRequestFileSystem;
		window.requestFileSystem(window.PERSISTENT,
			EU_PERSISTENT_FS_SIZE, initFunction, HandleErrorFileSystem);
	},
	IsFileSupported: function () {
		if (window.File && window.FileReader &&
			window.FileList && window.Blob) {
			return true;
		} else {
			return false;
		}
	},
	//-----------------------------------------------------------------------------
	// Session storage API
	//-----------------------------------------------------------------------------
	IsSessionStorageSupported: function() {
		return (window.sessionStorage !== 'underfined');
	},
	SetSessionStorageItem: function(name, item, protect) {
		try {
			if (protect) {
				var protectedData = this.euSign.ProtectDataByPassword(
					item, null, true);
				window.sessionStorage.setItem(name, protectedData);
			} else {
				if (typeof item === 'string') {
					window.sessionStorage.setItem(name, item);
				} else {
					var encoded = this.euSign.Base64Encode(item);
					window.sessionStorage.setItem(name, encoded);
				}
			}
		} catch (e) {
			return false;
		}

		return true;
	},
	SetSessionStorageItems: function(name, items, protect) {
		var length = items.length;

		if (!this.SetSessionStorageItem(name + 'Count', 
				length.toString(), protect)) {
			return false;
		}

		for (var i = 0; i < length; i++)  {
			if (!this.SetSessionStorageItem(name + i.toString(), 
					items[i], protect)) {
				for (var j = 0; j < i; j++) {
					this.RemoveSessionStorageItem(name + j.toString());
				}

				this.RemoveSessionStorageItem(name + 'Count');

				return false;
			}
		}

		return true;
	},
	GetSessionStorageItem: function(name, decode, protect) {
		try {
			var item = window.sessionStorage.getItem(name);
			if (item == null || item === 'underfined')
				return null;
					
			if (protect) {
				return this.euSign.UnprotectDataByPassword(
					item, null, !decode);
			} else {
				if (!decode)
					return item;
				else
					return this.euSign.Base64Decode(item);
			}
		} catch (e) {
			return null;
		}
	},
	GetSessionStorageItems: function(name, decode, protect) {
		var length = this.GetSessionStorageItem(
			name + 'Count', false, false);
		if (length == null)
			return null;

		length = parseInt(length);

		var items = [];

		for (var i = 0; i < length; i++) {
			var item = this.GetSessionStorageItem(
				name + i.toString(), decode, protect);
			if (item == null)
				return false;

			items.push(item);
		}

		return items;
	},
	RemoveSessionStorageItem: function(name) {
		try {
			window.sessionStorage.removeItem(name);
		} catch (e) {
			return false;
		}
		
		return true;
	},
	RemoveSessionStorageItems: function(name) {
		var length = this.GetSessionStorageItem(
			name + 'Count', false, false);
		if (length == null)
			return true;

		length = parseInt(length);

		for (var i = 0; i < length; i++) {
			this.RemoveSessionStorageItem(name + i.toString());
		}

		this.RemoveSessionStorageItem(name + 'Count');
		
		return true;
	},
	//-----------------------------------------------------------------------------
	// Browser detection
	//-----------------------------------------------------------------------------
	IsIOS: function () {
		return (/iP(hone|od|ad)/.test(navigator.platform));
	},
	GetIOSVersion: function () {
		var verString = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
		var verArray = [parseInt(verString[1], 10),
			parseInt(verString[2], 10), parseInt(verString[3] || 0, 10)];

		return verArray[0];
	},
	//-----------------------------------------------------------------------------
	// File API 
	//-----------------------------------------------------------------------------
	IsFileImage: function (file) {
		return (/image/.test(file.type));
	},
	CreateObjectURL: function (file) {
		if (this.IsIOS() &&
			(this.GetIOSVersion() < 7)) {
			return webkitURL.createObjectURL(file);
		}

		return URL.createObjectURL(file);
	},
	LoadFile: function (file, onSuccess, onFail) {
		if (file == null) {
			onFail(null);
			return;
		}

		function fileLoaded(file, onSuccess, onFail) {
			return function (evt) {
				if (evt.target.readyState != FileReader.DONE)
					return;

				var fileData = new Object();
				fileData.name = file.name;
				fileData.data = new Uint8Array(evt.target.result);

				onSuccess(fileData);
			}
		};

		var fileReader = new FileReader();
		fileReader.onloadend = fileLoaded(
			file, onSuccess, onFail);
		fileReader.readAsArrayBuffer(file);
	},
	LoadFilesToArray: function (files, onSuccess, onFail) {
		if (files.length <= 0) {
			onFail(null);
			return;
		}

		function fileLoaded(files, curIndex, processedFiles, onSuccess, onFail) {
			return function (evt) {
				if (evt.target.readyState != FileReader.DONE)
					return;

				var file = new Object();
				file.name = files[curIndex].name;
				file.data = new Uint8Array(evt.target.result);

				processedFiles.push(file);
				curIndex++;

				if (curIndex < files.length) {
					var fileReader = new FileReader();
					fileReader.onloadend = fileLoaded(
						files, curIndex, processedFiles, onSuccess, onFail);
					fileReader.readAsArrayBuffer(files[curIndex]);
					return;
				}

				onSuccess(processedFiles);
			}
		};

		var fileReader = new FileReader();
		fileReader.onloadend = fileLoaded(
			files, 0, [], onSuccess, onFail);
		fileReader.readAsArrayBuffer(files[0]);
	},
	RemoveFileExtension: function(fileName) {
		var lastIndex = fileName.lastIndexOf('.');
		if (lastIndex <= 0)
			return fileName;

		return fileName.substr(0, lastIndex);
	},
	GetFileExtension: function(fileName) {
		var lastIndex = fileName.lastIndexOf('.');
		if (lastIndex <= 0)
			return "";

		return fileName.substr(lastIndex + 1, fileName.length - 1);
	},
	//-----------------------------------------------------------------------------
	// File storage API
	//-----------------------------------------------------------------------------
	IsStorageSupported: function () {
		if (typeof (Storage) !== "undefined") {
			return true;
		} else {
			return false;
		}
	},
	IsFolderExists: function (folderName) {
		if (window.localStorage.getItem(folderName) != null)
			return true;

		return false;
	},
	CreateFolder: function (folderName) {
		if (this.IsFolderExists(folderName))
			return true;

		var files = JSON.stringify([]);
		window.localStorage.setItem(folderName, files);
	},
	DeleteFolder: function (folderName) {
		if (!this.IsFolderExists(folderName))
			return false;

		var files = this.GetFiles(folderName);
		for (var i = 0; i < files.length; i++)
			window.localStorage.removeItem(files[i]);

		window.localStorage.removeItem(folderName);

		return true;
	},
	ClearFolder: function (folderName) {
		this.DeleteFolder(folderName);
		this.CreateFolder(folderName);
	},
	GetFiles: function (folderName) {
		if (!this.IsFolderExists(folderName))
			return null;

		return JSON.parse(window.localStorage.getItem(folderName));
	},
	DeleteFile: function (folderName, fileName, data) {
		var filesArr = this.GetFiles(folderName);
		var index = filesArr.indexOf(fileName);
		if (index > 0) {
			filesArr.splice(index, 1);
			var filesStr = JSON.stringify(filesArr);
			window.localStorage.setItem(folderName, filesStr);
		}
		window.localStorage.removeItem(folderName + "/" + fileName);
	},
	ReadFile: function (folderName, fileName) {
		var fileData = window.localStorage.getItem(
			folderName + "/" + fileName);
		if (fileData != null) {
			try {
				return this.euSign.Base64Decode(fileData);
			} catch (e) {
			}
		}

		return null;
	},
	WriteFile: function (folderName, fileName, data) {
		try {
			var dataStr = this.euSign.Base64Encode(data);

			window.localStorage.setItem(
				folderName + "/" + fileName, dataStr);

			var filesArr = this.GetFiles(folderName);
			var index = filesArr.indexOf(fileName);
			if (index < 0)
				filesArr.push(fileName);
			var filesStr = JSON.stringify(filesArr);
			window.localStorage.setItem(folderName, filesStr);
		} catch (e) {
		}
	},
	//-----------------------------------------------------------------------------
	// HTTP Requests API
	//-----------------------------------------------------------------------------
	GetDataFromServerAsync: function(path, onSuccess, onFail, asByteArray) {
		try {
			var httpRequest;
			var url;

			if (window.XMLHttpRequest)
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
				else
					onFail(httpRequest.status);
			};

			httpRequest.onerror = function() {
				onFail(400);
			};
			
			if (path.indexOf('http://') != 0) {
				if (!window.location.origin) {
					window.location.origin = window.location.protocol + 
						"//" + window.location.hostname + 
						(window.location.port ? ':' + window.location.port: '');
				}

				url = window.location.origin + path;
			} else {
				url = path;
			}

			httpRequest.open("GET", url, true);
			if (asByteArray)
				httpRequest.responseType = 'arraybuffer';
			httpRequest.send();
		} catch (e) {
			onFail(400);
		}
	},
	//-----------------------------------------------------------------------------
	// Arrays API
	//-----------------------------------------------------------------------------
	CompareArrays: function (arr1, arr2) {
		var i = arr1.length;
		if (i != arr2.length)
			return false;

		while (i--) {
			if (arr1[i] !== arr2[i])
				return false;
		}

		return true;
	},
	//-----------------------------------------------------------------------------
	// String API
	//-----------------------------------------------------------------------------
	HashCode: function(str) {
		var hash = 0, i, chr, length;

		if (str.length == 0)
			return hash;

		for (i = 0, length = str.length; i < length; i++) {
			chr   = str.charCodeAt(i);
			hash  = ((hash << 5) - hash) + chr;
			hash |= 0;
		}

		return hash;
	}
});

//=============================================================================
