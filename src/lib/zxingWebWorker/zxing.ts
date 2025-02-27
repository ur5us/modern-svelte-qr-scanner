import wasmBinaryURL from './xzingBinary.wasm?url';
var wasmBinaryFile = wasmBinaryURL;

var ZXing = (function () {
	var _scriptDir = typeof document !== "undefined" && document.currentScript ? document.currentScript.src : undefined;

	return function (ZXing) {
		ZXing = ZXing || {};

		var Module = typeof ZXing !== "undefined" ? ZXing : {};
		var readyPromiseResolve, readyPromiseReject;
		Module["ready"] = new Promise(function (resolve, reject) {
			readyPromiseResolve = resolve;
			readyPromiseReject = reject;
		});
		var moduleOverrides = {};
		var key;
		for (key in Module) {
			if (Module.hasOwnProperty(key)) {
				moduleOverrides[key] = Module[key];
			}
		}
		var arguments_ = [];
		var thisProgram = "./this.program";
		var quit_ = function (status, toThrow) {
			throw toThrow;
		};
		var ENVIRONMENT_IS_WEB = true;
		var ENVIRONMENT_IS_WORKER = false;
		var scriptDirectory = "";
		function locateFile(path) {
			if (Module["locateFile"]) {
				return Module["locateFile"](path, scriptDirectory);
			}
			return scriptDirectory + path;
		}
		var read_, readAsync, readBinary, setWindowTitle;
		if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
			if (ENVIRONMENT_IS_WORKER) {
				scriptDirectory = self.location.href;
			} else if (typeof document !== "undefined" && document.currentScript) {
				scriptDirectory = document.currentScript.src;
			}
			if (_scriptDir) {
				scriptDirectory = _scriptDir;
			}
			if (scriptDirectory.indexOf("blob:") !== 0) {
				scriptDirectory = scriptDirectory.substr(0, scriptDirectory.lastIndexOf("/") + 1);
			} else {
				scriptDirectory = "";
			}
			{
				read_ = function (url) {
					var xhr = new XMLHttpRequest();
					xhr.open("GET", url, false);
					xhr.send(null);
					return xhr.responseText;
				};
				if (ENVIRONMENT_IS_WORKER) {
					readBinary = function (url) {
						var xhr = new XMLHttpRequest();
						xhr.open("GET", url, false);
						xhr.responseType = "arraybuffer";
						xhr.send(null);
						return new Uint8Array(xhr.response);
					};
				}
				readAsync = function (url, onload, onerror) {
					var xhr = new XMLHttpRequest();
					xhr.open("GET", url, true);
					xhr.responseType = "arraybuffer";
					xhr.onload = function () {
						if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) {
							onload(xhr.response);
							return;
						}
						onerror();
					};
					xhr.onerror = onerror;
					xhr.send(null);
				};
			}
			setWindowTitle = function (title) {
				document.title = title;
			};
		}
		var out = Module["print"] || console.log.bind(console);
		var err = Module["printErr"] || console.warn.bind(console);
		for (key in moduleOverrides) {
			if (moduleOverrides.hasOwnProperty(key)) {
				Module[key] = moduleOverrides[key];
			}
		}
		moduleOverrides = null;
		if (Module["arguments"]) arguments_ = Module["arguments"];
		if (Module["thisProgram"]) thisProgram = Module["thisProgram"];
		if (Module["quit"]) quit_ = Module["quit"];
		var tempRet0 = 0;
		var setTempRet0 = function (value) {
			tempRet0 = value;
		};
		var getTempRet0 = function () {
			return tempRet0;
		};
		var wasmBinary;
		if (Module["wasmBinary"]) wasmBinary = Module["wasmBinary"];
		var noExitRuntime = Module["noExitRuntime"] || true;
		if (typeof WebAssembly !== "object") {
			abort("no native wasm support detected");
		}
		var wasmMemory;
		var ABORT = false;
		var EXITSTATUS;
		var UTF8Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : undefined;
		function UTF8ArrayToString(heap, idx, maxBytesToRead) {
			var endIdx = idx + maxBytesToRead;
			var endPtr = idx;
			while (heap[endPtr] && !(endPtr >= endIdx)) ++endPtr;
			if (endPtr - idx > 16 && heap.subarray && UTF8Decoder) {
				return UTF8Decoder.decode(heap.subarray(idx, endPtr));
			} else {
				var str = "";
				while (idx < endPtr) {
					var u0 = heap[idx++];
					if (!(u0 & 128)) {
						str += String.fromCharCode(u0);
						continue;
					}
					var u1 = heap[idx++] & 63;
					if ((u0 & 224) == 192) {
						str += String.fromCharCode(((u0 & 31) << 6) | u1);
						continue;
					}
					var u2 = heap[idx++] & 63;
					if ((u0 & 240) == 224) {
						u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
					} else {
						u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heap[idx++] & 63);
					}
					if (u0 < 65536) {
						str += String.fromCharCode(u0);
					} else {
						var ch = u0 - 65536;
						str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
					}
				}
			}
			return str;
		}
		function UTF8ToString(ptr, maxBytesToRead) {
			return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
		}
		function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
			if (!(maxBytesToWrite > 0)) return 0;
			var startIdx = outIdx;
			var endIdx = outIdx + maxBytesToWrite - 1;
			for (var i = 0; i < str.length; ++i) {
				var u = str.charCodeAt(i);
				if (u >= 55296 && u <= 57343) {
					var u1 = str.charCodeAt(++i);
					u = (65536 + ((u & 1023) << 10)) | (u1 & 1023);
				}
				if (u <= 127) {
					if (outIdx >= endIdx) break;
					heap[outIdx++] = u;
				} else if (u <= 2047) {
					if (outIdx + 1 >= endIdx) break;
					heap[outIdx++] = 192 | (u >> 6);
					heap[outIdx++] = 128 | (u & 63);
				} else if (u <= 65535) {
					if (outIdx + 2 >= endIdx) break;
					heap[outIdx++] = 224 | (u >> 12);
					heap[outIdx++] = 128 | ((u >> 6) & 63);
					heap[outIdx++] = 128 | (u & 63);
				} else {
					if (outIdx + 3 >= endIdx) break;
					heap[outIdx++] = 240 | (u >> 18);
					heap[outIdx++] = 128 | ((u >> 12) & 63);
					heap[outIdx++] = 128 | ((u >> 6) & 63);
					heap[outIdx++] = 128 | (u & 63);
				}
			}
			heap[outIdx] = 0;
			return outIdx - startIdx;
		}
		function stringToUTF8(str, outPtr, maxBytesToWrite) {
			return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
		}
		function lengthBytesUTF8(str) {
			var len = 0;
			for (var i = 0; i < str.length; ++i) {
				var u = str.charCodeAt(i);
				if (u >= 55296 && u <= 57343) u = (65536 + ((u & 1023) << 10)) | (str.charCodeAt(++i) & 1023);
				if (u <= 127) ++len;
				else if (u <= 2047) len += 2;
				else if (u <= 65535) len += 3;
				else len += 4;
			}
			return len;
		}
		var UTF16Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-16le") : undefined;
		function UTF16ToString(ptr, maxBytesToRead) {
			var endPtr = ptr;
			var idx = endPtr >> 1;
			var maxIdx = idx + maxBytesToRead / 2;
			while (!(idx >= maxIdx) && HEAPU16[idx]) ++idx;
			endPtr = idx << 1;
			if (endPtr - ptr > 32 && UTF16Decoder) {
				return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr));
			} else {
				var str = "";
				for (var i = 0; !(i >= maxBytesToRead / 2); ++i) {
					var codeUnit = HEAP16[(ptr + i * 2) >> 1];
					if (codeUnit == 0) break;
					str += String.fromCharCode(codeUnit);
				}
				return str;
			}
		}
		function stringToUTF16(str, outPtr, maxBytesToWrite) {
			if (maxBytesToWrite === undefined) {
				maxBytesToWrite = 2147483647;
			}
			if (maxBytesToWrite < 2) return 0;
			maxBytesToWrite -= 2;
			var startPtr = outPtr;
			var numCharsToWrite = maxBytesToWrite < str.length * 2 ? maxBytesToWrite / 2 : str.length;
			for (var i = 0; i < numCharsToWrite; ++i) {
				var codeUnit = str.charCodeAt(i);
				HEAP16[outPtr >> 1] = codeUnit;
				outPtr += 2;
			}
			HEAP16[outPtr >> 1] = 0;
			return outPtr - startPtr;
		}
		function lengthBytesUTF16(str) {
			return str.length * 2;
		}
		function UTF32ToString(ptr, maxBytesToRead) {
			var i = 0;
			var str = "";
			while (!(i >= maxBytesToRead / 4)) {
				var utf32 = HEAP32[(ptr + i * 4) >> 2];
				if (utf32 == 0) break;
				++i;
				if (utf32 >= 65536) {
					var ch = utf32 - 65536;
					str += String.fromCharCode(55296 | (ch >> 10), 56320 | (ch & 1023));
				} else {
					str += String.fromCharCode(utf32);
				}
			}
			return str;
		}
		function stringToUTF32(str, outPtr, maxBytesToWrite) {
			if (maxBytesToWrite === undefined) {
				maxBytesToWrite = 2147483647;
			}
			if (maxBytesToWrite < 4) return 0;
			var startPtr = outPtr;
			var endPtr = startPtr + maxBytesToWrite - 4;
			for (var i = 0; i < str.length; ++i) {
				var codeUnit = str.charCodeAt(i);
				if (codeUnit >= 55296 && codeUnit <= 57343) {
					var trailSurrogate = str.charCodeAt(++i);
					codeUnit = (65536 + ((codeUnit & 1023) << 10)) | (trailSurrogate & 1023);
				}
				HEAP32[outPtr >> 2] = codeUnit;
				outPtr += 4;
				if (outPtr + 4 > endPtr) break;
			}
			HEAP32[outPtr >> 2] = 0;
			return outPtr - startPtr;
		}
		function lengthBytesUTF32(str) {
			var len = 0;
			for (var i = 0; i < str.length; ++i) {
				var codeUnit = str.charCodeAt(i);
				if (codeUnit >= 55296 && codeUnit <= 57343) ++i;
				len += 4;
			}
			return len;
		}
		function writeArrayToMemory(array, buffer) {
			HEAP8.set(array, buffer);
		}
		function writeAsciiToMemory(str, buffer, dontAddNull) {
			for (var i = 0; i < str.length; ++i) {
				HEAP8[buffer++ >> 0] = str.charCodeAt(i);
			}
			if (!dontAddNull) HEAP8[buffer >> 0] = 0;
		}
		function alignUp(x, multiple) {
			if (x % multiple > 0) {
				x += multiple - (x % multiple);
			}
			return x;
		}
		var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
		function updateGlobalBufferAndViews(buf) {
			buffer = buf;
			Module["HEAP8"] = HEAP8 = new Int8Array(buf);
			Module["HEAP16"] = HEAP16 = new Int16Array(buf);
			Module["HEAP32"] = HEAP32 = new Int32Array(buf);
			Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
			Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
			Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
			Module["HEAPF32"] = HEAPF32 = new Float32Array(buf);
			Module["HEAPF64"] = HEAPF64 = new Float64Array(buf);
		}
		var INITIAL_MEMORY = Module["INITIAL_MEMORY"] || 16777216;
		var wasmTable;
		var __ATPRERUN__ = [];
		var __ATINIT__ = [];
		var __ATPOSTRUN__ = [];
		var runtimeInitialized = false;
		function preRun() {
			if (Module["preRun"]) {
				if (typeof Module["preRun"] == "function") Module["preRun"] = [Module["preRun"]];
				while (Module["preRun"].length) {
					addOnPreRun(Module["preRun"].shift());
				}
			}
			callRuntimeCallbacks(__ATPRERUN__);
		}
		function initRuntime() {
			runtimeInitialized = true;
			callRuntimeCallbacks(__ATINIT__);
		}
		function postRun() {
			if (Module["postRun"]) {
				if (typeof Module["postRun"] == "function") Module["postRun"] = [Module["postRun"]];
				while (Module["postRun"].length) {
					addOnPostRun(Module["postRun"].shift());
				}
			}
			callRuntimeCallbacks(__ATPOSTRUN__);
		}
		function addOnPreRun(cb) {
			__ATPRERUN__.unshift(cb);
		}
		function addOnInit(cb) {
			__ATINIT__.unshift(cb);
		}
		function addOnPostRun(cb) {
			__ATPOSTRUN__.unshift(cb);
		}
		var runDependencies = 0;
		var runDependencyWatcher = null;
		var dependenciesFulfilled = null;
		function addRunDependency(id) {
			runDependencies++;
			if (Module["monitorRunDependencies"]) {
				Module["monitorRunDependencies"](runDependencies);
			}
		}
		function removeRunDependency(id) {
			runDependencies--;
			if (Module["monitorRunDependencies"]) {
				Module["monitorRunDependencies"](runDependencies);
			}
			if (runDependencies == 0) {
				if (runDependencyWatcher !== null) {
					clearInterval(runDependencyWatcher);
					runDependencyWatcher = null;
				}
				if (dependenciesFulfilled) {
					var callback = dependenciesFulfilled;
					dependenciesFulfilled = null;
					callback();
				}
			}
		}
		Module["preloadedImages"] = {};
		Module["preloadedAudios"] = {};
		function abort(what) {
			if (Module["onAbort"]) {
				Module["onAbort"](what);
			}
			what += "";
			err(what);
			ABORT = true;
			EXITSTATUS = 1;
			what = "abort(" + what + "). Build with -s ASSERTIONS=1 for more info.";
			var e = new WebAssembly.RuntimeError(what);
			readyPromiseReject(e);
			throw e;
		}
		var dataURIPrefix = "data:application/octet-stream;base64,";
		function isDataURI(filename) {
			return filename.startsWith(dataURIPrefix);
		}
		if (!isDataURI(wasmBinaryFile)) {
			wasmBinaryFile = locateFile(wasmBinaryFile);
		}
		function getBinary(file) {
			try {
				if (file == wasmBinaryFile && wasmBinary) {
					return new Uint8Array(wasmBinary);
				}
				if (readBinary) {
					return readBinary(file);
				} else {
					throw "both async and sync fetching of the wasm failed";
				}
			} catch (err) {
				abort(err);
			}
		}
		function getBinaryPromise() {
			if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
				if (typeof fetch === "function") {
					return fetch(wasmBinaryFile, { credentials: "same-origin" })
						.then(function (response) {
							if (!response["ok"]) {
								throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
							}
							return response["arrayBuffer"]();
						})
						.catch(function () {
							return getBinary(wasmBinaryFile);
						});
				}
			}
			return Promise.resolve().then(function () {
				return getBinary(wasmBinaryFile);
			});
		}
		function createWasm() {
			var info = { a: asmLibraryArg };
			function receiveInstance(instance, module) {
				var exports = instance.exports;
				Module["asm"] = exports;
				wasmMemory = Module["asm"]["na"];
				updateGlobalBufferAndViews(wasmMemory.buffer);
				wasmTable = Module["asm"]["ra"];
				addOnInit(Module["asm"]["oa"]);
				removeRunDependency("wasm-instantiate");
			}
			addRunDependency("wasm-instantiate");
			function receiveInstantiationResult(result) {
				receiveInstance(result["instance"]);
			}
			function instantiateArrayBuffer(receiver) {
				return getBinaryPromise()
					.then(function (binary) {
						var result = WebAssembly.instantiate(binary, info);
						return result;
					})
					.then(receiver, function (reason) {
						err("failed to asynchronously prepare wasm: " + reason);
						abort(reason);
					});
			}
			function instantiateAsync() {
				if (!wasmBinary && typeof WebAssembly.instantiateStreaming === "function" && !isDataURI(wasmBinaryFile) && typeof fetch === "function") {
					return fetch(wasmBinaryFile, { credentials: "same-origin" }).then(function (response) {
						var result = WebAssembly.instantiateStreaming(response, info);
						return result.then(receiveInstantiationResult, function (reason) {
							err("wasm streaming compile failed: " + reason);
							err("falling back to ArrayBuffer instantiation");
							return instantiateArrayBuffer(receiveInstantiationResult);
						});
					});
				} else {
					return instantiateArrayBuffer(receiveInstantiationResult);
				}
			}
			if (Module["instantiateWasm"]) {
				try {
					var exports = Module["instantiateWasm"](info, receiveInstance);
					return exports;
				} catch (e) {
					err("Module.instantiateWasm callback failed with error: " + e);
					return false;
				}
			}
			instantiateAsync().catch(readyPromiseReject);
			return {};
		}
		function callRuntimeCallbacks(callbacks) {
			while (callbacks.length > 0) {
				var callback = callbacks.shift();
				if (typeof callback == "function") {
					callback(Module);
					continue;
				}
				var func = callback.func;
				if (typeof func === "number") {
					if (callback.arg === undefined) {
						wasmTable.get(func)();
					} else {
						wasmTable.get(func)(callback.arg);
					}
				} else {
					func(callback.arg === undefined ? null : callback.arg);
				}
			}
		}
		var ExceptionInfoAttrs = { DESTRUCTOR_OFFSET: 0, REFCOUNT_OFFSET: 4, TYPE_OFFSET: 8, CAUGHT_OFFSET: 12, RETHROWN_OFFSET: 13, SIZE: 16 };
		function ___cxa_allocate_exception(size) {
			return _malloc(size + ExceptionInfoAttrs.SIZE) + ExceptionInfoAttrs.SIZE;
		}
		function ExceptionInfo(excPtr) {
			this.excPtr = excPtr;
			this.ptr = excPtr - ExceptionInfoAttrs.SIZE;
			this.set_type = function (type) {
				HEAP32[(this.ptr + ExceptionInfoAttrs.TYPE_OFFSET) >> 2] = type;
			};
			this.get_type = function () {
				return HEAP32[(this.ptr + ExceptionInfoAttrs.TYPE_OFFSET) >> 2];
			};
			this.set_destructor = function (destructor) {
				HEAP32[(this.ptr + ExceptionInfoAttrs.DESTRUCTOR_OFFSET) >> 2] = destructor;
			};
			this.get_destructor = function () {
				return HEAP32[(this.ptr + ExceptionInfoAttrs.DESTRUCTOR_OFFSET) >> 2];
			};
			this.set_refcount = function (refcount) {
				HEAP32[(this.ptr + ExceptionInfoAttrs.REFCOUNT_OFFSET) >> 2] = refcount;
			};
			this.set_caught = function (caught) {
				caught = caught ? 1 : 0;
				HEAP8[(this.ptr + ExceptionInfoAttrs.CAUGHT_OFFSET) >> 0] = caught;
			};
			this.get_caught = function () {
				return HEAP8[(this.ptr + ExceptionInfoAttrs.CAUGHT_OFFSET) >> 0] != 0;
			};
			this.set_rethrown = function (rethrown) {
				rethrown = rethrown ? 1 : 0;
				HEAP8[(this.ptr + ExceptionInfoAttrs.RETHROWN_OFFSET) >> 0] = rethrown;
			};
			this.get_rethrown = function () {
				return HEAP8[(this.ptr + ExceptionInfoAttrs.RETHROWN_OFFSET) >> 0] != 0;
			};
			this.init = function (type, destructor) {
				this.set_type(type);
				this.set_destructor(destructor);
				this.set_refcount(0);
				this.set_caught(false);
				this.set_rethrown(false);
			};
			this.add_ref = function () {
				var value = HEAP32[(this.ptr + ExceptionInfoAttrs.REFCOUNT_OFFSET) >> 2];
				HEAP32[(this.ptr + ExceptionInfoAttrs.REFCOUNT_OFFSET) >> 2] = value + 1;
			};
			this.release_ref = function () {
				var prev = HEAP32[(this.ptr + ExceptionInfoAttrs.REFCOUNT_OFFSET) >> 2];
				HEAP32[(this.ptr + ExceptionInfoAttrs.REFCOUNT_OFFSET) >> 2] = prev - 1;
				return prev === 1;
			};
		}
		function CatchInfo(ptr) {
			this.free = function () {
				_free(this.ptr);
				this.ptr = 0;
			};
			this.set_base_ptr = function (basePtr) {
				HEAP32[this.ptr >> 2] = basePtr;
			};
			this.get_base_ptr = function () {
				return HEAP32[this.ptr >> 2];
			};
			this.set_adjusted_ptr = function (adjustedPtr) {
				var ptrSize = 4;
				HEAP32[(this.ptr + ptrSize) >> 2] = adjustedPtr;
			};
			this.get_adjusted_ptr = function () {
				var ptrSize = 4;
				return HEAP32[(this.ptr + ptrSize) >> 2];
			};
			this.get_exception_ptr = function () {
				var isPointer = ___cxa_is_pointer_type(this.get_exception_info().get_type());
				if (isPointer) {
					return HEAP32[this.get_base_ptr() >> 2];
				}
				var adjusted = this.get_adjusted_ptr();
				if (adjusted !== 0) return adjusted;
				return this.get_base_ptr();
			};
			this.get_exception_info = function () {
				return new ExceptionInfo(this.get_base_ptr());
			};
			if (ptr === undefined) {
				this.ptr = _malloc(8);
				this.set_adjusted_ptr(0);
			} else {
				this.ptr = ptr;
			}
		}
		var exceptionCaught = [];
		function exception_addRef(info) {
			info.add_ref();
		}
		var uncaughtExceptionCount = 0;
		function ___cxa_begin_catch(ptr) {
			var catchInfo = new CatchInfo(ptr);
			var info = catchInfo.get_exception_info();
			if (!info.get_caught()) {
				info.set_caught(true);
				uncaughtExceptionCount--;
			}
			info.set_rethrown(false);
			exceptionCaught.push(catchInfo);
			exception_addRef(info);
			return catchInfo.get_exception_ptr();
		}
		var exceptionLast = 0;
		function ___cxa_free_exception(ptr) {
			return _free(new ExceptionInfo(ptr).ptr);
		}
		function exception_decRef(info) {
			if (info.release_ref() && !info.get_rethrown()) {
				var destructor = info.get_destructor();
				if (destructor) {
					wasmTable.get(destructor)(info.excPtr);
				}
				___cxa_free_exception(info.excPtr);
			}
		}
		function ___cxa_end_catch() {
			_setThrew(0);
			var catchInfo = exceptionCaught.pop();
			exception_decRef(catchInfo.get_exception_info());
			catchInfo.free();
			exceptionLast = 0;
		}
		function ___resumeException(catchInfoPtr) {
			var catchInfo = new CatchInfo(catchInfoPtr);
			var ptr = catchInfo.get_base_ptr();
			if (!exceptionLast) {
				exceptionLast = ptr;
			}
			catchInfo.free();
			throw ptr;
		}
		function ___cxa_find_matching_catch_2() {
			var thrown = exceptionLast;
			if (!thrown) {
				setTempRet0(0);
				return 0 | 0;
			}
			var info = new ExceptionInfo(thrown);
			var thrownType = info.get_type();
			var catchInfo = new CatchInfo();
			catchInfo.set_base_ptr(thrown);
			if (!thrownType) {
				setTempRet0(0);
				return catchInfo.ptr | 0;
			}
			var typeArray = Array.prototype.slice.call(arguments);
			var stackTop = stackSave();
			var exceptionThrowBuf = stackAlloc(4);
			HEAP32[exceptionThrowBuf >> 2] = thrown;
			for (var i = 0; i < typeArray.length; i++) {
				var caughtType = typeArray[i];
				if (caughtType === 0 || caughtType === thrownType) {
					break;
				}
				if (___cxa_can_catch(caughtType, thrownType, exceptionThrowBuf)) {
					var adjusted = HEAP32[exceptionThrowBuf >> 2];
					if (thrown !== adjusted) {
						catchInfo.set_adjusted_ptr(adjusted);
					}
					setTempRet0(caughtType);
					return catchInfo.ptr | 0;
				}
			}
			stackRestore(stackTop);
			setTempRet0(thrownType);
			return catchInfo.ptr | 0;
		}
		function ___cxa_find_matching_catch_3() {
			var thrown = exceptionLast;
			if (!thrown) {
				setTempRet0(0);
				return 0 | 0;
			}
			var info = new ExceptionInfo(thrown);
			var thrownType = info.get_type();
			var catchInfo = new CatchInfo();
			catchInfo.set_base_ptr(thrown);
			if (!thrownType) {
				setTempRet0(0);
				return catchInfo.ptr | 0;
			}
			var typeArray = Array.prototype.slice.call(arguments);
			var stackTop = stackSave();
			var exceptionThrowBuf = stackAlloc(4);
			HEAP32[exceptionThrowBuf >> 2] = thrown;
			for (var i = 0; i < typeArray.length; i++) {
				var caughtType = typeArray[i];
				if (caughtType === 0 || caughtType === thrownType) {
					break;
				}
				if (___cxa_can_catch(caughtType, thrownType, exceptionThrowBuf)) {
					var adjusted = HEAP32[exceptionThrowBuf >> 2];
					if (thrown !== adjusted) {
						catchInfo.set_adjusted_ptr(adjusted);
					}
					setTempRet0(caughtType);
					return catchInfo.ptr | 0;
				}
			}
			stackRestore(stackTop);
			setTempRet0(thrownType);
			return catchInfo.ptr | 0;
		}
		function ___cxa_find_matching_catch_4() {
			var thrown = exceptionLast;
			if (!thrown) {
				setTempRet0(0);
				return 0 | 0;
			}
			var info = new ExceptionInfo(thrown);
			var thrownType = info.get_type();
			var catchInfo = new CatchInfo();
			catchInfo.set_base_ptr(thrown);
			if (!thrownType) {
				setTempRet0(0);
				return catchInfo.ptr | 0;
			}
			var typeArray = Array.prototype.slice.call(arguments);
			var stackTop = stackSave();
			var exceptionThrowBuf = stackAlloc(4);
			HEAP32[exceptionThrowBuf >> 2] = thrown;
			for (var i = 0; i < typeArray.length; i++) {
				var caughtType = typeArray[i];
				if (caughtType === 0 || caughtType === thrownType) {
					break;
				}
				if (___cxa_can_catch(caughtType, thrownType, exceptionThrowBuf)) {
					var adjusted = HEAP32[exceptionThrowBuf >> 2];
					if (thrown !== adjusted) {
						catchInfo.set_adjusted_ptr(adjusted);
					}
					setTempRet0(caughtType);
					return catchInfo.ptr | 0;
				}
			}
			stackRestore(stackTop);
			setTempRet0(thrownType);
			return catchInfo.ptr | 0;
		}
		function ___cxa_rethrow() {
			var catchInfo = exceptionCaught.pop();
			if (!catchInfo) {
				abort("no exception to throw");
			}
			var info = catchInfo.get_exception_info();
			var ptr = catchInfo.get_base_ptr();
			if (!info.get_rethrown()) {
				exceptionCaught.push(catchInfo);
				info.set_rethrown(true);
				info.set_caught(false);
				uncaughtExceptionCount++;
			} else {
				catchInfo.free();
			}
			exceptionLast = ptr;
			throw ptr;
		}
		function ___cxa_throw(ptr, type, destructor) {
			var info = new ExceptionInfo(ptr);
			info.init(type, destructor);
			exceptionLast = ptr;
			uncaughtExceptionCount++;
			throw ptr;
		}
		function ___cxa_uncaught_exceptions() {
			return uncaughtExceptionCount;
		}
		var structRegistrations = {};
		function runDestructors(destructors) {
			while (destructors.length) {
				var ptr = destructors.pop();
				var del = destructors.pop();
				del(ptr);
			}
		}
		function simpleReadValueFromPointer(pointer) {
			return this["fromWireType"](HEAPU32[pointer >> 2]);
		}
		var awaitingDependencies = {};
		var registeredTypes = {};
		var typeDependencies = {};
		var char_0 = 48;
		var char_9 = 57;
		function makeLegalFunctionName(name) {
			if (undefined === name) {
				return "_unknown";
			}
			name = name.replace(/[^a-zA-Z0-9_]/g, "$");
			var f = name.charCodeAt(0);
			if (f >= char_0 && f <= char_9) {
				return "_" + name;
			} else {
				return name;
			}
		}
		function createNamedFunction(name, body) {
			name = makeLegalFunctionName(name);
			return new Function("body", "return function " + name + "() {\n" + '    "use strict";' + "    return body.apply(this, arguments);\n" + "};\n")(body);
		}
		function extendError(baseErrorType, errorName) {
			var errorClass = createNamedFunction(errorName, function (message) {
				this.name = errorName;
				this.message = message;
				var stack = new Error(message).stack;
				if (stack !== undefined) {
					this.stack = this.toString() + "\n" + stack.replace(/^Error(:[^\n]*)?\n/, "");
				}
			});
			errorClass.prototype = Object.create(baseErrorType.prototype);
			errorClass.prototype.constructor = errorClass;
			errorClass.prototype.toString = function () {
				if (this.message === undefined) {
					return this.name;
				} else {
					return this.name + ": " + this.message;
				}
			};
			return errorClass;
		}
		var InternalError = undefined;
		function throwInternalError(message) {
			throw new InternalError(message);
		}
		function whenDependentTypesAreResolved(myTypes, dependentTypes, getTypeConverters) {
			myTypes.forEach(function (type) {
				typeDependencies[type] = dependentTypes;
			});
			function onComplete(typeConverters) {
				var myTypeConverters = getTypeConverters(typeConverters);
				if (myTypeConverters.length !== myTypes.length) {
					throwInternalError("Mismatched type converter count");
				}
				for (var i = 0; i < myTypes.length; ++i) {
					registerType(myTypes[i], myTypeConverters[i]);
				}
			}
			var typeConverters = new Array(dependentTypes.length);
			var unregisteredTypes = [];
			var registered = 0;
			dependentTypes.forEach(function (dt, i) {
				if (registeredTypes.hasOwnProperty(dt)) {
					typeConverters[i] = registeredTypes[dt];
				} else {
					unregisteredTypes.push(dt);
					if (!awaitingDependencies.hasOwnProperty(dt)) {
						awaitingDependencies[dt] = [];
					}
					awaitingDependencies[dt].push(function () {
						typeConverters[i] = registeredTypes[dt];
						++registered;
						if (registered === unregisteredTypes.length) {
							onComplete(typeConverters);
						}
					});
				}
			});
			if (0 === unregisteredTypes.length) {
				onComplete(typeConverters);
			}
		}
		function __embind_finalize_value_object(structType) {
			var reg = structRegistrations[structType];
			delete structRegistrations[structType];
			var rawConstructor = reg.rawConstructor;
			var rawDestructor = reg.rawDestructor;
			var fieldRecords = reg.fields;
			var fieldTypes = fieldRecords
				.map(function (field) {
					return field.getterReturnType;
				})
				.concat(
					fieldRecords.map(function (field) {
						return field.setterArgumentType;
					})
				);
			whenDependentTypesAreResolved([structType], fieldTypes, function (fieldTypes) {
				var fields = {};
				fieldRecords.forEach(function (field, i) {
					var fieldName = field.fieldName;
					var getterReturnType = fieldTypes[i];
					var getter = field.getter;
					var getterContext = field.getterContext;
					var setterArgumentType = fieldTypes[i + fieldRecords.length];
					var setter = field.setter;
					var setterContext = field.setterContext;
					fields[fieldName] = {
						read: function (ptr) {
							return getterReturnType["fromWireType"](getter(getterContext, ptr));
						},
						write: function (ptr, o) {
							var destructors = [];
							setter(setterContext, ptr, setterArgumentType["toWireType"](destructors, o));
							runDestructors(destructors);
						},
					};
				});
				return [
					{
						name: reg.name,
						fromWireType: function (ptr) {
							var rv = {};
							for (var i in fields) {
								rv[i] = fields[i].read(ptr);
							}
							rawDestructor(ptr);
							return rv;
						},
						toWireType: function (destructors, o) {
							for (var fieldName in fields) {
								if (!(fieldName in o)) {
									throw new TypeError('Missing field:  "' + fieldName + '"');
								}
							}
							var ptr = rawConstructor();
							for (fieldName in fields) {
								fields[fieldName].write(ptr, o[fieldName]);
							}
							if (destructors !== null) {
								destructors.push(rawDestructor, ptr);
							}
							return ptr;
						},
						argPackAdvance: 8,
						readValueFromPointer: simpleReadValueFromPointer,
						destructorFunction: rawDestructor,
					},
				];
			});
		}
		function getShiftFromSize(size) {
			switch (size) {
				case 1:
					return 0;
				case 2:
					return 1;
				case 4:
					return 2;
				case 8:
					return 3;
				default:
					throw new TypeError("Unknown type size: " + size);
			}
		}
		function embind_init_charCodes() {
			var codes = new Array(256);
			for (var i = 0; i < 256; ++i) {
				codes[i] = String.fromCharCode(i);
			}
			embind_charCodes = codes;
		}
		var embind_charCodes = undefined;
		function readLatin1String(ptr) {
			var ret = "";
			var c = ptr;
			while (HEAPU8[c]) {
				ret += embind_charCodes[HEAPU8[c++]];
			}
			return ret;
		}
		var BindingError = undefined;
		function throwBindingError(message) {
			throw new BindingError(message);
		}
		function registerType(rawType, registeredInstance, options) {
			options = options || {};
			if (!("argPackAdvance" in registeredInstance)) {
				throw new TypeError("registerType registeredInstance requires argPackAdvance");
			}
			var name = registeredInstance.name;
			if (!rawType) {
				throwBindingError('type "' + name + '" must have a positive integer typeid pointer');
			}
			if (registeredTypes.hasOwnProperty(rawType)) {
				if (options.ignoreDuplicateRegistrations) {
					return;
				} else {
					throwBindingError("Cannot register type '" + name + "' twice");
				}
			}
			registeredTypes[rawType] = registeredInstance;
			delete typeDependencies[rawType];
			if (awaitingDependencies.hasOwnProperty(rawType)) {
				var callbacks = awaitingDependencies[rawType];
				delete awaitingDependencies[rawType];
				callbacks.forEach(function (cb) {
					cb();
				});
			}
		}
		function __embind_register_bool(rawType, name, size, trueValue, falseValue) {
			var shift = getShiftFromSize(size);
			name = readLatin1String(name);
			registerType(rawType, {
				name: name,
				fromWireType: function (wt) {
					return !!wt;
				},
				toWireType: function (destructors, o) {
					return o ? trueValue : falseValue;
				},
				argPackAdvance: 8,
				readValueFromPointer: function (pointer) {
					var heap;
					if (size === 1) {
						heap = HEAP8;
					} else if (size === 2) {
						heap = HEAP16;
					} else if (size === 4) {
						heap = HEAP32;
					} else {
						throw new TypeError("Unknown boolean type size: " + name);
					}
					return this["fromWireType"](heap[pointer >> shift]);
				},
				destructorFunction: null,
			});
		}
		var emval_free_list = [];
		var emval_handle_array = [{}, { value: undefined }, { value: null }, { value: true }, { value: false }];
		function __emval_decref(handle) {
			if (handle > 4 && 0 === --emval_handle_array[handle].refcount) {
				emval_handle_array[handle] = undefined;
				emval_free_list.push(handle);
			}
		}
		function count_emval_handles() {
			var count = 0;
			for (var i = 5; i < emval_handle_array.length; ++i) {
				if (emval_handle_array[i] !== undefined) {
					++count;
				}
			}
			return count;
		}
		function get_first_emval() {
			for (var i = 5; i < emval_handle_array.length; ++i) {
				if (emval_handle_array[i] !== undefined) {
					return emval_handle_array[i];
				}
			}
			return null;
		}
		function init_emval() {
			Module["count_emval_handles"] = count_emval_handles;
			Module["get_first_emval"] = get_first_emval;
		}
		function __emval_register(value) {
			switch (value) {
				case undefined: {
					return 1;
				}
				case null: {
					return 2;
				}
				case true: {
					return 3;
				}
				case false: {
					return 4;
				}
				default: {
					var handle = emval_free_list.length ? emval_free_list.pop() : emval_handle_array.length;
					emval_handle_array[handle] = { refcount: 1, value: value };
					return handle;
				}
			}
		}
		function __embind_register_emval(rawType, name) {
			name = readLatin1String(name);
			registerType(rawType, {
				name: name,
				fromWireType: function (handle) {
					var rv = emval_handle_array[handle].value;
					__emval_decref(handle);
					return rv;
				},
				toWireType: function (destructors, value) {
					return __emval_register(value);
				},
				argPackAdvance: 8,
				readValueFromPointer: simpleReadValueFromPointer,
				destructorFunction: null,
			});
		}
		function _embind_repr(v) {
			if (v === null) {
				return "null";
			}
			var t = typeof v;
			if (t === "object" || t === "function") {
				return v.toString();
			} else {
				return "" + v;
			}
		}
		function floatReadValueFromPointer(name, shift) {
			switch (shift) {
				case 2:
					return function (pointer) {
						return this["fromWireType"](HEAPF32[pointer >> 2]);
					};
				case 3:
					return function (pointer) {
						return this["fromWireType"](HEAPF64[pointer >> 3]);
					};
				default:
					throw new TypeError("Unknown float type: " + name);
			}
		}
		function __embind_register_float(rawType, name, size) {
			var shift = getShiftFromSize(size);
			name = readLatin1String(name);
			registerType(rawType, {
				name: name,
				fromWireType: function (value) {
					return value;
				},
				toWireType: function (destructors, value) {
					if (typeof value !== "number" && typeof value !== "boolean") {
						throw new TypeError('Cannot convert "' + _embind_repr(value) + '" to ' + this.name);
					}
					return value;
				},
				argPackAdvance: 8,
				readValueFromPointer: floatReadValueFromPointer(name, shift),
				destructorFunction: null,
			});
		}
		function new_(constructor, argumentList) {
			if (!(constructor instanceof Function)) {
				throw new TypeError("new_ called with constructor type " + typeof constructor + " which is not a function");
			}
			var dummy = createNamedFunction(constructor.name || "unknownFunctionName", function () { });
			dummy.prototype = constructor.prototype;
			var obj = new dummy();
			var r = constructor.apply(obj, argumentList);
			return r instanceof Object ? r : obj;
		}
		function craftInvokerFunction(humanName, argTypes, classType, cppInvokerFunc, cppTargetFunc) {
			var argCount = argTypes.length;
			if (argCount < 2) {
				throwBindingError("argTypes array size mismatch! Must at least get return value and 'this' types!");
			}
			var isClassMethodFunc = argTypes[1] !== null && classType !== null;
			var needsDestructorStack = false;
			for (var i = 1; i < argTypes.length; ++i) {
				if (argTypes[i] !== null && argTypes[i].destructorFunction === undefined) {
					needsDestructorStack = true;
					break;
				}
			}
			var returns = argTypes[0].name !== "void";
			var argsList = "";
			var argsListWired = "";
			for (var i = 0; i < argCount - 2; ++i) {
				argsList += (i !== 0 ? ", " : "") + "arg" + i;
				argsListWired += (i !== 0 ? ", " : "") + "arg" + i + "Wired";
			}
			var invokerFnBody =
				"return function " +
				makeLegalFunctionName(humanName) +
				"(" +
				argsList +
				") {\n" +
				"if (arguments.length !== " +
				(argCount - 2) +
				") {\n" +
				"throwBindingError('function " +
				humanName +
				" called with ' + arguments.length + ' arguments, expected " +
				(argCount - 2) +
				" args!');\n" +
				"}\n";
			if (needsDestructorStack) {
				invokerFnBody += "var destructors = [];\n";
			}
			var dtorStack = needsDestructorStack ? "destructors" : "null";
			var args1 = ["throwBindingError", "invoker", "fn", "runDestructors", "retType", "classParam"];
			var args2 = [throwBindingError, cppInvokerFunc, cppTargetFunc, runDestructors, argTypes[0], argTypes[1]];
			if (isClassMethodFunc) {
				invokerFnBody += "var thisWired = classParam.toWireType(" + dtorStack + ", this);\n";
			}
			for (var i = 0; i < argCount - 2; ++i) {
				invokerFnBody += "var arg" + i + "Wired = argType" + i + ".toWireType(" + dtorStack + ", arg" + i + "); // " + argTypes[i + 2].name + "\n";
				args1.push("argType" + i);
				args2.push(argTypes[i + 2]);
			}
			if (isClassMethodFunc) {
				argsListWired = "thisWired" + (argsListWired.length > 0 ? ", " : "") + argsListWired;
			}
			invokerFnBody += (returns ? "var rv = " : "") + "invoker(fn" + (argsListWired.length > 0 ? ", " : "") + argsListWired + ");\n";
			if (needsDestructorStack) {
				invokerFnBody += "runDestructors(destructors);\n";
			} else {
				for (var i = isClassMethodFunc ? 1 : 2; i < argTypes.length; ++i) {
					var paramName = i === 1 ? "thisWired" : "arg" + (i - 2) + "Wired";
					if (argTypes[i].destructorFunction !== null) {
						invokerFnBody += paramName + "_dtor(" + paramName + "); // " + argTypes[i].name + "\n";
						args1.push(paramName + "_dtor");
						args2.push(argTypes[i].destructorFunction);
					}
				}
			}
			if (returns) {
				invokerFnBody += "var ret = retType.fromWireType(rv);\n" + "return ret;\n";
			} else {
			}
			invokerFnBody += "}\n";
			args1.push(invokerFnBody);
			var invokerFunction = new_(Function, args1).apply(null, args2);
			return invokerFunction;
		}
		function ensureOverloadTable(proto, methodName, humanName) {
			if (undefined === proto[methodName].overloadTable) {
				var prevFunc = proto[methodName];
				proto[methodName] = function () {
					if (!proto[methodName].overloadTable.hasOwnProperty(arguments.length)) {
						throwBindingError("Function '" + humanName + "' called with an invalid number of arguments (" + arguments.length + ") - expects one of (" + proto[methodName].overloadTable + ")!");
					}
					return proto[methodName].overloadTable[arguments.length].apply(this, arguments);
				};
				proto[methodName].overloadTable = [];
				proto[methodName].overloadTable[prevFunc.argCount] = prevFunc;
			}
		}
		function exposePublicSymbol(name, value, numArguments) {
			if (Module.hasOwnProperty(name)) {
				if (undefined === numArguments || (undefined !== Module[name].overloadTable && undefined !== Module[name].overloadTable[numArguments])) {
					throwBindingError("Cannot register public name '" + name + "' twice");
				}
				ensureOverloadTable(Module, name, name);
				if (Module.hasOwnProperty(numArguments)) {
					throwBindingError("Cannot register multiple overloads of a function with the same number of arguments (" + numArguments + ")!");
				}
				Module[name].overloadTable[numArguments] = value;
			} else {
				Module[name] = value;
				if (undefined !== numArguments) {
					Module[name].numArguments = numArguments;
				}
			}
		}
		function heap32VectorToArray(count, firstElement) {
			var array = [];
			for (var i = 0; i < count; i++) {
				array.push(HEAP32[(firstElement >> 2) + i]);
			}
			return array;
		}
		function replacePublicSymbol(name, value, numArguments) {
			if (!Module.hasOwnProperty(name)) {
				throwInternalError("Replacing nonexistant public symbol");
			}
			if (undefined !== Module[name].overloadTable && undefined !== numArguments) {
				Module[name].overloadTable[numArguments] = value;
			} else {
				Module[name] = value;
				Module[name].argCount = numArguments;
			}
		}
		function dynCallLegacy(sig, ptr, args) {
			var f = Module["dynCall_" + sig];
			return args && args.length ? f.apply(null, [ptr].concat(args)) : f.call(null, ptr);
		}
		function dynCall(sig, ptr, args) {
			if (sig.includes("j")) {
				return dynCallLegacy(sig, ptr, args);
			}
			return wasmTable.get(ptr).apply(null, args);
		}
		function getDynCaller(sig, ptr) {
			var argCache = [];
			return function () {
				argCache.length = arguments.length;
				for (var i = 0; i < arguments.length; i++) {
					argCache[i] = arguments[i];
				}
				return dynCall(sig, ptr, argCache);
			};
		}
		function embind__requireFunction(signature, rawFunction) {
			signature = readLatin1String(signature);
			function makeDynCaller() {
				if (signature.includes("j")) {
					return getDynCaller(signature, rawFunction);
				}
				return wasmTable.get(rawFunction);
			}
			var fp = makeDynCaller();
			if (typeof fp !== "function") {
				throwBindingError("unknown function pointer with signature " + signature + ": " + rawFunction);
			}
			return fp;
		}
		var UnboundTypeError = undefined;
		function getTypeName(type) {
			var ptr = ___getTypeName(type);
			var rv = readLatin1String(ptr);
			_free(ptr);
			return rv;
		}
		function throwUnboundTypeError(message, types) {
			var unboundTypes = [];
			var seen = {};
			function visit(type) {
				if (seen[type]) {
					return;
				}
				if (registeredTypes[type]) {
					return;
				}
				if (typeDependencies[type]) {
					typeDependencies[type].forEach(visit);
					return;
				}
				unboundTypes.push(type);
				seen[type] = true;
			}
			types.forEach(visit);
			throw new UnboundTypeError(message + ": " + unboundTypes.map(getTypeName).join([", "]));
		}
		function __embind_register_function(name, argCount, rawArgTypesAddr, signature, rawInvoker, fn) {
			var argTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
			name = readLatin1String(name);
			rawInvoker = embind__requireFunction(signature, rawInvoker);
			exposePublicSymbol(
				name,
				function () {
					throwUnboundTypeError("Cannot call " + name + " due to unbound types", argTypes);
				},
				argCount - 1
			);
			whenDependentTypesAreResolved([], argTypes, function (argTypes) {
				var invokerArgsArray = [argTypes[0], null].concat(argTypes.slice(1));
				replacePublicSymbol(name, craftInvokerFunction(name, invokerArgsArray, null, rawInvoker, fn), argCount - 1);
				return [];
			});
		}
		function integerReadValueFromPointer(name, shift, signed) {
			switch (shift) {
				case 0:
					return signed
						? function readS8FromPointer(pointer) {
							return HEAP8[pointer];
						}
						: function readU8FromPointer(pointer) {
							return HEAPU8[pointer];
						};
				case 1:
					return signed
						? function readS16FromPointer(pointer) {
							return HEAP16[pointer >> 1];
						}
						: function readU16FromPointer(pointer) {
							return HEAPU16[pointer >> 1];
						};
				case 2:
					return signed
						? function readS32FromPointer(pointer) {
							return HEAP32[pointer >> 2];
						}
						: function readU32FromPointer(pointer) {
							return HEAPU32[pointer >> 2];
						};
				default:
					throw new TypeError("Unknown integer type: " + name);
			}
		}
		function __embind_register_integer(primitiveType, name, size, minRange, maxRange) {
			name = readLatin1String(name);
			if (maxRange === -1) {
				maxRange = 4294967295;
			}
			var shift = getShiftFromSize(size);
			var fromWireType = function (value) {
				return value;
			};
			if (minRange === 0) {
				var bitshift = 32 - 8 * size;
				fromWireType = function (value) {
					return (value << bitshift) >>> bitshift;
				};
			}
			var isUnsignedType = name.includes("unsigned");
			registerType(primitiveType, {
				name: name,
				fromWireType: fromWireType,
				toWireType: function (destructors, value) {
					if (typeof value !== "number" && typeof value !== "boolean") {
						throw new TypeError('Cannot convert "' + _embind_repr(value) + '" to ' + this.name);
					}
					if (value < minRange || value > maxRange) {
						throw new TypeError('Passing a number "' + _embind_repr(value) + '" from JS side to C/C++ side to an argument of type "' + name + '", which is outside the valid range [' + minRange + ", " + maxRange + "]!");
					}
					return isUnsignedType ? value >>> 0 : value | 0;
				},
				argPackAdvance: 8,
				readValueFromPointer: integerReadValueFromPointer(name, shift, minRange !== 0),
				destructorFunction: null,
			});
		}
		function __embind_register_memory_view(rawType, dataTypeIndex, name) {
			var typeMapping = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array];
			var TA = typeMapping[dataTypeIndex];
			function decodeMemoryView(handle) {
				handle = handle >> 2;
				var heap = HEAPU32;
				var size = heap[handle];
				var data = heap[handle + 1];
				return new TA(buffer, data, size);
			}
			name = readLatin1String(name);
			registerType(rawType, { name: name, fromWireType: decodeMemoryView, argPackAdvance: 8, readValueFromPointer: decodeMemoryView }, { ignoreDuplicateRegistrations: true });
		}
		function __embind_register_std_string(rawType, name) {
			name = readLatin1String(name);
			var stdStringIsUTF8 = name === "std::string";
			registerType(rawType, {
				name: name,
				fromWireType: function (value) {
					var length = HEAPU32[value >> 2];
					var str;
					if (stdStringIsUTF8) {
						var decodeStartPtr = value + 4;
						for (var i = 0; i <= length; ++i) {
							var currentBytePtr = value + 4 + i;
							if (i == length || HEAPU8[currentBytePtr] == 0) {
								var maxRead = currentBytePtr - decodeStartPtr;
								var stringSegment = UTF8ToString(decodeStartPtr, maxRead);
								if (str === undefined) {
									str = stringSegment;
								} else {
									str += String.fromCharCode(0);
									str += stringSegment;
								}
								decodeStartPtr = currentBytePtr + 1;
							}
						}
					} else {
						var a = new Array(length);
						for (var i = 0; i < length; ++i) {
							a[i] = String.fromCharCode(HEAPU8[value + 4 + i]);
						}
						str = a.join("");
					}
					_free(value);
					return str;
				},
				toWireType: function (destructors, value) {
					if (value instanceof ArrayBuffer) {
						value = new Uint8Array(value);
					}
					var getLength;
					var valueIsOfTypeString = typeof value === "string";
					if (!(valueIsOfTypeString || value instanceof Uint8Array || value instanceof Uint8ClampedArray || value instanceof Int8Array)) {
						throwBindingError("Cannot pass non-string to std::string");
					}
					if (stdStringIsUTF8 && valueIsOfTypeString) {
						getLength = function () {
							return lengthBytesUTF8(value);
						};
					} else {
						getLength = function () {
							return value.length;
						};
					}
					var length = getLength();
					var ptr = _malloc(4 + length + 1);
					HEAPU32[ptr >> 2] = length;
					if (stdStringIsUTF8 && valueIsOfTypeString) {
						stringToUTF8(value, ptr + 4, length + 1);
					} else {
						if (valueIsOfTypeString) {
							for (var i = 0; i < length; ++i) {
								var charCode = value.charCodeAt(i);
								if (charCode > 255) {
									_free(ptr);
									throwBindingError("String has UTF-16 code units that do not fit in 8 bits");
								}
								HEAPU8[ptr + 4 + i] = charCode;
							}
						} else {
							for (var i = 0; i < length; ++i) {
								HEAPU8[ptr + 4 + i] = value[i];
							}
						}
					}
					if (destructors !== null) {
						destructors.push(_free, ptr);
					}
					return ptr;
				},
				argPackAdvance: 8,
				readValueFromPointer: simpleReadValueFromPointer,
				destructorFunction: function (ptr) {
					_free(ptr);
				},
			});
		}
		function __embind_register_std_wstring(rawType, charSize, name) {
			name = readLatin1String(name);
			var decodeString, encodeString, getHeap, lengthBytesUTF, shift;
			if (charSize === 2) {
				decodeString = UTF16ToString;
				encodeString = stringToUTF16;
				lengthBytesUTF = lengthBytesUTF16;
				getHeap = function () {
					return HEAPU16;
				};
				shift = 1;
			} else if (charSize === 4) {
				decodeString = UTF32ToString;
				encodeString = stringToUTF32;
				lengthBytesUTF = lengthBytesUTF32;
				getHeap = function () {
					return HEAPU32;
				};
				shift = 2;
			}
			registerType(rawType, {
				name: name,
				fromWireType: function (value) {
					var length = HEAPU32[value >> 2];
					var HEAP = getHeap();
					var str;
					var decodeStartPtr = value + 4;
					for (var i = 0; i <= length; ++i) {
						var currentBytePtr = value + 4 + i * charSize;
						if (i == length || HEAP[currentBytePtr >> shift] == 0) {
							var maxReadBytes = currentBytePtr - decodeStartPtr;
							var stringSegment = decodeString(decodeStartPtr, maxReadBytes);
							if (str === undefined) {
								str = stringSegment;
							} else {
								str += String.fromCharCode(0);
								str += stringSegment;
							}
							decodeStartPtr = currentBytePtr + charSize;
						}
					}
					_free(value);
					return str;
				},
				toWireType: function (destructors, value) {
					if (!(typeof value === "string")) {
						throwBindingError("Cannot pass non-string to C++ string type " + name);
					}
					var length = lengthBytesUTF(value);
					var ptr = _malloc(4 + length + charSize);
					HEAPU32[ptr >> 2] = length >> shift;
					encodeString(value, ptr + 4, length + charSize);
					if (destructors !== null) {
						destructors.push(_free, ptr);
					}
					return ptr;
				},
				argPackAdvance: 8,
				readValueFromPointer: simpleReadValueFromPointer,
				destructorFunction: function (ptr) {
					_free(ptr);
				},
			});
		}
		function __embind_register_value_object(rawType, name, constructorSignature, rawConstructor, destructorSignature, rawDestructor) {
			structRegistrations[rawType] = {
				name: readLatin1String(name),
				rawConstructor: embind__requireFunction(constructorSignature, rawConstructor),
				rawDestructor: embind__requireFunction(destructorSignature, rawDestructor),
				fields: [],
			};
		}
		function __embind_register_value_object_field(structType, fieldName, getterReturnType, getterSignature, getter, getterContext, setterArgumentType, setterSignature, setter, setterContext) {
			structRegistrations[structType].fields.push({
				fieldName: readLatin1String(fieldName),
				getterReturnType: getterReturnType,
				getter: embind__requireFunction(getterSignature, getter),
				getterContext: getterContext,
				setterArgumentType: setterArgumentType,
				setter: embind__requireFunction(setterSignature, setter),
				setterContext: setterContext,
			});
		}
		function __embind_register_void(rawType, name) {
			name = readLatin1String(name);
			registerType(rawType, {
				isVoid: true,
				name: name,
				argPackAdvance: 0,
				fromWireType: function () {
					return undefined;
				},
				toWireType: function (destructors, o) {
					return undefined;
				},
			});
		}
		function _abort() {
			abort();
		}
		function _emscripten_memcpy_big(dest, src, num) {
			HEAPU8.copyWithin(dest, src, src + num);
		}
		function emscripten_realloc_buffer(size) {
			try {
				wasmMemory.grow((size - buffer.byteLength + 65535) >>> 16);
				updateGlobalBufferAndViews(wasmMemory.buffer);
				return 1;
			} catch (e) { }
		}
		function _emscripten_resize_heap(requestedSize) {
			var oldSize = HEAPU8.length;
			requestedSize = requestedSize >>> 0;
			var maxHeapSize = 2147483648;
			if (requestedSize > maxHeapSize) {
				return false;
			}
			for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
				var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown);
				overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296);
				var newSize = Math.min(maxHeapSize, alignUp(Math.max(requestedSize, overGrownHeapSize), 65536));
				var replacement = emscripten_realloc_buffer(newSize);
				if (replacement) {
					return true;
				}
			}
			return false;
		}
		var ENV = {};
		function getExecutableName() {
			return thisProgram || "./this.program";
		}
		function getEnvStrings() {
			if (!getEnvStrings.strings) {
				var lang = ((typeof navigator === "object" && navigator.languages && navigator.languages[0]) || "C").replace("-", "_") + ".UTF-8";
				var env = { USER: "web_user", LOGNAME: "web_user", PATH: "/", PWD: "/", HOME: "/home/web_user", LANG: lang, _: getExecutableName() };
				for (var x in ENV) {
					env[x] = ENV[x];
				}
				var strings = [];
				for (var x in env) {
					strings.push(x + "=" + env[x]);
				}
				getEnvStrings.strings = strings;
			}
			return getEnvStrings.strings;
		}
		var SYSCALLS = {
			mappings: {},
			buffers: [null, [], []],
			printChar: function (stream, curr) {
				var buffer = SYSCALLS.buffers[stream];
				if (curr === 0 || curr === 10) {
					(stream === 1 ? out : err)(UTF8ArrayToString(buffer, 0));
					buffer.length = 0;
				} else {
					buffer.push(curr);
				}
			},
			varargs: undefined,
			get: function () {
				SYSCALLS.varargs += 4;
				var ret = HEAP32[(SYSCALLS.varargs - 4) >> 2];
				return ret;
			},
			getStr: function (ptr) {
				var ret = UTF8ToString(ptr);
				return ret;
			},
			get64: function (low, high) {
				return low;
			},
		};
		function _environ_get(__environ, environ_buf) {
			var bufSize = 0;
			getEnvStrings().forEach(function (string, i) {
				var ptr = environ_buf + bufSize;
				HEAP32[(__environ + i * 4) >> 2] = ptr;
				writeAsciiToMemory(string, ptr);
				bufSize += string.length + 1;
			});
			return 0;
		}
		function _environ_sizes_get(penviron_count, penviron_buf_size) {
			var strings = getEnvStrings();
			HEAP32[penviron_count >> 2] = strings.length;
			var bufSize = 0;
			strings.forEach(function (string) {
				bufSize += string.length + 1;
			});
			HEAP32[penviron_buf_size >> 2] = bufSize;
			return 0;
		}
		function _getTempRet0() {
			return getTempRet0();
		}
		function _llvm_eh_typeid_for(type) {
			return type;
		}
		function _setTempRet0(val) {
			setTempRet0(val);
		}
		function __isLeapYear(year) {
			return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
		}
		function __arraySum(array, index) {
			var sum = 0;
			for (var i = 0; i <= index; sum += array[i++]) { }
			return sum;
		}
		var __MONTH_DAYS_LEAP = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		var __MONTH_DAYS_REGULAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		function __addDays(date, days) {
			var newDate = new Date(date.getTime());
			while (days > 0) {
				var leap = __isLeapYear(newDate.getFullYear());
				var currentMonth = newDate.getMonth();
				var daysInCurrentMonth = (leap ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR)[currentMonth];
				if (days > daysInCurrentMonth - newDate.getDate()) {
					days -= daysInCurrentMonth - newDate.getDate() + 1;
					newDate.setDate(1);
					if (currentMonth < 11) {
						newDate.setMonth(currentMonth + 1);
					} else {
						newDate.setMonth(0);
						newDate.setFullYear(newDate.getFullYear() + 1);
					}
				} else {
					newDate.setDate(newDate.getDate() + days);
					return newDate;
				}
			}
			return newDate;
		}
		function _strftime(s, maxsize, format, tm) {
			var tm_zone = HEAP32[(tm + 40) >> 2];
			var date = {
				tm_sec: HEAP32[tm >> 2],
				tm_min: HEAP32[(tm + 4) >> 2],
				tm_hour: HEAP32[(tm + 8) >> 2],
				tm_mday: HEAP32[(tm + 12) >> 2],
				tm_mon: HEAP32[(tm + 16) >> 2],
				tm_year: HEAP32[(tm + 20) >> 2],
				tm_wday: HEAP32[(tm + 24) >> 2],
				tm_yday: HEAP32[(tm + 28) >> 2],
				tm_isdst: HEAP32[(tm + 32) >> 2],
				tm_gmtoff: HEAP32[(tm + 36) >> 2],
				tm_zone: tm_zone ? UTF8ToString(tm_zone) : "",
			};
			var pattern = UTF8ToString(format);
			var EXPANSION_RULES_1 = {
				"%c": "%a %b %d %H:%M:%S %Y",
				"%D": "%m/%d/%y",
				"%F": "%Y-%m-%d",
				"%h": "%b",
				"%r": "%I:%M:%S %p",
				"%R": "%H:%M",
				"%T": "%H:%M:%S",
				"%x": "%m/%d/%y",
				"%X": "%H:%M:%S",
				"%Ec": "%c",
				"%EC": "%C",
				"%Ex": "%m/%d/%y",
				"%EX": "%H:%M:%S",
				"%Ey": "%y",
				"%EY": "%Y",
				"%Od": "%d",
				"%Oe": "%e",
				"%OH": "%H",
				"%OI": "%I",
				"%Om": "%m",
				"%OM": "%M",
				"%OS": "%S",
				"%Ou": "%u",
				"%OU": "%U",
				"%OV": "%V",
				"%Ow": "%w",
				"%OW": "%W",
				"%Oy": "%y",
			};
			for (var rule in EXPANSION_RULES_1) {
				pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_1[rule]);
			}
			var WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
			var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
			function leadingSomething(value, digits, character) {
				var str = typeof value === "number" ? value.toString() : value || "";
				while (str.length < digits) {
					str = character[0] + str;
				}
				return str;
			}
			function leadingNulls(value, digits) {
				return leadingSomething(value, digits, "0");
			}
			function compareByDay(date1, date2) {
				function sgn(value) {
					return value < 0 ? -1 : value > 0 ? 1 : 0;
				}
				var compare;
				if ((compare = sgn(date1.getFullYear() - date2.getFullYear())) === 0) {
					if ((compare = sgn(date1.getMonth() - date2.getMonth())) === 0) {
						compare = sgn(date1.getDate() - date2.getDate());
					}
				}
				return compare;
			}
			function getFirstWeekStartDate(janFourth) {
				switch (janFourth.getDay()) {
					case 0:
						return new Date(janFourth.getFullYear() - 1, 11, 29);
					case 1:
						return janFourth;
					case 2:
						return new Date(janFourth.getFullYear(), 0, 3);
					case 3:
						return new Date(janFourth.getFullYear(), 0, 2);
					case 4:
						return new Date(janFourth.getFullYear(), 0, 1);
					case 5:
						return new Date(janFourth.getFullYear() - 1, 11, 31);
					case 6:
						return new Date(janFourth.getFullYear() - 1, 11, 30);
				}
			}
			function getWeekBasedYear(date) {
				var thisDate = __addDays(new Date(date.tm_year + 1900, 0, 1), date.tm_yday);
				var janFourthThisYear = new Date(thisDate.getFullYear(), 0, 4);
				var janFourthNextYear = new Date(thisDate.getFullYear() + 1, 0, 4);
				var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
				var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
				if (compareByDay(firstWeekStartThisYear, thisDate) <= 0) {
					if (compareByDay(firstWeekStartNextYear, thisDate) <= 0) {
						return thisDate.getFullYear() + 1;
					} else {
						return thisDate.getFullYear();
					}
				} else {
					return thisDate.getFullYear() - 1;
				}
			}
			var EXPANSION_RULES_2 = {
				"%a": function (date) {
					return WEEKDAYS[date.tm_wday].substring(0, 3);
				},
				"%A": function (date) {
					return WEEKDAYS[date.tm_wday];
				},
				"%b": function (date) {
					return MONTHS[date.tm_mon].substring(0, 3);
				},
				"%B": function (date) {
					return MONTHS[date.tm_mon];
				},
				"%C": function (date) {
					var year = date.tm_year + 1900;
					return leadingNulls((year / 100) | 0, 2);
				},
				"%d": function (date) {
					return leadingNulls(date.tm_mday, 2);
				},
				"%e": function (date) {
					return leadingSomething(date.tm_mday, 2, " ");
				},
				"%g": function (date) {
					return getWeekBasedYear(date).toString().substring(2);
				},
				"%G": function (date) {
					return getWeekBasedYear(date);
				},
				"%H": function (date) {
					return leadingNulls(date.tm_hour, 2);
				},
				"%I": function (date) {
					var twelveHour = date.tm_hour;
					if (twelveHour == 0) twelveHour = 12;
					else if (twelveHour > 12) twelveHour -= 12;
					return leadingNulls(twelveHour, 2);
				},
				"%j": function (date) {
					return leadingNulls(date.tm_mday + __arraySum(__isLeapYear(date.tm_year + 1900) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, date.tm_mon - 1), 3);
				},
				"%m": function (date) {
					return leadingNulls(date.tm_mon + 1, 2);
				},
				"%M": function (date) {
					return leadingNulls(date.tm_min, 2);
				},
				"%n": function () {
					return "\n";
				},
				"%p": function (date) {
					if (date.tm_hour >= 0 && date.tm_hour < 12) {
						return "AM";
					} else {
						return "PM";
					}
				},
				"%S": function (date) {
					return leadingNulls(date.tm_sec, 2);
				},
				"%t": function () {
					return "\t";
				},
				"%u": function (date) {
					return date.tm_wday || 7;
				},
				"%U": function (date) {
					var janFirst = new Date(date.tm_year + 1900, 0, 1);
					var firstSunday = janFirst.getDay() === 0 ? janFirst : __addDays(janFirst, 7 - janFirst.getDay());
					var endDate = new Date(date.tm_year + 1900, date.tm_mon, date.tm_mday);
					if (compareByDay(firstSunday, endDate) < 0) {
						var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth() - 1) - 31;
						var firstSundayUntilEndJanuary = 31 - firstSunday.getDate();
						var days = firstSundayUntilEndJanuary + februaryFirstUntilEndMonth + endDate.getDate();
						return leadingNulls(Math.ceil(days / 7), 2);
					}
					return compareByDay(firstSunday, janFirst) === 0 ? "01" : "00";
				},
				"%V": function (date) {
					var janFourthThisYear = new Date(date.tm_year + 1900, 0, 4);
					var janFourthNextYear = new Date(date.tm_year + 1901, 0, 4);
					var firstWeekStartThisYear = getFirstWeekStartDate(janFourthThisYear);
					var firstWeekStartNextYear = getFirstWeekStartDate(janFourthNextYear);
					var endDate = __addDays(new Date(date.tm_year + 1900, 0, 1), date.tm_yday);
					if (compareByDay(endDate, firstWeekStartThisYear) < 0) {
						return "53";
					}
					if (compareByDay(firstWeekStartNextYear, endDate) <= 0) {
						return "01";
					}
					var daysDifference;
					if (firstWeekStartThisYear.getFullYear() < date.tm_year + 1900) {
						daysDifference = date.tm_yday + 32 - firstWeekStartThisYear.getDate();
					} else {
						daysDifference = date.tm_yday + 1 - firstWeekStartThisYear.getDate();
					}
					return leadingNulls(Math.ceil(daysDifference / 7), 2);
				},
				"%w": function (date) {
					return date.tm_wday;
				},
				"%W": function (date) {
					var janFirst = new Date(date.tm_year, 0, 1);
					var firstMonday = janFirst.getDay() === 1 ? janFirst : __addDays(janFirst, janFirst.getDay() === 0 ? 1 : 7 - janFirst.getDay() + 1);
					var endDate = new Date(date.tm_year + 1900, date.tm_mon, date.tm_mday);
					if (compareByDay(firstMonday, endDate) < 0) {
						var februaryFirstUntilEndMonth = __arraySum(__isLeapYear(endDate.getFullYear()) ? __MONTH_DAYS_LEAP : __MONTH_DAYS_REGULAR, endDate.getMonth() - 1) - 31;
						var firstMondayUntilEndJanuary = 31 - firstMonday.getDate();
						var days = firstMondayUntilEndJanuary + februaryFirstUntilEndMonth + endDate.getDate();
						return leadingNulls(Math.ceil(days / 7), 2);
					}
					return compareByDay(firstMonday, janFirst) === 0 ? "01" : "00";
				},
				"%y": function (date) {
					return (date.tm_year + 1900).toString().substring(2);
				},
				"%Y": function (date) {
					return date.tm_year + 1900;
				},
				"%z": function (date) {
					var off = date.tm_gmtoff;
					var ahead = off >= 0;
					off = Math.abs(off) / 60;
					off = (off / 60) * 100 + (off % 60);
					return (ahead ? "+" : "-") + String("0000" + off).slice(-4);
				},
				"%Z": function (date) {
					return date.tm_zone;
				},
				"%%": function () {
					return "%";
				},
			};
			for (var rule in EXPANSION_RULES_2) {
				if (pattern.includes(rule)) {
					pattern = pattern.replace(new RegExp(rule, "g"), EXPANSION_RULES_2[rule](date));
				}
			}
			var bytes = intArrayFromString(pattern, false);
			if (bytes.length > maxsize) {
				return 0;
			}
			writeArrayToMemory(bytes, s);
			return bytes.length - 1;
		}
		function _strftime_l(s, maxsize, format, tm) {
			return _strftime(s, maxsize, format, tm);
		}
		InternalError = Module["InternalError"] = extendError(Error, "InternalError");
		embind_init_charCodes();
		BindingError = Module["BindingError"] = extendError(Error, "BindingError");
		init_emval();
		UnboundTypeError = Module["UnboundTypeError"] = extendError(Error, "UnboundTypeError");
		function intArrayFromString(stringy, dontAddNull, length = 0) {
			var len = length > 0 ? length : lengthBytesUTF8(stringy) + 1;
			var u8array = new Array(len);
			var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
			if (dontAddNull) u8array.length = numBytesWritten;
			return u8array;
		}
		var asmLibraryArg = {
			m: ___cxa_allocate_exception,
			u: ___cxa_begin_catch,
			v: ___cxa_end_catch,
			b: ___cxa_find_matching_catch_2,
			h: ___cxa_find_matching_catch_3,
			w: ___cxa_find_matching_catch_4,
			o: ___cxa_free_exception,
			W: ___cxa_rethrow,
			n: ___cxa_throw,
			ca: ___cxa_uncaught_exceptions,
			c: ___resumeException,
			la: __embind_finalize_value_object,
			ia: __embind_register_bool,
			ha: __embind_register_emval,
			Q: __embind_register_float,
			X: __embind_register_function,
			C: __embind_register_integer,
			y: __embind_register_memory_view,
			R: __embind_register_std_string,
			K: __embind_register_std_wstring,
			ma: __embind_register_value_object,
			E: __embind_register_value_object_field,
			ja: __embind_register_void,
			ga: _abort,
			aa: _emscripten_memcpy_big,
			ba: _emscripten_resize_heap,
			ea: _environ_get,
			fa: _environ_sizes_get,
			a: _getTempRet0,
			U: invoke_di,
			D: invoke_dii,
			O: invoke_diii,
			P: invoke_fiii,
			p: invoke_i,
			f: invoke_ii,
			S: invoke_iid,
			ka: invoke_iidi,
			J: invoke_iif,
			d: invoke_iii,
			T: invoke_iiiff,
			i: invoke_iiii,
			j: invoke_iiiii,
			x: invoke_iiiiii,
			t: invoke_iiiiiii,
			B: invoke_iiiiiiii,
			A: invoke_iiiiiiiii,
			I: invoke_iiiiiiiiiiii,
			Z: invoke_iiiiij,
			$: invoke_iij,
			_: invoke_jiii,
			Y: invoke_jiiii,
			l: invoke_v,
			s: invoke_vi,
			e: invoke_vii,
			g: invoke_viii,
			k: invoke_viiii,
			M: invoke_viiiif,
			q: invoke_viiiii,
			z: invoke_viiiiii,
			r: invoke_viiiiiii,
			V: invoke_viiiiiiii,
			L: invoke_viiiiiiiii,
			F: invoke_viiiiiiiiii,
			H: invoke_viiiiiiiiiiiiiii,
			G: _llvm_eh_typeid_for,
			N: _setTempRet0,
			da: _strftime_l,
		};
		var asm = createWasm();
		var ___wasm_call_ctors = (Module["___wasm_call_ctors"] = function () {
			return (___wasm_call_ctors = Module["___wasm_call_ctors"] = Module["asm"]["oa"]).apply(null, arguments);
		});
		var _free = (Module["_free"] = function () {
			return (_free = Module["_free"] = Module["asm"]["pa"]).apply(null, arguments);
		});
		var _malloc = (Module["_malloc"] = function () {
			return (_malloc = Module["_malloc"] = Module["asm"]["qa"]).apply(null, arguments);
		});
		var ___getTypeName = (Module["___getTypeName"] = function () {
			return (___getTypeName = Module["___getTypeName"] = Module["asm"]["sa"]).apply(null, arguments);
		});
		var ___embind_register_native_and_builtin_types = (Module["___embind_register_native_and_builtin_types"] = function () {
			return (___embind_register_native_and_builtin_types = Module["___embind_register_native_and_builtin_types"] = Module["asm"]["ta"]).apply(null, arguments);
		});
		var stackSave = (Module["stackSave"] = function () {
			return (stackSave = Module["stackSave"] = Module["asm"]["ua"]).apply(null, arguments);
		});
		var stackRestore = (Module["stackRestore"] = function () {
			return (stackRestore = Module["stackRestore"] = Module["asm"]["va"]).apply(null, arguments);
		});
		var stackAlloc = (Module["stackAlloc"] = function () {
			return (stackAlloc = Module["stackAlloc"] = Module["asm"]["wa"]).apply(null, arguments);
		});
		var _setThrew = (Module["_setThrew"] = function () {
			return (_setThrew = Module["_setThrew"] = Module["asm"]["xa"]).apply(null, arguments);
		});
		var ___cxa_can_catch = (Module["___cxa_can_catch"] = function () {
			return (___cxa_can_catch = Module["___cxa_can_catch"] = Module["asm"]["ya"]).apply(null, arguments);
		});
		var ___cxa_is_pointer_type = (Module["___cxa_is_pointer_type"] = function () {
			return (___cxa_is_pointer_type = Module["___cxa_is_pointer_type"] = Module["asm"]["za"]).apply(null, arguments);
		});
		var dynCall_viijii = (Module["dynCall_viijii"] = function () {
			return (dynCall_viijii = Module["dynCall_viijii"] = Module["asm"]["Aa"]).apply(null, arguments);
		});
		var dynCall_iij = (Module["dynCall_iij"] = function () {
			return (dynCall_iij = Module["dynCall_iij"] = Module["asm"]["Ba"]).apply(null, arguments);
		});
		var dynCall_jiii = (Module["dynCall_jiii"] = function () {
			return (dynCall_jiii = Module["dynCall_jiii"] = Module["asm"]["Ca"]).apply(null, arguments);
		});
		var dynCall_iiiiij = (Module["dynCall_iiiiij"] = function () {
			return (dynCall_iiiiij = Module["dynCall_iiiiij"] = Module["asm"]["Da"]).apply(null, arguments);
		});
		var dynCall_jiiii = (Module["dynCall_jiiii"] = function () {
			return (dynCall_jiiii = Module["dynCall_jiiii"] = Module["asm"]["Ea"]).apply(null, arguments);
		});
		var dynCall_iiiiijj = (Module["dynCall_iiiiijj"] = function () {
			return (dynCall_iiiiijj = Module["dynCall_iiiiijj"] = Module["asm"]["Fa"]).apply(null, arguments);
		});
		var dynCall_iiiiiijj = (Module["dynCall_iiiiiijj"] = function () {
			return (dynCall_iiiiiijj = Module["dynCall_iiiiiijj"] = Module["asm"]["Ga"]).apply(null, arguments);
		});
		function invoke_ii(index, a1) {
			var sp = stackSave();
			try {
				return wasmTable.get(index)(a1);
			} catch (e) {
				stackRestore(sp);
				if (e !== e + 0 && e !== "longjmp") throw e;
				_setThrew(1, 0);
			}
		}
		function invoke_iiiiiii(index, a1, a2, a3, a4, a5, a6) {
			var sp = stackSave();
			try {
				return wasmTable.get(index)(a1, a2, a3, a4, a5, a6);
			} catch (e) {
				stackRestore(sp);
				if (e !== e + 0 && e !== "longjmp") throw e;
				_setThrew(1, 0);
			}
		}
		function invoke_iii(index, a1, a2) {
			var sp = stackSave();
			try {
				return wasmTable.get(index)(a1, a2);
			} catch (e) {
				stackRestore(sp);
				if (e !== e + 0 && e !== "longjmp") throw e;
				_setThrew(1, 0);
			}
		}
		function invoke_iiiiiiii(index, a1, a2, a3, a4, a5, a6, a7) {
			var sp = stackSave();
			try {
				return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7);
			} catch (e) {
				stackRestore(sp);
				if (e !== e + 0 && e !== "longjmp") throw e;
				_setThrew(1, 0);
			}
		}
		function invoke_viii(index, a1, a2, a3) {
			var sp = stackSave();
			try {
				wasmTable.get(index)(a1, a2, a3);
			} catch (e) {
				stackRestore(sp);
				if (e !== e + 0 && e !== "longjmp") throw e;
				_setThrew(1, 0);
			}
		}
		function invoke_v(index) {
			var sp = stackSave();
			try {
				wasmTable.get(index)();
			} catch (e) {
				stackRestore(sp);
				if (e !== e + 0 && e !== "longjmp") throw e;
				_setThrew(1, 0);
			}
		}
		function invoke_iiii(index, a1, a2, a3) {
			var sp = stackSave();
			try {
				return wasmTable.get(index)(a1, a2, a3);
			} catch (e) {
				stackRestore(sp);
				if (e !== e + 0 && e !== "longjmp") throw e;
				_setThrew(1, 0);
			}
		}
		function invoke_i(index) {
			var sp = stackSave();
			try {
				return wasmTable.get(index)();
			} catch (e) {
				stackRestore(sp);
				if (e !== e + 0 && e !== "longjmp") throw e;
				_setThrew(1, 0);
			}
		}
		function invoke_viiiiii(index, a1, a2, a3, a4, a5, a6) {
			var sp = stackSave();
			try {
				wasmTable.get(index)(a1, a2, a3, a4, a5, a6);
			} catch (e) {
				stackRestore(sp);
				if (e !== e + 0 && e !== "longjmp") throw e;
				_setThrew(1, 0);
			}
		}
		function invoke_vi(index, a1) {
			var sp = stackSave();
			try {
				wasmTable.get(index)(a1);
			} catch (e) {
				stackRestore(sp);
				if (e !== e + 0 && e !== "longjmp") throw e;
				_setThrew(1, 0);
			}
		}
		function invoke_vii(index, a1, a2) {
			var sp = stackSave();
			try {
				wasmTable.get(index)(a1, a2);
			} catch (e) {
				stackRestore(sp);
				if (e !== e + 0 && e !== "longjmp") throw e;
				_setThrew(1, 0);
			}
		}
		function invoke_viiiii(index, a1, a2, a3, a4, a5) {
			var sp = stackSave();
			try {
				wasmTable.get(index)(a1, a2, a3, a4, a5);
			} catch (e) {
				stackRestore(sp);
				if (e !== e + 0 && e !== "longjmp") throw e;
				_setThrew(1, 0);
			}
		}
		function invoke_viiii(index, a1, a2, a3, a4) {
			var sp = stackSave();
			try {
				wasmTable.get(index)(a1, a2, a3, a4);
			} catch (e) {
				stackRestore(sp);
				if (e !== e + 0 && e !== "longjmp") throw e;
				_setThrew(1, 0);
			}
		}
		function invoke_viiiiiii(index, a1, a2, a3, a4, a5, a6, a7) {
			var sp = stackSave();
			try {
				wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7);
			} catch (e) {
				stackRestore(sp);
				if (e !== e + 0 && e !== "longjmp") throw e;
				_setThrew(1, 0);
			}
		}
		function invoke_iiiii(index, a1, a2, a3, a4) {
			var sp = stackSave();
			try {
				return wasmTable.get(index)(a1, a2, a3, a4);
			} catch (e) {
				stackRestore(sp);
				if (e !== e + 0 && e !== "longjmp") throw e;
				_setThrew(1, 0);
			}
		}
		function invoke_viiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
			var sp = stackSave();
			try {
				wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8);
			} catch (e) {
				stackRestore(sp);
				if (e !== e + 0 && e !== "longjmp") throw e;
				_setThrew(1, 0);
			}
		}
		function invoke_iiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8) {
			var sp = stackSave();
			try {
				return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8);
			} catch (e) {
				stackRestore(sp);
				if (e !== e + 0 && e !== "longjmp") throw e;
				_setThrew(1, 0);
			}
		}
		function invoke_iiiiii(index, a1, a2, a3, a4, a5) {
			var sp = stackSave();
			try {
				return wasmTable.get(index)(a1, a2, a3, a4, a5);
			} catch (e) {
				stackRestore(sp);
				if (e !== e + 0 && e !== "longjmp") throw e;
				_setThrew(1, 0);
			}
		}
		function invoke_dii(index, a1, a2) {
			var sp = stackSave();
			try {
				return wasmTable.get(index)(a1, a2);
			} catch (e) {
				stackRestore(sp);
				if (e !== e + 0 && e !== "longjmp") throw e;
				_setThrew(1, 0);
			}
		}
		function invoke_di(index, a1) {
			var sp = stackSave();
			try {
				return wasmTable.get(index)(a1);
			} catch (e) {
				stackRestore(sp);
				if (e !== e + 0 && e !== "longjmp") throw e;
				_setThrew(1, 0);
			}
		}
		function invoke_iif(index, a1, a2) {
			var sp = stackSave();
			try {
				return wasmTable.get(index)(a1, a2);
			} catch (e) {
				stackRestore(sp);
				if (e !== e + 0 && e !== "longjmp") throw e;
				_setThrew(1, 0);
			}
		}
		function invoke_iiiff(index, a1, a2, a3, a4) {
			var sp = stackSave();
			try {
				return wasmTable.get(index)(a1, a2, a3, a4);
			} catch (e) {
				stackRestore(sp);
				if (e !== e + 0 && e !== "longjmp") throw e;
				_setThrew(1, 0);
			}
		}
		function invoke_viiiif(index, a1, a2, a3, a4, a5) {
			var sp = stackSave();
			try {
				wasmTable.get(index)(a1, a2, a3, a4, a5);
			} catch (e) {
				stackRestore(sp);
				if (e !== e + 0 && e !== "longjmp") throw e;
				_setThrew(1, 0);
			}
		}
		function invoke_viiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
			var sp = stackSave();
			try {
				wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9);
			} catch (e) {
				stackRestore(sp);
				if (e !== e + 0 && e !== "longjmp") throw e;
				_setThrew(1, 0);
			}
		}
		function invoke_iid(index, a1, a2) {
			var sp = stackSave();
			try {
				return wasmTable.get(index)(a1, a2);
			} catch (e) {
				stackRestore(sp);
				if (e !== e + 0 && e !== "longjmp") throw e;
				_setThrew(1, 0);
			}
		}
		function invoke_iidi(index, a1, a2, a3) {
			var sp = stackSave();
			try {
				return wasmTable.get(index)(a1, a2, a3);
			} catch (e) {
				stackRestore(sp);
				if (e !== e + 0 && e !== "longjmp") throw e;
				_setThrew(1, 0);
			}
		}
		function invoke_fiii(index, a1, a2, a3) {
			var sp = stackSave();
			try {
				return wasmTable.get(index)(a1, a2, a3);
			} catch (e) {
				stackRestore(sp);
				if (e !== e + 0 && e !== "longjmp") throw e;
				_setThrew(1, 0);
			}
		}
		function invoke_diii(index, a1, a2, a3) {
			var sp = stackSave();
			try {
				return wasmTable.get(index)(a1, a2, a3);
			} catch (e) {
				stackRestore(sp);
				if (e !== e + 0 && e !== "longjmp") throw e;
				_setThrew(1, 0);
			}
		}
		function invoke_iiiiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11) {
			var sp = stackSave();
			try {
				return wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11);
			} catch (e) {
				stackRestore(sp);
				if (e !== e + 0 && e !== "longjmp") throw e;
				_setThrew(1, 0);
			}
		}
		function invoke_viiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10) {
			var sp = stackSave();
			try {
				wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10);
			} catch (e) {
				stackRestore(sp);
				if (e !== e + 0 && e !== "longjmp") throw e;
				_setThrew(1, 0);
			}
		}
		function invoke_viiiiiiiiiiiiiii(index, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15) {
			var sp = stackSave();
			try {
				wasmTable.get(index)(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13, a14, a15);
			} catch (e) {
				stackRestore(sp);
				if (e !== e + 0 && e !== "longjmp") throw e;
				_setThrew(1, 0);
			}
		}
		function invoke_iij(index, a1, a2, a3) {
			var sp = stackSave();
			try {
				return dynCall_iij(index, a1, a2, a3);
			} catch (e) {
				stackRestore(sp);
				if (e !== e + 0 && e !== "longjmp") throw e;
				_setThrew(1, 0);
			}
		}
		function invoke_jiii(index, a1, a2, a3) {
			var sp = stackSave();
			try {
				return dynCall_jiii(index, a1, a2, a3);
			} catch (e) {
				stackRestore(sp);
				if (e !== e + 0 && e !== "longjmp") throw e;
				_setThrew(1, 0);
			}
		}
		function invoke_iiiiij(index, a1, a2, a3, a4, a5, a6) {
			var sp = stackSave();
			try {
				return dynCall_iiiiij(index, a1, a2, a3, a4, a5, a6);
			} catch (e) {
				stackRestore(sp);
				if (e !== e + 0 && e !== "longjmp") throw e;
				_setThrew(1, 0);
			}
		}
		function invoke_jiiii(index, a1, a2, a3, a4) {
			var sp = stackSave();
			try {
				return dynCall_jiiii(index, a1, a2, a3, a4);
			} catch (e) {
				stackRestore(sp);
				if (e !== e + 0 && e !== "longjmp") throw e;
				_setThrew(1, 0);
			}
		}
		var calledRun;
		dependenciesFulfilled = function runCaller() {
			if (!calledRun) run();
			if (!calledRun) dependenciesFulfilled = runCaller;
		};
		function run(args) {
			args = args || arguments_;
			if (runDependencies > 0) {
				return;
			}
			preRun();
			if (runDependencies > 0) {
				return;
			}
			function doRun() {
				if (calledRun) return;
				calledRun = true;
				Module["calledRun"] = true;
				if (ABORT) return;
				initRuntime();
				readyPromiseResolve(Module);
				if (Module["onRuntimeInitialized"]) Module["onRuntimeInitialized"]();
				postRun();
			}
			if (Module["setStatus"]) {
				Module["setStatus"]("Running...");
				setTimeout(function () {
					setTimeout(function () {
						Module["setStatus"]("");
					}, 1);
					doRun();
				}, 1);
			} else {
				doRun();
			}
		}
		Module["run"] = run;
		if (Module["preInit"]) {
			if (typeof Module["preInit"] == "function") Module["preInit"] = [Module["preInit"]];
			while (Module["preInit"].length > 0) {
				Module["preInit"].pop()();
			}
		}
		run();

		return ZXing.ready;
	};
})();
export default ZXing;
