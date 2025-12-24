/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const t=function(t){const e=[];let n=0;for(let r=0;r<t.length;r++){let i=t.charCodeAt(r);i<128?e[n++]=i:i<2048?(e[n++]=i>>6|192,e[n++]=63&i|128):55296==(64512&i)&&r+1<t.length&&56320==(64512&t.charCodeAt(r+1))?(i=65536+((1023&i)<<10)+(1023&t.charCodeAt(++r)),e[n++]=i>>18|240,e[n++]=i>>12&63|128,e[n++]=i>>6&63|128,e[n++]=63&i|128):(e[n++]=i>>12|224,e[n++]=i>>6&63|128,e[n++]=63&i|128)}return e},e={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:"function"==typeof atob,encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<t.length;i+=3){const e=t[i],s=i+1<t.length,o=s?t[i+1]:0,a=i+2<t.length,c=a?t[i+2]:0,u=e>>2,l=(3&e)<<4|o>>4;let h=(15&o)<<2|c>>6,d=63&c;a||(d=64,s||(h=64)),r.push(n[u],n[l],n[h],n[d])}return r.join("")},encodeString(e,n){return this.HAS_NATIVE_SUPPORT&&!n?btoa(e):this.encodeByteArray(t(e),n)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):function(t){const e=[];let n=0,r=0;for(;n<t.length;){const i=t[n++];if(i<128)e[r++]=String.fromCharCode(i);else if(i>191&&i<224){const s=t[n++];e[r++]=String.fromCharCode((31&i)<<6|63&s)}else if(i>239&&i<365){const s=((7&i)<<18|(63&t[n++])<<12|(63&t[n++])<<6|63&t[n++])-65536;e[r++]=String.fromCharCode(55296+(s>>10)),e[r++]=String.fromCharCode(56320+(1023&s))}else{const s=t[n++],o=t[n++];e[r++]=String.fromCharCode((15&i)<<12|(63&s)<<6|63&o)}}return e.join("")}(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const r=e?this.charToByteMapWebSafe_:this.charToByteMap_,i=[];for(let s=0;s<t.length;){const e=r[t.charAt(s++)],o=s<t.length?r[t.charAt(s)]:0;++s;const a=s<t.length?r[t.charAt(s)]:64;++s;const c=s<t.length?r[t.charAt(s)]:64;if(++s,null==e||null==o||null==a||null==c)throw new n;const u=e<<2|o>>4;if(i.push(u),64!==a){const t=o<<4&240|a>>2;if(i.push(t),64!==c){const t=a<<6&192|c;i.push(t)}}}return i},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class n extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const r=function(n){return function(n){const r=t(n);return e.encodeByteArray(r,!0)}(n).replace(/\./g,"")};
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const i=()=>
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if("undefined"!=typeof global)return global;throw new Error("Unable to locate global object.")}().__FIREBASE_DEFAULTS__,s=()=>{if("undefined"==typeof document)return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch(r){return}const n=t&&function(t){try{return e.decodeString(t,!0)}catch(r){}return null}(t[1]);return n&&JSON.parse(n)},o=()=>{try{return i()||(()=>{if("undefined"==typeof process||void 0===process.env)return;const t={}.__FIREBASE_DEFAULTS__;return t?JSON.parse(t):void 0})()||s()}catch(t){return}},a=t=>{const e=(t=>{var e,n;return null===(n=null===(e=o())||void 0===e?void 0:e.emulatorHosts)||void 0===n?void 0:n[t]})(t);if(!e)return;const n=e.lastIndexOf(":");if(n<=0||n+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(n+1),10);return"["===e[0]?[e.substring(1,n-1),r]:[e.substring(0,n),r]},c=()=>{var t;return null===(t=o())||void 0===t?void 0:t.config};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class u{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((t,e)=>{this.resolve=t,this.reject=e})}wrapCallback(t){return(e,n)=>{e?this.reject(e):this.resolve(n),"function"==typeof t&&(this.promise.catch(()=>{}),1===t.length?t(e):t(e,n))}}}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function l(){return"undefined"!=typeof navigator&&"string"==typeof navigator.userAgent?navigator.userAgent:""}function h(){return!function(){var t;const e=null===(t=o())||void 0===t?void 0:t.forceEnvironment;if("node"===e)return!0;if("browser"===e)return!1;try{return"[object process]"===Object.prototype.toString.call(global.process)}catch(n){return!1}}()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function d(){try{return"object"==typeof indexedDB}catch(t){return!1}}class f extends Error{constructor(t,e,n){super(e),this.code=t,this.customData=n,this.name="FirebaseError",Object.setPrototypeOf(this,f.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,m.prototype.create)}}class m{constructor(t,e,n){this.service=t,this.serviceName=e,this.errors=n}create(t,...e){const n=e[0]||{},r=`${this.service}/${t}`,i=this.errors[t],s=i?function(t,e){return t.replace(g,(t,n)=>{const r=e[n];return null!=r?String(r):`<${n}?>`})}(i,n):"Error",o=`${this.serviceName}: ${s} (${r}).`;return new f(r,o,n)}}const g=/\{\$([^}]+)}/g;function p(t,e){if(t===e)return!0;const n=Object.keys(t),r=Object.keys(e);for(const i of n){if(!r.includes(i))return!1;const n=t[i],s=e[i];if(y(n)&&y(s)){if(!p(n,s))return!1}else if(n!==s)return!1}for(const i of r)if(!n.includes(i))return!1;return!0}function y(t){return null!==t&&"object"==typeof t}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function v(t){return t&&t._delegate?t._delegate:t}class w{constructor(t,e,n){this.name=t,this.instanceFactory=e,this.type=n,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(t){return this.instantiationMode=t,this}setMultipleInstances(t){return this.multipleInstances=t,this}setServiceProps(t){return this.serviceProps=t,this}setInstanceCreatedCallback(t){return this.onInstanceCreated=t,this}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const b="[DEFAULT]";
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class I{constructor(t,e){this.name=t,this.container=e,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(t){const e=this.normalizeInstanceIdentifier(t);if(!this.instancesDeferred.has(e)){const t=new u;if(this.instancesDeferred.set(e,t),this.isInitialized(e)||this.shouldAutoInitialize())try{const n=this.getOrInitializeService({instanceIdentifier:e});n&&t.resolve(n)}catch(n){}}return this.instancesDeferred.get(e).promise}getImmediate(t){var e;const n=this.normalizeInstanceIdentifier(null==t?void 0:t.identifier),r=null!==(e=null==t?void 0:t.optional)&&void 0!==e&&e;if(!this.isInitialized(n)&&!this.shouldAutoInitialize()){if(r)return null;throw Error(`Service ${this.name} is not available`)}try{return this.getOrInitializeService({instanceIdentifier:n})}catch(i){if(r)return null;throw i}}getComponent(){return this.component}setComponent(t){if(t.name!==this.name)throw Error(`Mismatching Component ${t.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=t,this.shouldAutoInitialize()){if(function(t){return"EAGER"===t.instantiationMode}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(t))try{this.getOrInitializeService({instanceIdentifier:b})}catch(e){}for(const[t,n]of this.instancesDeferred.entries()){const r=this.normalizeInstanceIdentifier(t);try{const t=this.getOrInitializeService({instanceIdentifier:r});n.resolve(t)}catch(e){}}}}clearInstance(t=b){this.instancesDeferred.delete(t),this.instancesOptions.delete(t),this.instances.delete(t)}async delete(){const t=Array.from(this.instances.values());await Promise.all([...t.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...t.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return null!=this.component}isInitialized(t=b){return this.instances.has(t)}getOptions(t=b){return this.instancesOptions.get(t)||{}}initialize(t={}){const{options:e={}}=t,n=this.normalizeInstanceIdentifier(t.instanceIdentifier);if(this.isInitialized(n))throw Error(`${this.name}(${n}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const r=this.getOrInitializeService({instanceIdentifier:n,options:e});for(const[i,s]of this.instancesDeferred.entries()){n===this.normalizeInstanceIdentifier(i)&&s.resolve(r)}return r}onInit(t,e){var n;const r=this.normalizeInstanceIdentifier(e),i=null!==(n=this.onInitCallbacks.get(r))&&void 0!==n?n:new Set;i.add(t),this.onInitCallbacks.set(r,i);const s=this.instances.get(r);return s&&t(s,r),()=>{i.delete(t)}}invokeOnInitCallbacks(t,e){const n=this.onInitCallbacks.get(e);if(n)for(const i of n)try{i(t,e)}catch(r){}}getOrInitializeService({instanceIdentifier:t,options:e={}}){let n=this.instances.get(t);if(!n&&this.component&&(n=this.component.instanceFactory(this.container,{instanceIdentifier:(r=t,r===b?void 0:r),options:e}),this.instances.set(t,n),this.instancesOptions.set(t,e),this.invokeOnInitCallbacks(n,t),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,t,n)}catch(i){}var r;return n||null}normalizeInstanceIdentifier(t=b){return this.component?this.component.multipleInstances?t:b:t}shouldAutoInitialize(){return!!this.component&&"EXPLICIT"!==this.component.instantiationMode}}class _{constructor(t){this.name=t,this.providers=new Map}addComponent(t){const e=this.getProvider(t.name);if(e.isComponentSet())throw new Error(`Component ${t.name} has already been registered with ${this.name}`);e.setComponent(t)}addOrOverwriteComponent(t){this.getProvider(t.name).isComponentSet()&&this.providers.delete(t.name),this.addComponent(t)}getProvider(t){if(this.providers.has(t))return this.providers.get(t);const e=new I(t,this);return this.providers.set(t,e),e}getProviders(){return Array.from(this.providers.values())}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var E,T;(T=E||(E={}))[T.DEBUG=0]="DEBUG",T[T.VERBOSE=1]="VERBOSE",T[T.INFO=2]="INFO",T[T.WARN=3]="WARN",T[T.ERROR=4]="ERROR",T[T.SILENT=5]="SILENT";const S={debug:E.DEBUG,verbose:E.VERBOSE,info:E.INFO,warn:E.WARN,error:E.ERROR,silent:E.SILENT},x=E.INFO,C={[E.DEBUG]:"log",[E.VERBOSE]:"log",[E.INFO]:"info",[E.WARN]:"warn",[E.ERROR]:"error"},D=(t,e,...n)=>{if(e<t.logLevel)return;(new Date).toISOString();if(!C[e])throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class A{constructor(t){this.name=t,this._logLevel=x,this._logHandler=D,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(t){if(!(t in E))throw new TypeError(`Invalid value "${t}" assigned to \`logLevel\``);this._logLevel=t}setLogLevel(t){this._logLevel="string"==typeof t?S[t]:t}get logHandler(){return this._logHandler}set logHandler(t){if("function"!=typeof t)throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=t}get userLogHandler(){return this._userLogHandler}set userLogHandler(t){this._userLogHandler=t}debug(...t){this._userLogHandler&&this._userLogHandler(this,E.DEBUG,...t),this._logHandler(this,E.DEBUG,...t)}log(...t){this._userLogHandler&&this._userLogHandler(this,E.VERBOSE,...t),this._logHandler(this,E.VERBOSE,...t)}info(...t){this._userLogHandler&&this._userLogHandler(this,E.INFO,...t),this._logHandler(this,E.INFO,...t)}warn(...t){this._userLogHandler&&this._userLogHandler(this,E.WARN,...t),this._logHandler(this,E.WARN,...t)}error(...t){this._userLogHandler&&this._userLogHandler(this,E.ERROR,...t),this._logHandler(this,E.ERROR,...t)}}let N,k;const R=new WeakMap,O=new WeakMap,M=new WeakMap,L=new WeakMap,P=new WeakMap;let V={get(t,e,n){if(t instanceof IDBTransaction){if("done"===e)return O.get(t);if("objectStoreNames"===e)return t.objectStoreNames||M.get(t);if("store"===e)return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return U(t[e])},set:(t,e,n)=>(t[e]=n,!0),has:(t,e)=>t instanceof IDBTransaction&&("done"===e||"store"===e)||e in t};function F(t){return t!==IDBDatabase.prototype.transaction||"objectStoreNames"in IDBTransaction.prototype?(k||(k=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])).includes(t)?function(...e){return t.apply(q(this),e),U(R.get(this))}:function(...e){return U(t.apply(q(this),e))}:function(e,...n){const r=t.call(q(this),e,...n);return M.set(r,e.sort?e.sort():[e]),U(r)}}function B(t){return"function"==typeof t?F(t):(t instanceof IDBTransaction&&function(t){if(O.has(t))return;const e=new Promise((e,n)=>{const r=()=>{t.removeEventListener("complete",i),t.removeEventListener("error",s),t.removeEventListener("abort",s)},i=()=>{e(),r()},s=()=>{n(t.error||new DOMException("AbortError","AbortError")),r()};t.addEventListener("complete",i),t.addEventListener("error",s),t.addEventListener("abort",s)});O.set(t,e)}(t),e=t,(N||(N=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])).some(t=>e instanceof t)?new Proxy(t,V):t);var e}function U(t){if(t instanceof IDBRequest)return function(t){const e=new Promise((e,n)=>{const r=()=>{t.removeEventListener("success",i),t.removeEventListener("error",s)},i=()=>{e(U(t.result)),r()},s=()=>{n(t.error),r()};t.addEventListener("success",i),t.addEventListener("error",s)});return e.then(e=>{e instanceof IDBCursor&&R.set(e,t)}).catch(()=>{}),P.set(e,t),e}(t);if(L.has(t))return L.get(t);const e=B(t);return e!==t&&(L.set(t,e),P.set(e,t)),e}const q=t=>P.get(t);const j=["get","getKey","getAll","getAllKeys","count"],z=["put","add","delete","clear"],K=new Map;function G(t,e){if(!(t instanceof IDBDatabase)||e in t||"string"!=typeof e)return;if(K.get(e))return K.get(e);const n=e.replace(/FromIndex$/,""),r=e!==n,i=z.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!i&&!j.includes(n))return;const s=async function(t,...e){const s=this.transaction(t,i?"readwrite":"readonly");let o=s.store;return r&&(o=o.index(e.shift())),(await Promise.all([o[n](...e),i&&s.done]))[0]};return K.set(e,s),s}V=(t=>({...t,get:(e,n,r)=>G(e,n)||t.get(e,n,r),has:(e,n)=>!!G(e,n)||t.has(e,n)}))(V);
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ${constructor(t){this.container=t}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(function(t){const e=t.getComponent();return"VERSION"===(null==e?void 0:e.type)}(t)){const e=t.getImmediate();return`${e.library}/${e.version}`}return null}).filter(t=>t).join(" ")}}const Q="@firebase/app",H="0.10.13",W=new A("@firebase/app"),J="@firebase/app-compat",Y="@firebase/analytics-compat",X="@firebase/analytics",Z="@firebase/app-check-compat",tt="@firebase/app-check",et="@firebase/auth",nt="@firebase/auth-compat",rt="@firebase/database",it="@firebase/data-connect",st="@firebase/database-compat",ot="@firebase/functions",at="@firebase/functions-compat",ct="@firebase/installations",ut="@firebase/installations-compat",lt="@firebase/messaging",ht="@firebase/messaging-compat",dt="@firebase/performance",ft="@firebase/performance-compat",mt="@firebase/remote-config",gt="@firebase/remote-config-compat",pt="@firebase/storage",yt="@firebase/storage-compat",vt="@firebase/firestore",wt="@firebase/vertexai-preview",bt="@firebase/firestore-compat",It="firebase",_t="[DEFAULT]",Et={[Q]:"fire-core",[J]:"fire-core-compat",[X]:"fire-analytics",[Y]:"fire-analytics-compat",[tt]:"fire-app-check",[Z]:"fire-app-check-compat",[et]:"fire-auth",[nt]:"fire-auth-compat",[rt]:"fire-rtdb",[it]:"fire-data-connect",[st]:"fire-rtdb-compat",[ot]:"fire-fn",[at]:"fire-fn-compat",[ct]:"fire-iid",[ut]:"fire-iid-compat",[lt]:"fire-fcm",[ht]:"fire-fcm-compat",[dt]:"fire-perf",[ft]:"fire-perf-compat",[mt]:"fire-rc",[gt]:"fire-rc-compat",[pt]:"fire-gcs",[yt]:"fire-gcs-compat",[vt]:"fire-fst",[bt]:"fire-fst-compat",[wt]:"fire-vertex","fire-js":"fire-js",[It]:"fire-js-all"},Tt=new Map,St=new Map,xt=new Map;function Ct(t,e){try{t.container.addComponent(e)}catch(n){W.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function Dt(t){const e=t.name;if(xt.has(e))return W.debug(`There were multiple attempts to register component ${e}.`),!1;xt.set(e,t);for(const n of Tt.values())Ct(n,t);for(const n of St.values())Ct(n,t);return!0}function At(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nt=new m("app","Firebase",{"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."});
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class kt{constructor(t,e,n){this._isDeleted=!1,this._options=Object.assign({},t),this._config=Object.assign({},e),this._name=e.name,this._automaticDataCollectionEnabled=e.automaticDataCollectionEnabled,this._container=n,this.container.addComponent(new w("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(t){this.checkDestroyed(),this._automaticDataCollectionEnabled=t}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(t){this._isDeleted=t}checkDestroyed(){if(this.isDeleted)throw Nt.create("app-deleted",{appName:this._name})}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rt(t,e={}){let n=t;if("object"!=typeof e){e={name:e}}const r=Object.assign({name:_t,automaticDataCollectionEnabled:!1},e),i=r.name;if("string"!=typeof i||!i)throw Nt.create("bad-app-name",{appName:String(i)});if(n||(n=c()),!n)throw Nt.create("no-options");const s=Tt.get(i);if(s){if(p(n,s.options)&&p(r,s.config))return s;throw Nt.create("duplicate-app",{appName:i})}const o=new _(i);for(const c of xt.values())o.addComponent(c);const a=new kt(n,r,o);return Tt.set(i,a),a}function Ot(t,e,n){var r;let i=null!==(r=Et[t])&&void 0!==r?r:t;n&&(i+=`-${n}`);const s=i.match(/\s|\//),o=e.match(/\s|\//);if(s||o){const t=[`Unable to register library "${i}" with version "${e}":`];return s&&t.push(`library name "${i}" contains illegal characters (whitespace or "/")`),s&&o&&t.push("and"),o&&t.push(`version name "${e}" contains illegal characters (whitespace or "/")`),void W.warn(t.join(" "))}Dt(new w(`${i}-version`,()=>({library:i,version:e}),"VERSION"))}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Mt="firebase-heartbeat-store";let Lt=null;function Pt(){return Lt||(Lt=function(t,e,{blocked:n,upgrade:r,blocking:i,terminated:s}={}){const o=indexedDB.open(t,e),a=U(o);return r&&o.addEventListener("upgradeneeded",t=>{r(U(o.result),t.oldVersion,t.newVersion,U(o.transaction),t)}),n&&o.addEventListener("blocked",t=>n(t.oldVersion,t.newVersion,t)),a.then(t=>{s&&t.addEventListener("close",()=>s()),i&&t.addEventListener("versionchange",t=>i(t.oldVersion,t.newVersion,t))}).catch(()=>{}),a}("firebase-heartbeat-database",1,{upgrade:(t,e)=>{if(0===e)try{t.createObjectStore(Mt)}catch(n){}}}).catch(t=>{throw Nt.create("idb-open",{originalErrorMessage:t.message})})),Lt}async function Vt(t,e){try{const n=(await Pt()).transaction(Mt,"readwrite"),r=n.objectStore(Mt);await r.put(e,Ft(t)),await n.done}catch(n){if(n instanceof f)W.warn(n.message);else{const t=Nt.create("idb-set",{originalErrorMessage:null==n?void 0:n.message});W.warn(t.message)}}}function Ft(t){return`${t.name}!${t.options.appId}`}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bt{constructor(t){this.container=t,this._heartbeatsCache=null;const e=this.container.getProvider("app").getImmediate();this._storage=new qt(e),this._heartbeatsCachePromise=this._storage.read().then(t=>(this._heartbeatsCache=t,t))}async triggerHeartbeat(){var t,e;try{const n=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=Ut();if(null==(null===(t=this._heartbeatsCache)||void 0===t?void 0:t.heartbeats)&&(this._heartbeatsCache=await this._heartbeatsCachePromise,null==(null===(e=this._heartbeatsCache)||void 0===e?void 0:e.heartbeats)))return;if(this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(t=>t.date===r))return;return this._heartbeatsCache.heartbeats.push({date:r,agent:n}),this._heartbeatsCache.heartbeats=this._heartbeatsCache.heartbeats.filter(t=>{const e=new Date(t.date).valueOf();return Date.now()-e<=2592e6}),this._storage.overwrite(this._heartbeatsCache)}catch(n){W.warn(n)}}async getHeartbeatsHeader(){var t;try{if(null===this._heartbeatsCache&&await this._heartbeatsCachePromise,null==(null===(t=this._heartbeatsCache)||void 0===t?void 0:t.heartbeats)||0===this._heartbeatsCache.heartbeats.length)return"";const e=Ut(),{heartbeatsToSend:n,unsentEntries:i}=function(t,e=1024){const n=[];let r=t.slice();for(const i of t){const t=n.find(t=>t.agent===i.agent);if(t){if(t.dates.push(i.date),jt(n)>e){t.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),jt(n)>e){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}(this._heartbeatsCache.heartbeats),s=r(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=e,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(e){return W.warn(e),""}}}function Ut(){return(new Date).toISOString().substring(0,10)}class qt{constructor(t){this.app=t,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return!!d()&&new Promise((t,e)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),t(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{var t;e((null===(t=i.error)||void 0===t?void 0:t.message)||"")}}catch(n){e(n)}}).then(()=>!0).catch(()=>!1)}async read(){if(await this._canUseIndexedDBPromise){const t=await async function(t){try{const e=(await Pt()).transaction(Mt),n=await e.objectStore(Mt).get(Ft(t));return await e.done,n}catch(e){if(e instanceof f)W.warn(e.message);else{const t=Nt.create("idb-get",{originalErrorMessage:null==e?void 0:e.message});W.warn(t.message)}}}(this.app);return(null==t?void 0:t.heartbeats)?t:{heartbeats:[]}}return{heartbeats:[]}}async overwrite(t){var e;if(await this._canUseIndexedDBPromise){const n=await this.read();return Vt(this.app,{lastSentHeartbeatDate:null!==(e=t.lastSentHeartbeatDate)&&void 0!==e?e:n.lastSentHeartbeatDate,heartbeats:t.heartbeats})}}async add(t){var e;if(await this._canUseIndexedDBPromise){const n=await this.read();return Vt(this.app,{lastSentHeartbeatDate:null!==(e=t.lastSentHeartbeatDate)&&void 0!==e?e:n.lastSentHeartbeatDate,heartbeats:[...n.heartbeats,...t.heartbeats]})}}}function jt(t){return r(JSON.stringify({version:2,heartbeats:t})).length}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var zt;zt="",Dt(new w("platform-logger",t=>new $(t),"PRIVATE")),Dt(new w("heartbeat",t=>new Bt(t),"PRIVATE")),Ot(Q,H,zt),Ot(Q,H,"esm2017"),Ot("fire-js","");var Kt,Gt,$t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};
/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/(function(){var t;
/** @license
  
   Copyright The Closure Library Authors.
   SPDX-License-Identifier: Apache-2.0
  */function e(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.B=Array(this.blockSize),this.o=this.h=0,this.s()}function n(t,e,n){n||(n=0);var r=Array(16);if("string"==typeof e)for(var i=0;16>i;++i)r[i]=e.charCodeAt(n++)|e.charCodeAt(n++)<<8|e.charCodeAt(n++)<<16|e.charCodeAt(n++)<<24;else for(i=0;16>i;++i)r[i]=e[n++]|e[n++]<<8|e[n++]<<16|e[n++]<<24;e=t.g[0],n=t.g[1],i=t.g[2];var s=t.g[3],o=e+(s^n&(i^s))+r[0]+3614090360&4294967295;o=(n=(i=(s=(e=(n=(i=(s=(e=(n=(i=(s=(e=(n=(i=(s=(e=(n=(i=(s=(e=(n=(i=(s=(e=(n=(i=(s=(e=(n=(i=(s=(e=(n=(i=(s=(e=(n=(i=(s=(e=(n=(i=(s=(e=(n=(i=(s=(e=(n=(i=(s=(e=(n=(i=(s=(e=(n=(i=(s=(e=n+(o<<7&4294967295|o>>>25))+((o=s+(i^e&(n^i))+r[1]+3905402710&4294967295)<<12&4294967295|o>>>20))+((o=i+(n^s&(e^n))+r[2]+606105819&4294967295)<<17&4294967295|o>>>15))+((o=n+(e^i&(s^e))+r[3]+3250441966&4294967295)<<22&4294967295|o>>>10))+((o=e+(s^n&(i^s))+r[4]+4118548399&4294967295)<<7&4294967295|o>>>25))+((o=s+(i^e&(n^i))+r[5]+1200080426&4294967295)<<12&4294967295|o>>>20))+((o=i+(n^s&(e^n))+r[6]+2821735955&4294967295)<<17&4294967295|o>>>15))+((o=n+(e^i&(s^e))+r[7]+4249261313&4294967295)<<22&4294967295|o>>>10))+((o=e+(s^n&(i^s))+r[8]+1770035416&4294967295)<<7&4294967295|o>>>25))+((o=s+(i^e&(n^i))+r[9]+2336552879&4294967295)<<12&4294967295|o>>>20))+((o=i+(n^s&(e^n))+r[10]+4294925233&4294967295)<<17&4294967295|o>>>15))+((o=n+(e^i&(s^e))+r[11]+2304563134&4294967295)<<22&4294967295|o>>>10))+((o=e+(s^n&(i^s))+r[12]+1804603682&4294967295)<<7&4294967295|o>>>25))+((o=s+(i^e&(n^i))+r[13]+4254626195&4294967295)<<12&4294967295|o>>>20))+((o=i+(n^s&(e^n))+r[14]+2792965006&4294967295)<<17&4294967295|o>>>15))+((o=n+(e^i&(s^e))+r[15]+1236535329&4294967295)<<22&4294967295|o>>>10))+((o=e+(i^s&(n^i))+r[1]+4129170786&4294967295)<<5&4294967295|o>>>27))+((o=s+(n^i&(e^n))+r[6]+3225465664&4294967295)<<9&4294967295|o>>>23))+((o=i+(e^n&(s^e))+r[11]+643717713&4294967295)<<14&4294967295|o>>>18))+((o=n+(s^e&(i^s))+r[0]+3921069994&4294967295)<<20&4294967295|o>>>12))+((o=e+(i^s&(n^i))+r[5]+3593408605&4294967295)<<5&4294967295|o>>>27))+((o=s+(n^i&(e^n))+r[10]+38016083&4294967295)<<9&4294967295|o>>>23))+((o=i+(e^n&(s^e))+r[15]+3634488961&4294967295)<<14&4294967295|o>>>18))+((o=n+(s^e&(i^s))+r[4]+3889429448&4294967295)<<20&4294967295|o>>>12))+((o=e+(i^s&(n^i))+r[9]+568446438&4294967295)<<5&4294967295|o>>>27))+((o=s+(n^i&(e^n))+r[14]+3275163606&4294967295)<<9&4294967295|o>>>23))+((o=i+(e^n&(s^e))+r[3]+4107603335&4294967295)<<14&4294967295|o>>>18))+((o=n+(s^e&(i^s))+r[8]+1163531501&4294967295)<<20&4294967295|o>>>12))+((o=e+(i^s&(n^i))+r[13]+2850285829&4294967295)<<5&4294967295|o>>>27))+((o=s+(n^i&(e^n))+r[2]+4243563512&4294967295)<<9&4294967295|o>>>23))+((o=i+(e^n&(s^e))+r[7]+1735328473&4294967295)<<14&4294967295|o>>>18))+((o=n+(s^e&(i^s))+r[12]+2368359562&4294967295)<<20&4294967295|o>>>12))+((o=e+(n^i^s)+r[5]+4294588738&4294967295)<<4&4294967295|o>>>28))+((o=s+(e^n^i)+r[8]+2272392833&4294967295)<<11&4294967295|o>>>21))+((o=i+(s^e^n)+r[11]+1839030562&4294967295)<<16&4294967295|o>>>16))+((o=n+(i^s^e)+r[14]+4259657740&4294967295)<<23&4294967295|o>>>9))+((o=e+(n^i^s)+r[1]+2763975236&4294967295)<<4&4294967295|o>>>28))+((o=s+(e^n^i)+r[4]+1272893353&4294967295)<<11&4294967295|o>>>21))+((o=i+(s^e^n)+r[7]+4139469664&4294967295)<<16&4294967295|o>>>16))+((o=n+(i^s^e)+r[10]+3200236656&4294967295)<<23&4294967295|o>>>9))+((o=e+(n^i^s)+r[13]+681279174&4294967295)<<4&4294967295|o>>>28))+((o=s+(e^n^i)+r[0]+3936430074&4294967295)<<11&4294967295|o>>>21))+((o=i+(s^e^n)+r[3]+3572445317&4294967295)<<16&4294967295|o>>>16))+((o=n+(i^s^e)+r[6]+76029189&4294967295)<<23&4294967295|o>>>9))+((o=e+(n^i^s)+r[9]+3654602809&4294967295)<<4&4294967295|o>>>28))+((o=s+(e^n^i)+r[12]+3873151461&4294967295)<<11&4294967295|o>>>21))+((o=i+(s^e^n)+r[15]+530742520&4294967295)<<16&4294967295|o>>>16))+((o=n+(i^s^e)+r[2]+3299628645&4294967295)<<23&4294967295|o>>>9))+((o=e+(i^(n|~s))+r[0]+4096336452&4294967295)<<6&4294967295|o>>>26))+((o=s+(n^(e|~i))+r[7]+1126891415&4294967295)<<10&4294967295|o>>>22))+((o=i+(e^(s|~n))+r[14]+2878612391&4294967295)<<15&4294967295|o>>>17))+((o=n+(s^(i|~e))+r[5]+4237533241&4294967295)<<21&4294967295|o>>>11))+((o=e+(i^(n|~s))+r[12]+1700485571&4294967295)<<6&4294967295|o>>>26))+((o=s+(n^(e|~i))+r[3]+2399980690&4294967295)<<10&4294967295|o>>>22))+((o=i+(e^(s|~n))+r[10]+4293915773&4294967295)<<15&4294967295|o>>>17))+((o=n+(s^(i|~e))+r[1]+2240044497&4294967295)<<21&4294967295|o>>>11))+((o=e+(i^(n|~s))+r[8]+1873313359&4294967295)<<6&4294967295|o>>>26))+((o=s+(n^(e|~i))+r[15]+4264355552&4294967295)<<10&4294967295|o>>>22))+((o=i+(e^(s|~n))+r[6]+2734768916&4294967295)<<15&4294967295|o>>>17))+((o=n+(s^(i|~e))+r[13]+1309151649&4294967295)<<21&4294967295|o>>>11))+((s=(e=n+((o=e+(i^(n|~s))+r[4]+4149444226&4294967295)<<6&4294967295|o>>>26))+((o=s+(n^(e|~i))+r[11]+3174756917&4294967295)<<10&4294967295|o>>>22))^((i=s+((o=i+(e^(s|~n))+r[2]+718787259&4294967295)<<15&4294967295|o>>>17))|~e))+r[9]+3951481745&4294967295,t.g[0]=t.g[0]+e&4294967295,t.g[1]=t.g[1]+(i+(o<<21&4294967295|o>>>11))&4294967295,t.g[2]=t.g[2]+i&4294967295,t.g[3]=t.g[3]+s&4294967295}function r(t,e){this.h=e;for(var n=[],r=!0,i=t.length-1;0<=i;i--){var s=0|t[i];r&&s==e||(n[i]=s,r=!1)}this.g=n}!function(t,e){function n(){}n.prototype=e.prototype,t.D=e.prototype,t.prototype=new n,t.prototype.constructor=t,t.C=function(t,n,r){for(var i=Array(arguments.length-2),s=2;s<arguments.length;s++)i[s-2]=arguments[s];return e.prototype[n].apply(t,i)}}(e,function(){this.blockSize=-1}),e.prototype.s=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0},e.prototype.u=function(t,e){void 0===e&&(e=t.length);for(var r=e-this.blockSize,i=this.B,s=this.h,o=0;o<e;){if(0==s)for(;o<=r;)n(this,t,o),o+=this.blockSize;if("string"==typeof t){for(;o<e;)if(i[s++]=t.charCodeAt(o++),s==this.blockSize){n(this,i),s=0;break}}else for(;o<e;)if(i[s++]=t[o++],s==this.blockSize){n(this,i),s=0;break}}this.h=s,this.o+=e},e.prototype.v=function(){var t=Array((56>this.h?this.blockSize:2*this.blockSize)-this.h);t[0]=128;for(var e=1;e<t.length-8;++e)t[e]=0;var n=8*this.o;for(e=t.length-8;e<t.length;++e)t[e]=255&n,n/=256;for(this.u(t),t=Array(16),e=n=0;4>e;++e)for(var r=0;32>r;r+=8)t[n++]=this.g[e]>>>r&255;return t};var i={};function s(t){return-128<=t&&128>t?function(t,e){var n=i;return Object.prototype.hasOwnProperty.call(n,t)?n[t]:n[t]=e(t)}(t,function(t){return new r([0|t],0>t?-1:0)}):new r([0|t],0>t?-1:0)}function o(t){if(isNaN(t)||!isFinite(t))return a;if(0>t)return d(o(-t));for(var e=[],n=1,i=0;t>=n;i++)e[i]=t/n|0,n*=4294967296;return new r(e,0)}var a=s(0),c=s(1),u=s(16777216);function l(t){if(0!=t.h)return!1;for(var e=0;e<t.g.length;e++)if(0!=t.g[e])return!1;return!0}function h(t){return-1==t.h}function d(t){for(var e=t.g.length,n=[],i=0;i<e;i++)n[i]=~t.g[i];return new r(n,~t.h).add(c)}function f(t,e){return t.add(d(e))}function m(t,e){for(;(65535&t[e])!=t[e];)t[e+1]+=t[e]>>>16,t[e]&=65535,e++}function g(t,e){this.g=t,this.h=e}function p(t,e){if(l(e))throw Error("division by zero");if(l(t))return new g(a,a);if(h(t))return e=p(d(t),e),new g(d(e.g),d(e.h));if(h(e))return e=p(t,d(e)),new g(d(e.g),e.h);if(30<t.g.length){if(h(t)||h(e))throw Error("slowDivide_ only works with positive integers.");for(var n=c,r=e;0>=r.l(t);)n=y(n),r=y(r);var i=v(n,1),s=v(r,1);for(r=v(r,2),n=v(n,2);!l(r);){var u=s.add(r);0>=u.l(t)&&(i=i.add(n),s=u),r=v(r,1),n=v(n,1)}return e=f(t,i.j(e)),new g(i,e)}for(i=a;0<=t.l(e);){for(n=Math.max(1,Math.floor(t.m()/e.m())),r=48>=(r=Math.ceil(Math.log(n)/Math.LN2))?1:Math.pow(2,r-48),u=(s=o(n)).j(e);h(u)||0<u.l(t);)u=(s=o(n-=r)).j(e);l(s)&&(s=c),i=i.add(s),t=f(t,u)}return new g(i,t)}function y(t){for(var e=t.g.length+1,n=[],i=0;i<e;i++)n[i]=t.i(i)<<1|t.i(i-1)>>>31;return new r(n,t.h)}function v(t,e){var n=e>>5;e%=32;for(var i=t.g.length-n,s=[],o=0;o<i;o++)s[o]=0<e?t.i(o+n)>>>e|t.i(o+n+1)<<32-e:t.i(o+n);return new r(s,t.h)}(t=r.prototype).m=function(){if(h(this))return-d(this).m();for(var t=0,e=1,n=0;n<this.g.length;n++){var r=this.i(n);t+=(0<=r?r:4294967296+r)*e,e*=4294967296}return t},t.toString=function(t){if(2>(t=t||10)||36<t)throw Error("radix out of range: "+t);if(l(this))return"0";if(h(this))return"-"+d(this).toString(t);for(var e=o(Math.pow(t,6)),n=this,r="";;){var i=p(n,e).g,s=((0<(n=f(n,i.j(e))).g.length?n.g[0]:n.h)>>>0).toString(t);if(l(n=i))return s+r;for(;6>s.length;)s="0"+s;r=s+r}},t.i=function(t){return 0>t?0:t<this.g.length?this.g[t]:this.h},t.l=function(t){return h(t=f(this,t))?-1:l(t)?0:1},t.abs=function(){return h(this)?d(this):this},t.add=function(t){for(var e=Math.max(this.g.length,t.g.length),n=[],i=0,s=0;s<=e;s++){var o=i+(65535&this.i(s))+(65535&t.i(s)),a=(o>>>16)+(this.i(s)>>>16)+(t.i(s)>>>16);i=a>>>16,o&=65535,a&=65535,n[s]=a<<16|o}return new r(n,-2147483648&n[n.length-1]?-1:0)},t.j=function(t){if(l(this)||l(t))return a;if(h(this))return h(t)?d(this).j(d(t)):d(d(this).j(t));if(h(t))return d(this.j(d(t)));if(0>this.l(u)&&0>t.l(u))return o(this.m()*t.m());for(var e=this.g.length+t.g.length,n=[],i=0;i<2*e;i++)n[i]=0;for(i=0;i<this.g.length;i++)for(var s=0;s<t.g.length;s++){var c=this.i(i)>>>16,f=65535&this.i(i),g=t.i(s)>>>16,p=65535&t.i(s);n[2*i+2*s]+=f*p,m(n,2*i+2*s),n[2*i+2*s+1]+=c*p,m(n,2*i+2*s+1),n[2*i+2*s+1]+=f*g,m(n,2*i+2*s+1),n[2*i+2*s+2]+=c*g,m(n,2*i+2*s+2)}for(i=0;i<e;i++)n[i]=n[2*i+1]<<16|n[2*i];for(i=e;i<2*e;i++)n[i]=0;return new r(n,0)},t.A=function(t){return p(this,t).h},t.and=function(t){for(var e=Math.max(this.g.length,t.g.length),n=[],i=0;i<e;i++)n[i]=this.i(i)&t.i(i);return new r(n,this.h&t.h)},t.or=function(t){for(var e=Math.max(this.g.length,t.g.length),n=[],i=0;i<e;i++)n[i]=this.i(i)|t.i(i);return new r(n,this.h|t.h)},t.xor=function(t){for(var e=Math.max(this.g.length,t.g.length),n=[],i=0;i<e;i++)n[i]=this.i(i)^t.i(i);return new r(n,this.h^t.h)},e.prototype.digest=e.prototype.v,e.prototype.reset=e.prototype.s,e.prototype.update=e.prototype.u,Gt=e,r.prototype.add=r.prototype.add,r.prototype.multiply=r.prototype.j,r.prototype.modulo=r.prototype.A,r.prototype.compare=r.prototype.l,r.prototype.toNumber=r.prototype.m,r.prototype.toString=r.prototype.toString,r.prototype.getBits=r.prototype.i,r.fromNumber=o,r.fromString=function t(e,n){if(0==e.length)throw Error("number format error: empty string");if(2>(n=n||10)||36<n)throw Error("radix out of range: "+n);if("-"==e.charAt(0))return d(t(e.substring(1),n));if(0<=e.indexOf("-"))throw Error('number format error: interior "-" character');for(var r=o(Math.pow(n,8)),i=a,s=0;s<e.length;s+=8){var c=Math.min(8,e.length-s),u=parseInt(e.substring(s,s+c),n);8>c?(c=o(Math.pow(n,c)),i=i.j(c).add(o(u))):i=(i=i.j(r)).add(o(u))}return i},Kt=r}).apply(void 0!==$t?$t:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{});var Qt,Ht,Wt,Jt,Yt,Xt,Zt,te,ee="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};
/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/(function(){var t,e="function"==typeof Object.defineProperties?Object.defineProperty:function(t,e,n){return t==Array.prototype||t==Object.prototype||(t[e]=n.value),t};var n=function(t){t=["object"==typeof globalThis&&globalThis,t,"object"==typeof window&&window,"object"==typeof self&&self,"object"==typeof ee&&ee];for(var e=0;e<t.length;++e){var n=t[e];if(n&&n.Math==Math)return n}throw Error("Cannot find global object")}(this);!function(t,r){if(r)t:{var i=n;t=t.split(".");for(var s=0;s<t.length-1;s++){var o=t[s];if(!(o in i))break t;i=i[o]}(r=r(s=i[t=t[t.length-1]]))!=s&&null!=r&&e(i,t,{configurable:!0,writable:!0,value:r})}}("Array.prototype.values",function(t){return t||function(){return function(t,e){t instanceof String&&(t+="");var n=0,r=!1,i={next:function(){if(!r&&n<t.length){var i=n++;return{value:e(i,t[i]),done:!1}}return r=!0,{done:!0,value:void 0}}};return i[Symbol.iterator]=function(){return i},i}(this,function(t,e){return e})}});
/** @license
  
   Copyright The Closure Library Authors.
   SPDX-License-Identifier: Apache-2.0
  */
var r=r||{},i=this||self;function s(t){var e=typeof t;return"array"==(e="object"!=e?e:t?Array.isArray(t)?"array":e:"null")||"object"==e&&"number"==typeof t.length}function o(t){var e=typeof t;return"object"==e&&null!=t||"function"==e}function a(t,e,n){return t.call.apply(t.bind,arguments)}function c(t,e,n){if(!t)throw Error();if(2<arguments.length){var r=Array.prototype.slice.call(arguments,2);return function(){var n=Array.prototype.slice.call(arguments);return Array.prototype.unshift.apply(n,r),t.apply(e,n)}}return function(){return t.apply(e,arguments)}}function u(t,e,n){return(u=Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?a:c).apply(null,arguments)}function l(t,e){var n=Array.prototype.slice.call(arguments,1);return function(){var e=n.slice();return e.push.apply(e,arguments),t.apply(this,e)}}function h(t,e){function n(){}n.prototype=e.prototype,t.aa=e.prototype,t.prototype=new n,t.prototype.constructor=t,t.Qb=function(t,n,r){for(var i=Array(arguments.length-2),s=2;s<arguments.length;s++)i[s-2]=arguments[s];return e.prototype[n].apply(t,i)}}function d(t){const e=t.length;if(0<e){const n=Array(e);for(let r=0;r<e;r++)n[r]=t[r];return n}return[]}function f(t,e){for(let n=1;n<arguments.length;n++){const e=arguments[n];if(s(e)){const n=t.length||0,r=e.length||0;t.length=n+r;for(let i=0;i<r;i++)t[n+i]=e[i]}else t.push(e)}}function m(t){return/^[\s\xa0]*$/.test(t)}function g(){var t=i.navigator;return t&&(t=t.userAgent)?t:""}function p(t){return p[" "](t),t}p[" "]=function(){};var y=!(-1==g().indexOf("Gecko")||-1!=g().toLowerCase().indexOf("webkit")&&-1==g().indexOf("Edge")||-1!=g().indexOf("Trident")||-1!=g().indexOf("MSIE")||-1!=g().indexOf("Edge"));function v(t,e,n){for(const r in t)e.call(n,t[r],r,t)}function w(t){const e={};for(const n in t)e[n]=t[n];return e}const b="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function I(t,e){let n,r;for(let i=1;i<arguments.length;i++){for(n in r=arguments[i],r)t[n]=r[n];for(let e=0;e<b.length;e++)n=b[e],Object.prototype.hasOwnProperty.call(r,n)&&(t[n]=r[n])}}function _(t){var e=1;t=t.split(":");const n=[];for(;0<e&&t.length;)n.push(t.shift()),e--;return t.length&&n.push(t.join(":")),n}function E(t){i.setTimeout(()=>{throw t},0)}function T(){var t=A;let e=null;return t.g&&(e=t.g,t.g=t.g.next,t.g||(t.h=null),e.next=null),e}var S=new class{constructor(t,e){this.i=t,this.j=e,this.h=0,this.g=null}get(){let t;return 0<this.h?(this.h--,t=this.g,this.g=t.next,t.next=null):t=this.i(),t}}(()=>new x,t=>t.reset());class x{constructor(){this.next=this.g=this.h=null}set(t,e){this.h=t,this.g=e,this.next=null}reset(){this.next=this.g=this.h=null}}let C,D=!1,A=new class{constructor(){this.h=this.g=null}add(t,e){const n=S.get();n.set(t,e),this.h?this.h.next=n:this.g=n,this.h=n}},N=()=>{const t=i.Promise.resolve(void 0);C=()=>{t.then(k)}};var k=()=>{for(var t;t=T();){try{t.h.call(t.g)}catch(n){E(n)}var e=S;e.j(t),100>e.h&&(e.h++,t.next=e.g,e.g=t)}D=!1};function R(){this.s=this.s,this.C=this.C}function O(t,e){this.type=t,this.g=this.target=e,this.defaultPrevented=!1}R.prototype.s=!1,R.prototype.ma=function(){this.s||(this.s=!0,this.N())},R.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()},O.prototype.h=function(){this.defaultPrevented=!0};var M=function(){if(!i.addEventListener||!Object.defineProperty)return!1;var t=!1,e=Object.defineProperty({},"passive",{get:function(){t=!0}});try{const t=()=>{};i.addEventListener("test",t,e),i.removeEventListener("test",t,e)}catch(n){}return t}();function L(t,e){if(O.call(this,t?t.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,t){var n=this.type=t.type,r=t.changedTouches&&t.changedTouches.length?t.changedTouches[0]:null;if(this.target=t.target||t.srcElement,this.g=e,e=t.relatedTarget){if(y){t:{try{p(e.nodeName);var i=!0;break t}catch(s){}i=!1}i||(e=null)}}else"mouseover"==n?e=t.fromElement:"mouseout"==n&&(e=t.toElement);this.relatedTarget=e,r?(this.clientX=void 0!==r.clientX?r.clientX:r.pageX,this.clientY=void 0!==r.clientY?r.clientY:r.pageY,this.screenX=r.screenX||0,this.screenY=r.screenY||0):(this.clientX=void 0!==t.clientX?t.clientX:t.pageX,this.clientY=void 0!==t.clientY?t.clientY:t.pageY,this.screenX=t.screenX||0,this.screenY=t.screenY||0),this.button=t.button,this.key=t.key||"",this.ctrlKey=t.ctrlKey,this.altKey=t.altKey,this.shiftKey=t.shiftKey,this.metaKey=t.metaKey,this.pointerId=t.pointerId||0,this.pointerType="string"==typeof t.pointerType?t.pointerType:P[t.pointerType]||"",this.state=t.state,this.i=t,t.defaultPrevented&&L.aa.h.call(this)}}h(L,O);var P={2:"touch",3:"pen",4:"mouse"};L.prototype.h=function(){L.aa.h.call(this);var t=this.i;t.preventDefault?t.preventDefault():t.returnValue=!1};var V="closure_listenable_"+(1e6*Math.random()|0),F=0;function B(t,e,n,r,i){this.listener=t,this.proxy=null,this.src=e,this.type=n,this.capture=!!r,this.ha=i,this.key=++F,this.da=this.fa=!1}function U(t){t.da=!0,t.listener=null,t.proxy=null,t.src=null,t.ha=null}function q(t){this.src=t,this.g={},this.h=0}function j(t,e){var n=e.type;if(n in t.g){var r,i=t.g[n],s=Array.prototype.indexOf.call(i,e,void 0);(r=0<=s)&&Array.prototype.splice.call(i,s,1),r&&(U(e),0==t.g[n].length&&(delete t.g[n],t.h--))}}function z(t,e,n,r){for(var i=0;i<t.length;++i){var s=t[i];if(!s.da&&s.listener==e&&s.capture==!!n&&s.ha==r)return i}return-1}q.prototype.add=function(t,e,n,r,i){var s=t.toString();(t=this.g[s])||(t=this.g[s]=[],this.h++);var o=z(t,e,r,i);return-1<o?(e=t[o],n||(e.fa=!1)):((e=new B(e,this.src,s,!!r,i)).fa=n,t.push(e)),e};var K="closure_lm_"+(1e6*Math.random()|0),G={};function $(t,e,n,r,i){if(r&&r.once)return H(t,e,n,r,i);if(Array.isArray(e)){for(var s=0;s<e.length;s++)$(t,e[s],n,r,i);return null}return n=et(n),t&&t[V]?t.K(e,n,o(r)?!!r.capture:!!r,i):Q(t,e,n,!1,r,i)}function Q(t,e,n,r,i,s){if(!e)throw Error("Invalid event type");var a=o(i)?!!i.capture:!!i,c=Z(t);if(c||(t[K]=c=new q(t)),(n=c.add(e,n,r,a,s)).proxy)return n;if(r=function(){function t(n){return e.call(t.src,t.listener,n)}const e=X;return t}(),n.proxy=r,r.src=t,r.listener=n,t.addEventListener)M||(i=a),void 0===i&&(i=!1),t.addEventListener(e.toString(),r,i);else if(t.attachEvent)t.attachEvent(Y(e.toString()),r);else{if(!t.addListener||!t.removeListener)throw Error("addEventListener and attachEvent are unavailable.");t.addListener(r)}return n}function H(t,e,n,r,i){if(Array.isArray(e)){for(var s=0;s<e.length;s++)H(t,e[s],n,r,i);return null}return n=et(n),t&&t[V]?t.L(e,n,o(r)?!!r.capture:!!r,i):Q(t,e,n,!0,r,i)}function W(t,e,n,r,i){if(Array.isArray(e))for(var s=0;s<e.length;s++)W(t,e[s],n,r,i);else r=o(r)?!!r.capture:!!r,n=et(n),t&&t[V]?(t=t.i,(e=String(e).toString())in t.g&&(-1<(n=z(s=t.g[e],n,r,i))&&(U(s[n]),Array.prototype.splice.call(s,n,1),0==s.length&&(delete t.g[e],t.h--)))):t&&(t=Z(t))&&(e=t.g[e.toString()],t=-1,e&&(t=z(e,n,r,i)),(n=-1<t?e[t]:null)&&J(n))}function J(t){if("number"!=typeof t&&t&&!t.da){var e=t.src;if(e&&e[V])j(e.i,t);else{var n=t.type,r=t.proxy;e.removeEventListener?e.removeEventListener(n,r,t.capture):e.detachEvent?e.detachEvent(Y(n),r):e.addListener&&e.removeListener&&e.removeListener(r),(n=Z(e))?(j(n,t),0==n.h&&(n.src=null,e[K]=null)):U(t)}}}function Y(t){return t in G?G[t]:G[t]="on"+t}function X(t,e){if(t.da)t=!0;else{e=new L(e,this);var n=t.listener,r=t.ha||t.src;t.fa&&J(t),t=n.call(r,e)}return t}function Z(t){return(t=t[K])instanceof q?t:null}var tt="__closure_events_fn_"+(1e9*Math.random()>>>0);function et(t){return"function"==typeof t?t:(t[tt]||(t[tt]=function(e){return t.handleEvent(e)}),t[tt])}function nt(){R.call(this),this.i=new q(this),this.M=this,this.F=null}function rt(t,e){var n,r=t.F;if(r)for(n=[];r;r=r.F)n.push(r);if(t=t.M,r=e.type||e,"string"==typeof e)e=new O(e,t);else if(e instanceof O)e.target=e.target||t;else{var i=e;I(e=new O(r,t),i)}if(i=!0,n)for(var s=n.length-1;0<=s;s--){var o=e.g=n[s];i=it(o,r,!0,e)&&i}if(i=it(o=e.g=t,r,!0,e)&&i,i=it(o,r,!1,e)&&i,n)for(s=0;s<n.length;s++)i=it(o=e.g=n[s],r,!1,e)&&i}function it(t,e,n,r){if(!(e=t.i.g[String(e)]))return!0;e=e.concat();for(var i=!0,s=0;s<e.length;++s){var o=e[s];if(o&&!o.da&&o.capture==n){var a=o.listener,c=o.ha||o.src;o.fa&&j(t.i,o),i=!1!==a.call(c,r)&&i}}return i&&!r.defaultPrevented}function st(t,e,n){if("function"==typeof t)n&&(t=u(t,n));else{if(!t||"function"!=typeof t.handleEvent)throw Error("Invalid listener argument");t=u(t.handleEvent,t)}return 2147483647<Number(e)?-1:i.setTimeout(t,e||0)}function ot(t){t.g=st(()=>{t.g=null,t.i&&(t.i=!1,ot(t))},t.l);const e=t.h;t.h=null,t.m.apply(null,e)}h(nt,R),nt.prototype[V]=!0,nt.prototype.removeEventListener=function(t,e,n,r){W(this,t,e,n,r)},nt.prototype.N=function(){if(nt.aa.N.call(this),this.i){var t,e=this.i;for(t in e.g){for(var n=e.g[t],r=0;r<n.length;r++)U(n[r]);delete e.g[t],e.h--}}this.F=null},nt.prototype.K=function(t,e,n,r){return this.i.add(String(t),e,!1,n,r)},nt.prototype.L=function(t,e,n,r){return this.i.add(String(t),e,!0,n,r)};class at extends R{constructor(t,e){super(),this.m=t,this.l=e,this.h=null,this.i=!1,this.g=null}j(t){this.h=arguments,this.g?this.i=!0:ot(this)}N(){super.N(),this.g&&(i.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function ct(t){R.call(this),this.h=t,this.g={}}h(ct,R);var ut=[];function lt(t){v(t.g,function(t,e){this.g.hasOwnProperty(e)&&J(t)},t),t.g={}}ct.prototype.N=function(){ct.aa.N.call(this),lt(this)},ct.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var ht=i.JSON.stringify,dt=i.JSON.parse,ft=class{stringify(t){return i.JSON.stringify(t,void 0)}parse(t){return i.JSON.parse(t,void 0)}};function mt(){}function gt(t){return t.h||(t.h=t.i())}function pt(){}mt.prototype.h=null;var yt={OPEN:"a",kb:"b",Ja:"c",wb:"d"};function vt(){O.call(this,"d")}function wt(){O.call(this,"c")}h(vt,O),h(wt,O);var bt={},It=null;function _t(){return It=It||new nt}function Et(t){O.call(this,bt.La,t)}function Tt(t){const e=_t();rt(e,new Et(e))}function St(t,e){O.call(this,bt.STAT_EVENT,t),this.stat=e}function xt(t){const e=_t();rt(e,new St(e,t))}function Ct(t,e){O.call(this,bt.Ma,t),this.size=e}function Dt(t,e){if("function"!=typeof t)throw Error("Fn must not be null and must be a function");return i.setTimeout(function(){t()},e)}function At(){this.g=!0}function Nt(t,e,n,r){t.info(function(){return"XMLHTTP TEXT ("+e+"): "+function(t,e){if(!t.g)return e;if(!e)return null;try{var n=JSON.parse(e);if(n)for(t=0;t<n.length;t++)if(Array.isArray(n[t])){var r=n[t];if(!(2>r.length)){var i=r[1];if(Array.isArray(i)&&!(1>i.length)){var s=i[0];if("noop"!=s&&"stop"!=s&&"close"!=s)for(var o=1;o<i.length;o++)i[o]=""}}}return ht(n)}catch(a){return e}}(t,n)+(r?" "+r:"")})}bt.La="serverreachability",h(Et,O),bt.STAT_EVENT="statevent",h(St,O),bt.Ma="timingevent",h(Ct,O),At.prototype.xa=function(){this.g=!1},At.prototype.info=function(){};var kt,Rt={NO_ERROR:0,gb:1,tb:2,sb:3,nb:4,rb:5,ub:6,Ia:7,TIMEOUT:8,xb:9},Ot={lb:"complete",Hb:"success",Ja:"error",Ia:"abort",zb:"ready",Ab:"readystatechange",TIMEOUT:"timeout",vb:"incrementaldata",yb:"progress",ob:"downloadprogress",Pb:"uploadprogress"};function Mt(){}function Lt(t,e,n,r){this.j=t,this.i=e,this.l=n,this.R=r||1,this.U=new ct(this),this.I=45e3,this.H=null,this.o=!1,this.m=this.A=this.v=this.L=this.F=this.S=this.B=null,this.D=[],this.g=null,this.C=0,this.s=this.u=null,this.X=-1,this.J=!1,this.O=0,this.M=null,this.W=this.K=this.T=this.P=!1,this.h=new Pt}function Pt(){this.i=null,this.g="",this.h=!1}h(Mt,mt),Mt.prototype.g=function(){return new XMLHttpRequest},Mt.prototype.i=function(){return{}},kt=new Mt;var Vt={},Ft={};function Bt(t,e,n){t.L=1,t.v=be(ge(e)),t.m=n,t.P=!0,Ut(t,null)}function Ut(t,e){t.F=Date.now(),zt(t),t.A=ge(t.v);var n=t.A,r=t.R;Array.isArray(r)||(r=[String(r)]),Me(n.i,"t",r),t.C=0,n=t.j.J,t.h=new Pt,t.g=_n(t.j,n?e:null,!t.m),0<t.O&&(t.M=new at(u(t.Y,t,t.g),t.O)),e=t.U,n=t.g,r=t.ca;var i="readystatechange";Array.isArray(i)||(i&&(ut[0]=i.toString()),i=ut);for(var s=0;s<i.length;s++){var o=$(n,i[s],r||e.handleEvent,!1,e.h||e);if(!o)break;e.g[o.key]=o}e=t.H?w(t.H):{},t.m?(t.u||(t.u="POST"),e["Content-Type"]="application/x-www-form-urlencoded",t.g.ea(t.A,t.u,t.m,e)):(t.u="GET",t.g.ea(t.A,t.u,null,e)),Tt(),function(t,e,n,r,i,s){t.info(function(){if(t.g)if(s)for(var o="",a=s.split("&"),c=0;c<a.length;c++){var u=a[c].split("=");if(1<u.length){var l=u[0];u=u[1];var h=l.split("_");o=2<=h.length&&"type"==h[1]?o+(l+"=")+u+"&":o+(l+"=redacted&")}}else o=null;else o=s;return"XMLHTTP REQ ("+r+") [attempt "+i+"]: "+e+"\n"+n+"\n"+o})}(t.i,t.u,t.A,t.l,t.R,t.m)}function qt(t){return!!t.g&&("GET"==t.u&&2!=t.L&&t.j.Ca)}function jt(t,e){var n=t.C,r=e.indexOf("\n",n);return-1==r?Ft:(n=Number(e.substring(n,r)),isNaN(n)?Vt:(r+=1)+n>e.length?Ft:(e=e.slice(r,r+n),t.C=r+n,e))}function zt(t){t.S=Date.now()+t.I,Kt(t,t.I)}function Kt(t,e){if(null!=t.B)throw Error("WatchDog timer not null");t.B=Dt(u(t.ba,t),e)}function Gt(t){t.B&&(i.clearTimeout(t.B),t.B=null)}function $t(t){0==t.j.G||t.J||yn(t.j,t)}function ne(t){Gt(t);var e=t.M;e&&"function"==typeof e.ma&&e.ma(),t.M=null,lt(t.U),t.g&&(e=t.g,t.g=null,e.abort(),e.ma())}function re(t,e){try{var n=t.j;if(0!=n.G&&(n.g==t||ce(n.h,t)))if(!t.K&&ce(n.h,t)&&3==n.G){try{var r=n.Da.g.parse(e)}catch(l){r=null}if(Array.isArray(r)&&3==r.length){var i=r;if(0==i[0]){t:if(!n.u){if(n.g){if(!(n.g.F+3e3<t.F))break t;pn(n),on(n)}fn(n),xt(18)}}else n.za=i[1],0<n.za-n.T&&37500>i[2]&&n.F&&0==n.v&&!n.C&&(n.C=Dt(u(n.Za,n),6e3));if(1>=ae(n.h)&&n.ca){try{n.ca()}catch(l){}n.ca=void 0}}else wn(n,11)}else if((t.K||n.g==t)&&pn(n),!m(e))for(i=n.Da.g.parse(e),e=0;e<i.length;e++){let u=i[e];if(n.T=u[0],u=u[1],2==n.G)if("c"==u[0]){n.K=u[1],n.ia=u[2];const e=u[3];null!=e&&(n.la=e,n.j.info("VER="+n.la));const i=u[4];null!=i&&(n.Aa=i,n.j.info("SVER="+n.Aa));const l=u[5];null!=l&&"number"==typeof l&&0<l&&(r=1.5*l,n.L=r,n.j.info("backChannelRequestTimeoutMs_="+r)),r=n;const h=t.g;if(h){const t=h.g?h.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(t){var s=r.h;s.g||-1==t.indexOf("spdy")&&-1==t.indexOf("quic")&&-1==t.indexOf("h2")||(s.j=s.l,s.g=new Set,s.h&&(ue(s,s.h),s.h=null))}if(r.D){const t=h.g?h.g.getResponseHeader("X-HTTP-Session-Id"):null;t&&(r.ya=t,we(r.I,r.D,t))}}n.G=3,n.l&&n.l.ua(),n.ba&&(n.R=Date.now()-t.F,n.j.info("Handshake RTT: "+n.R+"ms"));var o=t;if((r=n).qa=In(r,r.J?r.ia:null,r.W),o.K){le(r.h,o);var a=o,c=r.L;c&&(a.I=c),a.B&&(Gt(a),zt(a)),r.g=o}else dn(r);0<n.i.length&&cn(n)}else"stop"!=u[0]&&"close"!=u[0]||wn(n,7);else 3==n.G&&("stop"==u[0]||"close"==u[0]?"stop"==u[0]?wn(n,7):sn(n):"noop"!=u[0]&&n.l&&n.l.ta(u),n.v=0)}Tt()}catch(l){}}Lt.prototype.ca=function(t){t=t.target;const e=this.M;e&&3==tn(t)?e.j():this.Y(t)},Lt.prototype.Y=function(t){try{if(t==this.g)t:{const d=tn(this.g);var e=this.g.Ba();this.g.Z();if(!(3>d)&&(3!=d||this.g&&(this.h.h||this.g.oa()||en(this.g)))){this.J||4!=d||7==e||Tt(),Gt(this);var n=this.g.Z();this.X=n;e:if(qt(this)){var r=en(this.g);t="";var s=r.length,o=4==tn(this.g);if(!this.h.i){if("undefined"==typeof TextDecoder){ne(this),$t(this);var a="";break e}this.h.i=new i.TextDecoder}for(e=0;e<s;e++)this.h.h=!0,t+=this.h.i.decode(r[e],{stream:!(o&&e==s-1)});r.length=0,this.h.g+=t,this.C=0,a=this.h.g}else a=this.g.oa();if(this.o=200==n,function(t,e,n,r,i,s,o){t.info(function(){return"XMLHTTP RESP ("+r+") [ attempt "+i+"]: "+e+"\n"+n+"\n"+s+" "+o})}(this.i,this.u,this.A,this.l,this.R,d,n),this.o){if(this.T&&!this.K){e:{if(this.g){var c,u=this.g;if((c=u.g?u.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!m(c)){var l=c;break e}}l=null}if(!(n=l)){this.o=!1,this.s=3,xt(12),ne(this),$t(this);break t}Nt(this.i,this.l,n,"Initial handshake response via X-HTTP-Initial-Response"),this.K=!0,re(this,n)}if(this.P){let t;for(n=!0;!this.J&&this.C<a.length;){if(t=jt(this,a),t==Ft){4==d&&(this.s=4,xt(14),n=!1),Nt(this.i,this.l,null,"[Incomplete Response]");break}if(t==Vt){this.s=4,xt(15),Nt(this.i,this.l,a,"[Invalid Chunk]"),n=!1;break}Nt(this.i,this.l,t,null),re(this,t)}if(qt(this)&&0!=this.C&&(this.h.g=this.h.g.slice(this.C),this.C=0),4!=d||0!=a.length||this.h.h||(this.s=1,xt(16),n=!1),this.o=this.o&&n,n){if(0<a.length&&!this.W){this.W=!0;var h=this.j;h.g==this&&h.ba&&!h.M&&(h.j.info("Great, no buffering proxy detected. Bytes received: "+a.length),mn(h),h.M=!0,xt(11))}}else Nt(this.i,this.l,a,"[Invalid Chunked Response]"),ne(this),$t(this)}else Nt(this.i,this.l,a,null),re(this,a);4==d&&ne(this),this.o&&!this.J&&(4==d?yn(this.j,this):(this.o=!1,zt(this)))}else(function(t){const e={};t=(t.g&&2<=tn(t)&&t.g.getAllResponseHeaders()||"").split("\r\n");for(let r=0;r<t.length;r++){if(m(t[r]))continue;var n=_(t[r]);const i=n[0];if("string"!=typeof(n=n[1]))continue;n=n.trim();const s=e[i]||[];e[i]=s,s.push(n)}!function(t,e){for(const n in t)e.call(void 0,t[n],n,t)}(e,function(t){return t.join(", ")})})(this.g),400==n&&0<a.indexOf("Unknown SID")?(this.s=3,xt(12)):(this.s=0,xt(13)),ne(this),$t(this)}}}catch(d){}},Lt.prototype.cancel=function(){this.J=!0,ne(this)},Lt.prototype.ba=function(){this.B=null;const t=Date.now();0<=t-this.S?(function(t,e){t.info(function(){return"TIMEOUT: "+e})}(this.i,this.A),2!=this.L&&(Tt(),xt(17)),ne(this),this.s=2,$t(this)):Kt(this,this.S-t)};var ie=class{constructor(t,e){this.g=t,this.map=e}};function se(t){this.l=t||10,i.PerformanceNavigationTiming?t=0<(t=i.performance.getEntriesByType("navigation")).length&&("hq"==t[0].nextHopProtocol||"h2"==t[0].nextHopProtocol):t=!!(i.chrome&&i.chrome.loadTimes&&i.chrome.loadTimes()&&i.chrome.loadTimes().wasFetchedViaSpdy),this.j=t?this.l:1,this.g=null,1<this.j&&(this.g=new Set),this.h=null,this.i=[]}function oe(t){return!!t.h||!!t.g&&t.g.size>=t.j}function ae(t){return t.h?1:t.g?t.g.size:0}function ce(t,e){return t.h?t.h==e:!!t.g&&t.g.has(e)}function ue(t,e){t.g?t.g.add(e):t.h=e}function le(t,e){t.h&&t.h==e?t.h=null:t.g&&t.g.has(e)&&t.g.delete(e)}function he(t){if(null!=t.h)return t.i.concat(t.h.D);if(null!=t.g&&0!==t.g.size){let e=t.i;for(const n of t.g.values())e=e.concat(n.D);return e}return d(t.i)}function de(t,e){if(t.forEach&&"function"==typeof t.forEach)t.forEach(e,void 0);else if(s(t)||"string"==typeof t)Array.prototype.forEach.call(t,e,void 0);else for(var n=function(t){if(t.na&&"function"==typeof t.na)return t.na();if(!t.V||"function"!=typeof t.V){if("undefined"!=typeof Map&&t instanceof Map)return Array.from(t.keys());if(!("undefined"!=typeof Set&&t instanceof Set)){if(s(t)||"string"==typeof t){var e=[];t=t.length;for(var n=0;n<t;n++)e.push(n);return e}e=[],n=0;for(const r in t)e[n++]=r;return e}}}(t),r=function(t){if(t.V&&"function"==typeof t.V)return t.V();if("undefined"!=typeof Map&&t instanceof Map||"undefined"!=typeof Set&&t instanceof Set)return Array.from(t.values());if("string"==typeof t)return t.split("");if(s(t)){for(var e=[],n=t.length,r=0;r<n;r++)e.push(t[r]);return e}for(r in e=[],n=0,t)e[n++]=t[r];return e}(t),i=r.length,o=0;o<i;o++)e.call(void 0,r[o],n&&n[o],t)}se.prototype.cancel=function(){if(this.i=he(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&0!==this.g.size){for(const t of this.g.values())t.cancel();this.g.clear()}};var fe=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function me(t){if(this.g=this.o=this.j="",this.s=null,this.m=this.l="",this.h=!1,t instanceof me){this.h=t.h,pe(this,t.j),this.o=t.o,this.g=t.g,ye(this,t.s),this.l=t.l;var e=t.i,n=new Ne;n.i=e.i,e.g&&(n.g=new Map(e.g),n.h=e.h),ve(this,n),this.m=t.m}else t&&(e=String(t).match(fe))?(this.h=!1,pe(this,e[1]||"",!0),this.o=Ie(e[2]||""),this.g=Ie(e[3]||"",!0),ye(this,e[4]),this.l=Ie(e[5]||"",!0),ve(this,e[6]||"",!0),this.m=Ie(e[7]||"")):(this.h=!1,this.i=new Ne(null,this.h))}function ge(t){return new me(t)}function pe(t,e,n){t.j=n?Ie(e,!0):e,t.j&&(t.j=t.j.replace(/:$/,""))}function ye(t,e){if(e){if(e=Number(e),isNaN(e)||0>e)throw Error("Bad port number "+e);t.s=e}else t.s=null}function ve(t,e,n){e instanceof Ne?(t.i=e,function(t,e){e&&!t.j&&(ke(t),t.i=null,t.g.forEach(function(t,e){var n=e.toLowerCase();e!=n&&(Re(this,e),Me(this,n,t))},t)),t.j=e}(t.i,t.h)):(n||(e=_e(e,De)),t.i=new Ne(e,t.h))}function we(t,e,n){t.i.set(e,n)}function be(t){return we(t,"zx",Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^Date.now()).toString(36)),t}function Ie(t,e){return t?e?decodeURI(t.replace(/%25/g,"%2525")):decodeURIComponent(t):""}function _e(t,e,n){return"string"==typeof t?(t=encodeURI(t).replace(e,Ee),n&&(t=t.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),t):null}function Ee(t){return"%"+((t=t.charCodeAt(0))>>4&15).toString(16)+(15&t).toString(16)}me.prototype.toString=function(){var t=[],e=this.j;e&&t.push(_e(e,Se,!0),":");var n=this.g;return(n||"file"==e)&&(t.push("//"),(e=this.o)&&t.push(_e(e,Se,!0),"@"),t.push(encodeURIComponent(String(n)).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),null!=(n=this.s)&&t.push(":",String(n))),(n=this.l)&&(this.g&&"/"!=n.charAt(0)&&t.push("/"),t.push(_e(n,"/"==n.charAt(0)?Ce:xe,!0))),(n=this.i.toString())&&t.push("?",n),(n=this.m)&&t.push("#",_e(n,Ae)),t.join("")};var Te,Se=/[#\/\?@]/g,xe=/[#\?:]/g,Ce=/[#\?]/g,De=/[#\?@]/g,Ae=/#/g;function Ne(t,e){this.h=this.g=null,this.i=t||null,this.j=!!e}function ke(t){t.g||(t.g=new Map,t.h=0,t.i&&function(t,e){if(t){t=t.split("&");for(var n=0;n<t.length;n++){var r=t[n].indexOf("="),i=null;if(0<=r){var s=t[n].substring(0,r);i=t[n].substring(r+1)}else s=t[n];e(s,i?decodeURIComponent(i.replace(/\+/g," ")):"")}}}(t.i,function(e,n){t.add(decodeURIComponent(e.replace(/\+/g," ")),n)}))}function Re(t,e){ke(t),e=Le(t,e),t.g.has(e)&&(t.i=null,t.h-=t.g.get(e).length,t.g.delete(e))}function Oe(t,e){return ke(t),e=Le(t,e),t.g.has(e)}function Me(t,e,n){Re(t,e),0<n.length&&(t.i=null,t.g.set(Le(t,e),d(n)),t.h+=n.length)}function Le(t,e){return e=String(e),t.j&&(e=e.toLowerCase()),e}function Pe(t,e,n,r,i){try{i&&(i.onload=null,i.onerror=null,i.onabort=null,i.ontimeout=null),r(n)}catch(s){}}function Ve(){this.g=new ft}function Fe(t,e,n){const r=n||"";try{de(t,function(t,n){let i=t;o(t)&&(i=ht(t)),e.push(r+n+"="+encodeURIComponent(i))})}catch(i){throw e.push(r+"type="+encodeURIComponent("_badmap")),i}}function Be(t){this.l=t.Ub||null,this.j=t.eb||!1}function Ue(t,e){nt.call(this),this.D=t,this.o=e,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.u=new Headers,this.h=null,this.B="GET",this.A="",this.g=!1,this.v=this.j=this.l=null}function qe(t){t.j.read().then(t.Pa.bind(t)).catch(t.ga.bind(t))}function je(t){t.readyState=4,t.l=null,t.j=null,t.v=null,ze(t)}function ze(t){t.onreadystatechange&&t.onreadystatechange.call(t)}function Ke(t){let e="";return v(t,function(t,n){e+=n,e+=":",e+=t,e+="\r\n"}),e}function Ge(t,e,n){t:{for(r in n){var r=!1;break t}r=!0}r||(n=Ke(n),"string"==typeof t?null!=n&&encodeURIComponent(String(n)):we(t,e,n))}function $e(t){nt.call(this),this.headers=new Map,this.o=t||null,this.h=!1,this.v=this.g=null,this.D="",this.m=0,this.l="",this.j=this.B=this.u=this.A=!1,this.I=null,this.H="",this.J=!1}(t=Ne.prototype).add=function(t,e){ke(this),this.i=null,t=Le(this,t);var n=this.g.get(t);return n||this.g.set(t,n=[]),n.push(e),this.h+=1,this},t.forEach=function(t,e){ke(this),this.g.forEach(function(n,r){n.forEach(function(n){t.call(e,n,r,this)},this)},this)},t.na=function(){ke(this);const t=Array.from(this.g.values()),e=Array.from(this.g.keys()),n=[];for(let r=0;r<e.length;r++){const i=t[r];for(let t=0;t<i.length;t++)n.push(e[r])}return n},t.V=function(t){ke(this);let e=[];if("string"==typeof t)Oe(this,t)&&(e=e.concat(this.g.get(Le(this,t))));else{t=Array.from(this.g.values());for(let n=0;n<t.length;n++)e=e.concat(t[n])}return e},t.set=function(t,e){return ke(this),this.i=null,Oe(this,t=Le(this,t))&&(this.h-=this.g.get(t).length),this.g.set(t,[e]),this.h+=1,this},t.get=function(t,e){return t&&0<(t=this.V(t)).length?String(t[0]):e},t.toString=function(){if(this.i)return this.i;if(!this.g)return"";const t=[],e=Array.from(this.g.keys());for(var n=0;n<e.length;n++){var r=e[n];const s=encodeURIComponent(String(r)),o=this.V(r);for(r=0;r<o.length;r++){var i=s;""!==o[r]&&(i+="="+encodeURIComponent(String(o[r]))),t.push(i)}}return this.i=t.join("&")},h(Be,mt),Be.prototype.g=function(){return new Ue(this.l,this.j)},Be.prototype.i=(Te={},function(){return Te}),h(Ue,nt),(t=Ue.prototype).open=function(t,e){if(0!=this.readyState)throw this.abort(),Error("Error reopening a connection");this.B=t,this.A=e,this.readyState=1,ze(this)},t.send=function(t){if(1!=this.readyState)throw this.abort(),Error("need to call open() first. ");this.g=!0;const e={headers:this.u,method:this.B,credentials:this.m,cache:void 0};t&&(e.body=t),(this.D||i).fetch(new Request(this.A,e)).then(this.Sa.bind(this),this.ga.bind(this))},t.abort=function(){this.response=this.responseText="",this.u=new Headers,this.status=0,this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),1<=this.readyState&&this.g&&4!=this.readyState&&(this.g=!1,je(this)),this.readyState=0},t.Sa=function(t){if(this.g&&(this.l=t,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=t.headers,this.readyState=2,ze(this)),this.g&&(this.readyState=3,ze(this),this.g)))if("arraybuffer"===this.responseType)t.arrayBuffer().then(this.Qa.bind(this),this.ga.bind(this));else if(void 0!==i.ReadableStream&&"body"in t){if(this.j=t.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.v=new TextDecoder;qe(this)}else t.text().then(this.Ra.bind(this),this.ga.bind(this))},t.Pa=function(t){if(this.g){if(this.o&&t.value)this.response.push(t.value);else if(!this.o){var e=t.value?t.value:new Uint8Array(0);(e=this.v.decode(e,{stream:!t.done}))&&(this.response=this.responseText+=e)}t.done?je(this):ze(this),3==this.readyState&&qe(this)}},t.Ra=function(t){this.g&&(this.response=this.responseText=t,je(this))},t.Qa=function(t){this.g&&(this.response=t,je(this))},t.ga=function(){this.g&&je(this)},t.setRequestHeader=function(t,e){this.u.append(t,e)},t.getResponseHeader=function(t){return this.h&&this.h.get(t.toLowerCase())||""},t.getAllResponseHeaders=function(){if(!this.h)return"";const t=[],e=this.h.entries();for(var n=e.next();!n.done;)n=n.value,t.push(n[0]+": "+n[1]),n=e.next();return t.join("\r\n")},Object.defineProperty(Ue.prototype,"withCredentials",{get:function(){return"include"===this.m},set:function(t){this.m=t?"include":"same-origin"}}),h($e,nt);var Qe=/^https?$/i,He=["POST","PUT"];function We(t,e){t.h=!1,t.g&&(t.j=!0,t.g.abort(),t.j=!1),t.l=e,t.m=5,Je(t),Xe(t)}function Je(t){t.A||(t.A=!0,rt(t,"complete"),rt(t,"error"))}function Ye(t){if(t.h&&void 0!==r&&(!t.v[1]||4!=tn(t)||2!=t.Z()))if(t.u&&4==tn(t))st(t.Ea,0,t);else if(rt(t,"readystatechange"),4==tn(t)){t.h=!1;try{const r=t.Z();t:switch(r){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var e=!0;break t;default:e=!1}var n;if(!(n=e)){var s;if(s=0===r){var o=String(t.D).match(fe)[1]||null;!o&&i.self&&i.self.location&&(o=i.self.location.protocol.slice(0,-1)),s=!Qe.test(o?o.toLowerCase():"")}n=s}if(n)rt(t,"complete"),rt(t,"success");else{t.m=6;try{var a=2<tn(t)?t.g.statusText:""}catch(c){a=""}t.l=a+" ["+t.Z()+"]",Je(t)}}finally{Xe(t)}}}function Xe(t,e){if(t.g){Ze(t);const r=t.g,i=t.v[0]?()=>{}:null;t.g=null,t.v=null,e||rt(t,"ready");try{r.onreadystatechange=i}catch(n){}}}function Ze(t){t.I&&(i.clearTimeout(t.I),t.I=null)}function tn(t){return t.g?t.g.readyState:0}function en(t){try{if(!t.g)return null;if("response"in t.g)return t.g.response;switch(t.H){case"":case"text":return t.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in t.g)return t.g.mozResponseArrayBuffer}return null}catch(e){return null}}function nn(t,e,n){return n&&n.internalChannelParams&&n.internalChannelParams[t]||e}function rn(t){this.Aa=0,this.i=[],this.j=new At,this.ia=this.qa=this.I=this.W=this.g=this.ya=this.D=this.H=this.m=this.S=this.o=null,this.Ya=this.U=0,this.Va=nn("failFast",!1,t),this.F=this.C=this.u=this.s=this.l=null,this.X=!0,this.za=this.T=-1,this.Y=this.v=this.B=0,this.Ta=nn("baseRetryDelayMs",5e3,t),this.cb=nn("retryDelaySeedMs",1e4,t),this.Wa=nn("forwardChannelMaxRetries",2,t),this.wa=nn("forwardChannelRequestTimeoutMs",2e4,t),this.pa=t&&t.xmlHttpFactory||void 0,this.Xa=t&&t.Tb||void 0,this.Ca=t&&t.useFetchStreams||!1,this.L=void 0,this.J=t&&t.supportsCrossDomainXhr||!1,this.K="",this.h=new se(t&&t.concurrentRequestLimit),this.Da=new Ve,this.P=t&&t.fastHandshake||!1,this.O=t&&t.encodeInitMessageHeaders||!1,this.P&&this.O&&(this.O=!1),this.Ua=t&&t.Rb||!1,t&&t.xa&&this.j.xa(),t&&t.forceLongPolling&&(this.X=!1),this.ba=!this.P&&this.X&&t&&t.detectBufferingProxy||!1,this.ja=void 0,t&&t.longPollingTimeout&&0<t.longPollingTimeout&&(this.ja=t.longPollingTimeout),this.ca=void 0,this.R=0,this.M=!1,this.ka=this.A=null}function sn(t){if(an(t),3==t.G){var e=t.U++,n=ge(t.I);if(we(n,"SID",t.K),we(n,"RID",e),we(n,"TYPE","terminate"),ln(t,n),(e=new Lt(t,t.j,e)).L=2,e.v=be(ge(n)),n=!1,i.navigator&&i.navigator.sendBeacon)try{n=i.navigator.sendBeacon(e.v.toString(),"")}catch(r){}!n&&i.Image&&((new Image).src=e.v,n=!0),n||(e.g=_n(e.j,null),e.g.ea(e.v)),e.F=Date.now(),zt(e)}bn(t)}function on(t){t.g&&(mn(t),t.g.cancel(),t.g=null)}function an(t){on(t),t.u&&(i.clearTimeout(t.u),t.u=null),pn(t),t.h.cancel(),t.s&&("number"==typeof t.s&&i.clearTimeout(t.s),t.s=null)}function cn(t){if(!oe(t.h)&&!t.s){t.s=!0;var e=t.Ga;C||N(),D||(C(),D=!0),A.add(e,t),t.B=0}}function un(t,e){var n;n=e?e.l:t.U++;const r=ge(t.I);we(r,"SID",t.K),we(r,"RID",n),we(r,"AID",t.T),ln(t,r),t.m&&t.o&&Ge(r,t.m,t.o),n=new Lt(t,t.j,n,t.B+1),null===t.m&&(n.H=t.o),e&&(t.i=e.D.concat(t.i)),e=hn(t,n,1e3),n.I=Math.round(.5*t.wa)+Math.round(.5*t.wa*Math.random()),ue(t.h,n),Bt(n,r,e)}function ln(t,e){t.H&&v(t.H,function(t,n){we(e,n,t)}),t.l&&de({},function(t,n){we(e,n,t)})}function hn(t,e,n){n=Math.min(t.i.length,n);var r=t.l?u(t.l.Na,t.l,t):null;t:{var i=t.i;let e=-1;for(;;){const t=["count="+n];-1==e?0<n?(e=i[0].g,t.push("ofs="+e)):e=0:t.push("ofs="+e);let o=!0;for(let a=0;a<n;a++){let n=i[a].g;const c=i[a].map;if(n-=e,0>n)e=Math.max(0,i[a].g-100),o=!1;else try{Fe(c,t,"req"+n+"_")}catch(s){r&&r(c)}}if(o){r=t.join("&");break t}}}return t=t.i.splice(0,n),e.D=t,r}function dn(t){if(!t.g&&!t.u){t.Y=1;var e=t.Fa;C||N(),D||(C(),D=!0),A.add(e,t),t.v=0}}function fn(t){return!(t.g||t.u||3<=t.v)&&(t.Y++,t.u=Dt(u(t.Fa,t),vn(t,t.v)),t.v++,!0)}function mn(t){null!=t.A&&(i.clearTimeout(t.A),t.A=null)}function gn(t){t.g=new Lt(t,t.j,"rpc",t.Y),null===t.m&&(t.g.H=t.o),t.g.O=0;var e=ge(t.qa);we(e,"RID","rpc"),we(e,"SID",t.K),we(e,"AID",t.T),we(e,"CI",t.F?"0":"1"),!t.F&&t.ja&&we(e,"TO",t.ja),we(e,"TYPE","xmlhttp"),ln(t,e),t.m&&t.o&&Ge(e,t.m,t.o),t.L&&(t.g.I=t.L);var n=t.g;t=t.ia,n.L=1,n.v=be(ge(e)),n.m=null,n.P=!0,Ut(n,t)}function pn(t){null!=t.C&&(i.clearTimeout(t.C),t.C=null)}function yn(t,e){var n=null;if(t.g==e){pn(t),mn(t),t.g=null;var r=2}else{if(!ce(t.h,e))return;n=e.D,le(t.h,e),r=1}if(0!=t.G)if(e.o)if(1==r){n=e.m?e.m.length:0,e=Date.now()-e.F;var i=t.B;rt(r=_t(),new Ct(r,n)),cn(t)}else dn(t);else if(3==(i=e.s)||0==i&&0<e.X||!(1==r&&function(t,e){return!(ae(t.h)>=t.h.j-(t.s?1:0)||(t.s?(t.i=e.D.concat(t.i),0):1==t.G||2==t.G||t.B>=(t.Va?0:t.Wa)||(t.s=Dt(u(t.Ga,t,e),vn(t,t.B)),t.B++,0)))}(t,e)||2==r&&fn(t)))switch(n&&0<n.length&&(e=t.h,e.i=e.i.concat(n)),i){case 1:wn(t,5);break;case 4:wn(t,10);break;case 3:wn(t,6);break;default:wn(t,2)}}function vn(t,e){let n=t.Ta+Math.floor(Math.random()*t.cb);return t.isActive()||(n*=2),n*e}function wn(t,e){if(t.j.info("Error code "+e),2==e){var n=u(t.fb,t),r=t.Xa;const e=!r;r=new me(r||"//www.google.com/images/cleardot.gif"),i.location&&"http"==i.location.protocol||pe(r,"https"),be(r),e?function(t,e){const n=new At;if(i.Image){const r=new Image;r.onload=l(Pe,n,"TestLoadImage: loaded",!0,e,r),r.onerror=l(Pe,n,"TestLoadImage: error",!1,e,r),r.onabort=l(Pe,n,"TestLoadImage: abort",!1,e,r),r.ontimeout=l(Pe,n,"TestLoadImage: timeout",!1,e,r),i.setTimeout(function(){r.ontimeout&&r.ontimeout()},1e4),r.src=t}else e(!1)}(r.toString(),n):function(t,e){new At;const n=new AbortController,r=setTimeout(()=>{n.abort(),Pe(0,0,!1,e)},1e4);fetch(t,{signal:n.signal}).then(t=>{clearTimeout(r),t.ok?Pe(0,0,!0,e):Pe(0,0,!1,e)}).catch(()=>{clearTimeout(r),Pe(0,0,!1,e)})}(r.toString(),n)}else xt(2);t.G=0,t.l&&t.l.sa(e),bn(t),an(t)}function bn(t){if(t.G=0,t.ka=[],t.l){const e=he(t.h);0==e.length&&0==t.i.length||(f(t.ka,e),f(t.ka,t.i),t.h.i.length=0,d(t.i),t.i.length=0),t.l.ra()}}function In(t,e,n){var r=n instanceof me?ge(n):new me(n);if(""!=r.g)e&&(r.g=e+"."+r.g),ye(r,r.s);else{var s=i.location;r=s.protocol,e=e?e+"."+s.hostname:s.hostname,s=+s.port;var o=new me(null);r&&pe(o,r),e&&(o.g=e),s&&ye(o,s),n&&(o.l=n),r=o}return n=t.D,e=t.ya,n&&e&&we(r,n,e),we(r,"VER",t.la),ln(t,r),r}function _n(t,e,n){if(e&&!t.J)throw Error("Can't create secondary domain capable XhrIo object.");return(e=t.Ca&&!t.pa?new $e(new Be({eb:n})):new $e(t.pa)).Ha(t.J),e}function En(){}function Tn(){}function Sn(t,e){nt.call(this),this.g=new rn(e),this.l=t,this.h=e&&e.messageUrlParams||null,t=e&&e.messageHeaders||null,e&&e.clientProtocolHeaderRequired&&(t?t["X-Client-Protocol"]="webchannel":t={"X-Client-Protocol":"webchannel"}),this.g.o=t,t=e&&e.initMessageHeaders||null,e&&e.messageContentType&&(t?t["X-WebChannel-Content-Type"]=e.messageContentType:t={"X-WebChannel-Content-Type":e.messageContentType}),e&&e.va&&(t?t["X-WebChannel-Client-Profile"]=e.va:t={"X-WebChannel-Client-Profile":e.va}),this.g.S=t,(t=e&&e.Sb)&&!m(t)&&(this.g.m=t),this.v=e&&e.supportsCrossDomainXhr||!1,this.u=e&&e.sendRawJson||!1,(e=e&&e.httpSessionIdParam)&&!m(e)&&(this.g.D=e,null!==(t=this.h)&&e in t&&(e in(t=this.h)&&delete t[e])),this.j=new Dn(this)}function xn(t){vt.call(this),t.__headers__&&(this.headers=t.__headers__,this.statusCode=t.__status__,delete t.__headers__,delete t.__status__);var e=t.__sm__;if(e){t:{for(const n in e){t=n;break t}t=void 0}(this.i=t)&&(t=this.i,e=null!==e&&t in e?e[t]:void 0),this.data=e}else this.data=t}function Cn(){wt.call(this),this.status=1}function Dn(t){this.g=t}(t=$e.prototype).Ha=function(t){this.J=t},t.ea=function(t,e,n,r){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+t);e=e?e.toUpperCase():"GET",this.D=t,this.l="",this.m=0,this.A=!1,this.h=!0,this.g=this.o?this.o.g():kt.g(),this.v=this.o?gt(this.o):gt(kt),this.g.onreadystatechange=u(this.Ea,this);try{this.B=!0,this.g.open(e,String(t),!0),this.B=!1}catch(o){return void We(this,o)}if(t=n||"",n=new Map(this.headers),r)if(Object.getPrototypeOf(r)===Object.prototype)for(var s in r)n.set(s,r[s]);else{if("function"!=typeof r.keys||"function"!=typeof r.get)throw Error("Unknown input type for opt_headers: "+String(r));for(const t of r.keys())n.set(t,r.get(t))}r=Array.from(n.keys()).find(t=>"content-type"==t.toLowerCase()),s=i.FormData&&t instanceof i.FormData,!(0<=Array.prototype.indexOf.call(He,e,void 0))||r||s||n.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[i,a]of n)this.g.setRequestHeader(i,a);this.H&&(this.g.responseType=this.H),"withCredentials"in this.g&&this.g.withCredentials!==this.J&&(this.g.withCredentials=this.J);try{Ze(this),this.u=!0,this.g.send(t),this.u=!1}catch(o){We(this,o)}},t.abort=function(t){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.m=t||7,rt(this,"complete"),rt(this,"abort"),Xe(this))},t.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Xe(this,!0)),$e.aa.N.call(this)},t.Ea=function(){this.s||(this.B||this.u||this.j?Ye(this):this.bb())},t.bb=function(){Ye(this)},t.isActive=function(){return!!this.g},t.Z=function(){try{return 2<tn(this)?this.g.status:-1}catch(Te){return-1}},t.oa=function(){try{return this.g?this.g.responseText:""}catch(Te){return""}},t.Oa=function(t){if(this.g){var e=this.g.responseText;return t&&0==e.indexOf(t)&&(e=e.substring(t.length)),dt(e)}},t.Ba=function(){return this.m},t.Ka=function(){return"string"==typeof this.l?this.l:String(this.l)},(t=rn.prototype).la=8,t.G=1,t.connect=function(t,e,n,r){xt(0),this.W=t,this.H=e||{},n&&void 0!==r&&(this.H.OSID=n,this.H.OAID=r),this.F=this.X,this.I=In(this,null,this.W),cn(this)},t.Ga=function(t){if(this.s)if(this.s=null,1==this.G){if(!t){this.U=Math.floor(1e5*Math.random()),t=this.U++;const i=new Lt(this,this.j,t);let s=this.o;if(this.S&&(s?(s=w(s),I(s,this.S)):s=this.S),null!==this.m||this.O||(i.H=s,s=null),this.P)t:{for(var e=0,n=0;n<this.i.length;n++){var r=this.i[n];if(void 0===(r="__data__"in r.map&&"string"==typeof(r=r.map.__data__)?r.length:void 0))break;if(4096<(e+=r)){e=n;break t}if(4096===e||n===this.i.length-1){e=n+1;break t}}e=1e3}else e=1e3;e=hn(this,i,e),we(n=ge(this.I),"RID",t),we(n,"CVER",22),this.D&&we(n,"X-HTTP-Session-Id",this.D),ln(this,n),s&&(this.O?e="headers="+encodeURIComponent(String(Ke(s)))+"&"+e:this.m&&Ge(n,this.m,s)),ue(this.h,i),this.Ua&&we(n,"TYPE","init"),this.P?(we(n,"$req",e),we(n,"SID","null"),i.T=!0,Bt(i,n,null)):Bt(i,n,e),this.G=2}}else 3==this.G&&(t?un(this,t):0==this.i.length||oe(this.h)||un(this))},t.Fa=function(){if(this.u=null,gn(this),this.ba&&!(this.M||null==this.g||0>=this.R)){var t=2*this.R;this.j.info("BP detection timer enabled: "+t),this.A=Dt(u(this.ab,this),t)}},t.ab=function(){this.A&&(this.A=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.M=!0,xt(10),on(this),gn(this))},t.Za=function(){null!=this.C&&(this.C=null,on(this),fn(this),xt(19))},t.fb=function(t){t?(this.j.info("Successfully pinged google.com"),xt(2)):(this.j.info("Failed to ping google.com"),xt(1))},t.isActive=function(){return!!this.l&&this.l.isActive(this)},(t=En.prototype).ua=function(){},t.ta=function(){},t.sa=function(){},t.ra=function(){},t.isActive=function(){return!0},t.Na=function(){},Tn.prototype.g=function(t,e){return new Sn(t,e)},h(Sn,nt),Sn.prototype.m=function(){this.g.l=this.j,this.v&&(this.g.J=!0),this.g.connect(this.l,this.h||void 0)},Sn.prototype.close=function(){sn(this.g)},Sn.prototype.o=function(t){var e=this.g;if("string"==typeof t){var n={};n.__data__=t,t=n}else this.u&&((n={}).__data__=ht(t),t=n);e.i.push(new ie(e.Ya++,t)),3==e.G&&cn(e)},Sn.prototype.N=function(){this.g.l=null,delete this.j,sn(this.g),delete this.g,Sn.aa.N.call(this)},h(xn,vt),h(Cn,wt),h(Dn,En),Dn.prototype.ua=function(){rt(this.g,"a")},Dn.prototype.ta=function(t){rt(this.g,new xn(t))},Dn.prototype.sa=function(t){rt(this.g,new Cn)},Dn.prototype.ra=function(){rt(this.g,"b")},Tn.prototype.createWebChannel=Tn.prototype.g,Sn.prototype.send=Sn.prototype.o,Sn.prototype.open=Sn.prototype.m,Sn.prototype.close=Sn.prototype.close,te=function(){return new Tn},Zt=function(){return _t()},Xt=bt,Yt={mb:0,pb:1,qb:2,Jb:3,Ob:4,Lb:5,Mb:6,Kb:7,Ib:8,Nb:9,PROXY:10,NOPROXY:11,Gb:12,Cb:13,Db:14,Bb:15,Eb:16,Fb:17,ib:18,hb:19,jb:20},Rt.NO_ERROR=0,Rt.TIMEOUT=8,Rt.HTTP_ERROR=6,Jt=Rt,Ot.COMPLETE="complete",Wt=Ot,pt.EventType=yt,yt.OPEN="a",yt.CLOSE="b",yt.ERROR="c",yt.MESSAGE="d",nt.prototype.listen=nt.prototype.K,Ht=pt,$e.prototype.listenOnce=$e.prototype.L,$e.prototype.getLastError=$e.prototype.Ka,$e.prototype.getLastErrorCode=$e.prototype.Ba,$e.prototype.getStatus=$e.prototype.Z,$e.prototype.getResponseJson=$e.prototype.Oa,$e.prototype.getResponseText=$e.prototype.oa,$e.prototype.send=$e.prototype.ea,$e.prototype.setWithCredentials=$e.prototype.Ha,Qt=$e}).apply(void 0!==ee?ee:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{});const ne="@firebase/firestore";
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class re{constructor(t){this.uid=t}isAuthenticated(){return null!=this.uid}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(t){return t.uid===this.uid}}re.UNAUTHENTICATED=new re(null),re.GOOGLE_CREDENTIALS=new re("google-credentials-uid"),re.FIRST_PARTY=new re("first-party-uid"),re.MOCK_USER=new re("mock-user");
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
let ie="10.14.0";
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const se=new A("@firebase/firestore");function oe(){return se.logLevel}function ae(t,...e){if(se.logLevel<=E.DEBUG){const n=e.map(le);se.debug(`Firestore (${ie}): ${t}`,...n)}}function ce(t,...e){if(se.logLevel<=E.ERROR){const n=e.map(le);se.error(`Firestore (${ie}): ${t}`,...n)}}function ue(t,...e){if(se.logLevel<=E.WARN){const n=e.map(le);se.warn(`Firestore (${ie}): ${t}`,...n)}}function le(t){if("string"==typeof t)return t;try{
/**
    * @license
    * Copyright 2020 Google LLC
    *
    * Licensed under the Apache License, Version 2.0 (the "License");
    * you may not use this file except in compliance with the License.
    * You may obtain a copy of the License at
    *
    *   http://www.apache.org/licenses/LICENSE-2.0
    *
    * Unless required by applicable law or agreed to in writing, software
    * distributed under the License is distributed on an "AS IS" BASIS,
    * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    * See the License for the specific language governing permissions and
    * limitations under the License.
    */
return e=t,JSON.stringify(e)}catch(n){return t}var e}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function he(t="Unexpected state"){const e=`FIRESTORE (${ie}) INTERNAL ASSERTION FAILED: `+t;throw ce(e),new Error(e)}function de(t,e){t||he()}function fe(t,e){return t}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const me={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class ge extends f{constructor(t,e){super(t,e),this.code=t,this.message=e,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pe{constructor(){this.promise=new Promise((t,e)=>{this.resolve=t,this.reject=e})}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ye{constructor(t,e){this.user=e,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${t}`)}}class ve{getToken(){return Promise.resolve(null)}invalidateToken(){}start(t,e){t.enqueueRetryable(()=>e(re.UNAUTHENTICATED))}shutdown(){}}class we{constructor(t){this.token=t,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(t,e){this.changeListener=e,t.enqueueRetryable(()=>e(this.token.user))}shutdown(){this.changeListener=null}}class be{constructor(t){this.t=t,this.currentUser=re.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(t,e){de(void 0===this.o);let n=this.i;const r=t=>this.i!==n?(n=this.i,e(t)):Promise.resolve();let i=new pe;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new pe,t.enqueueRetryable(()=>r(this.currentUser))};const s=()=>{const e=i;t.enqueueRetryable(async()=>{await e.promise,await r(this.currentUser)})},o=t=>{ae("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=t,this.o&&(this.auth.addAuthTokenListener(this.o),s())};this.t.onInit(t=>o(t)),setTimeout(()=>{if(!this.auth){const t=this.t.getImmediate({optional:!0});t?o(t):(ae("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new pe)}},0),s()}getToken(){const t=this.i,e=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(e).then(e=>this.i!==t?(ae("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):e?(de("string"==typeof e.accessToken),new ye(e.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const t=this.auth&&this.auth.getUid();return de(null===t||"string"==typeof t),new re(t)}}class Ie{constructor(t,e,n){this.l=t,this.h=e,this.P=n,this.type="FirstParty",this.user=re.FIRST_PARTY,this.I=new Map}T(){return this.P?this.P():null}get headers(){this.I.set("X-Goog-AuthUser",this.l);const t=this.T();return t&&this.I.set("Authorization",t),this.h&&this.I.set("X-Goog-Iam-Authorization-Token",this.h),this.I}}class _e{constructor(t,e,n){this.l=t,this.h=e,this.P=n}getToken(){return Promise.resolve(new Ie(this.l,this.h,this.P))}start(t,e){t.enqueueRetryable(()=>e(re.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class Ee{constructor(t){this.value=t,this.type="AppCheck",this.headers=new Map,t&&t.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class Te{constructor(t){this.A=t,this.forceRefresh=!1,this.appCheck=null,this.R=null}start(t,e){de(void 0===this.o);const n=t=>{null!=t.error&&ae("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${t.error.message}`);const n=t.token!==this.R;return this.R=t.token,ae("FirebaseAppCheckTokenProvider",`Received ${n?"new":"existing"} token.`),n?e(t.token):Promise.resolve()};this.o=e=>{t.enqueueRetryable(()=>n(e))};const r=t=>{ae("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=t,this.o&&this.appCheck.addTokenListener(this.o)};this.A.onInit(t=>r(t)),setTimeout(()=>{if(!this.appCheck){const t=this.A.getImmediate({optional:!0});t?r(t):ae("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){const t=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(t).then(t=>t?(de("string"==typeof t.token),this.R=t.token,new Ee(t.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Se(t){const e="undefined"!=typeof self&&(self.crypto||self.msCrypto),n=new Uint8Array(t);if(e&&"function"==typeof e.getRandomValues)e.getRandomValues(n);else for(let r=0;r<t;r++)n[r]=Math.floor(256*Math.random());return n}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xe{static newId(){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",e=62*Math.floor(256/62);let n="";for(;n.length<20;){const r=Se(40);for(let i=0;i<r.length;++i)n.length<20&&r[i]<e&&(n+=t.charAt(r[i]%62))}return n}}function Ce(t,e){return t<e?-1:t>e?1:0}function De(t,e,n){return t.length===e.length&&t.every((t,r)=>n(t,e[r]))}function Ae(t){return t+"\0"}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ne{constructor(t,e){if(this.seconds=t,this.nanoseconds=e,e<0)throw new ge(me.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+e);if(e>=1e9)throw new ge(me.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+e);if(t<-62135596800)throw new ge(me.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t);if(t>=253402300800)throw new ge(me.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t)}static now(){return Ne.fromMillis(Date.now())}static fromDate(t){return Ne.fromMillis(t.getTime())}static fromMillis(t){const e=Math.floor(t/1e3),n=Math.floor(1e6*(t-1e3*e));return new Ne(e,n)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(t){return this.seconds===t.seconds?Ce(this.nanoseconds,t.nanoseconds):Ce(this.seconds,t.seconds)}isEqual(t){return t.seconds===this.seconds&&t.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{seconds:this.seconds,nanoseconds:this.nanoseconds}}valueOf(){const t=this.seconds- -62135596800;return String(t).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ke{constructor(t){this.timestamp=t}static fromTimestamp(t){return new ke(t)}static min(){return new ke(new Ne(0,0))}static max(){return new ke(new Ne(253402300799,999999999))}compareTo(t){return this.timestamp._compareTo(t.timestamp)}isEqual(t){return this.timestamp.isEqual(t.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Re{constructor(t,e,n){void 0===e?e=0:e>t.length&&he(),void 0===n?n=t.length-e:n>t.length-e&&he(),this.segments=t,this.offset=e,this.len=n}get length(){return this.len}isEqual(t){return 0===Re.comparator(this,t)}child(t){const e=this.segments.slice(this.offset,this.limit());return t instanceof Re?t.forEach(t=>{e.push(t)}):e.push(t),this.construct(e)}limit(){return this.offset+this.length}popFirst(t){return t=void 0===t?1:t,this.construct(this.segments,this.offset+t,this.length-t)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(t){return this.segments[this.offset+t]}isEmpty(){return 0===this.length}isPrefixOf(t){if(t.length<this.length)return!1;for(let e=0;e<this.length;e++)if(this.get(e)!==t.get(e))return!1;return!0}isImmediateParentOf(t){if(this.length+1!==t.length)return!1;for(let e=0;e<this.length;e++)if(this.get(e)!==t.get(e))return!1;return!0}forEach(t){for(let e=this.offset,n=this.limit();e<n;e++)t(this.segments[e])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(t,e){const n=Math.min(t.length,e.length);for(let r=0;r<n;r++){const n=t.get(r),i=e.get(r);if(n<i)return-1;if(n>i)return 1}return t.length<e.length?-1:t.length>e.length?1:0}}class Oe extends Re{construct(t,e,n){return new Oe(t,e,n)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...t){const e=[];for(const n of t){if(n.indexOf("//")>=0)throw new ge(me.INVALID_ARGUMENT,`Invalid segment (${n}). Paths must not contain // in them.`);e.push(...n.split("/").filter(t=>t.length>0))}return new Oe(e)}static emptyPath(){return new Oe([])}}const Me=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Le extends Re{construct(t,e,n){return new Le(t,e,n)}static isValidIdentifier(t){return Me.test(t)}canonicalString(){return this.toArray().map(t=>(t=t.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Le.isValidIdentifier(t)||(t="`"+t+"`"),t)).join(".")}toString(){return this.canonicalString()}isKeyField(){return 1===this.length&&"__name__"===this.get(0)}static keyField(){return new Le(["__name__"])}static fromServerFormat(t){const e=[];let n="",r=0;const i=()=>{if(0===n.length)throw new ge(me.INVALID_ARGUMENT,`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);e.push(n),n=""};let s=!1;for(;r<t.length;){const e=t[r];if("\\"===e){if(r+1===t.length)throw new ge(me.INVALID_ARGUMENT,"Path has trailing escape character: "+t);const e=t[r+1];if("\\"!==e&&"."!==e&&"`"!==e)throw new ge(me.INVALID_ARGUMENT,"Path has invalid escape sequence: "+t);n+=e,r+=2}else"`"===e?(s=!s,r++):"."!==e||s?(n+=e,r++):(i(),r++)}if(i(),s)throw new ge(me.INVALID_ARGUMENT,"Unterminated ` in path: "+t);return new Le(e)}static emptyPath(){return new Le([])}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pe{constructor(t){this.path=t}static fromPath(t){return new Pe(Oe.fromString(t))}static fromName(t){return new Pe(Oe.fromString(t).popFirst(5))}static empty(){return new Pe(Oe.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(t){return this.path.length>=2&&this.path.get(this.path.length-2)===t}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(t){return null!==t&&0===Oe.comparator(this.path,t.path)}toString(){return this.path.toString()}static comparator(t,e){return Oe.comparator(t.path,e.path)}static isDocumentKey(t){return t.length%2==0}static fromSegments(t){return new Pe(new Oe(t.slice()))}}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ve{constructor(t,e,n,r){this.indexId=t,this.collectionGroup=e,this.fields=n,this.indexState=r}}function Fe(t){return t.fields.find(t=>2===t.kind)}function Be(t){return t.fields.filter(t=>2!==t.kind)}Ve.UNKNOWN_ID=-1;class Ue{constructor(t,e){this.fieldPath=t,this.kind=e}}class qe{constructor(t,e){this.sequenceNumber=t,this.offset=e}static empty(){return new qe(0,ze.min())}}function je(t){return new ze(t.readTime,t.key,-1)}class ze{constructor(t,e,n){this.readTime=t,this.documentKey=e,this.largestBatchId=n}static min(){return new ze(ke.min(),Pe.empty(),-1)}static max(){return new ze(ke.max(),Pe.empty(),-1)}}function Ke(t,e){let n=t.readTime.compareTo(e.readTime);return 0!==n?n:(n=Pe.comparator(t.documentKey,e.documentKey),0!==n?n:Ce(t.largestBatchId,e.largestBatchId)
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */)}const Ge="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class $e{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(t){this.onCommittedListeners.push(t)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(t=>t())}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Qe(t){if(t.code!==me.FAILED_PRECONDITION||t.message!==Ge)throw t;ae("LocalStore","Unexpectedly lost primary lease")}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class He{constructor(t){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,t(t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)},t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)})}catch(t){return this.next(void 0,t)}next(t,e){return this.callbackAttached&&he(),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(e,this.error):this.wrapSuccess(t,this.result):new He((n,r)=>{this.nextCallback=e=>{this.wrapSuccess(t,e).next(n,r)},this.catchCallback=t=>{this.wrapFailure(e,t).next(n,r)}})}toPromise(){return new Promise((t,e)=>{this.next(t,e)})}wrapUserFunction(t){try{const e=t();return e instanceof He?e:He.resolve(e)}catch(e){return He.reject(e)}}wrapSuccess(t,e){return t?this.wrapUserFunction(()=>t(e)):He.resolve(e)}wrapFailure(t,e){return t?this.wrapUserFunction(()=>t(e)):He.reject(e)}static resolve(t){return new He((e,n)=>{e(t)})}static reject(t){return new He((e,n)=>{n(t)})}static waitFor(t){return new He((e,n)=>{let r=0,i=0,s=!1;t.forEach(t=>{++r,t.next(()=>{++i,s&&i===r&&e()},t=>n(t))}),s=!0,i===r&&e()})}static or(t){let e=He.resolve(!1);for(const n of t)e=e.next(t=>t?He.resolve(t):n());return e}static forEach(t,e){const n=[];return t.forEach((t,r)=>{n.push(e.call(this,t,r))}),this.waitFor(n)}static mapArray(t,e){return new He((n,r)=>{const i=t.length,s=new Array(i);let o=0;for(let a=0;a<i;a++){const c=a;e(t[c]).next(t=>{s[c]=t,++o,o===i&&n(s)},t=>r(t))}})}static doWhile(t,e){return new He((n,r)=>{const i=()=>{!0===t()?e().next(()=>{i()},r):n()};i()})}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class We{constructor(t,e){this.action=t,this.transaction=e,this.aborted=!1,this.V=new pe,this.transaction.oncomplete=()=>{this.V.resolve()},this.transaction.onabort=()=>{e.error?this.V.reject(new Ze(t,e.error)):this.V.resolve()},this.transaction.onerror=e=>{const n=sn(e.target.error);this.V.reject(new Ze(t,n))}}static open(t,e,n,r){try{return new We(e,t.transaction(r,n))}catch(i){throw new Ze(e,i)}}get m(){return this.V.promise}abort(t){t&&this.V.reject(t),this.aborted||(ae("SimpleDb","Aborting transaction:",t?t.message:"Client-initiated abort"),this.aborted=!0,this.transaction.abort())}g(){const t=this.transaction;this.aborted||"function"!=typeof t.commit||t.commit()}store(t){const e=this.transaction.objectStore(t);return new en(e)}}class Je{constructor(t,e,n){this.name=t,this.version=e,this.p=n,12.2===Je.S(l())&&ce("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.")}static delete(t){return ae("SimpleDb","Removing database:",t),nn(window.indexedDB.deleteDatabase(t)).toPromise()}static D(){if(!d())return!1;if(Je.v())return!0;const t=l(),e=Je.S(t),n=0<e&&e<10,r=Ye(t),i=0<r&&r<4.5;return!(t.indexOf("MSIE ")>0||t.indexOf("Trident/")>0||t.indexOf("Edge/")>0||n||i)}static v(){var t;return"undefined"!=typeof process&&"YES"===(null===(t=process.__PRIVATE_env)||void 0===t?void 0:t.C)}static F(t,e){return t.store(e)}static S(t){const e=t.match(/i(?:phone|pad|pod) os ([\d_]+)/i),n=e?e[1].split("_").slice(0,2).join("."):"-1";return Number(n)}async M(t){return this.db||(ae("SimpleDb","Opening database:",this.name),this.db=await new Promise((e,n)=>{const r=indexedDB.open(this.name,this.version);r.onsuccess=t=>{const n=t.target.result;e(n)},r.onblocked=()=>{n(new Ze(t,"Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."))},r.onerror=e=>{const r=e.target.error;"VersionError"===r.name?n(new ge(me.FAILED_PRECONDITION,"A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")):"InvalidStateError"===r.name?n(new ge(me.FAILED_PRECONDITION,"Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: "+r)):n(new Ze(t,r))},r.onupgradeneeded=t=>{ae("SimpleDb",'Database "'+this.name+'" requires upgrade from version:',t.oldVersion);const e=t.target.result;this.p.O(e,r.transaction,t.oldVersion,this.version).next(()=>{ae("SimpleDb","Database upgrade to version "+this.version+" complete")})}})),this.N&&(this.db.onversionchange=t=>this.N(t)),this.db}L(t){this.N=t,this.db&&(this.db.onversionchange=e=>t(e))}async runTransaction(t,e,n,r){const i="readonly"===e;let s=0;for(;;){++s;try{this.db=await this.M(t);const e=We.open(this.db,t,i?"readonly":"readwrite",n),s=r(e).next(t=>(e.g(),t)).catch(t=>(e.abort(t),He.reject(t))).toPromise();return s.catch(()=>{}),await e.m,s}catch(o){const t=o,e="FirebaseError"!==t.name&&s<3;if(ae("SimpleDb","Transaction failed with error:",t.message,"Retrying:",e),this.close(),!e)return Promise.reject(t)}}}close(){this.db&&this.db.close(),this.db=void 0}}function Ye(t){const e=t.match(/Android ([\d.]+)/i),n=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(n)}class Xe{constructor(t){this.B=t,this.k=!1,this.q=null}get isDone(){return this.k}get K(){return this.q}set cursor(t){this.B=t}done(){this.k=!0}$(t){this.q=t}delete(){return nn(this.B.delete())}}class Ze extends ge{constructor(t,e){super(me.UNAVAILABLE,`IndexedDB transaction '${t}' failed: ${e}`),this.name="IndexedDbTransactionError"}}function tn(t){return"IndexedDbTransactionError"===t.name}class en{constructor(t){this.store=t}put(t,e){let n;return void 0!==e?(ae("SimpleDb","PUT",this.store.name,t,e),n=this.store.put(e,t)):(ae("SimpleDb","PUT",this.store.name,"<auto-key>",t),n=this.store.put(t)),nn(n)}add(t){return ae("SimpleDb","ADD",this.store.name,t,t),nn(this.store.add(t))}get(t){return nn(this.store.get(t)).next(e=>(void 0===e&&(e=null),ae("SimpleDb","GET",this.store.name,t,e),e))}delete(t){return ae("SimpleDb","DELETE",this.store.name,t),nn(this.store.delete(t))}count(){return ae("SimpleDb","COUNT",this.store.name),nn(this.store.count())}U(t,e){const n=this.options(t,e),r=n.index?this.store.index(n.index):this.store;if("function"==typeof r.getAll){const t=r.getAll(n.range);return new He((e,n)=>{t.onerror=t=>{n(t.target.error)},t.onsuccess=t=>{e(t.target.result)}})}{const t=this.cursor(n),e=[];return this.W(t,(t,n)=>{e.push(n)}).next(()=>e)}}G(t,e){const n=this.store.getAll(t,null===e?void 0:e);return new He((t,e)=>{n.onerror=t=>{e(t.target.error)},n.onsuccess=e=>{t(e.target.result)}})}j(t,e){ae("SimpleDb","DELETE ALL",this.store.name);const n=this.options(t,e);n.H=!1;const r=this.cursor(n);return this.W(r,(t,e,n)=>n.delete())}J(t,e){let n;e?n=t:(n={},e=t);const r=this.cursor(n);return this.W(r,e)}Y(t){const e=this.cursor({});return new He((n,r)=>{e.onerror=t=>{const e=sn(t.target.error);r(e)},e.onsuccess=e=>{const r=e.target.result;r?t(r.primaryKey,r.value).next(t=>{t?r.continue():n()}):n()}})}W(t,e){const n=[];return new He((r,i)=>{t.onerror=t=>{i(t.target.error)},t.onsuccess=t=>{const i=t.target.result;if(!i)return void r();const s=new Xe(i),o=e(i.primaryKey,i.value,s);if(o instanceof He){const t=o.catch(t=>(s.done(),He.reject(t)));n.push(t)}s.isDone?r():null===s.K?i.continue():i.continue(s.K)}}).next(()=>He.waitFor(n))}options(t,e){let n;return void 0!==t&&("string"==typeof t?n=t:e=t),{index:n,range:e}}cursor(t){let e="next";if(t.reverse&&(e="prev"),t.index){const n=this.store.index(t.index);return t.H?n.openKeyCursor(t.range,e):n.openCursor(t.range,e)}return this.store.openCursor(t.range,e)}}function nn(t){return new He((e,n)=>{t.onsuccess=t=>{const n=t.target.result;e(n)},t.onerror=t=>{const e=sn(t.target.error);n(e)}})}let rn=!1;function sn(t){const e=Je.S(l());if(e>=12.2&&e<13){const e="An internal error was encountered in the Indexed Database server";if(t.message.indexOf(e)>=0){const t=new ge("internal",`IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${e}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);return rn||(rn=!0,setTimeout(()=>{throw t},0)),t}}return t}class on{constructor(t,e){this.asyncQueue=t,this.Z=e,this.task=null}start(){this.X(15e3)}stop(){this.task&&(this.task.cancel(),this.task=null)}get started(){return null!==this.task}X(t){ae("IndexBackfiller",`Scheduled in ${t}ms`),this.task=this.asyncQueue.enqueueAfterDelay("index_backfill",t,async()=>{this.task=null;try{ae("IndexBackfiller",`Documents written: ${await this.Z.ee()}`)}catch(t){tn(t)?ae("IndexBackfiller","Ignoring IndexedDB error during index backfill: ",t):await Qe(t)}await this.X(6e4)})}}class an{constructor(t,e){this.localStore=t,this.persistence=e}async ee(t=50){return this.persistence.runTransaction("Backfill Indexes","readwrite-primary",e=>this.te(e,t))}te(t,e){const n=new Set;let r=e,i=!0;return He.doWhile(()=>!0===i&&r>0,()=>this.localStore.indexManager.getNextCollectionGroupToUpdate(t).next(e=>{if(null!==e&&!n.has(e))return ae("IndexBackfiller",`Processing collection: ${e}`),this.ne(t,e,r).next(t=>{r-=t,n.add(e)});i=!1})).next(()=>e-r)}ne(t,e,n){return this.localStore.indexManager.getMinOffsetFromCollectionGroup(t,e).next(r=>this.localStore.localDocuments.getNextDocuments(t,e,r,n).next(n=>{const i=n.changes;return this.localStore.indexManager.updateIndexEntries(t,i).next(()=>this.re(r,n)).next(n=>(ae("IndexBackfiller",`Updating offset: ${n}`),this.localStore.indexManager.updateCollectionGroup(t,e,n))).next(()=>i.size)}))}re(t,e){let n=t;return e.changes.forEach((t,e)=>{const r=je(e);Ke(r,n)>0&&(n=r)}),new ze(n.readTime,n.documentKey,Math.max(e.batchId,t.largestBatchId))}}
/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cn{constructor(t,e){this.previousValue=t,e&&(e.sequenceNumberHandler=t=>this.ie(t),this.se=t=>e.writeSequenceNumber(t))}ie(t){return this.previousValue=Math.max(t,this.previousValue),this.previousValue}next(){const t=++this.previousValue;return this.se&&this.se(t),t}}function un(t){return null==t}function ln(t){return 0===t&&1/t==-1/0}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function hn(t){let e="";for(let n=0;n<t.length;n++)e.length>0&&(e=fn(e)),e=dn(t.get(n),e);return fn(e)}function dn(t,e){let n=e;const r=t.length;for(let i=0;i<r;i++){const e=t.charAt(i);switch(e){case"\0":n+="";break;case"":n+="";break;default:n+=e}}return n}function fn(t){return t+""}function mn(t){const e=t.length;if(de(e>=2),2===e)return de(""===t.charAt(0)&&""===t.charAt(1)),Oe.emptyPath();const n=e-2,r=[];let i="";for(let s=0;s<e;){const e=t.indexOf("",s);switch((e<0||e>n)&&he(),t.charAt(e+1)){case"":const n=t.substring(s,e);let o;0===i.length?o=n:(i+=n,o=i,i=""),r.push(o);break;case"":i+=t.substring(s,e),i+="\0";break;case"":i+=t.substring(s,e+1);break;default:he()}s=e+2}return new Oe(r)}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */cn.oe=-1;const gn=["userId","batchId"];
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pn(t,e){return[t,hn(e)]}function yn(t,e,n){return[t,hn(e),n]}const vn={},wn=["prefixPath","collectionGroup","readTime","documentId"],bn=["prefixPath","collectionGroup","documentId"],In=["collectionGroup","readTime","prefixPath","documentId"],_n=["canonicalId","targetId"],En=["targetId","path"],Tn=["path","targetId"],Sn=["collectionId","parent"],xn=["indexId","uid"],Cn=["uid","sequenceNumber"],Dn=["indexId","uid","arrayValue","directionalValue","orderedDocumentKey","documentKey"],An=["indexId","uid","orderedDocumentKey"],Nn=["userId","collectionPath","documentId"],kn=["userId","collectionPath","largestBatchId"],Rn=["userId","collectionGroup","largestBatchId"],On=["mutationQueues","mutations","documentMutations","remoteDocuments","targets","owner","targetGlobal","targetDocuments","clientMetadata","remoteDocumentGlobal","collectionParents","bundles","namedQueries"],Mn=[...On,"documentOverlays"],Ln=["mutationQueues","mutations","documentMutations","remoteDocumentsV14","targets","owner","targetGlobal","targetDocuments","clientMetadata","remoteDocumentGlobal","collectionParents","bundles","namedQueries","documentOverlays"],Pn=Ln,Vn=[...Pn,"indexConfiguration","indexState","indexEntries"],Fn=Vn,Bn=[...Vn,"globals"];
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Un extends $e{constructor(t,e){super(),this._e=t,this.currentSequenceNumber=e}}function qn(t,e){const n=fe(t);return Je.F(n._e,e)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jn(t){let e=0;for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e++;return e}function zn(t,e){for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e(n,t[n])}function Kn(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gn{constructor(t,e){this.comparator=t,this.root=e||Qn.EMPTY}insert(t,e){return new Gn(this.comparator,this.root.insert(t,e,this.comparator).copy(null,null,Qn.BLACK,null,null))}remove(t){return new Gn(this.comparator,this.root.remove(t,this.comparator).copy(null,null,Qn.BLACK,null,null))}get(t){let e=this.root;for(;!e.isEmpty();){const n=this.comparator(t,e.key);if(0===n)return e.value;n<0?e=e.left:n>0&&(e=e.right)}return null}indexOf(t){let e=0,n=this.root;for(;!n.isEmpty();){const r=this.comparator(t,n.key);if(0===r)return e+n.left.size;r<0?n=n.left:(e+=n.left.size+1,n=n.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(t){return this.root.inorderTraversal(t)}forEach(t){this.inorderTraversal((e,n)=>(t(e,n),!1))}toString(){const t=[];return this.inorderTraversal((e,n)=>(t.push(`${e}:${n}`),!1)),`{${t.join(", ")}}`}reverseTraversal(t){return this.root.reverseTraversal(t)}getIterator(){return new $n(this.root,null,this.comparator,!1)}getIteratorFrom(t){return new $n(this.root,t,this.comparator,!1)}getReverseIterator(){return new $n(this.root,null,this.comparator,!0)}getReverseIteratorFrom(t){return new $n(this.root,t,this.comparator,!0)}}class $n{constructor(t,e,n,r){this.isReverse=r,this.nodeStack=[];let i=1;for(;!t.isEmpty();)if(i=e?n(t.key,e):1,e&&r&&(i*=-1),i<0)t=this.isReverse?t.left:t.right;else{if(0===i){this.nodeStack.push(t);break}this.nodeStack.push(t),t=this.isReverse?t.right:t.left}}getNext(){let t=this.nodeStack.pop();const e={key:t.key,value:t.value};if(this.isReverse)for(t=t.left;!t.isEmpty();)this.nodeStack.push(t),t=t.right;else for(t=t.right;!t.isEmpty();)this.nodeStack.push(t),t=t.left;return e}hasNext(){return this.nodeStack.length>0}peek(){if(0===this.nodeStack.length)return null;const t=this.nodeStack[this.nodeStack.length-1];return{key:t.key,value:t.value}}}class Qn{constructor(t,e,n,r,i){this.key=t,this.value=e,this.color=null!=n?n:Qn.RED,this.left=null!=r?r:Qn.EMPTY,this.right=null!=i?i:Qn.EMPTY,this.size=this.left.size+1+this.right.size}copy(t,e,n,r,i){return new Qn(null!=t?t:this.key,null!=e?e:this.value,null!=n?n:this.color,null!=r?r:this.left,null!=i?i:this.right)}isEmpty(){return!1}inorderTraversal(t){return this.left.inorderTraversal(t)||t(this.key,this.value)||this.right.inorderTraversal(t)}reverseTraversal(t){return this.right.reverseTraversal(t)||t(this.key,this.value)||this.left.reverseTraversal(t)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(t,e,n){let r=this;const i=n(t,r.key);return r=i<0?r.copy(null,null,null,r.left.insert(t,e,n),null):0===i?r.copy(null,e,null,null,null):r.copy(null,null,null,null,r.right.insert(t,e,n)),r.fixUp()}removeMin(){if(this.left.isEmpty())return Qn.EMPTY;let t=this;return t.left.isRed()||t.left.left.isRed()||(t=t.moveRedLeft()),t=t.copy(null,null,null,t.left.removeMin(),null),t.fixUp()}remove(t,e){let n,r=this;if(e(t,r.key)<0)r.left.isEmpty()||r.left.isRed()||r.left.left.isRed()||(r=r.moveRedLeft()),r=r.copy(null,null,null,r.left.remove(t,e),null);else{if(r.left.isRed()&&(r=r.rotateRight()),r.right.isEmpty()||r.right.isRed()||r.right.left.isRed()||(r=r.moveRedRight()),0===e(t,r.key)){if(r.right.isEmpty())return Qn.EMPTY;n=r.right.min(),r=r.copy(n.key,n.value,null,null,r.right.removeMin())}r=r.copy(null,null,null,null,r.right.remove(t,e))}return r.fixUp()}isRed(){return this.color}fixUp(){let t=this;return t.right.isRed()&&!t.left.isRed()&&(t=t.rotateLeft()),t.left.isRed()&&t.left.left.isRed()&&(t=t.rotateRight()),t.left.isRed()&&t.right.isRed()&&(t=t.colorFlip()),t}moveRedLeft(){let t=this.colorFlip();return t.right.left.isRed()&&(t=t.copy(null,null,null,null,t.right.rotateRight()),t=t.rotateLeft(),t=t.colorFlip()),t}moveRedRight(){let t=this.colorFlip();return t.left.left.isRed()&&(t=t.rotateRight(),t=t.colorFlip()),t}rotateLeft(){const t=this.copy(null,null,Qn.RED,null,this.right.left);return this.right.copy(null,null,this.color,t,null)}rotateRight(){const t=this.copy(null,null,Qn.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,t)}colorFlip(){const t=this.left.copy(null,null,!this.left.color,null,null),e=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,t,e)}checkMaxDepth(){const t=this.check();return Math.pow(2,t)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw he();if(this.right.isRed())throw he();const t=this.left.check();if(t!==this.right.check())throw he();return t+(this.isRed()?0:1)}}Qn.EMPTY=null,Qn.RED=!0,Qn.BLACK=!1,Qn.EMPTY=new class{constructor(){this.size=0}get key(){throw he()}get value(){throw he()}get color(){throw he()}get left(){throw he()}get right(){throw he()}copy(t,e,n,r,i){return this}insert(t,e,n){return new Qn(t,e)}remove(t,e){return this}isEmpty(){return!0}inorderTraversal(t){return!1}reverseTraversal(t){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Hn{constructor(t){this.comparator=t,this.data=new Gn(this.comparator)}has(t){return null!==this.data.get(t)}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(t){return this.data.indexOf(t)}forEach(t){this.data.inorderTraversal((e,n)=>(t(e),!1))}forEachInRange(t,e){const n=this.data.getIteratorFrom(t[0]);for(;n.hasNext();){const r=n.getNext();if(this.comparator(r.key,t[1])>=0)return;e(r.key)}}forEachWhile(t,e){let n;for(n=void 0!==e?this.data.getIteratorFrom(e):this.data.getIterator();n.hasNext();)if(!t(n.getNext().key))return}firstAfterOrEqual(t){const e=this.data.getIteratorFrom(t);return e.hasNext()?e.getNext().key:null}getIterator(){return new Wn(this.data.getIterator())}getIteratorFrom(t){return new Wn(this.data.getIteratorFrom(t))}add(t){return this.copy(this.data.remove(t).insert(t,!0))}delete(t){return this.has(t)?this.copy(this.data.remove(t)):this}isEmpty(){return this.data.isEmpty()}unionWith(t){let e=this;return e.size<t.size&&(e=t,t=this),t.forEach(t=>{e=e.add(t)}),e}isEqual(t){if(!(t instanceof Hn))return!1;if(this.size!==t.size)return!1;const e=this.data.getIterator(),n=t.data.getIterator();for(;e.hasNext();){const t=e.getNext().key,r=n.getNext().key;if(0!==this.comparator(t,r))return!1}return!0}toArray(){const t=[];return this.forEach(e=>{t.push(e)}),t}toString(){const t=[];return this.forEach(e=>t.push(e)),"SortedSet("+t.toString()+")"}copy(t){const e=new Hn(this.comparator);return e.data=t,e}}class Wn{constructor(t){this.iter=t}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}function Jn(t){return t.hasNext()?t.getNext():void 0}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yn{constructor(t){this.fields=t,t.sort(Le.comparator)}static empty(){return new Yn([])}unionWith(t){let e=new Hn(Le.comparator);for(const n of this.fields)e=e.add(n);for(const n of t)e=e.add(n);return new Yn(e.toArray())}covers(t){for(const e of this.fields)if(e.isPrefixOf(t))return!0;return!1}isEqual(t){return De(this.fields,t.fields,(t,e)=>t.isEqual(e))}}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xn extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Zn{constructor(t){this.binaryString=t}static fromBase64String(t){const e=function(t){try{return atob(t)}catch(e){throw"undefined"!=typeof DOMException&&e instanceof DOMException?new Xn("Invalid base64 string: "+e):e}}(t);return new Zn(e)}static fromUint8Array(t){const e=function(t){let e="";for(let n=0;n<t.length;++n)e+=String.fromCharCode(t[n]);return e}(t);return new Zn(e)}[Symbol.iterator](){let t=0;return{next:()=>t<this.binaryString.length?{value:this.binaryString.charCodeAt(t++),done:!1}:{value:void 0,done:!0}}}toBase64(){return t=this.binaryString,btoa(t);var t}toUint8Array(){return function(t){const e=new Uint8Array(t.length);for(let n=0;n<t.length;n++)e[n]=t.charCodeAt(n);return e}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(t){return Ce(this.binaryString,t.binaryString)}isEqual(t){return this.binaryString===t.binaryString}}Zn.EMPTY_BYTE_STRING=new Zn("");const tr=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function er(t){if(de(!!t),"string"==typeof t){let e=0;const n=tr.exec(t);if(de(!!n),n[1]){let t=n[1];t=(t+"000000000").substr(0,9),e=Number(t)}const r=new Date(t);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:nr(t.seconds),nanos:nr(t.nanos)}}function nr(t){return"number"==typeof t?t:"string"==typeof t?Number(t):0}function rr(t){return"string"==typeof t?Zn.fromBase64String(t):Zn.fromUint8Array(t)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ir(t){var e,n;return"server_timestamp"===(null===(n=((null===(e=null==t?void 0:t.mapValue)||void 0===e?void 0:e.fields)||{}).__type__)||void 0===n?void 0:n.stringValue)}function sr(t){const e=t.mapValue.fields.__previous_value__;return ir(e)?sr(e):e}function or(t){const e=er(t.mapValue.fields.__local_write_time__.timestampValue);return new Ne(e.seconds,e.nanos)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ar{constructor(t,e,n,r,i,s,o,a,c){this.databaseId=t,this.appId=e,this.persistenceKey=n,this.host=r,this.ssl=i,this.forceLongPolling=s,this.autoDetectLongPolling=o,this.longPollingOptions=a,this.useFetchStreams=c}}class cr{constructor(t,e){this.projectId=t,this.database=e||"(default)"}static empty(){return new cr("","")}get isDefaultDatabase(){return"(default)"===this.database}isEqual(t){return t instanceof cr&&t.projectId===this.projectId&&t.database===this.database}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ur={mapValue:{fields:{__type__:{stringValue:"__max__"}}}},lr={nullValue:"NULL_VALUE"};function hr(t){return"nullValue"in t?0:"booleanValue"in t?1:"integerValue"in t||"doubleValue"in t?2:"timestampValue"in t?3:"stringValue"in t?5:"bytesValue"in t?6:"referenceValue"in t?7:"geoPointValue"in t?8:"arrayValue"in t?9:"mapValue"in t?ir(t)?4:Cr(t)?9007199254740991:Sr(t)?10:11:he()}function dr(t,e){if(t===e)return!0;const n=hr(t);if(n!==hr(e))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return t.booleanValue===e.booleanValue;case 4:return or(t).isEqual(or(e));case 3:return function(t,e){if("string"==typeof t.timestampValue&&"string"==typeof e.timestampValue&&t.timestampValue.length===e.timestampValue.length)return t.timestampValue===e.timestampValue;const n=er(t.timestampValue),r=er(e.timestampValue);return n.seconds===r.seconds&&n.nanos===r.nanos}(t,e);case 5:return t.stringValue===e.stringValue;case 6:return r=e,rr(t.bytesValue).isEqual(rr(r.bytesValue));case 7:return t.referenceValue===e.referenceValue;case 8:return function(t,e){return nr(t.geoPointValue.latitude)===nr(e.geoPointValue.latitude)&&nr(t.geoPointValue.longitude)===nr(e.geoPointValue.longitude)}(t,e);case 2:return function(t,e){if("integerValue"in t&&"integerValue"in e)return nr(t.integerValue)===nr(e.integerValue);if("doubleValue"in t&&"doubleValue"in e){const n=nr(t.doubleValue),r=nr(e.doubleValue);return n===r?ln(n)===ln(r):isNaN(n)&&isNaN(r)}return!1}(t,e);case 9:return De(t.arrayValue.values||[],e.arrayValue.values||[],dr);case 10:case 11:return function(t,e){const n=t.mapValue.fields||{},r=e.mapValue.fields||{};if(jn(n)!==jn(r))return!1;for(const i in n)if(n.hasOwnProperty(i)&&(void 0===r[i]||!dr(n[i],r[i])))return!1;return!0}(t,e);default:return he()}var r}function fr(t,e){return void 0!==(t.values||[]).find(t=>dr(t,e))}function mr(t,e){if(t===e)return 0;const n=hr(t),r=hr(e);if(n!==r)return Ce(n,r);switch(n){case 0:case 9007199254740991:return 0;case 1:return Ce(t.booleanValue,e.booleanValue);case 2:return function(t,e){const n=nr(t.integerValue||t.doubleValue),r=nr(e.integerValue||e.doubleValue);return n<r?-1:n>r?1:n===r?0:isNaN(n)?isNaN(r)?0:-1:1}(t,e);case 3:return gr(t.timestampValue,e.timestampValue);case 4:return gr(or(t),or(e));case 5:return Ce(t.stringValue,e.stringValue);case 6:return function(t,e){const n=rr(t),r=rr(e);return n.compareTo(r)}(t.bytesValue,e.bytesValue);case 7:return function(t,e){const n=t.split("/"),r=e.split("/");for(let i=0;i<n.length&&i<r.length;i++){const t=Ce(n[i],r[i]);if(0!==t)return t}return Ce(n.length,r.length)}(t.referenceValue,e.referenceValue);case 8:return function(t,e){const n=Ce(nr(t.latitude),nr(e.latitude));return 0!==n?n:Ce(nr(t.longitude),nr(e.longitude))}(t.geoPointValue,e.geoPointValue);case 9:return pr(t.arrayValue,e.arrayValue);case 10:return function(t,e){var n,r,i,s;const o=t.fields||{},a=e.fields||{},c=null===(n=o.value)||void 0===n?void 0:n.arrayValue,u=null===(r=a.value)||void 0===r?void 0:r.arrayValue,l=Ce((null===(i=null==c?void 0:c.values)||void 0===i?void 0:i.length)||0,(null===(s=null==u?void 0:u.values)||void 0===s?void 0:s.length)||0);return 0!==l?l:pr(c,u)}(t.mapValue,e.mapValue);case 11:return function(t,e){if(t===ur.mapValue&&e===ur.mapValue)return 0;if(t===ur.mapValue)return 1;if(e===ur.mapValue)return-1;const n=t.fields||{},r=Object.keys(n),i=e.fields||{},s=Object.keys(i);r.sort(),s.sort();for(let o=0;o<r.length&&o<s.length;++o){const t=Ce(r[o],s[o]);if(0!==t)return t;const e=mr(n[r[o]],i[s[o]]);if(0!==e)return e}return Ce(r.length,s.length)}(t.mapValue,e.mapValue);default:throw he()}}function gr(t,e){if("string"==typeof t&&"string"==typeof e&&t.length===e.length)return Ce(t,e);const n=er(t),r=er(e),i=Ce(n.seconds,r.seconds);return 0!==i?i:Ce(n.nanos,r.nanos)}function pr(t,e){const n=t.values||[],r=e.values||[];for(let i=0;i<n.length&&i<r.length;++i){const t=mr(n[i],r[i]);if(t)return t}return Ce(n.length,r.length)}function yr(t){return vr(t)}function vr(t){return"nullValue"in t?"null":"booleanValue"in t?""+t.booleanValue:"integerValue"in t?""+t.integerValue:"doubleValue"in t?""+t.doubleValue:"timestampValue"in t?function(t){const e=er(t);return`time(${e.seconds},${e.nanos})`}(t.timestampValue):"stringValue"in t?t.stringValue:"bytesValue"in t?rr(t.bytesValue).toBase64():"referenceValue"in t?function(t){return Pe.fromName(t).toString()}(t.referenceValue):"geoPointValue"in t?function(t){return`geo(${t.latitude},${t.longitude})`}(t.geoPointValue):"arrayValue"in t?function(t){let e="[",n=!0;for(const r of t.values||[])n?n=!1:e+=",",e+=vr(r);return e+"]"}(t.arrayValue):"mapValue"in t?function(t){const e=Object.keys(t.fields||{}).sort();let n="{",r=!0;for(const i of e)r?r=!1:n+=",",n+=`${i}:${vr(t.fields[i])}`;return n+"}"}(t.mapValue):he()}function wr(t,e){return{referenceValue:`projects/${t.projectId}/databases/${t.database}/documents/${e.path.canonicalString()}`}}function br(t){return!!t&&"integerValue"in t}function Ir(t){return!!t&&"arrayValue"in t}function _r(t){return!!t&&"nullValue"in t}function Er(t){return!!t&&"doubleValue"in t&&isNaN(Number(t.doubleValue))}function Tr(t){return!!t&&"mapValue"in t}function Sr(t){var e,n;return"__vector__"===(null===(n=((null===(e=null==t?void 0:t.mapValue)||void 0===e?void 0:e.fields)||{}).__type__)||void 0===n?void 0:n.stringValue)}function xr(t){if(t.geoPointValue)return{geoPointValue:Object.assign({},t.geoPointValue)};if(t.timestampValue&&"object"==typeof t.timestampValue)return{timestampValue:Object.assign({},t.timestampValue)};if(t.mapValue){const e={mapValue:{fields:{}}};return zn(t.mapValue.fields,(t,n)=>e.mapValue.fields[t]=xr(n)),e}if(t.arrayValue){const e={arrayValue:{values:[]}};for(let n=0;n<(t.arrayValue.values||[]).length;++n)e.arrayValue.values[n]=xr(t.arrayValue.values[n]);return e}return Object.assign({},t)}function Cr(t){return"__max__"===(((t.mapValue||{}).fields||{}).__type__||{}).stringValue}const Dr={mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{}}}}};function Ar(t){return"nullValue"in t?lr:"booleanValue"in t?{booleanValue:!1}:"integerValue"in t||"doubleValue"in t?{doubleValue:NaN}:"timestampValue"in t?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"stringValue"in t?{stringValue:""}:"bytesValue"in t?{bytesValue:""}:"referenceValue"in t?wr(cr.empty(),Pe.empty()):"geoPointValue"in t?{geoPointValue:{latitude:-90,longitude:-180}}:"arrayValue"in t?{arrayValue:{}}:"mapValue"in t?Sr(t)?Dr:{mapValue:{}}:he()}function Nr(t){return"nullValue"in t?{booleanValue:!1}:"booleanValue"in t?{doubleValue:NaN}:"integerValue"in t||"doubleValue"in t?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"timestampValue"in t?{stringValue:""}:"stringValue"in t?{bytesValue:""}:"bytesValue"in t?wr(cr.empty(),Pe.empty()):"referenceValue"in t?{geoPointValue:{latitude:-90,longitude:-180}}:"geoPointValue"in t?{arrayValue:{}}:"arrayValue"in t?Dr:"mapValue"in t?Sr(t)?{mapValue:{}}:ur:he()}function kr(t,e){const n=mr(t.value,e.value);return 0!==n?n:t.inclusive&&!e.inclusive?-1:!t.inclusive&&e.inclusive?1:0}function Rr(t,e){const n=mr(t.value,e.value);return 0!==n?n:t.inclusive&&!e.inclusive?1:!t.inclusive&&e.inclusive?-1:0}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Or{constructor(t){this.value=t}static empty(){return new Or({mapValue:{}})}field(t){if(t.isEmpty())return this.value;{let e=this.value;for(let n=0;n<t.length-1;++n)if(e=(e.mapValue.fields||{})[t.get(n)],!Tr(e))return null;return e=(e.mapValue.fields||{})[t.lastSegment()],e||null}}set(t,e){this.getFieldsMap(t.popLast())[t.lastSegment()]=xr(e)}setAll(t){let e=Le.emptyPath(),n={},r=[];t.forEach((t,i)=>{if(!e.isImmediateParentOf(i)){const t=this.getFieldsMap(e);this.applyChanges(t,n,r),n={},r=[],e=i.popLast()}t?n[i.lastSegment()]=xr(t):r.push(i.lastSegment())});const i=this.getFieldsMap(e);this.applyChanges(i,n,r)}delete(t){const e=this.field(t.popLast());Tr(e)&&e.mapValue.fields&&delete e.mapValue.fields[t.lastSegment()]}isEqual(t){return dr(this.value,t.value)}getFieldsMap(t){let e=this.value;e.mapValue.fields||(e.mapValue={fields:{}});for(let n=0;n<t.length;++n){let r=e.mapValue.fields[t.get(n)];Tr(r)&&r.mapValue.fields||(r={mapValue:{fields:{}}},e.mapValue.fields[t.get(n)]=r),e=r}return e.mapValue.fields}applyChanges(t,e,n){zn(e,(e,n)=>t[e]=n);for(const r of n)delete t[r]}clone(){return new Or(xr(this.value))}}function Mr(t){const e=[];return zn(t.fields,(t,n)=>{const r=new Le([t]);if(Tr(n)){const t=Mr(n.mapValue).fields;if(0===t.length)e.push(r);else for(const n of t)e.push(r.child(n))}else e.push(r)}),new Yn(e)
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}class Lr{constructor(t,e,n,r,i,s,o){this.key=t,this.documentType=e,this.version=n,this.readTime=r,this.createTime=i,this.data=s,this.documentState=o}static newInvalidDocument(t){return new Lr(t,0,ke.min(),ke.min(),ke.min(),Or.empty(),0)}static newFoundDocument(t,e,n,r){return new Lr(t,1,e,ke.min(),n,r,0)}static newNoDocument(t,e){return new Lr(t,2,e,ke.min(),ke.min(),Or.empty(),0)}static newUnknownDocument(t,e){return new Lr(t,3,e,ke.min(),ke.min(),Or.empty(),2)}convertToFoundDocument(t,e){return!this.createTime.isEqual(ke.min())||2!==this.documentType&&0!==this.documentType||(this.createTime=t),this.version=t,this.documentType=1,this.data=e,this.documentState=0,this}convertToNoDocument(t){return this.version=t,this.documentType=2,this.data=Or.empty(),this.documentState=0,this}convertToUnknownDocument(t){return this.version=t,this.documentType=3,this.data=Or.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=ke.min(),this}setReadTime(t){return this.readTime=t,this}get hasLocalMutations(){return 1===this.documentState}get hasCommittedMutations(){return 2===this.documentState}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return 0!==this.documentType}isFoundDocument(){return 1===this.documentType}isNoDocument(){return 2===this.documentType}isUnknownDocument(){return 3===this.documentType}isEqual(t){return t instanceof Lr&&this.key.isEqual(t.key)&&this.version.isEqual(t.version)&&this.documentType===t.documentType&&this.documentState===t.documentState&&this.data.isEqual(t.data)}mutableCopy(){return new Lr(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pr{constructor(t,e){this.position=t,this.inclusive=e}}function Vr(t,e,n){let r=0;for(let i=0;i<t.position.length;i++){const s=e[i],o=t.position[i];if(r=s.field.isKeyField()?Pe.comparator(Pe.fromName(o.referenceValue),n.key):mr(o,n.data.field(s.field)),"desc"===s.dir&&(r*=-1),0!==r)break}return r}function Fr(t,e){if(null===t)return null===e;if(null===e)return!1;if(t.inclusive!==e.inclusive||t.position.length!==e.position.length)return!1;for(let n=0;n<t.position.length;n++)if(!dr(t.position[n],e.position[n]))return!1;return!0}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Br{constructor(t,e="asc"){this.field=t,this.dir=e}}function Ur(t,e){return t.dir===e.dir&&t.field.isEqual(e.field)}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qr{}class jr extends qr{constructor(t,e,n){super(),this.field=t,this.op=e,this.value=n}static create(t,e,n){return t.isKeyField()?"in"===e||"not-in"===e?this.createKeyFieldInFilter(t,e,n):new Xr(t,e,n):"array-contains"===e?new ni(t,n):"in"===e?new ri(t,n):"not-in"===e?new ii(t,n):"array-contains-any"===e?new si(t,n):new jr(t,e,n)}static createKeyFieldInFilter(t,e,n){return"in"===e?new Zr(t,n):new ti(t,n)}matches(t){const e=t.data.field(this.field);return"!="===this.op?null!==e&&this.matchesComparison(mr(e,this.value)):null!==e&&hr(this.value)===hr(e)&&this.matchesComparison(mr(e,this.value))}matchesComparison(t){switch(this.op){case"<":return t<0;case"<=":return t<=0;case"==":return 0===t;case"!=":return 0!==t;case">":return t>0;case">=":return t>=0;default:return he()}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class zr extends qr{constructor(t,e){super(),this.filters=t,this.op=e,this.ae=null}static create(t,e){return new zr(t,e)}matches(t){return Kr(this)?void 0===this.filters.find(e=>!e.matches(t)):void 0!==this.filters.find(e=>e.matches(t))}getFlattenedFilters(){return null!==this.ae||(this.ae=this.filters.reduce((t,e)=>t.concat(e.getFlattenedFilters()),[])),this.ae}getFilters(){return Object.assign([],this.filters)}}function Kr(t){return"and"===t.op}function Gr(t){return"or"===t.op}function $r(t){return Qr(t)&&Kr(t)}function Qr(t){for(const e of t.filters)if(e instanceof zr)return!1;return!0}function Hr(t){if(t instanceof jr)return t.field.canonicalString()+t.op.toString()+yr(t.value);if($r(t))return t.filters.map(t=>Hr(t)).join(",");{const e=t.filters.map(t=>Hr(t)).join(",");return`${t.op}(${e})`}}function Wr(t,e){return t instanceof jr?(n=t,(r=e)instanceof jr&&n.op===r.op&&n.field.isEqual(r.field)&&dr(n.value,r.value)):t instanceof zr?function(t,e){return e instanceof zr&&t.op===e.op&&t.filters.length===e.filters.length&&t.filters.reduce((t,n,r)=>t&&Wr(n,e.filters[r]),!0)}(t,e):void he();var n,r}function Jr(t,e){const n=t.filters.concat(e);return zr.create(n,t.op)}function Yr(t){return t instanceof jr?`${(e=t).field.canonicalString()} ${e.op} ${yr(e.value)}`:t instanceof zr?function(t){return t.op.toString()+" {"+t.getFilters().map(Yr).join(" ,")+"}"}(t):"Filter";var e}class Xr extends jr{constructor(t,e,n){super(t,e,n),this.key=Pe.fromName(n.referenceValue)}matches(t){const e=Pe.comparator(t.key,this.key);return this.matchesComparison(e)}}class Zr extends jr{constructor(t,e){super(t,"in",e),this.keys=ei("in",e)}matches(t){return this.keys.some(e=>e.isEqual(t.key))}}class ti extends jr{constructor(t,e){super(t,"not-in",e),this.keys=ei("not-in",e)}matches(t){return!this.keys.some(e=>e.isEqual(t.key))}}function ei(t,e){var n;return((null===(n=e.arrayValue)||void 0===n?void 0:n.values)||[]).map(t=>Pe.fromName(t.referenceValue))}class ni extends jr{constructor(t,e){super(t,"array-contains",e)}matches(t){const e=t.data.field(this.field);return Ir(e)&&fr(e.arrayValue,this.value)}}class ri extends jr{constructor(t,e){super(t,"in",e)}matches(t){const e=t.data.field(this.field);return null!==e&&fr(this.value.arrayValue,e)}}class ii extends jr{constructor(t,e){super(t,"not-in",e)}matches(t){if(fr(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const e=t.data.field(this.field);return null!==e&&!fr(this.value.arrayValue,e)}}class si extends jr{constructor(t,e){super(t,"array-contains-any",e)}matches(t){const e=t.data.field(this.field);return!(!Ir(e)||!e.arrayValue.values)&&e.arrayValue.values.some(t=>fr(this.value.arrayValue,t))}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oi{constructor(t,e=null,n=[],r=[],i=null,s=null,o=null){this.path=t,this.collectionGroup=e,this.orderBy=n,this.filters=r,this.limit=i,this.startAt=s,this.endAt=o,this.ue=null}}function ai(t,e=null,n=[],r=[],i=null,s=null,o=null){return new oi(t,e,n,r,i,s,o)}function ci(t){const e=fe(t);if(null===e.ue){let t=e.path.canonicalString();null!==e.collectionGroup&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map(t=>Hr(t)).join(","),t+="|ob:",t+=e.orderBy.map(t=>{return(e=t).field.canonicalString()+e.dir;var e}).join(","),un(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map(t=>yr(t)).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map(t=>yr(t)).join(",")),e.ue=t}return e.ue}function ui(t,e){if(t.limit!==e.limit)return!1;if(t.orderBy.length!==e.orderBy.length)return!1;for(let n=0;n<t.orderBy.length;n++)if(!Ur(t.orderBy[n],e.orderBy[n]))return!1;if(t.filters.length!==e.filters.length)return!1;for(let n=0;n<t.filters.length;n++)if(!Wr(t.filters[n],e.filters[n]))return!1;return t.collectionGroup===e.collectionGroup&&!!t.path.isEqual(e.path)&&!!Fr(t.startAt,e.startAt)&&Fr(t.endAt,e.endAt)}function li(t){return Pe.isDocumentKey(t.path)&&null===t.collectionGroup&&0===t.filters.length}function hi(t,e){return t.filters.filter(t=>t instanceof jr&&t.field.isEqual(e))}function di(t,e,n){let r=lr,i=!0;for(const s of hi(t,e)){let t=lr,e=!0;switch(s.op){case"<":case"<=":t=Ar(s.value);break;case"==":case"in":case">=":t=s.value;break;case">":t=s.value,e=!1;break;case"!=":case"not-in":t=lr}kr({value:r,inclusive:i},{value:t,inclusive:e})<0&&(r=t,i=e)}if(null!==n)for(let s=0;s<t.orderBy.length;++s)if(t.orderBy[s].field.isEqual(e)){const t=n.position[s];kr({value:r,inclusive:i},{value:t,inclusive:n.inclusive})<0&&(r=t,i=n.inclusive);break}return{value:r,inclusive:i}}function fi(t,e,n){let r=ur,i=!0;for(const s of hi(t,e)){let t=ur,e=!0;switch(s.op){case">=":case">":t=Nr(s.value),e=!1;break;case"==":case"in":case"<=":t=s.value;break;case"<":t=s.value,e=!1;break;case"!=":case"not-in":t=ur}Rr({value:r,inclusive:i},{value:t,inclusive:e})>0&&(r=t,i=e)}if(null!==n)for(let s=0;s<t.orderBy.length;++s)if(t.orderBy[s].field.isEqual(e)){const t=n.position[s];Rr({value:r,inclusive:i},{value:t,inclusive:n.inclusive})>0&&(r=t,i=n.inclusive);break}return{value:r,inclusive:i}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mi{constructor(t,e=null,n=[],r=[],i=null,s="F",o=null,a=null){this.path=t,this.collectionGroup=e,this.explicitOrderBy=n,this.filters=r,this.limit=i,this.limitType=s,this.startAt=o,this.endAt=a,this.ce=null,this.le=null,this.he=null,this.startAt,this.endAt}}function gi(t){return new mi(t)}function pi(t){return 0===t.filters.length&&null===t.limit&&null==t.startAt&&null==t.endAt&&(0===t.explicitOrderBy.length||1===t.explicitOrderBy.length&&t.explicitOrderBy[0].field.isKeyField())}function yi(t){return null!==t.collectionGroup}function vi(t){const e=fe(t);if(null===e.ce){e.ce=[];const t=new Set;for(const r of e.explicitOrderBy)e.ce.push(r),t.add(r.field.canonicalString());const n=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(t){let e=new Hn(Le.comparator);return t.filters.forEach(t=>{t.getFlattenedFilters().forEach(t=>{t.isInequality()&&(e=e.add(t.field))})}),e})(e).forEach(r=>{t.has(r.canonicalString())||r.isKeyField()||e.ce.push(new Br(r,n))}),t.has(Le.keyField().canonicalString())||e.ce.push(new Br(Le.keyField(),n))}return e.ce}function wi(t){const e=fe(t);return e.le||(e.le=function(t,e){if("F"===t.limitType)return ai(t.path,t.collectionGroup,e,t.filters,t.limit,t.startAt,t.endAt);{e=e.map(t=>{const e="desc"===t.dir?"asc":"desc";return new Br(t.field,e)});const n=t.endAt?new Pr(t.endAt.position,t.endAt.inclusive):null,r=t.startAt?new Pr(t.startAt.position,t.startAt.inclusive):null;return ai(t.path,t.collectionGroup,e,t.filters,t.limit,n,r)}}(e,vi(t))),e.le}function bi(t,e){const n=t.filters.concat([e]);return new mi(t.path,t.collectionGroup,t.explicitOrderBy.slice(),n,t.limit,t.limitType,t.startAt,t.endAt)}function Ii(t,e,n){return new mi(t.path,t.collectionGroup,t.explicitOrderBy.slice(),t.filters.slice(),e,n,t.startAt,t.endAt)}function _i(t,e){return ui(wi(t),wi(e))&&t.limitType===e.limitType}function Ei(t){return`${ci(wi(t))}|lt:${t.limitType}`}function Ti(t){return`Query(target=${function(t){let e=t.path.canonicalString();return null!==t.collectionGroup&&(e+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(e+=`, filters: [${t.filters.map(t=>Yr(t)).join(", ")}]`),un(t.limit)||(e+=", limit: "+t.limit),t.orderBy.length>0&&(e+=`, orderBy: [${t.orderBy.map(t=>{return`${(e=t).field.canonicalString()} (${e.dir})`;var e}).join(", ")}]`),t.startAt&&(e+=", startAt: ",e+=t.startAt.inclusive?"b:":"a:",e+=t.startAt.position.map(t=>yr(t)).join(",")),t.endAt&&(e+=", endAt: ",e+=t.endAt.inclusive?"a:":"b:",e+=t.endAt.position.map(t=>yr(t)).join(",")),`Target(${e})`}(wi(t))}; limitType=${t.limitType})`}function Si(t,e){return e.isFoundDocument()&&function(t,e){const n=e.key.path;return null!==t.collectionGroup?e.key.hasCollectionId(t.collectionGroup)&&t.path.isPrefixOf(n):Pe.isDocumentKey(t.path)?t.path.isEqual(n):t.path.isImmediateParentOf(n)}(t,e)&&function(t,e){for(const n of vi(t))if(!n.field.isKeyField()&&null===e.data.field(n.field))return!1;return!0}(t,e)&&function(t,e){for(const n of t.filters)if(!n.matches(e))return!1;return!0}(t,e)&&(r=e,!((n=t).startAt&&!function(t,e,n){const r=Vr(t,e,n);return t.inclusive?r<=0:r<0}(n.startAt,vi(n),r)||n.endAt&&!function(t,e,n){const r=Vr(t,e,n);return t.inclusive?r>=0:r>0}(n.endAt,vi(n),r)));var n,r}function xi(t){return(e,n)=>{let r=!1;for(const i of vi(t)){const t=Ci(i,e,n);if(0!==t)return t;r=r||i.field.isKeyField()}return 0}}function Ci(t,e,n){const r=t.field.isKeyField()?Pe.comparator(e.key,n.key):function(t,e,n){const r=e.data.field(t),i=n.data.field(t);return null!==r&&null!==i?mr(r,i):he()}(t.field,e,n);switch(t.dir){case"asc":return r;case"desc":return-1*r;default:return he()}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Di{constructor(t,e){this.mapKeyFn=t,this.equalsFn=e,this.inner={},this.innerSize=0}get(t){const e=this.mapKeyFn(t),n=this.inner[e];if(void 0!==n)for(const[r,i]of n)if(this.equalsFn(r,t))return i}has(t){return void 0!==this.get(t)}set(t,e){const n=this.mapKeyFn(t),r=this.inner[n];if(void 0===r)return this.inner[n]=[[t,e]],void this.innerSize++;for(let i=0;i<r.length;i++)if(this.equalsFn(r[i][0],t))return void(r[i]=[t,e]);r.push([t,e]),this.innerSize++}delete(t){const e=this.mapKeyFn(t),n=this.inner[e];if(void 0===n)return!1;for(let r=0;r<n.length;r++)if(this.equalsFn(n[r][0],t))return 1===n.length?delete this.inner[e]:n.splice(r,1),this.innerSize--,!0;return!1}forEach(t){zn(this.inner,(e,n)=>{for(const[r,i]of n)t(r,i)})}isEmpty(){return Kn(this.inner)}size(){return this.innerSize}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ai=new Gn(Pe.comparator);function Ni(){return Ai}const ki=new Gn(Pe.comparator);function Ri(...t){let e=ki;for(const n of t)e=e.insert(n.key,n);return e}function Oi(t){let e=ki;return t.forEach((t,n)=>e=e.insert(t,n.overlayedDocument)),e}function Mi(){return Pi()}function Li(){return Pi()}function Pi(){return new Di(t=>t.toString(),(t,e)=>t.isEqual(e))}const Vi=new Gn(Pe.comparator),Fi=new Hn(Pe.comparator);function Bi(...t){let e=Fi;for(const n of t)e=e.add(n);return e}const Ui=new Hn(Ce);
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function qi(t,e){if(t.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:ln(e)?"-0":e}}function ji(t){return{integerValue:""+t}}function zi(t,e){return function(t){return"number"==typeof t&&Number.isInteger(t)&&!ln(t)&&t<=Number.MAX_SAFE_INTEGER&&t>=Number.MIN_SAFE_INTEGER}(e)?ji(e):qi(t,e)}
/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ki{constructor(){this._=void 0}}function Gi(t,e,n){return t instanceof Hi?function(t,e){const n={fields:{__type__:{stringValue:"server_timestamp"},__local_write_time__:{timestampValue:{seconds:t.seconds,nanos:t.nanoseconds}}}};return e&&ir(e)&&(e=sr(e)),e&&(n.fields.__previous_value__=e),{mapValue:n}}(n,e):t instanceof Wi?Ji(t,e):t instanceof Yi?Xi(t,e):function(t,e){const n=Qi(t,e),r=ts(n)+ts(t.Pe);return br(n)&&br(t.Pe)?ji(r):qi(t.serializer,r)}(t,e)}function $i(t,e,n){return t instanceof Wi?Ji(t,e):t instanceof Yi?Xi(t,e):n}function Qi(t,e){return t instanceof Zi?br(n=e)||(r=n)&&"doubleValue"in r?e:{integerValue:0}:null;var n,r}class Hi extends Ki{}class Wi extends Ki{constructor(t){super(),this.elements=t}}function Ji(t,e){const n=es(e);for(const r of t.elements)n.some(t=>dr(t,r))||n.push(r);return{arrayValue:{values:n}}}class Yi extends Ki{constructor(t){super(),this.elements=t}}function Xi(t,e){let n=es(e);for(const r of t.elements)n=n.filter(t=>!dr(t,r));return{arrayValue:{values:n}}}class Zi extends Ki{constructor(t,e){super(),this.serializer=t,this.Pe=e}}function ts(t){return nr(t.integerValue||t.doubleValue)}function es(t){return Ir(t)&&t.arrayValue.values?t.arrayValue.values.slice():[]}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ns{constructor(t,e){this.field=t,this.transform=e}}class rs{constructor(t,e){this.version=t,this.transformResults=e}}class is{constructor(t,e){this.updateTime=t,this.exists=e}static none(){return new is}static exists(t){return new is(void 0,t)}static updateTime(t){return new is(t)}get isNone(){return void 0===this.updateTime&&void 0===this.exists}isEqual(t){return this.exists===t.exists&&(this.updateTime?!!t.updateTime&&this.updateTime.isEqual(t.updateTime):!t.updateTime)}}function ss(t,e){return void 0!==t.updateTime?e.isFoundDocument()&&e.version.isEqual(t.updateTime):void 0===t.exists||t.exists===e.isFoundDocument()}class os{}function as(t,e){if(!t.hasLocalMutations||e&&0===e.fields.length)return null;if(null===e)return t.isNoDocument()?new ys(t.key,is.none()):new ds(t.key,t.data,is.none());{const n=t.data,r=Or.empty();let i=new Hn(Le.comparator);for(let t of e.fields)if(!i.has(t)){let e=n.field(t);null===e&&t.length>1&&(t=t.popLast(),e=n.field(t)),null===e?r.delete(t):r.set(t,e),i=i.add(t)}return new fs(t.key,r,new Yn(i.toArray()),is.none())}}function cs(t,e,n){var r;t instanceof ds?function(t,e,n){const r=t.value.clone(),i=gs(t.fieldTransforms,e,n.transformResults);r.setAll(i),e.convertToFoundDocument(n.version,r).setHasCommittedMutations()}(t,e,n):t instanceof fs?function(t,e,n){if(!ss(t.precondition,e))return void e.convertToUnknownDocument(n.version);const r=gs(t.fieldTransforms,e,n.transformResults),i=e.data;i.setAll(ms(t)),i.setAll(r),e.convertToFoundDocument(n.version,i).setHasCommittedMutations()}(t,e,n):(r=n,e.convertToNoDocument(r.version).setHasCommittedMutations())}function us(t,e,n,r){return t instanceof ds?function(t,e,n,r){if(!ss(t.precondition,e))return n;const i=t.value.clone(),s=ps(t.fieldTransforms,r,e);return i.setAll(s),e.convertToFoundDocument(e.version,i).setHasLocalMutations(),null}(t,e,n,r):t instanceof fs?function(t,e,n,r){if(!ss(t.precondition,e))return n;const i=ps(t.fieldTransforms,r,e),s=e.data;return s.setAll(ms(t)),s.setAll(i),e.convertToFoundDocument(e.version,s).setHasLocalMutations(),null===n?null:n.unionWith(t.fieldMask.fields).unionWith(t.fieldTransforms.map(t=>t.field))}(t,e,n,r):(i=e,s=n,ss(t.precondition,i)?(i.convertToNoDocument(i.version).setHasLocalMutations(),null):s);var i,s}function ls(t,e){let n=null;for(const r of t.fieldTransforms){const t=e.data.field(r.field),i=Qi(r.transform,t||null);null!=i&&(null===n&&(n=Or.empty()),n.set(r.field,i))}return n||null}function hs(t,e){return t.type===e.type&&!!t.key.isEqual(e.key)&&!!t.precondition.isEqual(e.precondition)&&(n=t.fieldTransforms,r=e.fieldTransforms,!!(void 0===n&&void 0===r||n&&r&&De(n,r,(t,e)=>function(t,e){return t.field.isEqual(e.field)&&(n=t.transform,r=e.transform,n instanceof Wi&&r instanceof Wi||n instanceof Yi&&r instanceof Yi?De(n.elements,r.elements,dr):n instanceof Zi&&r instanceof Zi?dr(n.Pe,r.Pe):n instanceof Hi&&r instanceof Hi);var n,r}(t,e)))&&(0===t.type?t.value.isEqual(e.value):1!==t.type||t.data.isEqual(e.data)&&t.fieldMask.isEqual(e.fieldMask)));var n,r}class ds extends os{constructor(t,e,n,r=[]){super(),this.key=t,this.value=e,this.precondition=n,this.fieldTransforms=r,this.type=0}getFieldMask(){return null}}class fs extends os{constructor(t,e,n,r,i=[]){super(),this.key=t,this.data=e,this.fieldMask=n,this.precondition=r,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function ms(t){const e=new Map;return t.fieldMask.fields.forEach(n=>{if(!n.isEmpty()){const r=t.data.field(n);e.set(n,r)}}),e}function gs(t,e,n){const r=new Map;de(t.length===n.length);for(let i=0;i<n.length;i++){const s=t[i],o=s.transform,a=e.data.field(s.field);r.set(s.field,$i(o,a,n[i]))}return r}function ps(t,e,n){const r=new Map;for(const i of t){const t=i.transform,s=n.data.field(i.field);r.set(i.field,Gi(t,s,e))}return r}class ys extends os{constructor(t,e){super(),this.key=t,this.precondition=e,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class vs extends os{constructor(t,e){super(),this.key=t,this.precondition=e,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ws{constructor(t,e,n,r){this.batchId=t,this.localWriteTime=e,this.baseMutations=n,this.mutations=r}applyToRemoteDocument(t,e){const n=e.mutationResults;for(let r=0;r<this.mutations.length;r++){const e=this.mutations[r];e.key.isEqual(t.key)&&cs(e,t,n[r])}}applyToLocalView(t,e){for(const n of this.baseMutations)n.key.isEqual(t.key)&&(e=us(n,t,e,this.localWriteTime));for(const n of this.mutations)n.key.isEqual(t.key)&&(e=us(n,t,e,this.localWriteTime));return e}applyToLocalDocumentSet(t,e){const n=Li();return this.mutations.forEach(r=>{const i=t.get(r.key),s=i.overlayedDocument;let o=this.applyToLocalView(s,i.mutatedFields);o=e.has(r.key)?null:o;const a=as(s,o);null!==a&&n.set(r.key,a),s.isValidDocument()||s.convertToNoDocument(ke.min())}),n}keys(){return this.mutations.reduce((t,e)=>t.add(e.key),Bi())}isEqual(t){return this.batchId===t.batchId&&De(this.mutations,t.mutations,(t,e)=>hs(t,e))&&De(this.baseMutations,t.baseMutations,(t,e)=>hs(t,e))}}class bs{constructor(t,e,n,r){this.batch=t,this.commitVersion=e,this.mutationResults=n,this.docVersions=r}static from(t,e,n){de(t.mutations.length===n.length);let r=Vi;const i=t.mutations;for(let s=0;s<i.length;s++)r=r.insert(i[s].key,n[s].version);return new bs(t,e,n,r)}}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Is{constructor(t,e){this.largestBatchId=t,this.mutation=e}getKey(){return this.mutation.key}isEqual(t){return null!==t&&this.mutation===t.mutation}toString(){return`Overlay{\n      largestBatchId: ${this.largestBatchId},\n      mutation: ${this.mutation.toString()}\n    }`}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _s{constructor(t,e){this.count=t,this.unchangedNames=e}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Es,Ts;function Ss(t){if(void 0===t)return ce("GRPC error has no .code"),me.UNKNOWN;switch(t){case Es.OK:return me.OK;case Es.CANCELLED:return me.CANCELLED;case Es.UNKNOWN:return me.UNKNOWN;case Es.DEADLINE_EXCEEDED:return me.DEADLINE_EXCEEDED;case Es.RESOURCE_EXHAUSTED:return me.RESOURCE_EXHAUSTED;case Es.INTERNAL:return me.INTERNAL;case Es.UNAVAILABLE:return me.UNAVAILABLE;case Es.UNAUTHENTICATED:return me.UNAUTHENTICATED;case Es.INVALID_ARGUMENT:return me.INVALID_ARGUMENT;case Es.NOT_FOUND:return me.NOT_FOUND;case Es.ALREADY_EXISTS:return me.ALREADY_EXISTS;case Es.PERMISSION_DENIED:return me.PERMISSION_DENIED;case Es.FAILED_PRECONDITION:return me.FAILED_PRECONDITION;case Es.ABORTED:return me.ABORTED;case Es.OUT_OF_RANGE:return me.OUT_OF_RANGE;case Es.UNIMPLEMENTED:return me.UNIMPLEMENTED;case Es.DATA_LOSS:return me.DATA_LOSS;default:return he()}}(Ts=Es||(Es={}))[Ts.OK=0]="OK",Ts[Ts.CANCELLED=1]="CANCELLED",Ts[Ts.UNKNOWN=2]="UNKNOWN",Ts[Ts.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",Ts[Ts.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",Ts[Ts.NOT_FOUND=5]="NOT_FOUND",Ts[Ts.ALREADY_EXISTS=6]="ALREADY_EXISTS",Ts[Ts.PERMISSION_DENIED=7]="PERMISSION_DENIED",Ts[Ts.UNAUTHENTICATED=16]="UNAUTHENTICATED",Ts[Ts.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",Ts[Ts.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",Ts[Ts.ABORTED=10]="ABORTED",Ts[Ts.OUT_OF_RANGE=11]="OUT_OF_RANGE",Ts[Ts.UNIMPLEMENTED=12]="UNIMPLEMENTED",Ts[Ts.INTERNAL=13]="INTERNAL",Ts[Ts.UNAVAILABLE=14]="UNAVAILABLE",Ts[Ts.DATA_LOSS=15]="DATA_LOSS";
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const xs=new Kt([4294967295,4294967295],0);function Cs(t){const e=(new TextEncoder).encode(t),n=new Gt;return n.update(e),new Uint8Array(n.digest())}function Ds(t){const e=new DataView(t.buffer),n=e.getUint32(0,!0),r=e.getUint32(4,!0),i=e.getUint32(8,!0),s=e.getUint32(12,!0);return[new Kt([n,r],0),new Kt([i,s],0)]}class As{constructor(t,e,n){if(this.bitmap=t,this.padding=e,this.hashCount=n,e<0||e>=8)throw new Ns(`Invalid padding: ${e}`);if(n<0)throw new Ns(`Invalid hash count: ${n}`);if(t.length>0&&0===this.hashCount)throw new Ns(`Invalid hash count: ${n}`);if(0===t.length&&0!==e)throw new Ns(`Invalid padding when bitmap length is 0: ${e}`);this.Ie=8*t.length-e,this.Te=Kt.fromNumber(this.Ie)}Ee(t,e,n){let r=t.add(e.multiply(Kt.fromNumber(n)));return 1===r.compare(xs)&&(r=new Kt([r.getBits(0),r.getBits(1)],0)),r.modulo(this.Te).toNumber()}de(t){return!!(this.bitmap[Math.floor(t/8)]&1<<t%8)}mightContain(t){if(0===this.Ie)return!1;const e=Cs(t),[n,r]=Ds(e);for(let i=0;i<this.hashCount;i++){const t=this.Ee(n,r,i);if(!this.de(t))return!1}return!0}static create(t,e,n){const r=t%8==0?0:8-t%8,i=new Uint8Array(Math.ceil(t/8)),s=new As(i,r,e);return n.forEach(t=>s.insert(t)),s}insert(t){if(0===this.Ie)return;const e=Cs(t),[n,r]=Ds(e);for(let i=0;i<this.hashCount;i++){const t=this.Ee(n,r,i);this.Ae(t)}}Ae(t){const e=Math.floor(t/8),n=t%8;this.bitmap[e]|=1<<n}}class Ns extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ks{constructor(t,e,n,r,i){this.snapshotVersion=t,this.targetChanges=e,this.targetMismatches=n,this.documentUpdates=r,this.resolvedLimboDocuments=i}static createSynthesizedRemoteEventForCurrentChange(t,e,n){const r=new Map;return r.set(t,Rs.createSynthesizedTargetChangeForCurrentChange(t,e,n)),new ks(ke.min(),r,new Gn(Ce),Ni(),Bi())}}class Rs{constructor(t,e,n,r,i){this.resumeToken=t,this.current=e,this.addedDocuments=n,this.modifiedDocuments=r,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(t,e,n){return new Rs(n,e,Bi(),Bi(),Bi())}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Os{constructor(t,e,n,r){this.Re=t,this.removedTargetIds=e,this.key=n,this.Ve=r}}class Ms{constructor(t,e){this.targetId=t,this.me=e}}class Ls{constructor(t,e,n=Zn.EMPTY_BYTE_STRING,r=null){this.state=t,this.targetIds=e,this.resumeToken=n,this.cause=r}}class Ps{constructor(){this.fe=0,this.ge=Bs(),this.pe=Zn.EMPTY_BYTE_STRING,this.ye=!1,this.we=!0}get current(){return this.ye}get resumeToken(){return this.pe}get Se(){return 0!==this.fe}get be(){return this.we}De(t){t.approximateByteSize()>0&&(this.we=!0,this.pe=t)}ve(){let t=Bi(),e=Bi(),n=Bi();return this.ge.forEach((r,i)=>{switch(i){case 0:t=t.add(r);break;case 2:e=e.add(r);break;case 1:n=n.add(r);break;default:he()}}),new Rs(this.pe,this.ye,t,e,n)}Ce(){this.we=!1,this.ge=Bs()}Fe(t,e){this.we=!0,this.ge=this.ge.insert(t,e)}Me(t){this.we=!0,this.ge=this.ge.remove(t)}xe(){this.fe+=1}Oe(){this.fe-=1,de(this.fe>=0)}Ne(){this.we=!0,this.ye=!0}}class Vs{constructor(t){this.Le=t,this.Be=new Map,this.ke=Ni(),this.qe=Fs(),this.Qe=new Gn(Ce)}Ke(t){for(const e of t.Re)t.Ve&&t.Ve.isFoundDocument()?this.$e(e,t.Ve):this.Ue(e,t.key,t.Ve);for(const e of t.removedTargetIds)this.Ue(e,t.key,t.Ve)}We(t){this.forEachTarget(t,e=>{const n=this.Ge(e);switch(t.state){case 0:this.ze(e)&&n.De(t.resumeToken);break;case 1:n.Oe(),n.Se||n.Ce(),n.De(t.resumeToken);break;case 2:n.Oe(),n.Se||this.removeTarget(e);break;case 3:this.ze(e)&&(n.Ne(),n.De(t.resumeToken));break;case 4:this.ze(e)&&(this.je(e),n.De(t.resumeToken));break;default:he()}})}forEachTarget(t,e){t.targetIds.length>0?t.targetIds.forEach(e):this.Be.forEach((t,n)=>{this.ze(n)&&e(n)})}He(t){const e=t.targetId,n=t.me.count,r=this.Je(e);if(r){const i=r.target;if(li(i))if(0===n){const t=new Pe(i.path);this.Ue(e,t,Lr.newNoDocument(t,ke.min()))}else de(1===n);else{const r=this.Ye(e);if(r!==n){const n=this.Ze(t),i=n?this.Xe(n,t,r):1;if(0!==i){this.je(e);const t=2===i?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Qe=this.Qe.insert(e,t)}}}}}Ze(t){const e=t.me.unchangedNames;if(!e||!e.bits)return null;const{bits:{bitmap:n="",padding:r=0},hashCount:i=0}=e;let s,o;try{s=rr(n).toUint8Array()}catch(a){if(a instanceof Xn)return ue("Decoding the base64 bloom filter in existence filter failed ("+a.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw a}try{o=new As(s,r,i)}catch(a){return ue(a instanceof Ns?"BloomFilter error: ":"Applying bloom filter failed: ",a),null}return 0===o.Ie?null:o}Xe(t,e,n){return e.me.count===n-this.nt(t,e.targetId)?0:2}nt(t,e){const n=this.Le.getRemoteKeysForTarget(e);let r=0;return n.forEach(n=>{const i=this.Le.tt(),s=`projects/${i.projectId}/databases/${i.database}/documents/${n.path.canonicalString()}`;t.mightContain(s)||(this.Ue(e,n,null),r++)}),r}rt(t){const e=new Map;this.Be.forEach((n,r)=>{const i=this.Je(r);if(i){if(n.current&&li(i.target)){const e=new Pe(i.target.path);null!==this.ke.get(e)||this.it(r,e)||this.Ue(r,e,Lr.newNoDocument(e,t))}n.be&&(e.set(r,n.ve()),n.Ce())}});let n=Bi();this.qe.forEach((t,e)=>{let r=!0;e.forEachWhile(t=>{const e=this.Je(t);return!e||"TargetPurposeLimboResolution"===e.purpose||(r=!1,!1)}),r&&(n=n.add(t))}),this.ke.forEach((e,n)=>n.setReadTime(t));const r=new ks(t,e,this.Qe,this.ke,n);return this.ke=Ni(),this.qe=Fs(),this.Qe=new Gn(Ce),r}$e(t,e){if(!this.ze(t))return;const n=this.it(t,e.key)?2:0;this.Ge(t).Fe(e.key,n),this.ke=this.ke.insert(e.key,e),this.qe=this.qe.insert(e.key,this.st(e.key).add(t))}Ue(t,e,n){if(!this.ze(t))return;const r=this.Ge(t);this.it(t,e)?r.Fe(e,1):r.Me(e),this.qe=this.qe.insert(e,this.st(e).delete(t)),n&&(this.ke=this.ke.insert(e,n))}removeTarget(t){this.Be.delete(t)}Ye(t){const e=this.Ge(t).ve();return this.Le.getRemoteKeysForTarget(t).size+e.addedDocuments.size-e.removedDocuments.size}xe(t){this.Ge(t).xe()}Ge(t){let e=this.Be.get(t);return e||(e=new Ps,this.Be.set(t,e)),e}st(t){let e=this.qe.get(t);return e||(e=new Hn(Ce),this.qe=this.qe.insert(t,e)),e}ze(t){const e=null!==this.Je(t);return e||ae("WatchChangeAggregator","Detected inactive target",t),e}Je(t){const e=this.Be.get(t);return e&&e.Se?null:this.Le.ot(t)}je(t){this.Be.set(t,new Ps),this.Le.getRemoteKeysForTarget(t).forEach(e=>{this.Ue(t,e,null)})}it(t,e){return this.Le.getRemoteKeysForTarget(t).has(e)}}function Fs(){return new Gn(Pe.comparator)}function Bs(){return new Gn(Pe.comparator)}const Us={asc:"ASCENDING",desc:"DESCENDING"},qs={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},js={and:"AND",or:"OR"};class zs{constructor(t,e){this.databaseId=t,this.useProto3Json=e}}function Ks(t,e){return t.useProto3Json||un(e)?e:{value:e}}function Gs(t,e){return t.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function $s(t,e){return t.useProto3Json?e.toBase64():e.toUint8Array()}function Qs(t,e){return Gs(t,e.toTimestamp())}function Hs(t){return de(!!t),ke.fromTimestamp(function(t){const e=er(t);return new Ne(e.seconds,e.nanos)}(t))}function Ws(t,e){return Js(t,e).canonicalString()}function Js(t,e){const n=(r=t,new Oe(["projects",r.projectId,"databases",r.database])).child("documents");var r;return void 0===e?n:n.child(e)}function Ys(t){const e=Oe.fromString(t);return de(wo(e)),e}function Xs(t,e){return Ws(t.databaseId,e.path)}function Zs(t,e){const n=Ys(e);if(n.get(1)!==t.databaseId.projectId)throw new ge(me.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+n.get(1)+" vs "+t.databaseId.projectId);if(n.get(3)!==t.databaseId.database)throw new ge(me.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+n.get(3)+" vs "+t.databaseId.database);return new Pe(ro(n))}function to(t,e){return Ws(t.databaseId,e)}function eo(t){const e=Ys(t);return 4===e.length?Oe.emptyPath():ro(e)}function no(t){return new Oe(["projects",t.databaseId.projectId,"databases",t.databaseId.database]).canonicalString()}function ro(t){return de(t.length>4&&"documents"===t.get(4)),t.popFirst(5)}function io(t,e,n){return{name:Xs(t,e),fields:n.value.mapValue.fields}}function so(t,e){let n;if(e instanceof ds)n={update:io(t,e.key,e.value)};else if(e instanceof ys)n={delete:Xs(t,e.key)};else if(e instanceof fs)n={update:io(t,e.key,e.data),updateMask:vo(e.fieldMask)};else{if(!(e instanceof vs))return he();n={verify:Xs(t,e.key)}}return e.fieldTransforms.length>0&&(n.updateTransforms=e.fieldTransforms.map(t=>function(t,e){const n=e.transform;if(n instanceof Hi)return{fieldPath:e.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(n instanceof Wi)return{fieldPath:e.field.canonicalString(),appendMissingElements:{values:n.elements}};if(n instanceof Yi)return{fieldPath:e.field.canonicalString(),removeAllFromArray:{values:n.elements}};if(n instanceof Zi)return{fieldPath:e.field.canonicalString(),increment:n.Pe};throw he()}(0,t))),e.precondition.isNone||(n.currentDocument=(r=t,void 0!==(i=e.precondition).updateTime?{updateTime:Qs(r,i.updateTime)}:void 0!==i.exists?{exists:i.exists}:he())),n;var r,i}function oo(t,e){const n=e.currentDocument?void 0!==(i=e.currentDocument).updateTime?is.updateTime(Hs(i.updateTime)):void 0!==i.exists?is.exists(i.exists):is.none():is.none(),r=e.updateTransforms?e.updateTransforms.map(e=>function(t,e){let n=null;if("setToServerValue"in e)de("REQUEST_TIME"===e.setToServerValue),n=new Hi;else if("appendMissingElements"in e){const t=e.appendMissingElements.values||[];n=new Wi(t)}else if("removeAllFromArray"in e){const t=e.removeAllFromArray.values||[];n=new Yi(t)}else"increment"in e?n=new Zi(t,e.increment):he();const r=Le.fromServerFormat(e.fieldPath);return new ns(r,n)}(t,e)):[];var i;if(e.update){e.update.name;const i=Zs(t,e.update.name),s=new Or({mapValue:{fields:e.update.fields}});if(e.updateMask){const t=function(t){const e=t.fieldPaths||[];return new Yn(e.map(t=>Le.fromServerFormat(t)))}(e.updateMask);return new fs(i,s,t,n,r)}return new ds(i,s,n,r)}if(e.delete){const r=Zs(t,e.delete);return new ys(r,n)}if(e.verify){const r=Zs(t,e.verify);return new vs(r,n)}return he()}function ao(t,e){return{documents:[to(t,e.path)]}}function co(t,e){const n={structuredQuery:{}},r=e.path;let i;null!==e.collectionGroup?(i=r,n.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(i=r.popLast(),n.structuredQuery.from=[{collectionId:r.lastSegment()}]),n.parent=to(t,i);const s=function(t){if(0!==t.length)return yo(zr.create(t,"and"))}(e.filters);s&&(n.structuredQuery.where=s);const o=function(t){if(0!==t.length)return t.map(t=>{return{field:go((e=t).field),direction:ho(e.dir)};var e})}(e.orderBy);o&&(n.structuredQuery.orderBy=o);const a=Ks(t,e.limit);return null!==a&&(n.structuredQuery.limit=a),e.startAt&&(n.structuredQuery.startAt={before:(c=e.startAt).inclusive,values:c.position}),e.endAt&&(n.structuredQuery.endAt=function(t){return{before:!t.inclusive,values:t.position}}(e.endAt)),{_t:n,parent:i};var c}function uo(t){let e=eo(t.parent);const n=t.structuredQuery,r=n.from?n.from.length:0;let i=null;if(r>0){de(1===r);const t=n.from[0];t.allDescendants?i=t.collectionId:e=e.child(t.collectionId)}let s=[];n.where&&(s=function(t){const e=lo(t);return e instanceof zr&&$r(e)?e.getFilters():[e]}(n.where));let o=[];n.orderBy&&(o=n.orderBy.map(t=>{return new Br(po((e=t).field),function(t){switch(t){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(e.direction));var e}));let a=null;n.limit&&(a=function(t){let e;return e="object"==typeof t?t.value:t,un(e)?null:e}(n.limit));let c=null;n.startAt&&(c=function(t){const e=!!t.before,n=t.values||[];return new Pr(n,e)}(n.startAt));let u=null;return n.endAt&&(u=function(t){const e=!t.before,n=t.values||[];return new Pr(n,e)}(n.endAt)),function(t,e,n,r,i,s,o,a){return new mi(t,e,n,r,i,s,o,a)}(e,i,o,s,a,"F",c,u)}function lo(t){return void 0!==t.unaryFilter?function(t){switch(t.unaryFilter.op){case"IS_NAN":const e=po(t.unaryFilter.field);return jr.create(e,"==",{doubleValue:NaN});case"IS_NULL":const n=po(t.unaryFilter.field);return jr.create(n,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const r=po(t.unaryFilter.field);return jr.create(r,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const i=po(t.unaryFilter.field);return jr.create(i,"!=",{nullValue:"NULL_VALUE"});default:return he()}}(t):void 0!==t.fieldFilter?(e=t,jr.create(po(e.fieldFilter.field),function(t){switch(t){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";default:return he()}}(e.fieldFilter.op),e.fieldFilter.value)):void 0!==t.compositeFilter?function(t){return zr.create(t.compositeFilter.filters.map(t=>lo(t)),function(t){switch(t){case"AND":return"and";case"OR":return"or";default:return he()}}(t.compositeFilter.op))}(t):he();var e}function ho(t){return Us[t]}function fo(t){return qs[t]}function mo(t){return js[t]}function go(t){return{fieldPath:t.canonicalString()}}function po(t){return Le.fromServerFormat(t.fieldPath)}function yo(t){return t instanceof jr?function(t){if("=="===t.op){if(Er(t.value))return{unaryFilter:{field:go(t.field),op:"IS_NAN"}};if(_r(t.value))return{unaryFilter:{field:go(t.field),op:"IS_NULL"}}}else if("!="===t.op){if(Er(t.value))return{unaryFilter:{field:go(t.field),op:"IS_NOT_NAN"}};if(_r(t.value))return{unaryFilter:{field:go(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:go(t.field),op:fo(t.op),value:t.value}}}(t):t instanceof zr?function(t){const e=t.getFilters().map(t=>yo(t));return 1===e.length?e[0]:{compositeFilter:{op:mo(t.op),filters:e}}}(t):he()}function vo(t){const e=[];return t.fields.forEach(t=>e.push(t.canonicalString())),{fieldPaths:e}}function wo(t){return t.length>=4&&"projects"===t.get(0)&&"databases"===t.get(2)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bo{constructor(t,e,n,r,i=ke.min(),s=ke.min(),o=Zn.EMPTY_BYTE_STRING,a=null){this.target=t,this.targetId=e,this.purpose=n,this.sequenceNumber=r,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=s,this.resumeToken=o,this.expectedCount=a}withSequenceNumber(t){return new bo(this.target,this.targetId,this.purpose,t,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(t,e){return new bo(this.target,this.targetId,this.purpose,this.sequenceNumber,e,this.lastLimboFreeSnapshotVersion,t,null)}withExpectedCount(t){return new bo(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,t)}withLastLimboFreeSnapshotVersion(t){return new bo(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,t,this.resumeToken,this.expectedCount)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Io{constructor(t){this.ct=t}}function _o(t,e){let n;if(e.document)n=function(t,e,n){const r=Zs(t,e.name),i=Hs(e.updateTime),s=e.createTime?Hs(e.createTime):ke.min(),o=new Or({mapValue:{fields:e.fields}}),a=Lr.newFoundDocument(r,i,s,o);return n&&a.setHasCommittedMutations(),n?a.setHasCommittedMutations():a}(t.ct,e.document,!!e.hasCommittedMutations);else if(e.noDocument){const t=Pe.fromSegments(e.noDocument.path),r=xo(e.noDocument.readTime);n=Lr.newNoDocument(t,r),e.hasCommittedMutations&&n.setHasCommittedMutations()}else{if(!e.unknownDocument)return he();{const t=Pe.fromSegments(e.unknownDocument.path),r=xo(e.unknownDocument.version);n=Lr.newUnknownDocument(t,r)}}return e.readTime&&n.setReadTime(function(t){const e=new Ne(t[0],t[1]);return ke.fromTimestamp(e)}(e.readTime)),n}function Eo(t,e){const n=e.key,r={prefixPath:n.getCollectionPath().popLast().toArray(),collectionGroup:n.collectionGroup,documentId:n.path.lastSegment(),readTime:To(e.readTime),hasCommittedMutations:e.hasCommittedMutations};if(e.isFoundDocument())r.document={name:Xs(i=t.ct,(s=e).key),fields:s.data.value.mapValue.fields,updateTime:Gs(i,s.version.toTimestamp()),createTime:Gs(i,s.createTime.toTimestamp())};else if(e.isNoDocument())r.noDocument={path:n.path.toArray(),readTime:So(e.version)};else{if(!e.isUnknownDocument())return he();r.unknownDocument={path:n.path.toArray(),version:So(e.version)}}var i,s;return r}function To(t){const e=t.toTimestamp();return[e.seconds,e.nanoseconds]}function So(t){const e=t.toTimestamp();return{seconds:e.seconds,nanoseconds:e.nanoseconds}}function xo(t){const e=new Ne(t.seconds,t.nanoseconds);return ke.fromTimestamp(e)}function Co(t,e){const n=(e.baseMutations||[]).map(e=>oo(t.ct,e));for(let s=0;s<e.mutations.length-1;++s){const t=e.mutations[s];if(s+1<e.mutations.length&&void 0!==e.mutations[s+1].transform){const n=e.mutations[s+1];t.updateTransforms=n.transform.fieldTransforms,e.mutations.splice(s+1,1),++s}}const r=e.mutations.map(e=>oo(t.ct,e)),i=Ne.fromMillis(e.localWriteTimeMs);return new ws(e.batchId,i,n,r)}function Do(t){const e=xo(t.readTime),n=void 0!==t.lastLimboFreeSnapshotVersion?xo(t.lastLimboFreeSnapshotVersion):ke.min();let r;return r=void 0!==t.query.documents?function(t){return de(1===t.documents.length),wi(gi(eo(t.documents[0])))}(t.query):function(t){return wi(uo(t))}(t.query),new bo(r,t.targetId,"TargetPurposeListen",t.lastListenSequenceNumber,e,n,Zn.fromBase64String(t.resumeToken))}function Ao(t,e){const n=So(e.snapshotVersion),r=So(e.lastLimboFreeSnapshotVersion);let i;i=li(e.target)?ao(t.ct,e.target):co(t.ct,e.target)._t;const s=e.resumeToken.toBase64();return{targetId:e.targetId,canonicalId:ci(e.target),readTime:n,resumeToken:s,lastListenSequenceNumber:e.sequenceNumber,lastLimboFreeSnapshotVersion:r,query:i}}function No(t){const e=uo({parent:t.parent,structuredQuery:t.structuredQuery});return"LAST"===t.limitType?Ii(e,e.limit,"L"):e}function ko(t,e){return new Is(e.largestBatchId,oo(t.ct,e.overlayMutation))}function Ro(t,e){const n=e.path.lastSegment();return[t,hn(e.path.popLast()),n]}function Oo(t,e,n,r){return{indexId:t,uid:e,sequenceNumber:n,readTime:So(r.readTime),documentKey:hn(r.documentKey.path),largestBatchId:r.largestBatchId}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mo{getBundleMetadata(t,e){return Lo(t).get(e).next(t=>{if(t)return{id:(e=t).bundleId,createTime:xo(e.createTime),version:e.version};var e})}saveBundleMetadata(t,e){return Lo(t).put({bundleId:(n=e).id,createTime:So(Hs(n.createTime)),version:n.version});var n}getNamedQuery(t,e){return Po(t).get(e).next(t=>{if(t)return{name:(e=t).name,query:No(e.bundledQuery),readTime:xo(e.readTime)};var e})}saveNamedQuery(t,e){return Po(t).put({name:(n=e).name,readTime:So(Hs(n.readTime)),bundledQuery:n.bundledQuery});var n}}function Lo(t){return qn(t,"bundles")}function Po(t){return qn(t,"namedQueries")}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vo{constructor(t,e){this.serializer=t,this.userId=e}static lt(t,e){const n=e.uid||"";return new Vo(t,n)}getOverlay(t,e){return Fo(t).get(Ro(this.userId,e)).next(t=>t?ko(this.serializer,t):null)}getOverlays(t,e){const n=Mi();return He.forEach(e,e=>this.getOverlay(t,e).next(t=>{null!==t&&n.set(e,t)})).next(()=>n)}saveOverlays(t,e,n){const r=[];return n.forEach((n,i)=>{const s=new Is(e,i);r.push(this.ht(t,s))}),He.waitFor(r)}removeOverlaysForBatchId(t,e,n){const r=new Set;e.forEach(t=>r.add(hn(t.getCollectionPath())));const i=[];return r.forEach(e=>{const r=IDBKeyRange.bound([this.userId,e,n],[this.userId,e,n+1],!1,!0);i.push(Fo(t).j("collectionPathOverlayIndex",r))}),He.waitFor(i)}getOverlaysForCollection(t,e,n){const r=Mi(),i=hn(e),s=IDBKeyRange.bound([this.userId,i,n],[this.userId,i,Number.POSITIVE_INFINITY],!0);return Fo(t).U("collectionPathOverlayIndex",s).next(t=>{for(const e of t){const t=ko(this.serializer,e);r.set(t.getKey(),t)}return r})}getOverlaysForCollectionGroup(t,e,n,r){const i=Mi();let s;const o=IDBKeyRange.bound([this.userId,e,n],[this.userId,e,Number.POSITIVE_INFINITY],!0);return Fo(t).J({index:"collectionGroupOverlayIndex",range:o},(t,e,n)=>{const o=ko(this.serializer,e);i.size()<r||o.largestBatchId===s?(i.set(o.getKey(),o),s=o.largestBatchId):n.done()}).next(()=>i)}ht(t,e){return Fo(t).put(function(t,e,n){const[r,i,s]=Ro(e,n.mutation.key);return{userId:e,collectionPath:i,documentId:s,collectionGroup:n.mutation.key.getCollectionGroup(),largestBatchId:n.largestBatchId,overlayMutation:so(t.ct,n.mutation)}}(this.serializer,this.userId,e))}}function Fo(t){return qn(t,"documentOverlays")}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bo{Pt(t){return qn(t,"globals")}getSessionToken(t){return this.Pt(t).get("sessionToken").next(t=>{const e=null==t?void 0:t.value;return e?Zn.fromUint8Array(e):Zn.EMPTY_BYTE_STRING})}setSessionToken(t,e){return this.Pt(t).put({name:"sessionToken",value:e.toUint8Array()})}}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uo{constructor(){}It(t,e){this.Tt(t,e),e.Et()}Tt(t,e){if("nullValue"in t)this.dt(e,5);else if("booleanValue"in t)this.dt(e,10),e.At(t.booleanValue?1:0);else if("integerValue"in t)this.dt(e,15),e.At(nr(t.integerValue));else if("doubleValue"in t){const n=nr(t.doubleValue);isNaN(n)?this.dt(e,13):(this.dt(e,15),ln(n)?e.At(0):e.At(n))}else if("timestampValue"in t){let n=t.timestampValue;this.dt(e,20),"string"==typeof n&&(n=er(n)),e.Rt(`${n.seconds||""}`),e.At(n.nanos||0)}else if("stringValue"in t)this.Vt(t.stringValue,e),this.ft(e);else if("bytesValue"in t)this.dt(e,30),e.gt(rr(t.bytesValue)),this.ft(e);else if("referenceValue"in t)this.yt(t.referenceValue,e);else if("geoPointValue"in t){const n=t.geoPointValue;this.dt(e,45),e.At(n.latitude||0),e.At(n.longitude||0)}else"mapValue"in t?Cr(t)?this.dt(e,Number.MAX_SAFE_INTEGER):Sr(t)?this.wt(t.mapValue,e):(this.St(t.mapValue,e),this.ft(e)):"arrayValue"in t?(this.bt(t.arrayValue,e),this.ft(e)):he()}Vt(t,e){this.dt(e,25),this.Dt(t,e)}Dt(t,e){e.Rt(t)}St(t,e){const n=t.fields||{};this.dt(e,55);for(const r of Object.keys(n))this.Vt(r,e),this.Tt(n[r],e)}wt(t,e){var n,r;const i=t.fields||{};this.dt(e,53);const s="value",o=(null===(r=null===(n=i[s].arrayValue)||void 0===n?void 0:n.values)||void 0===r?void 0:r.length)||0;this.dt(e,15),e.At(nr(o)),this.Vt(s,e),this.Tt(i[s],e)}bt(t,e){const n=t.values||[];this.dt(e,50);for(const r of n)this.Tt(r,e)}yt(t,e){this.dt(e,37),Pe.fromName(t).path.forEach(t=>{this.dt(e,60),this.Dt(t,e)})}dt(t,e){t.At(e)}ft(t){t.At(2)}}function qo(t){if(0===t)return 8;let e=0;return!(t>>4)&&(e+=4,t<<=4),!(t>>6)&&(e+=2,t<<=2),!(t>>7)&&(e+=1),e}function jo(t){const e=64-function(t){let e=0;for(let n=0;n<8;++n){const r=qo(255&t[n]);if(e+=r,8!==r)break}return e}(t);return Math.ceil(e/8)}Uo.vt=new Uo;class zo{constructor(){this.buffer=new Uint8Array(1024),this.position=0}Ct(t){const e=t[Symbol.iterator]();let n=e.next();for(;!n.done;)this.Ft(n.value),n=e.next();this.Mt()}xt(t){const e=t[Symbol.iterator]();let n=e.next();for(;!n.done;)this.Ot(n.value),n=e.next();this.Nt()}Lt(t){for(const e of t){const t=e.charCodeAt(0);if(t<128)this.Ft(t);else if(t<2048)this.Ft(960|t>>>6),this.Ft(128|63&t);else if(e<"\ud800"||"\udbff"<e)this.Ft(480|t>>>12),this.Ft(128|63&t>>>6),this.Ft(128|63&t);else{const t=e.codePointAt(0);this.Ft(240|t>>>18),this.Ft(128|63&t>>>12),this.Ft(128|63&t>>>6),this.Ft(128|63&t)}}this.Mt()}Bt(t){for(const e of t){const t=e.charCodeAt(0);if(t<128)this.Ot(t);else if(t<2048)this.Ot(960|t>>>6),this.Ot(128|63&t);else if(e<"\ud800"||"\udbff"<e)this.Ot(480|t>>>12),this.Ot(128|63&t>>>6),this.Ot(128|63&t);else{const t=e.codePointAt(0);this.Ot(240|t>>>18),this.Ot(128|63&t>>>12),this.Ot(128|63&t>>>6),this.Ot(128|63&t)}}this.Nt()}kt(t){const e=this.qt(t),n=jo(e);this.Qt(1+n),this.buffer[this.position++]=255&n;for(let r=e.length-n;r<e.length;++r)this.buffer[this.position++]=255&e[r]}Kt(t){const e=this.qt(t),n=jo(e);this.Qt(1+n),this.buffer[this.position++]=~(255&n);for(let r=e.length-n;r<e.length;++r)this.buffer[this.position++]=~(255&e[r])}$t(){this.Ut(255),this.Ut(255)}Wt(){this.Gt(255),this.Gt(255)}reset(){this.position=0}seed(t){this.Qt(t.length),this.buffer.set(t,this.position),this.position+=t.length}zt(){return this.buffer.slice(0,this.position)}qt(t){const e=function(t){const e=new DataView(new ArrayBuffer(8));return e.setFloat64(0,t,!1),new Uint8Array(e.buffer)}(t),n=!!(128&e[0]);e[0]^=n?255:128;for(let r=1;r<e.length;++r)e[r]^=n?255:0;return e}Ft(t){const e=255&t;0===e?(this.Ut(0),this.Ut(255)):255===e?(this.Ut(255),this.Ut(0)):this.Ut(e)}Ot(t){const e=255&t;0===e?(this.Gt(0),this.Gt(255)):255===e?(this.Gt(255),this.Gt(0)):this.Gt(t)}Mt(){this.Ut(0),this.Ut(1)}Nt(){this.Gt(0),this.Gt(1)}Ut(t){this.Qt(1),this.buffer[this.position++]=t}Gt(t){this.Qt(1),this.buffer[this.position++]=~t}Qt(t){const e=t+this.position;if(e<=this.buffer.length)return;let n=2*this.buffer.length;n<e&&(n=e);const r=new Uint8Array(n);r.set(this.buffer),this.buffer=r}}class Ko{constructor(t){this.jt=t}gt(t){this.jt.Ct(t)}Rt(t){this.jt.Lt(t)}At(t){this.jt.kt(t)}Et(){this.jt.$t()}}class Go{constructor(t){this.jt=t}gt(t){this.jt.xt(t)}Rt(t){this.jt.Bt(t)}At(t){this.jt.Kt(t)}Et(){this.jt.Wt()}}class $o{constructor(){this.jt=new zo,this.Ht=new Ko(this.jt),this.Jt=new Go(this.jt)}seed(t){this.jt.seed(t)}Yt(t){return 0===t?this.Ht:this.Jt}zt(){return this.jt.zt()}reset(){this.jt.reset()}}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qo{constructor(t,e,n,r){this.indexId=t,this.documentKey=e,this.arrayValue=n,this.directionalValue=r}Zt(){const t=this.directionalValue.length,e=0===t||255===this.directionalValue[t-1]?t+1:t,n=new Uint8Array(e);return n.set(this.directionalValue,0),e!==t?n.set([0],this.directionalValue.length):++n[n.length-1],new Qo(this.indexId,this.documentKey,this.arrayValue,n)}}function Ho(t,e){let n=t.indexId-e.indexId;return 0!==n?n:(n=Wo(t.arrayValue,e.arrayValue),0!==n?n:(n=Wo(t.directionalValue,e.directionalValue),0!==n?n:Pe.comparator(t.documentKey,e.documentKey)))}function Wo(t,e){for(let n=0;n<t.length&&n<e.length;++n){const r=t[n]-e[n];if(0!==r)return r}return t.length-e.length}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jo{constructor(t){this.Xt=new Hn((t,e)=>Le.comparator(t.field,e.field)),this.collectionId=null!=t.collectionGroup?t.collectionGroup:t.path.lastSegment(),this.en=t.orderBy,this.tn=[];for(const e of t.filters){const t=e;t.isInequality()?this.Xt=this.Xt.add(t):this.tn.push(t)}}get nn(){return this.Xt.size>1}rn(t){if(de(t.collectionGroup===this.collectionId),this.nn)return!1;const e=Fe(t);if(void 0!==e&&!this.sn(e))return!1;const n=Be(t);let r=new Set,i=0,s=0;for(;i<n.length&&this.sn(n[i]);++i)r=r.add(n[i].fieldPath.canonicalString());if(i===n.length)return!0;if(this.Xt.size>0){const t=this.Xt.getIterator().getNext();if(!r.has(t.field.canonicalString())){const e=n[i];if(!this.on(t,e)||!this._n(this.en[s++],e))return!1}++i}for(;i<n.length;++i){const t=n[i];if(s>=this.en.length||!this._n(this.en[s++],t))return!1}return!0}an(){if(this.nn)return null;let t=new Hn(Le.comparator);const e=[];for(const n of this.tn)if(!n.field.isKeyField())if("array-contains"===n.op||"array-contains-any"===n.op)e.push(new Ue(n.field,2));else{if(t.has(n.field))continue;t=t.add(n.field),e.push(new Ue(n.field,0))}for(const n of this.en)n.field.isKeyField()||t.has(n.field)||(t=t.add(n.field),e.push(new Ue(n.field,"asc"===n.dir?0:1)));return new Ve(Ve.UNKNOWN_ID,this.collectionId,e,qe.empty())}sn(t){for(const e of this.tn)if(this.on(e,t))return!0;return!1}on(t,e){if(void 0===t||!t.field.isEqual(e.fieldPath))return!1;const n="array-contains"===t.op||"array-contains-any"===t.op;return 2===e.kind===n}_n(t,e){return!!t.field.isEqual(e.fieldPath)&&(0===e.kind&&"asc"===t.dir||1===e.kind&&"desc"===t.dir)}}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yo(t){var e,n;if(de(t instanceof jr||t instanceof zr),t instanceof jr){if(t instanceof ri){const r=(null===(n=null===(e=t.value.arrayValue)||void 0===e?void 0:e.values)||void 0===n?void 0:n.map(e=>jr.create(t.field,"==",e)))||[];return zr.create(r,"or")}return t}const r=t.filters.map(t=>Yo(t));return zr.create(r,t.op)}function Xo(t){if(0===t.getFilters().length)return[];const e=na(Yo(t));return de(ea(e)),Zo(e)||ta(e)?[e]:e.getFilters()}function Zo(t){return t instanceof jr}function ta(t){return t instanceof zr&&$r(t)}function ea(t){return Zo(t)||ta(t)||function(t){if(t instanceof zr&&Gr(t)){for(const e of t.getFilters())if(!Zo(e)&&!ta(e))return!1;return!0}return!1}(t)}function na(t){if(de(t instanceof jr||t instanceof zr),t instanceof jr)return t;if(1===t.filters.length)return na(t.filters[0]);const e=t.filters.map(t=>na(t));let n=zr.create(e,t.op);return n=sa(n),ea(n)?n:(de(n instanceof zr),de(Kr(n)),de(n.filters.length>1),n.filters.reduce((t,e)=>ra(t,e)))}function ra(t,e){let n;return de(t instanceof jr||t instanceof zr),de(e instanceof jr||e instanceof zr),n=t instanceof jr?e instanceof jr?(r=t,i=e,zr.create([r,i],"and")):ia(t,e):e instanceof jr?ia(e,t):function(t,e){if(de(t.filters.length>0&&e.filters.length>0),Kr(t)&&Kr(e))return Jr(t,e.getFilters());const n=Gr(t)?t:e,r=Gr(t)?e:t,i=n.filters.map(t=>ra(t,r));return zr.create(i,"or")}(t,e),sa(n);var r,i}function ia(t,e){if(Kr(e))return Jr(e,t.getFilters());{const n=e.filters.map(e=>ra(t,e));return zr.create(n,"or")}}function sa(t){if(de(t instanceof jr||t instanceof zr),t instanceof jr)return t;const e=t.getFilters();if(1===e.length)return sa(e[0]);if(Qr(t))return t;const n=e.map(t=>sa(t)),r=[];return n.forEach(e=>{e instanceof jr?r.push(e):e instanceof zr&&(e.op===t.op?r.push(...e.filters):r.push(e))}),1===r.length?r[0]:zr.create(r,t.op)
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}class oa{constructor(){this.un=new aa}addToCollectionParentIndex(t,e){return this.un.add(e),He.resolve()}getCollectionParents(t,e){return He.resolve(this.un.getEntries(e))}addFieldIndex(t,e){return He.resolve()}deleteFieldIndex(t,e){return He.resolve()}deleteAllFieldIndexes(t){return He.resolve()}createTargetIndexes(t,e){return He.resolve()}getDocumentsMatchingTarget(t,e){return He.resolve(null)}getIndexType(t,e){return He.resolve(0)}getFieldIndexes(t,e){return He.resolve([])}getNextCollectionGroupToUpdate(t){return He.resolve(null)}getMinOffset(t,e){return He.resolve(ze.min())}getMinOffsetFromCollectionGroup(t,e){return He.resolve(ze.min())}updateCollectionGroup(t,e,n){return He.resolve()}updateIndexEntries(t,e){return He.resolve()}}class aa{constructor(){this.index={}}add(t){const e=t.lastSegment(),n=t.popLast(),r=this.index[e]||new Hn(Oe.comparator),i=!r.has(n);return this.index[e]=r.add(n),i}has(t){const e=t.lastSegment(),n=t.popLast(),r=this.index[e];return r&&r.has(n)}getEntries(t){return(this.index[t]||new Hn(Oe.comparator)).toArray()}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ca=new Uint8Array(0);class ua{constructor(t,e){this.databaseId=e,this.cn=new aa,this.ln=new Di(t=>ci(t),(t,e)=>ui(t,e)),this.uid=t.uid||""}addToCollectionParentIndex(t,e){if(!this.cn.has(e)){const n=e.lastSegment(),r=e.popLast();t.addOnCommittedListener(()=>{this.cn.add(e)});const i={collectionId:n,parent:hn(r)};return la(t).put(i)}return He.resolve()}getCollectionParents(t,e){const n=[],r=IDBKeyRange.bound([e,""],[Ae(e),""],!1,!0);return la(t).U(r).next(t=>{for(const r of t){if(r.collectionId!==e)break;n.push(mn(r.parent))}return n})}addFieldIndex(t,e){const n=da(t),r={indexId:(i=e).indexId,collectionGroup:i.collectionGroup,fields:i.fields.map(t=>[t.fieldPath.canonicalString(),t.kind])};var i;delete r.indexId;const s=n.add(r);if(e.indexState){const n=fa(t);return s.next(t=>{n.put(Oo(t,this.uid,e.indexState.sequenceNumber,e.indexState.offset))})}return s.next()}deleteFieldIndex(t,e){const n=da(t),r=fa(t),i=ha(t);return n.delete(e.indexId).next(()=>r.delete(IDBKeyRange.bound([e.indexId],[e.indexId+1],!1,!0))).next(()=>i.delete(IDBKeyRange.bound([e.indexId],[e.indexId+1],!1,!0)))}deleteAllFieldIndexes(t){const e=da(t),n=ha(t),r=fa(t);return e.j().next(()=>n.j()).next(()=>r.j())}createTargetIndexes(t,e){return He.forEach(this.hn(e),e=>this.getIndexType(t,e).next(n=>{if(0===n||1===n){const n=new Jo(e).an();if(null!=n)return this.addFieldIndex(t,n)}}))}getDocumentsMatchingTarget(t,e){const n=ha(t);let r=!0;const i=new Map;return He.forEach(this.hn(e),e=>this.Pn(t,e).next(t=>{r&&(r=!!t),i.set(e,t)})).next(()=>{if(r){let t=Bi();const r=[];return He.forEach(i,(i,s)=>{var o;ae("IndexedDbIndexManager",`Using index ${o=i,`id=${o.indexId}|cg=${o.collectionGroup}|f=${o.fields.map(t=>`${t.fieldPath}:${t.kind}`).join(",")}`} to execute ${ci(e)}`);const a=function(t,e){const n=Fe(e);if(void 0===n)return null;for(const r of hi(t,n.fieldPath))switch(r.op){case"array-contains-any":return r.value.arrayValue.values||[];case"array-contains":return[r.value]}return null}(s,i),c=function(t,e){const n=new Map;for(const r of Be(e))for(const e of hi(t,r.fieldPath))switch(e.op){case"==":case"in":n.set(r.fieldPath.canonicalString(),e.value);break;case"not-in":case"!=":return n.set(r.fieldPath.canonicalString(),e.value),Array.from(n.values())}return null}(s,i),u=function(t,e){const n=[];let r=!0;for(const i of Be(e)){const e=0===i.kind?di(t,i.fieldPath,t.startAt):fi(t,i.fieldPath,t.startAt);n.push(e.value),r&&(r=e.inclusive)}return new Pr(n,r)}(s,i),l=function(t,e){const n=[];let r=!0;for(const i of Be(e)){const e=0===i.kind?fi(t,i.fieldPath,t.endAt):di(t,i.fieldPath,t.endAt);n.push(e.value),r&&(r=e.inclusive)}return new Pr(n,r)}(s,i),h=this.In(i,s,u),d=this.In(i,s,l),f=this.Tn(i,s,c),m=this.En(i.indexId,a,h,u.inclusive,d,l.inclusive,f);return He.forEach(m,i=>n.G(i,e.limit).next(e=>{e.forEach(e=>{const n=Pe.fromSegments(e.documentKey);t.has(n)||(t=t.add(n),r.push(n))})}))}).next(()=>r)}return He.resolve(null)})}hn(t){let e=this.ln.get(t);return e||(e=0===t.filters.length?[t]:Xo(zr.create(t.filters,"and")).map(e=>ai(t.path,t.collectionGroup,t.orderBy,e.getFilters(),t.limit,t.startAt,t.endAt)),this.ln.set(t,e),e)}En(t,e,n,r,i,s,o){const a=(null!=e?e.length:1)*Math.max(n.length,i.length),c=a/(null!=e?e.length:1),u=[];for(let l=0;l<a;++l){const a=e?this.dn(e[l/c]):ca,h=this.An(t,a,n[l%c],r),d=this.Rn(t,a,i[l%c],s),f=o.map(e=>this.An(t,a,e,!0));u.push(...this.createRange(h,d,f))}return u}An(t,e,n,r){const i=new Qo(t,Pe.empty(),e,n);return r?i:i.Zt()}Rn(t,e,n,r){const i=new Qo(t,Pe.empty(),e,n);return r?i.Zt():i}Pn(t,e){const n=new Jo(e),r=null!=e.collectionGroup?e.collectionGroup:e.path.lastSegment();return this.getFieldIndexes(t,r).next(t=>{let e=null;for(const r of t)n.rn(r)&&(!e||r.fields.length>e.fields.length)&&(e=r);return e})}getIndexType(t,e){let n=2;const r=this.hn(e);return He.forEach(r,e=>this.Pn(t,e).next(t=>{t?0!==n&&t.fields.length<function(t){let e=new Hn(Le.comparator),n=!1;for(const r of t.filters)for(const t of r.getFlattenedFilters())t.field.isKeyField()||("array-contains"===t.op||"array-contains-any"===t.op?n=!0:e=e.add(t.field));for(const r of t.orderBy)r.field.isKeyField()||(e=e.add(r.field));return e.size+(n?1:0)}(e)&&(n=1):n=0})).next(()=>null!==e.limit&&r.length>1&&2===n?1:n)}Vn(t,e){const n=new $o;for(const r of Be(t)){const t=e.data.field(r.fieldPath);if(null==t)return null;const i=n.Yt(r.kind);Uo.vt.It(t,i)}return n.zt()}dn(t){const e=new $o;return Uo.vt.It(t,e.Yt(0)),e.zt()}mn(t,e){const n=new $o;return Uo.vt.It(wr(this.databaseId,e),n.Yt(function(t){const e=Be(t);return 0===e.length?0:e[e.length-1].kind}(t))),n.zt()}Tn(t,e,n){if(null===n)return[];let r=[];r.push(new $o);let i=0;for(const s of Be(t)){const t=n[i++];for(const n of r)if(this.fn(e,s.fieldPath)&&Ir(t))r=this.gn(r,s,t);else{const e=n.Yt(s.kind);Uo.vt.It(t,e)}}return this.pn(r)}In(t,e,n){return this.Tn(t,e,n.position)}pn(t){const e=[];for(let n=0;n<t.length;++n)e[n]=t[n].zt();return e}gn(t,e,n){const r=[...t],i=[];for(const s of n.arrayValue.values||[])for(const t of r){const n=new $o;n.seed(t.zt()),Uo.vt.It(s,n.Yt(e.kind)),i.push(n)}return i}fn(t,e){return!!t.filters.find(t=>t instanceof jr&&t.field.isEqual(e)&&("in"===t.op||"not-in"===t.op))}getFieldIndexes(t,e){const n=da(t),r=fa(t);return(e?n.U("collectionGroupIndex",IDBKeyRange.bound(e,e)):n.U()).next(t=>{const e=[];return He.forEach(t,t=>r.get([t.indexId,this.uid]).next(n=>{e.push(function(t,e){const n=e?new qe(e.sequenceNumber,new ze(xo(e.readTime),new Pe(mn(e.documentKey)),e.largestBatchId)):qe.empty(),r=t.fields.map(([t,e])=>new Ue(Le.fromServerFormat(t),e));return new Ve(t.indexId,t.collectionGroup,r,n)}(t,n))})).next(()=>e)})}getNextCollectionGroupToUpdate(t){return this.getFieldIndexes(t).next(t=>0===t.length?null:(t.sort((t,e)=>{const n=t.indexState.sequenceNumber-e.indexState.sequenceNumber;return 0!==n?n:Ce(t.collectionGroup,e.collectionGroup)}),t[0].collectionGroup))}updateCollectionGroup(t,e,n){const r=da(t),i=fa(t);return this.yn(t).next(t=>r.U("collectionGroupIndex",IDBKeyRange.bound(e,e)).next(e=>He.forEach(e,e=>i.put(Oo(e.indexId,this.uid,t,n)))))}updateIndexEntries(t,e){const n=new Map;return He.forEach(e,(e,r)=>{const i=n.get(e.collectionGroup);return(i?He.resolve(i):this.getFieldIndexes(t,e.collectionGroup)).next(i=>(n.set(e.collectionGroup,i),He.forEach(i,n=>this.wn(t,e,n).next(e=>{const i=this.Sn(r,n);return e.isEqual(i)?He.resolve():this.bn(t,r,n,e,i)}))))})}Dn(t,e,n,r){return ha(t).put({indexId:r.indexId,uid:this.uid,arrayValue:r.arrayValue,directionalValue:r.directionalValue,orderedDocumentKey:this.mn(n,e.key),documentKey:e.key.path.toArray()})}vn(t,e,n,r){return ha(t).delete([r.indexId,this.uid,r.arrayValue,r.directionalValue,this.mn(n,e.key),e.key.path.toArray()])}wn(t,e,n){const r=ha(t);let i=new Hn(Ho);return r.J({index:"documentKeyIndex",range:IDBKeyRange.only([n.indexId,this.uid,this.mn(n,e)])},(t,r)=>{i=i.add(new Qo(n.indexId,e,r.arrayValue,r.directionalValue))}).next(()=>i)}Sn(t,e){let n=new Hn(Ho);const r=this.Vn(e,t);if(null==r)return n;const i=Fe(e);if(null!=i){const s=t.data.field(i.fieldPath);if(Ir(s))for(const i of s.arrayValue.values||[])n=n.add(new Qo(e.indexId,t.key,this.dn(i),r))}else n=n.add(new Qo(e.indexId,t.key,ca,r));return n}bn(t,e,n,r,i){ae("IndexedDbIndexManager","Updating index entries for document '%s'",e.key);const s=[];return function(t,e,n,r,i){const s=t.getIterator(),o=e.getIterator();let a=Jn(s),c=Jn(o);for(;a||c;){let t=!1,e=!1;if(a&&c){const r=n(a,c);r<0?e=!0:r>0&&(t=!0)}else null!=a?e=!0:t=!0;t?(r(c),c=Jn(o)):e?(i(a),a=Jn(s)):(a=Jn(s),c=Jn(o))}}(r,i,Ho,r=>{s.push(this.Dn(t,e,n,r))},r=>{s.push(this.vn(t,e,n,r))}),He.waitFor(s)}yn(t){let e=1;return fa(t).J({index:"sequenceNumberIndex",reverse:!0,range:IDBKeyRange.upperBound([this.uid,Number.MAX_SAFE_INTEGER])},(t,n,r)=>{r.done(),e=n.sequenceNumber+1}).next(()=>e)}createRange(t,e,n){n=n.sort((t,e)=>Ho(t,e)).filter((t,e,n)=>!e||0!==Ho(t,n[e-1]));const r=[];r.push(t);for(const s of n){const n=Ho(s,t),i=Ho(s,e);if(0===n)r[0]=t.Zt();else if(n>0&&i<0)r.push(s),r.push(s.Zt());else if(i>0)break}r.push(e);const i=[];for(let s=0;s<r.length;s+=2){if(this.Cn(r[s],r[s+1]))return[];const t=[r[s].indexId,this.uid,r[s].arrayValue,r[s].directionalValue,ca,[]],e=[r[s+1].indexId,this.uid,r[s+1].arrayValue,r[s+1].directionalValue,ca,[]];i.push(IDBKeyRange.bound(t,e))}return i}Cn(t,e){return Ho(t,e)>0}getMinOffsetFromCollectionGroup(t,e){return this.getFieldIndexes(t,e).next(ma)}getMinOffset(t,e){return He.mapArray(this.hn(e),e=>this.Pn(t,e).next(t=>t||he())).next(ma)}}function la(t){return qn(t,"collectionParents")}function ha(t){return qn(t,"indexEntries")}function da(t){return qn(t,"indexConfiguration")}function fa(t){return qn(t,"indexState")}function ma(t){de(0!==t.length);let e=t[0].indexState.offset,n=e.largestBatchId;for(let r=1;r<t.length;r++){const i=t[r].indexState.offset;Ke(i,e)<0&&(e=i),n<i.largestBatchId&&(n=i.largestBatchId)}return new ze(e.readTime,e.documentKey,n)}
/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ga={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0};class pa{constructor(t,e,n){this.cacheSizeCollectionThreshold=t,this.percentileToCollect=e,this.maximumSequenceNumbersToCollect=n}static withCacheSize(t){return new pa(t,pa.DEFAULT_COLLECTION_PERCENTILE,pa.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ya(t,e,n){const r=t.store("mutations"),i=t.store("documentMutations"),s=[],o=IDBKeyRange.only(n.batchId);let a=0;const c=r.J({range:o},(t,e,n)=>(a++,n.delete()));s.push(c.next(()=>{de(1===a)}));const u=[];for(const l of n.mutations){const t=yn(e,l.key.path,n.batchId);s.push(i.delete(t)),u.push(l.key)}return He.waitFor(s).next(()=>u)}function va(t){if(!t)return 0;let e;if(t.document)e=t.document;else if(t.unknownDocument)e=t.unknownDocument;else{if(!t.noDocument)throw he();e=t.noDocument}return JSON.stringify(e).length}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */pa.DEFAULT_COLLECTION_PERCENTILE=10,pa.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,pa.DEFAULT=new pa(41943040,pa.DEFAULT_COLLECTION_PERCENTILE,pa.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),pa.DISABLED=new pa(-1,0,0);class wa{constructor(t,e,n,r){this.userId=t,this.serializer=e,this.indexManager=n,this.referenceDelegate=r,this.Fn={}}static lt(t,e,n,r){de(""!==t.uid);const i=t.isAuthenticated()?t.uid:"";return new wa(i,e,n,r)}checkEmpty(t){let e=!0;const n=IDBKeyRange.bound([this.userId,Number.NEGATIVE_INFINITY],[this.userId,Number.POSITIVE_INFINITY]);return Ia(t).J({index:"userMutationsIndex",range:n},(t,n,r)=>{e=!1,r.done()}).next(()=>e)}addMutationBatch(t,e,n,r){const i=_a(t),s=Ia(t);return s.add({}).next(o=>{de("number"==typeof o);const a=new ws(o,e,n,r),c=function(t,e,n){const r=n.baseMutations.map(e=>so(t.ct,e)),i=n.mutations.map(e=>so(t.ct,e));return{userId:e,batchId:n.batchId,localWriteTimeMs:n.localWriteTime.toMillis(),baseMutations:r,mutations:i}}(this.serializer,this.userId,a),u=[];let l=new Hn((t,e)=>Ce(t.canonicalString(),e.canonicalString()));for(const t of r){const e=yn(this.userId,t.key.path,o);l=l.add(t.key.path.popLast()),u.push(s.put(c)),u.push(i.put(e,vn))}return l.forEach(e=>{u.push(this.indexManager.addToCollectionParentIndex(t,e))}),t.addOnCommittedListener(()=>{this.Fn[o]=a.keys()}),He.waitFor(u).next(()=>a)})}lookupMutationBatch(t,e){return Ia(t).get(e).next(t=>t?(de(t.userId===this.userId),Co(this.serializer,t)):null)}Mn(t,e){return this.Fn[e]?He.resolve(this.Fn[e]):this.lookupMutationBatch(t,e).next(t=>{if(t){const n=t.keys();return this.Fn[e]=n,n}return null})}getNextMutationBatchAfterBatchId(t,e){const n=e+1,r=IDBKeyRange.lowerBound([this.userId,n]);let i=null;return Ia(t).J({index:"userMutationsIndex",range:r},(t,e,r)=>{e.userId===this.userId&&(de(e.batchId>=n),i=Co(this.serializer,e)),r.done()}).next(()=>i)}getHighestUnacknowledgedBatchId(t){const e=IDBKeyRange.upperBound([this.userId,Number.POSITIVE_INFINITY]);let n=-1;return Ia(t).J({index:"userMutationsIndex",range:e,reverse:!0},(t,e,r)=>{n=e.batchId,r.done()}).next(()=>n)}getAllMutationBatches(t){const e=IDBKeyRange.bound([this.userId,-1],[this.userId,Number.POSITIVE_INFINITY]);return Ia(t).U("userMutationsIndex",e).next(t=>t.map(t=>Co(this.serializer,t)))}getAllMutationBatchesAffectingDocumentKey(t,e){const n=pn(this.userId,e.path),r=IDBKeyRange.lowerBound(n),i=[];return _a(t).J({range:r},(n,r,s)=>{const[o,a,c]=n,u=mn(a);if(o===this.userId&&e.path.isEqual(u))return Ia(t).get(c).next(t=>{if(!t)throw he();de(t.userId===this.userId),i.push(Co(this.serializer,t))});s.done()}).next(()=>i)}getAllMutationBatchesAffectingDocumentKeys(t,e){let n=new Hn(Ce);const r=[];return e.forEach(e=>{const i=pn(this.userId,e.path),s=IDBKeyRange.lowerBound(i),o=_a(t).J({range:s},(t,r,i)=>{const[s,o,a]=t,c=mn(o);s===this.userId&&e.path.isEqual(c)?n=n.add(a):i.done()});r.push(o)}),He.waitFor(r).next(()=>this.xn(t,n))}getAllMutationBatchesAffectingQuery(t,e){const n=e.path,r=n.length+1,i=pn(this.userId,n),s=IDBKeyRange.lowerBound(i);let o=new Hn(Ce);return _a(t).J({range:s},(t,e,i)=>{const[s,a,c]=t,u=mn(a);s===this.userId&&n.isPrefixOf(u)?u.length===r&&(o=o.add(c)):i.done()}).next(()=>this.xn(t,o))}xn(t,e){const n=[],r=[];return e.forEach(e=>{r.push(Ia(t).get(e).next(t=>{if(null===t)throw he();de(t.userId===this.userId),n.push(Co(this.serializer,t))}))}),He.waitFor(r).next(()=>n)}removeMutationBatch(t,e){return ya(t._e,this.userId,e).next(n=>(t.addOnCommittedListener(()=>{this.On(e.batchId)}),He.forEach(n,e=>this.referenceDelegate.markPotentiallyOrphaned(t,e))))}On(t){delete this.Fn[t]}performConsistencyCheck(t){return this.checkEmpty(t).next(e=>{if(!e)return He.resolve();const n=IDBKeyRange.lowerBound([this.userId]),r=[];return _a(t).J({range:n},(t,e,n)=>{if(t[0]===this.userId){const e=mn(t[1]);r.push(e)}else n.done()}).next(()=>{de(0===r.length)})})}containsKey(t,e){return ba(t,this.userId,e)}Nn(t){return Ea(t).get(this.userId).next(t=>t||{userId:this.userId,lastAcknowledgedBatchId:-1,lastStreamToken:""})}}function ba(t,e,n){const r=pn(e,n.path),i=r[1],s=IDBKeyRange.lowerBound(r);let o=!1;return _a(t).J({range:s,H:!0},(t,n,r)=>{const[s,a,c]=t;s===e&&a===i&&(o=!0),r.done()}).next(()=>o)}function Ia(t){return qn(t,"mutations")}function _a(t){return qn(t,"documentMutations")}function Ea(t){return qn(t,"mutationQueues")}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ta{constructor(t){this.Ln=t}next(){return this.Ln+=2,this.Ln}static Bn(){return new Ta(0)}static kn(){return new Ta(-1)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sa{constructor(t,e){this.referenceDelegate=t,this.serializer=e}allocateTargetId(t){return this.qn(t).next(e=>{const n=new Ta(e.highestTargetId);return e.highestTargetId=n.next(),this.Qn(t,e).next(()=>e.highestTargetId)})}getLastRemoteSnapshotVersion(t){return this.qn(t).next(t=>ke.fromTimestamp(new Ne(t.lastRemoteSnapshotVersion.seconds,t.lastRemoteSnapshotVersion.nanoseconds)))}getHighestSequenceNumber(t){return this.qn(t).next(t=>t.highestListenSequenceNumber)}setTargetsMetadata(t,e,n){return this.qn(t).next(r=>(r.highestListenSequenceNumber=e,n&&(r.lastRemoteSnapshotVersion=n.toTimestamp()),e>r.highestListenSequenceNumber&&(r.highestListenSequenceNumber=e),this.Qn(t,r)))}addTargetData(t,e){return this.Kn(t,e).next(()=>this.qn(t).next(n=>(n.targetCount+=1,this.$n(e,n),this.Qn(t,n))))}updateTargetData(t,e){return this.Kn(t,e)}removeTargetData(t,e){return this.removeMatchingKeysForTargetId(t,e.targetId).next(()=>xa(t).delete(e.targetId)).next(()=>this.qn(t)).next(e=>(de(e.targetCount>0),e.targetCount-=1,this.Qn(t,e)))}removeTargets(t,e,n){let r=0;const i=[];return xa(t).J((s,o)=>{const a=Do(o);a.sequenceNumber<=e&&null===n.get(a.targetId)&&(r++,i.push(this.removeTargetData(t,a)))}).next(()=>He.waitFor(i)).next(()=>r)}forEachTarget(t,e){return xa(t).J((t,n)=>{const r=Do(n);e(r)})}qn(t){return Ca(t).get("targetGlobalKey").next(t=>(de(null!==t),t))}Qn(t,e){return Ca(t).put("targetGlobalKey",e)}Kn(t,e){return xa(t).put(Ao(this.serializer,e))}$n(t,e){let n=!1;return t.targetId>e.highestTargetId&&(e.highestTargetId=t.targetId,n=!0),t.sequenceNumber>e.highestListenSequenceNumber&&(e.highestListenSequenceNumber=t.sequenceNumber,n=!0),n}getTargetCount(t){return this.qn(t).next(t=>t.targetCount)}getTargetData(t,e){const n=ci(e),r=IDBKeyRange.bound([n,Number.NEGATIVE_INFINITY],[n,Number.POSITIVE_INFINITY]);let i=null;return xa(t).J({range:r,index:"queryTargetsIndex"},(t,n,r)=>{const s=Do(n);ui(e,s.target)&&(i=s,r.done())}).next(()=>i)}addMatchingKeys(t,e,n){const r=[],i=Da(t);return e.forEach(e=>{const s=hn(e.path);r.push(i.put({targetId:n,path:s})),r.push(this.referenceDelegate.addReference(t,n,e))}),He.waitFor(r)}removeMatchingKeys(t,e,n){const r=Da(t);return He.forEach(e,e=>{const i=hn(e.path);return He.waitFor([r.delete([n,i]),this.referenceDelegate.removeReference(t,n,e)])})}removeMatchingKeysForTargetId(t,e){const n=Da(t),r=IDBKeyRange.bound([e],[e+1],!1,!0);return n.delete(r)}getMatchingKeysForTargetId(t,e){const n=IDBKeyRange.bound([e],[e+1],!1,!0),r=Da(t);let i=Bi();return r.J({range:n,H:!0},(t,e,n)=>{const r=mn(t[1]),s=new Pe(r);i=i.add(s)}).next(()=>i)}containsKey(t,e){const n=hn(e.path),r=IDBKeyRange.bound([n],[Ae(n)],!1,!0);let i=0;return Da(t).J({index:"documentTargetsIndex",H:!0,range:r},([t,e],n,r)=>{0!==t&&(i++,r.done())}).next(()=>i>0)}ot(t,e){return xa(t).get(e).next(t=>t?Do(t):null)}}function xa(t){return qn(t,"targets")}function Ca(t){return qn(t,"targetGlobal")}function Da(t){return qn(t,"targetDocuments")}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Aa([t,e],[n,r]){const i=Ce(t,n);return 0===i?Ce(e,r):i}class Na{constructor(t){this.Un=t,this.buffer=new Hn(Aa),this.Wn=0}Gn(){return++this.Wn}zn(t){const e=[t,this.Gn()];if(this.buffer.size<this.Un)this.buffer=this.buffer.add(e);else{const t=this.buffer.last();Aa(e,t)<0&&(this.buffer=this.buffer.delete(t).add(e))}}get maxValue(){return this.buffer.last()[0]}}class ka{constructor(t,e,n){this.garbageCollector=t,this.asyncQueue=e,this.localStore=n,this.jn=null}start(){-1!==this.garbageCollector.params.cacheSizeCollectionThreshold&&this.Hn(6e4)}stop(){this.jn&&(this.jn.cancel(),this.jn=null)}get started(){return null!==this.jn}Hn(t){ae("LruGarbageCollector",`Garbage collection scheduled in ${t}ms`),this.jn=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",t,async()=>{this.jn=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){tn(t)?ae("LruGarbageCollector","Ignoring IndexedDB error during garbage collection: ",t):await Qe(t)}await this.Hn(3e5)})}}class Ra{constructor(t,e){this.Jn=t,this.params=e}calculateTargetCount(t,e){return this.Jn.Yn(t).next(t=>Math.floor(e/100*t))}nthSequenceNumber(t,e){if(0===e)return He.resolve(cn.oe);const n=new Na(e);return this.Jn.forEachTarget(t,t=>n.zn(t.sequenceNumber)).next(()=>this.Jn.Zn(t,t=>n.zn(t))).next(()=>n.maxValue)}removeTargets(t,e,n){return this.Jn.removeTargets(t,e,n)}removeOrphanedDocuments(t,e){return this.Jn.removeOrphanedDocuments(t,e)}collect(t,e){return-1===this.params.cacheSizeCollectionThreshold?(ae("LruGarbageCollector","Garbage collection skipped; disabled"),He.resolve(ga)):this.getCacheSize(t).next(n=>n<this.params.cacheSizeCollectionThreshold?(ae("LruGarbageCollector",`Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),ga):this.Xn(t,e))}getCacheSize(t){return this.Jn.getCacheSize(t)}Xn(t,e){let n,r,i,s,o,a,c;const u=Date.now();return this.calculateTargetCount(t,this.params.percentileToCollect).next(e=>(e>this.params.maximumSequenceNumbersToCollect?(ae("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${e}`),r=this.params.maximumSequenceNumbersToCollect):r=e,s=Date.now(),this.nthSequenceNumber(t,r))).next(r=>(n=r,o=Date.now(),this.removeTargets(t,n,e))).next(e=>(i=e,a=Date.now(),this.removeOrphanedDocuments(t,n))).next(t=>(c=Date.now(),oe()<=E.DEBUG&&ae("LruGarbageCollector",`LRU Garbage Collection\n\tCounted targets in ${s-u}ms\n\tDetermined least recently used ${r} in `+(o-s)+`ms\n\tRemoved ${i} targets in `+(a-o)+`ms\n\tRemoved ${t} documents in `+(c-a)+`ms\nTotal Duration: ${c-u}ms`),He.resolve({didRun:!0,sequenceNumbersCollected:r,targetsRemoved:i,documentsRemoved:t})))}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Oa{constructor(t,e){this.db=t,this.garbageCollector=function(t,e){return new Ra(t,e)}(this,e)}Yn(t){const e=this.er(t);return this.db.getTargetCache().getTargetCount(t).next(t=>e.next(e=>t+e))}er(t){let e=0;return this.Zn(t,t=>{e++}).next(()=>e)}forEachTarget(t,e){return this.db.getTargetCache().forEachTarget(t,e)}Zn(t,e){return this.tr(t,(t,n)=>e(n))}addReference(t,e,n){return Ma(t,n)}removeReference(t,e,n){return Ma(t,n)}removeTargets(t,e,n){return this.db.getTargetCache().removeTargets(t,e,n)}markPotentiallyOrphaned(t,e){return Ma(t,e)}nr(t,e){return function(t,e){let n=!1;return Ea(t).Y(r=>ba(t,r,e).next(t=>(t&&(n=!0),He.resolve(!t)))).next(()=>n)}(t,e)}removeOrphanedDocuments(t,e){const n=this.db.getRemoteDocumentCache().newChangeBuffer(),r=[];let i=0;return this.tr(t,(s,o)=>{if(o<=e){const e=this.nr(t,s).next(e=>{if(!e)return i++,n.getEntry(t,s).next(()=>(n.removeEntry(s,ke.min()),Da(t).delete([0,hn(s.path)])))});r.push(e)}}).next(()=>He.waitFor(r)).next(()=>n.apply(t)).next(()=>i)}removeTarget(t,e){const n=e.withSequenceNumber(t.currentSequenceNumber);return this.db.getTargetCache().updateTargetData(t,n)}updateLimboDocument(t,e){return Ma(t,e)}tr(t,e){const n=Da(t);let r,i=cn.oe;return n.J({index:"documentTargetsIndex"},([t,n],{path:s,sequenceNumber:o})=>{0===t?(i!==cn.oe&&e(new Pe(mn(r)),i),i=o,r=s):i=cn.oe}).next(()=>{i!==cn.oe&&e(new Pe(mn(r)),i)})}getCacheSize(t){return this.db.getRemoteDocumentCache().getSize(t)}}function Ma(t,e){return Da(t).put((n=e,r=t.currentSequenceNumber,{targetId:0,path:hn(n.path),sequenceNumber:r}));var n,r}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class La{constructor(){this.changes=new Di(t=>t.toString(),(t,e)=>t.isEqual(e)),this.changesApplied=!1}addEntry(t){this.assertNotApplied(),this.changes.set(t.key,t)}removeEntry(t,e){this.assertNotApplied(),this.changes.set(t,Lr.newInvalidDocument(t).setReadTime(e))}getEntry(t,e){this.assertNotApplied();const n=this.changes.get(e);return void 0!==n?He.resolve(n):this.getFromCache(t,e)}getEntries(t,e){return this.getAllFromCache(t,e)}apply(t){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(t)}assertNotApplied(){}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pa{constructor(t){this.serializer=t}setIndexManager(t){this.indexManager=t}addEntry(t,e,n){return Ua(t).put(n)}removeEntry(t,e,n){return Ua(t).delete(function(t,e){const n=t.path.toArray();return[n.slice(0,n.length-2),n[n.length-2],To(e),n[n.length-1]]}(e,n))}updateMetadata(t,e){return this.getMetadata(t).next(n=>(n.byteSize+=e,this.rr(t,n)))}getEntry(t,e){let n=Lr.newInvalidDocument(e);return Ua(t).J({index:"documentKeyIndex",range:IDBKeyRange.only(qa(e))},(t,r)=>{n=this.ir(e,r)}).next(()=>n)}sr(t,e){let n={size:0,document:Lr.newInvalidDocument(e)};return Ua(t).J({index:"documentKeyIndex",range:IDBKeyRange.only(qa(e))},(t,r)=>{n={document:this.ir(e,r),size:va(r)}}).next(()=>n)}getEntries(t,e){let n=Ni();return this._r(t,e,(t,e)=>{const r=this.ir(t,e);n=n.insert(t,r)}).next(()=>n)}ar(t,e){let n=Ni(),r=new Gn(Pe.comparator);return this._r(t,e,(t,e)=>{const i=this.ir(t,e);n=n.insert(t,i),r=r.insert(t,va(e))}).next(()=>({documents:n,ur:r}))}_r(t,e,n){if(e.isEmpty())return He.resolve();let r=new Hn(za);e.forEach(t=>r=r.add(t));const i=IDBKeyRange.bound(qa(r.first()),qa(r.last())),s=r.getIterator();let o=s.getNext();return Ua(t).J({index:"documentKeyIndex",range:i},(t,e,r)=>{const i=Pe.fromSegments([...e.prefixPath,e.collectionGroup,e.documentId]);for(;o&&za(o,i)<0;)n(o,null),o=s.getNext();o&&o.isEqual(i)&&(n(o,e),o=s.hasNext()?s.getNext():null),o?r.$(qa(o)):r.done()}).next(()=>{for(;o;)n(o,null),o=s.hasNext()?s.getNext():null})}getDocumentsMatchingQuery(t,e,n,r,i){const s=e.path,o=[s.popLast().toArray(),s.lastSegment(),To(n.readTime),n.documentKey.path.isEmpty()?"":n.documentKey.path.lastSegment()],a=[s.popLast().toArray(),s.lastSegment(),[Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER],""];return Ua(t).U(IDBKeyRange.bound(o,a,!0)).next(t=>{null==i||i.incrementDocumentReadCount(t.length);let n=Ni();for(const i of t){const t=this.ir(Pe.fromSegments(i.prefixPath.concat(i.collectionGroup,i.documentId)),i);t.isFoundDocument()&&(Si(e,t)||r.has(t.key))&&(n=n.insert(t.key,t))}return n})}getAllFromCollectionGroup(t,e,n,r){let i=Ni();const s=ja(e,n),o=ja(e,ze.max());return Ua(t).J({index:"collectionGroupIndex",range:IDBKeyRange.bound(s,o,!0)},(t,e,n)=>{const s=this.ir(Pe.fromSegments(e.prefixPath.concat(e.collectionGroup,e.documentId)),e);i=i.insert(s.key,s),i.size===r&&n.done()}).next(()=>i)}newChangeBuffer(t){return new Fa(this,!!t&&t.trackRemovals)}getSize(t){return this.getMetadata(t).next(t=>t.byteSize)}getMetadata(t){return Ba(t).get("remoteDocumentGlobalKey").next(t=>(de(!!t),t))}rr(t,e){return Ba(t).put("remoteDocumentGlobalKey",e)}ir(t,e){if(e){const t=_o(this.serializer,e);if(!t.isNoDocument()||!t.version.isEqual(ke.min()))return t}return Lr.newInvalidDocument(t)}}function Va(t){return new Pa(t)}class Fa extends La{constructor(t,e){super(),this.cr=t,this.trackRemovals=e,this.lr=new Di(t=>t.toString(),(t,e)=>t.isEqual(e))}applyChanges(t){const e=[];let n=0,r=new Hn((t,e)=>Ce(t.canonicalString(),e.canonicalString()));return this.changes.forEach((i,s)=>{const o=this.lr.get(i);if(e.push(this.cr.removeEntry(t,i,o.readTime)),s.isValidDocument()){const a=Eo(this.cr.serializer,s);r=r.add(i.path.popLast());const c=va(a);n+=c-o.size,e.push(this.cr.addEntry(t,i,a))}else if(n-=o.size,this.trackRemovals){const n=Eo(this.cr.serializer,s.convertToNoDocument(ke.min()));e.push(this.cr.addEntry(t,i,n))}}),r.forEach(n=>{e.push(this.cr.indexManager.addToCollectionParentIndex(t,n))}),e.push(this.cr.updateMetadata(t,n)),He.waitFor(e)}getFromCache(t,e){return this.cr.sr(t,e).next(t=>(this.lr.set(e,{size:t.size,readTime:t.document.readTime}),t.document))}getAllFromCache(t,e){return this.cr.ar(t,e).next(({documents:t,ur:e})=>(e.forEach((e,n)=>{this.lr.set(e,{size:n,readTime:t.get(e).readTime})}),t))}}function Ba(t){return qn(t,"remoteDocumentGlobal")}function Ua(t){return qn(t,"remoteDocumentsV14")}function qa(t){const e=t.path.toArray();return[e.slice(0,e.length-2),e[e.length-2],e[e.length-1]]}function ja(t,e){const n=e.documentKey.path.toArray();return[t,To(e.readTime),n.slice(0,n.length-2),n.length>0?n[n.length-1]:""]}function za(t,e){const n=t.path.toArray(),r=e.path.toArray();let i=0;for(let s=0;s<n.length-2&&s<r.length-2;++s)if(i=Ce(n[s],r[s]),i)return i;return i=Ce(n.length,r.length),i||(i=Ce(n[n.length-2],r[r.length-2]),i||Ce(n[n.length-1],r[r.length-1])
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */)}class Ka{constructor(t,e){this.overlayedDocument=t,this.mutatedFields=e}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ga{constructor(t,e,n,r){this.remoteDocumentCache=t,this.mutationQueue=e,this.documentOverlayCache=n,this.indexManager=r}getDocument(t,e){let n=null;return this.documentOverlayCache.getOverlay(t,e).next(r=>(n=r,this.remoteDocumentCache.getEntry(t,e))).next(t=>(null!==n&&us(n.mutation,t,Yn.empty(),Ne.now()),t))}getDocuments(t,e){return this.remoteDocumentCache.getEntries(t,e).next(e=>this.getLocalViewOfDocuments(t,e,Bi()).next(()=>e))}getLocalViewOfDocuments(t,e,n=Bi()){const r=Mi();return this.populateOverlays(t,r,e).next(()=>this.computeViews(t,e,r,n).next(t=>{let e=Ri();return t.forEach((t,n)=>{e=e.insert(t,n.overlayedDocument)}),e}))}getOverlayedDocuments(t,e){const n=Mi();return this.populateOverlays(t,n,e).next(()=>this.computeViews(t,e,n,Bi()))}populateOverlays(t,e,n){const r=[];return n.forEach(t=>{e.has(t)||r.push(t)}),this.documentOverlayCache.getOverlays(t,r).next(t=>{t.forEach((t,n)=>{e.set(t,n)})})}computeViews(t,e,n,r){let i=Ni();const s=Pi(),o=Pi();return e.forEach((t,e)=>{const o=n.get(e.key);r.has(e.key)&&(void 0===o||o.mutation instanceof fs)?i=i.insert(e.key,e):void 0!==o?(s.set(e.key,o.mutation.getFieldMask()),us(o.mutation,e,o.mutation.getFieldMask(),Ne.now())):s.set(e.key,Yn.empty())}),this.recalculateAndSaveOverlays(t,i).next(t=>(t.forEach((t,e)=>s.set(t,e)),e.forEach((t,e)=>{var n;return o.set(t,new Ka(e,null!==(n=s.get(t))&&void 0!==n?n:null))}),o))}recalculateAndSaveOverlays(t,e){const n=Pi();let r=new Gn((t,e)=>t-e),i=Bi();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(t,e).next(t=>{for(const i of t)i.keys().forEach(t=>{const s=e.get(t);if(null===s)return;let o=n.get(t)||Yn.empty();o=i.applyToLocalView(s,o),n.set(t,o);const a=(r.get(i.batchId)||Bi()).add(t);r=r.insert(i.batchId,a)})}).next(()=>{const s=[],o=r.getReverseIterator();for(;o.hasNext();){const r=o.getNext(),a=r.key,c=r.value,u=Li();c.forEach(t=>{if(!i.has(t)){const r=as(e.get(t),n.get(t));null!==r&&u.set(t,r),i=i.add(t)}}),s.push(this.documentOverlayCache.saveOverlays(t,a,u))}return He.waitFor(s)}).next(()=>n)}recalculateAndSaveOverlaysForDocumentKeys(t,e){return this.remoteDocumentCache.getEntries(t,e).next(e=>this.recalculateAndSaveOverlays(t,e))}getDocumentsMatchingQuery(t,e,n,r){return i=e,Pe.isDocumentKey(i.path)&&null===i.collectionGroup&&0===i.filters.length?this.getDocumentsMatchingDocumentQuery(t,e.path):yi(e)?this.getDocumentsMatchingCollectionGroupQuery(t,e,n,r):this.getDocumentsMatchingCollectionQuery(t,e,n,r);var i}getNextDocuments(t,e,n,r){return this.remoteDocumentCache.getAllFromCollectionGroup(t,e,n,r).next(i=>{const s=r-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(t,e,n.largestBatchId,r-i.size):He.resolve(Mi());let o=-1,a=i;return s.next(e=>He.forEach(e,(e,n)=>(o<n.largestBatchId&&(o=n.largestBatchId),i.get(e)?He.resolve():this.remoteDocumentCache.getEntry(t,e).next(t=>{a=a.insert(e,t)}))).next(()=>this.populateOverlays(t,e,i)).next(()=>this.computeViews(t,a,e,Bi())).next(t=>({batchId:o,changes:Oi(t)})))})}getDocumentsMatchingDocumentQuery(t,e){return this.getDocument(t,new Pe(e)).next(t=>{let e=Ri();return t.isFoundDocument()&&(e=e.insert(t.key,t)),e})}getDocumentsMatchingCollectionGroupQuery(t,e,n,r){const i=e.collectionGroup;let s=Ri();return this.indexManager.getCollectionParents(t,i).next(o=>He.forEach(o,o=>{const a=(c=e,u=o.child(i),new mi(u,null,c.explicitOrderBy.slice(),c.filters.slice(),c.limit,c.limitType,c.startAt,c.endAt));var c,u;return this.getDocumentsMatchingCollectionQuery(t,a,n,r).next(t=>{t.forEach((t,e)=>{s=s.insert(t,e)})})}).next(()=>s))}getDocumentsMatchingCollectionQuery(t,e,n,r){let i;return this.documentOverlayCache.getOverlaysForCollection(t,e.path,n.largestBatchId).next(s=>(i=s,this.remoteDocumentCache.getDocumentsMatchingQuery(t,e,n,i,r))).next(t=>{i.forEach((e,n)=>{const r=n.getKey();null===t.get(r)&&(t=t.insert(r,Lr.newInvalidDocument(r)))});let n=Ri();return t.forEach((t,r)=>{const s=i.get(t);void 0!==s&&us(s.mutation,r,Yn.empty(),Ne.now()),Si(e,r)&&(n=n.insert(t,r))}),n})}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $a{constructor(t){this.serializer=t,this.hr=new Map,this.Pr=new Map}getBundleMetadata(t,e){return He.resolve(this.hr.get(e))}saveBundleMetadata(t,e){return this.hr.set(e.id,{id:(n=e).id,version:n.version,createTime:Hs(n.createTime)}),He.resolve();var n}getNamedQuery(t,e){return He.resolve(this.Pr.get(e))}saveNamedQuery(t,e){return this.Pr.set(e.name,{name:(n=e).name,query:No(n.bundledQuery),readTime:Hs(n.readTime)}),He.resolve();var n}}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qa{constructor(){this.overlays=new Gn(Pe.comparator),this.Ir=new Map}getOverlay(t,e){return He.resolve(this.overlays.get(e))}getOverlays(t,e){const n=Mi();return He.forEach(e,e=>this.getOverlay(t,e).next(t=>{null!==t&&n.set(e,t)})).next(()=>n)}saveOverlays(t,e,n){return n.forEach((n,r)=>{this.ht(t,e,r)}),He.resolve()}removeOverlaysForBatchId(t,e,n){const r=this.Ir.get(n);return void 0!==r&&(r.forEach(t=>this.overlays=this.overlays.remove(t)),this.Ir.delete(n)),He.resolve()}getOverlaysForCollection(t,e,n){const r=Mi(),i=e.length+1,s=new Pe(e.child("")),o=this.overlays.getIteratorFrom(s);for(;o.hasNext();){const t=o.getNext().value,s=t.getKey();if(!e.isPrefixOf(s.path))break;s.path.length===i&&t.largestBatchId>n&&r.set(t.getKey(),t)}return He.resolve(r)}getOverlaysForCollectionGroup(t,e,n,r){let i=new Gn((t,e)=>t-e);const s=this.overlays.getIterator();for(;s.hasNext();){const t=s.getNext().value;if(t.getKey().getCollectionGroup()===e&&t.largestBatchId>n){let e=i.get(t.largestBatchId);null===e&&(e=Mi(),i=i.insert(t.largestBatchId,e)),e.set(t.getKey(),t)}}const o=Mi(),a=i.getIterator();for(;a.hasNext()&&(a.getNext().value.forEach((t,e)=>o.set(t,e)),!(o.size()>=r)););return He.resolve(o)}ht(t,e,n){const r=this.overlays.get(n.key);if(null!==r){const t=this.Ir.get(r.largestBatchId).delete(n.key);this.Ir.set(r.largestBatchId,t)}this.overlays=this.overlays.insert(n.key,new Is(e,n));let i=this.Ir.get(e);void 0===i&&(i=Bi(),this.Ir.set(e,i)),this.Ir.set(e,i.add(n.key))}}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ha{constructor(){this.sessionToken=Zn.EMPTY_BYTE_STRING}getSessionToken(t){return He.resolve(this.sessionToken)}setSessionToken(t,e){return this.sessionToken=e,He.resolve()}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wa{constructor(){this.Tr=new Hn(Ja.Er),this.dr=new Hn(Ja.Ar)}isEmpty(){return this.Tr.isEmpty()}addReference(t,e){const n=new Ja(t,e);this.Tr=this.Tr.add(n),this.dr=this.dr.add(n)}Rr(t,e){t.forEach(t=>this.addReference(t,e))}removeReference(t,e){this.Vr(new Ja(t,e))}mr(t,e){t.forEach(t=>this.removeReference(t,e))}gr(t){const e=new Pe(new Oe([])),n=new Ja(e,t),r=new Ja(e,t+1),i=[];return this.dr.forEachInRange([n,r],t=>{this.Vr(t),i.push(t.key)}),i}pr(){this.Tr.forEach(t=>this.Vr(t))}Vr(t){this.Tr=this.Tr.delete(t),this.dr=this.dr.delete(t)}yr(t){const e=new Pe(new Oe([])),n=new Ja(e,t),r=new Ja(e,t+1);let i=Bi();return this.dr.forEachInRange([n,r],t=>{i=i.add(t.key)}),i}containsKey(t){const e=new Ja(t,0),n=this.Tr.firstAfterOrEqual(e);return null!==n&&t.isEqual(n.key)}}class Ja{constructor(t,e){this.key=t,this.wr=e}static Er(t,e){return Pe.comparator(t.key,e.key)||Ce(t.wr,e.wr)}static Ar(t,e){return Ce(t.wr,e.wr)||Pe.comparator(t.key,e.key)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ya{constructor(t,e){this.indexManager=t,this.referenceDelegate=e,this.mutationQueue=[],this.Sr=1,this.br=new Hn(Ja.Er)}checkEmpty(t){return He.resolve(0===this.mutationQueue.length)}addMutationBatch(t,e,n,r){const i=this.Sr;this.Sr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const s=new ws(i,e,n,r);this.mutationQueue.push(s);for(const o of r)this.br=this.br.add(new Ja(o.key,i)),this.indexManager.addToCollectionParentIndex(t,o.key.path.popLast());return He.resolve(s)}lookupMutationBatch(t,e){return He.resolve(this.Dr(e))}getNextMutationBatchAfterBatchId(t,e){const n=e+1,r=this.vr(n),i=r<0?0:r;return He.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return He.resolve(0===this.mutationQueue.length?-1:this.Sr-1)}getAllMutationBatches(t){return He.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(t,e){const n=new Ja(e,0),r=new Ja(e,Number.POSITIVE_INFINITY),i=[];return this.br.forEachInRange([n,r],t=>{const e=this.Dr(t.wr);i.push(e)}),He.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(t,e){let n=new Hn(Ce);return e.forEach(t=>{const e=new Ja(t,0),r=new Ja(t,Number.POSITIVE_INFINITY);this.br.forEachInRange([e,r],t=>{n=n.add(t.wr)})}),He.resolve(this.Cr(n))}getAllMutationBatchesAffectingQuery(t,e){const n=e.path,r=n.length+1;let i=n;Pe.isDocumentKey(i)||(i=i.child(""));const s=new Ja(new Pe(i),0);let o=new Hn(Ce);return this.br.forEachWhile(t=>{const e=t.key.path;return!!n.isPrefixOf(e)&&(e.length===r&&(o=o.add(t.wr)),!0)},s),He.resolve(this.Cr(o))}Cr(t){const e=[];return t.forEach(t=>{const n=this.Dr(t);null!==n&&e.push(n)}),e}removeMutationBatch(t,e){de(0===this.Fr(e.batchId,"removed")),this.mutationQueue.shift();let n=this.br;return He.forEach(e.mutations,r=>{const i=new Ja(r.key,e.batchId);return n=n.delete(i),this.referenceDelegate.markPotentiallyOrphaned(t,r.key)}).next(()=>{this.br=n})}On(t){}containsKey(t,e){const n=new Ja(e,0),r=this.br.firstAfterOrEqual(n);return He.resolve(e.isEqual(r&&r.key))}performConsistencyCheck(t){return this.mutationQueue.length,He.resolve()}Fr(t,e){return this.vr(t)}vr(t){return 0===this.mutationQueue.length?0:t-this.mutationQueue[0].batchId}Dr(t){const e=this.vr(t);return e<0||e>=this.mutationQueue.length?null:this.mutationQueue[e]}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xa{constructor(t){this.Mr=t,this.docs=new Gn(Pe.comparator),this.size=0}setIndexManager(t){this.indexManager=t}addEntry(t,e){const n=e.key,r=this.docs.get(n),i=r?r.size:0,s=this.Mr(e);return this.docs=this.docs.insert(n,{document:e.mutableCopy(),size:s}),this.size+=s-i,this.indexManager.addToCollectionParentIndex(t,n.path.popLast())}removeEntry(t){const e=this.docs.get(t);e&&(this.docs=this.docs.remove(t),this.size-=e.size)}getEntry(t,e){const n=this.docs.get(e);return He.resolve(n?n.document.mutableCopy():Lr.newInvalidDocument(e))}getEntries(t,e){let n=Ni();return e.forEach(t=>{const e=this.docs.get(t);n=n.insert(t,e?e.document.mutableCopy():Lr.newInvalidDocument(t))}),He.resolve(n)}getDocumentsMatchingQuery(t,e,n,r){let i=Ni();const s=e.path,o=new Pe(s.child("")),a=this.docs.getIteratorFrom(o);for(;a.hasNext();){const{key:t,value:{document:o}}=a.getNext();if(!s.isPrefixOf(t.path))break;t.path.length>s.length+1||Ke(je(o),n)<=0||(r.has(o.key)||Si(e,o))&&(i=i.insert(o.key,o.mutableCopy()))}return He.resolve(i)}getAllFromCollectionGroup(t,e,n,r){he()}Or(t,e){return He.forEach(this.docs,t=>e(t))}newChangeBuffer(t){return new Za(this)}getSize(t){return He.resolve(this.size)}}class Za extends La{constructor(t){super(),this.cr=t}applyChanges(t){const e=[];return this.changes.forEach((n,r)=>{r.isValidDocument()?e.push(this.cr.addEntry(t,r)):this.cr.removeEntry(n)}),He.waitFor(e)}getFromCache(t,e){return this.cr.getEntry(t,e)}getAllFromCache(t,e){return this.cr.getEntries(t,e)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tc{constructor(t){this.persistence=t,this.Nr=new Di(t=>ci(t),ui),this.lastRemoteSnapshotVersion=ke.min(),this.highestTargetId=0,this.Lr=0,this.Br=new Wa,this.targetCount=0,this.kr=Ta.Bn()}forEachTarget(t,e){return this.Nr.forEach((t,n)=>e(n)),He.resolve()}getLastRemoteSnapshotVersion(t){return He.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(t){return He.resolve(this.Lr)}allocateTargetId(t){return this.highestTargetId=this.kr.next(),He.resolve(this.highestTargetId)}setTargetsMetadata(t,e,n){return n&&(this.lastRemoteSnapshotVersion=n),e>this.Lr&&(this.Lr=e),He.resolve()}Kn(t){this.Nr.set(t.target,t);const e=t.targetId;e>this.highestTargetId&&(this.kr=new Ta(e),this.highestTargetId=e),t.sequenceNumber>this.Lr&&(this.Lr=t.sequenceNumber)}addTargetData(t,e){return this.Kn(e),this.targetCount+=1,He.resolve()}updateTargetData(t,e){return this.Kn(e),He.resolve()}removeTargetData(t,e){return this.Nr.delete(e.target),this.Br.gr(e.targetId),this.targetCount-=1,He.resolve()}removeTargets(t,e,n){let r=0;const i=[];return this.Nr.forEach((s,o)=>{o.sequenceNumber<=e&&null===n.get(o.targetId)&&(this.Nr.delete(s),i.push(this.removeMatchingKeysForTargetId(t,o.targetId)),r++)}),He.waitFor(i).next(()=>r)}getTargetCount(t){return He.resolve(this.targetCount)}getTargetData(t,e){const n=this.Nr.get(e)||null;return He.resolve(n)}addMatchingKeys(t,e,n){return this.Br.Rr(e,n),He.resolve()}removeMatchingKeys(t,e,n){this.Br.mr(e,n);const r=this.persistence.referenceDelegate,i=[];return r&&e.forEach(e=>{i.push(r.markPotentiallyOrphaned(t,e))}),He.waitFor(i)}removeMatchingKeysForTargetId(t,e){return this.Br.gr(e),He.resolve()}getMatchingKeysForTargetId(t,e){const n=this.Br.yr(e);return He.resolve(n)}containsKey(t,e){return He.resolve(this.Br.containsKey(e))}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ec{constructor(t,e){this.qr={},this.overlays={},this.Qr=new cn(0),this.Kr=!1,this.Kr=!0,this.$r=new Ha,this.referenceDelegate=t(this),this.Ur=new tc(this),this.indexManager=new oa,this.remoteDocumentCache=new Xa(t=>this.referenceDelegate.Wr(t)),this.serializer=new Io(e),this.Gr=new $a(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.Kr=!1,Promise.resolve()}get started(){return this.Kr}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(t){return this.indexManager}getDocumentOverlayCache(t){let e=this.overlays[t.toKey()];return e||(e=new Qa,this.overlays[t.toKey()]=e),e}getMutationQueue(t,e){let n=this.qr[t.toKey()];return n||(n=new Ya(e,this.referenceDelegate),this.qr[t.toKey()]=n),n}getGlobalsCache(){return this.$r}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Gr}runTransaction(t,e,n){ae("MemoryPersistence","Starting transaction:",t);const r=new nc(this.Qr.next());return this.referenceDelegate.zr(),n(r).next(t=>this.referenceDelegate.jr(r).next(()=>t)).toPromise().then(t=>(r.raiseOnCommittedEvent(),t))}Hr(t,e){return He.or(Object.values(this.qr).map(n=>()=>n.containsKey(t,e)))}}class nc extends $e{constructor(t){super(),this.currentSequenceNumber=t}}class rc{constructor(t){this.persistence=t,this.Jr=new Wa,this.Yr=null}static Zr(t){return new rc(t)}get Xr(){if(this.Yr)return this.Yr;throw he()}addReference(t,e,n){return this.Jr.addReference(n,e),this.Xr.delete(n.toString()),He.resolve()}removeReference(t,e,n){return this.Jr.removeReference(n,e),this.Xr.add(n.toString()),He.resolve()}markPotentiallyOrphaned(t,e){return this.Xr.add(e.toString()),He.resolve()}removeTarget(t,e){this.Jr.gr(e.targetId).forEach(t=>this.Xr.add(t.toString()));const n=this.persistence.getTargetCache();return n.getMatchingKeysForTargetId(t,e.targetId).next(t=>{t.forEach(t=>this.Xr.add(t.toString()))}).next(()=>n.removeTargetData(t,e))}zr(){this.Yr=new Set}jr(t){const e=this.persistence.getRemoteDocumentCache().newChangeBuffer();return He.forEach(this.Xr,n=>{const r=Pe.fromPath(n);return this.ei(t,r).next(t=>{t||e.removeEntry(r,ke.min())})}).next(()=>(this.Yr=null,e.apply(t)))}updateLimboDocument(t,e){return this.ei(t,e).next(t=>{t?this.Xr.delete(e.toString()):this.Xr.add(e.toString())})}Wr(t){return 0}ei(t,e){return He.or([()=>He.resolve(this.Jr.containsKey(e)),()=>this.persistence.getTargetCache().containsKey(t,e),()=>this.persistence.Hr(t,e)])}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ic{constructor(t){this.serializer=t}O(t,e,n,r){const i=new We("createOrUpgrade",e);n<1&&r>=1&&(t.createObjectStore("owner"),function(t){t.createObjectStore("mutationQueues",{keyPath:"userId"}),t.createObjectStore("mutations",{keyPath:"batchId",autoIncrement:!0}).createIndex("userMutationsIndex",gn,{unique:!0}),t.createObjectStore("documentMutations")}(t),sc(t),function(t){t.createObjectStore("remoteDocuments")}(t));let s=He.resolve();return n<3&&r>=3&&(0!==n&&(function(t){t.deleteObjectStore("targetDocuments"),t.deleteObjectStore("targets"),t.deleteObjectStore("targetGlobal")}(t),sc(t)),s=s.next(()=>function(t){const e=t.store("targetGlobal"),n={highestTargetId:0,highestListenSequenceNumber:0,lastRemoteSnapshotVersion:ke.min().toTimestamp(),targetCount:0};return e.put("targetGlobalKey",n)}(i))),n<4&&r>=4&&(0!==n&&(s=s.next(()=>function(t,e){return e.store("mutations").U().next(n=>{t.deleteObjectStore("mutations"),t.createObjectStore("mutations",{keyPath:"batchId",autoIncrement:!0}).createIndex("userMutationsIndex",gn,{unique:!0});const r=e.store("mutations"),i=n.map(t=>r.put(t));return He.waitFor(i)})}(t,i))),s=s.next(()=>{!function(t){t.createObjectStore("clientMetadata",{keyPath:"clientId"})}(t)})),n<5&&r>=5&&(s=s.next(()=>this.ni(i))),n<6&&r>=6&&(s=s.next(()=>(function(t){t.createObjectStore("remoteDocumentGlobal")}(t),this.ri(i)))),n<7&&r>=7&&(s=s.next(()=>this.ii(i))),n<8&&r>=8&&(s=s.next(()=>this.si(t,i))),n<9&&r>=9&&(s=s.next(()=>{!function(t){t.objectStoreNames.contains("remoteDocumentChanges")&&t.deleteObjectStore("remoteDocumentChanges")}(t)})),n<10&&r>=10&&(s=s.next(()=>this.oi(i))),n<11&&r>=11&&(s=s.next(()=>{!function(t){t.createObjectStore("bundles",{keyPath:"bundleId"})}(t),function(t){t.createObjectStore("namedQueries",{keyPath:"name"})}(t)})),n<12&&r>=12&&(s=s.next(()=>{!function(t){const e=t.createObjectStore("documentOverlays",{keyPath:Nn});e.createIndex("collectionPathOverlayIndex",kn,{unique:!1}),e.createIndex("collectionGroupOverlayIndex",Rn,{unique:!1})}(t)})),n<13&&r>=13&&(s=s.next(()=>function(t){const e=t.createObjectStore("remoteDocumentsV14",{keyPath:wn});e.createIndex("documentKeyIndex",bn),e.createIndex("collectionGroupIndex",In)}(t)).next(()=>this._i(t,i)).next(()=>t.deleteObjectStore("remoteDocuments"))),n<14&&r>=14&&(s=s.next(()=>this.ai(t,i))),n<15&&r>=15&&(s=s.next(()=>function(t){t.createObjectStore("indexConfiguration",{keyPath:"indexId",autoIncrement:!0}).createIndex("collectionGroupIndex","collectionGroup",{unique:!1}),t.createObjectStore("indexState",{keyPath:xn}).createIndex("sequenceNumberIndex",Cn,{unique:!1}),t.createObjectStore("indexEntries",{keyPath:Dn}).createIndex("documentKeyIndex",An,{unique:!1})}(t))),n<16&&r>=16&&(s=s.next(()=>{e.objectStore("indexState").clear()}).next(()=>{e.objectStore("indexEntries").clear()})),n<17&&r>=17&&(s=s.next(()=>{!function(t){t.createObjectStore("globals",{keyPath:"name"})}(t)})),s}ri(t){let e=0;return t.store("remoteDocuments").J((t,n)=>{e+=va(n)}).next(()=>{const n={byteSize:e};return t.store("remoteDocumentGlobal").put("remoteDocumentGlobalKey",n)})}ni(t){const e=t.store("mutationQueues"),n=t.store("mutations");return e.U().next(e=>He.forEach(e,e=>{const r=IDBKeyRange.bound([e.userId,-1],[e.userId,e.lastAcknowledgedBatchId]);return n.U("userMutationsIndex",r).next(n=>He.forEach(n,n=>{de(n.userId===e.userId);const r=Co(this.serializer,n);return ya(t,e.userId,r).next(()=>{})}))}))}ii(t){const e=t.store("targetDocuments"),n=t.store("remoteDocuments");return t.store("targetGlobal").get("targetGlobalKey").next(t=>{const r=[];return n.J((n,i)=>{const s=new Oe(n),o=[0,hn(s)];r.push(e.get(o).next(n=>{return n?He.resolve():(r=s,e.put({targetId:0,path:hn(r),sequenceNumber:t.highestListenSequenceNumber}));var r}))}).next(()=>He.waitFor(r))})}si(t,e){t.createObjectStore("collectionParents",{keyPath:Sn});const n=e.store("collectionParents"),r=new aa,i=t=>{if(r.add(t)){const e=t.lastSegment(),r=t.popLast();return n.put({collectionId:e,parent:hn(r)})}};return e.store("remoteDocuments").J({H:!0},(t,e)=>{const n=new Oe(t);return i(n.popLast())}).next(()=>e.store("documentMutations").J({H:!0},([t,e,n],r)=>{const s=mn(e);return i(s.popLast())}))}oi(t){const e=t.store("targets");return e.J((t,n)=>{const r=Do(n),i=Ao(this.serializer,r);return e.put(i)})}_i(t,e){const n=e.store("remoteDocuments"),r=[];return n.J((t,n)=>{const i=e.store("remoteDocumentsV14"),s=(a=n,a.document?new Pe(Oe.fromString(a.document.name).popFirst(5)):a.noDocument?Pe.fromSegments(a.noDocument.path):a.unknownDocument?Pe.fromSegments(a.unknownDocument.path):he()).path.toArray(),o={prefixPath:s.slice(0,s.length-2),collectionGroup:s[s.length-2],documentId:s[s.length-1],readTime:n.readTime||[0,0],unknownDocument:n.unknownDocument,noDocument:n.noDocument,document:n.document,hasCommittedMutations:!!n.hasCommittedMutations};var a;r.push(i.put(o))}).next(()=>He.waitFor(r))}ai(t,e){const n=e.store("mutations"),r=Va(this.serializer),i=new ec(rc.Zr,this.serializer.ct);return n.U().next(t=>{const n=new Map;return t.forEach(t=>{var e;let r=null!==(e=n.get(t.userId))&&void 0!==e?e:Bi();Co(this.serializer,t).keys().forEach(t=>r=r.add(t)),n.set(t.userId,r)}),He.forEach(n,(t,n)=>{const s=new re(n),o=Vo.lt(this.serializer,s),a=i.getIndexManager(s),c=wa.lt(s,this.serializer,a,i.referenceDelegate);return new Ga(r,c,o,a).recalculateAndSaveOverlaysForDocumentKeys(new Un(e,cn.oe),t).next()})})}}function sc(t){t.createObjectStore("targetDocuments",{keyPath:En}).createIndex("documentTargetsIndex",Tn,{unique:!0}),t.createObjectStore("targets",{keyPath:"targetId"}).createIndex("queryTargetsIndex",_n,{unique:!0}),t.createObjectStore("targetGlobal")}const oc="Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.";class ac{constructor(t,e,n,r,i,s,o,a,c,u,l=17){if(this.allowTabSynchronization=t,this.persistenceKey=e,this.clientId=n,this.ui=i,this.window=s,this.document=o,this.ci=c,this.li=u,this.hi=l,this.Qr=null,this.Kr=!1,this.isPrimary=!1,this.networkEnabled=!0,this.Pi=null,this.inForeground=!1,this.Ii=null,this.Ti=null,this.Ei=Number.NEGATIVE_INFINITY,this.di=t=>Promise.resolve(),!ac.D())throw new ge(me.UNIMPLEMENTED,"This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.");this.referenceDelegate=new Oa(this,r),this.Ai=e+"main",this.serializer=new Io(a),this.Ri=new Je(this.Ai,this.hi,new ic(this.serializer)),this.$r=new Bo,this.Ur=new Sa(this.referenceDelegate,this.serializer),this.remoteDocumentCache=Va(this.serializer),this.Gr=new Mo,this.window&&this.window.localStorage?this.Vi=this.window.localStorage:(this.Vi=null,!1===u&&ce("IndexedDbPersistence","LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page."))}start(){return this.mi().then(()=>{if(!this.isPrimary&&!this.allowTabSynchronization)throw new ge(me.FAILED_PRECONDITION,oc);return this.fi(),this.gi(),this.pi(),this.runTransaction("getHighestListenSequenceNumber","readonly",t=>this.Ur.getHighestSequenceNumber(t))}).then(t=>{this.Qr=new cn(t,this.ci)}).then(()=>{this.Kr=!0}).catch(t=>(this.Ri&&this.Ri.close(),Promise.reject(t)))}yi(t){return this.di=async e=>{if(this.started)return t(e)},t(this.isPrimary)}setDatabaseDeletedListener(t){this.Ri.L(async e=>{null===e.newVersion&&await t()})}setNetworkEnabled(t){this.networkEnabled!==t&&(this.networkEnabled=t,this.ui.enqueueAndForget(async()=>{this.started&&await this.mi()}))}mi(){return this.runTransaction("updateClientMetadataAndTryBecomePrimary","readwrite",t=>uc(t).put({clientId:this.clientId,updateTimeMs:Date.now(),networkEnabled:this.networkEnabled,inForeground:this.inForeground}).next(()=>{if(this.isPrimary)return this.wi(t).next(t=>{t||(this.isPrimary=!1,this.ui.enqueueRetryable(()=>this.di(!1)))})}).next(()=>this.Si(t)).next(e=>this.isPrimary&&!e?this.bi(t).next(()=>!1):!!e&&this.Di(t).next(()=>!0))).catch(t=>{if(tn(t))return ae("IndexedDbPersistence","Failed to extend owner lease: ",t),this.isPrimary;if(!this.allowTabSynchronization)throw t;return ae("IndexedDbPersistence","Releasing owner lease after error during lease refresh",t),!1}).then(t=>{this.isPrimary!==t&&this.ui.enqueueRetryable(()=>this.di(t)),this.isPrimary=t})}wi(t){return cc(t).get("owner").next(t=>He.resolve(this.vi(t)))}Ci(t){return uc(t).delete(this.clientId)}async Fi(){if(this.isPrimary&&!this.Mi(this.Ei,18e5)){this.Ei=Date.now();const t=await this.runTransaction("maybeGarbageCollectMultiClientState","readwrite-primary",t=>{const e=qn(t,"clientMetadata");return e.U().next(t=>{const n=this.xi(t,18e5),r=t.filter(t=>-1===n.indexOf(t));return He.forEach(r,t=>e.delete(t.clientId)).next(()=>r)})}).catch(()=>[]);if(this.Vi)for(const e of t)this.Vi.removeItem(this.Oi(e.clientId))}}pi(){this.Ti=this.ui.enqueueAfterDelay("client_metadata_refresh",4e3,()=>this.mi().then(()=>this.Fi()).then(()=>this.pi()))}vi(t){return!!t&&t.ownerId===this.clientId}Si(t){return this.li?He.resolve(!0):cc(t).get("owner").next(e=>{if(null!==e&&this.Mi(e.leaseTimestampMs,5e3)&&!this.Ni(e.ownerId)){if(this.vi(e)&&this.networkEnabled)return!0;if(!this.vi(e)){if(!e.allowTabSynchronization)throw new ge(me.FAILED_PRECONDITION,oc);return!1}}return!(!this.networkEnabled||!this.inForeground)||uc(t).U().next(t=>void 0===this.xi(t,5e3).find(t=>{if(this.clientId!==t.clientId){const e=!this.networkEnabled&&t.networkEnabled,n=!this.inForeground&&t.inForeground,r=this.networkEnabled===t.networkEnabled;if(e||n&&r)return!0}return!1}))}).next(t=>(this.isPrimary!==t&&ae("IndexedDbPersistence",`Client ${t?"is":"is not"} eligible for a primary lease.`),t))}async shutdown(){this.Kr=!1,this.Li(),this.Ti&&(this.Ti.cancel(),this.Ti=null),this.Bi(),this.ki(),await this.Ri.runTransaction("shutdown","readwrite",["owner","clientMetadata"],t=>{const e=new Un(t,cn.oe);return this.bi(e).next(()=>this.Ci(e))}),this.Ri.close(),this.qi()}xi(t,e){return t.filter(t=>this.Mi(t.updateTimeMs,e)&&!this.Ni(t.clientId))}Qi(){return this.runTransaction("getActiveClients","readonly",t=>uc(t).U().next(t=>this.xi(t,18e5).map(t=>t.clientId)))}get started(){return this.Kr}getGlobalsCache(){return this.$r}getMutationQueue(t,e){return wa.lt(t,this.serializer,e,this.referenceDelegate)}getTargetCache(){return this.Ur}getRemoteDocumentCache(){return this.remoteDocumentCache}getIndexManager(t){return new ua(t,this.serializer.ct.databaseId)}getDocumentOverlayCache(t){return Vo.lt(this.serializer,t)}getBundleCache(){return this.Gr}runTransaction(t,e,n){ae("IndexedDbPersistence","Starting transaction:",t);const r="readonly"===e?"readonly":"readwrite",i=17===(s=this.hi)?Bn:16===s?Fn:15===s?Vn:14===s?Pn:13===s?Ln:12===s?Mn:11===s?On:void he();var s;let o;return this.Ri.runTransaction(t,r,i,r=>(o=new Un(r,this.Qr?this.Qr.next():cn.oe),"readwrite-primary"===e?this.wi(o).next(t=>!!t||this.Si(o)).next(e=>{if(!e)throw ce(`Failed to obtain primary lease for action '${t}'.`),this.isPrimary=!1,this.ui.enqueueRetryable(()=>this.di(!1)),new ge(me.FAILED_PRECONDITION,Ge);return n(o)}).next(t=>this.Di(o).next(()=>t)):this.Ki(o).next(()=>n(o)))).then(t=>(o.raiseOnCommittedEvent(),t))}Ki(t){return cc(t).get("owner").next(t=>{if(null!==t&&this.Mi(t.leaseTimestampMs,5e3)&&!this.Ni(t.ownerId)&&!this.vi(t)&&!(this.li||this.allowTabSynchronization&&t.allowTabSynchronization))throw new ge(me.FAILED_PRECONDITION,oc)})}Di(t){const e={ownerId:this.clientId,allowTabSynchronization:this.allowTabSynchronization,leaseTimestampMs:Date.now()};return cc(t).put("owner",e)}static D(){return Je.D()}bi(t){const e=cc(t);return e.get("owner").next(t=>this.vi(t)?(ae("IndexedDbPersistence","Releasing primary lease."),e.delete("owner")):He.resolve())}Mi(t,e){const n=Date.now();return!(t<n-e||t>n&&(ce(`Detected an update time that is in the future: ${t} > ${n}`),1))}fi(){null!==this.document&&"function"==typeof this.document.addEventListener&&(this.Ii=()=>{this.ui.enqueueAndForget(()=>(this.inForeground="visible"===this.document.visibilityState,this.mi()))},this.document.addEventListener("visibilitychange",this.Ii),this.inForeground="visible"===this.document.visibilityState)}Bi(){this.Ii&&(this.document.removeEventListener("visibilitychange",this.Ii),this.Ii=null)}gi(){var t;"function"==typeof(null===(t=this.window)||void 0===t?void 0:t.addEventListener)&&(this.Pi=()=>{this.Li();const t=/(?:Version|Mobile)\/1[456]/;h()&&(navigator.appVersion.match(t)||navigator.userAgent.match(t))&&this.ui.enterRestrictedMode(!0),this.ui.enqueueAndForget(()=>this.shutdown())},this.window.addEventListener("pagehide",this.Pi))}ki(){this.Pi&&(this.window.removeEventListener("pagehide",this.Pi),this.Pi=null)}Ni(t){var e;try{const n=null!==(null===(e=this.Vi)||void 0===e?void 0:e.getItem(this.Oi(t)));return ae("IndexedDbPersistence",`Client '${t}' ${n?"is":"is not"} zombied in LocalStorage`),n}catch(n){return ce("IndexedDbPersistence","Failed to get zombied client id.",n),!1}}Li(){if(this.Vi)try{this.Vi.setItem(this.Oi(this.clientId),String(Date.now()))}catch(t){ce("Failed to set zombie client id.",t)}}qi(){if(this.Vi)try{this.Vi.removeItem(this.Oi(this.clientId))}catch(t){}}Oi(t){return`firestore_zombie_${this.persistenceKey}_${t}`}}function cc(t){return qn(t,"owner")}function uc(t){return qn(t,"clientMetadata")}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class lc{constructor(t,e,n,r){this.targetId=t,this.fromCache=e,this.$i=n,this.Ui=r}static Wi(t,e){let n=Bi(),r=Bi();for(const i of e.docChanges)switch(i.type){case 0:n=n.add(i.doc.key);break;case 1:r=r.add(i.doc.key)}return new lc(t,e.fromCache,n,r)}}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hc{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(t){this._documentReadCount+=t}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dc{constructor(){this.Gi=!1,this.zi=!1,this.ji=100,this.Hi=h()?8:Ye(l())>0?6:4}initialize(t,e){this.Ji=t,this.indexManager=e,this.Gi=!0}getDocumentsMatchingQuery(t,e,n,r){const i={result:null};return this.Yi(t,e).next(t=>{i.result=t}).next(()=>{if(!i.result)return this.Zi(t,e,r,n).next(t=>{i.result=t})}).next(()=>{if(i.result)return;const n=new hc;return this.Xi(t,e,n).next(r=>{if(i.result=r,this.zi)return this.es(t,e,n,r.size)})}).next(()=>i.result)}es(t,e,n,r){return n.documentReadCount<this.ji?(oe()<=E.DEBUG&&ae("QueryEngine","SDK will not create cache indexes for query:",Ti(e),"since it only creates cache indexes for collection contains","more than or equal to",this.ji,"documents"),He.resolve()):(oe()<=E.DEBUG&&ae("QueryEngine","Query:",Ti(e),"scans",n.documentReadCount,"local documents and returns",r,"documents as results."),n.documentReadCount>this.Hi*r?(oe()<=E.DEBUG&&ae("QueryEngine","The SDK decides to create cache indexes for query:",Ti(e),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(t,wi(e))):He.resolve())}Yi(t,e){if(pi(e))return He.resolve(null);let n=wi(e);return this.indexManager.getIndexType(t,n).next(r=>0===r?null:(null!==e.limit&&1===r&&(e=Ii(e,null,"F"),n=wi(e)),this.indexManager.getDocumentsMatchingTarget(t,n).next(r=>{const i=Bi(...r);return this.Ji.getDocuments(t,i).next(r=>this.indexManager.getMinOffset(t,n).next(n=>{const s=this.ts(e,r);return this.ns(e,s,i,n.readTime)?this.Yi(t,Ii(e,null,"F")):this.rs(t,s,e,n)}))})))}Zi(t,e,n,r){return pi(e)||r.isEqual(ke.min())?He.resolve(null):this.Ji.getDocuments(t,n).next(i=>{const s=this.ts(e,i);return this.ns(e,s,n,r)?He.resolve(null):(oe()<=E.DEBUG&&ae("QueryEngine","Re-using previous result from %s to execute query: %s",r.toString(),Ti(e)),this.rs(t,s,e,function(t,e){const n=t.toTimestamp().seconds,r=t.toTimestamp().nanoseconds+1,i=ke.fromTimestamp(1e9===r?new Ne(n+1,0):new Ne(n,r));return new ze(i,Pe.empty(),e)}(r,-1)).next(t=>t))})}ts(t,e){let n=new Hn(xi(t));return e.forEach((e,r)=>{Si(t,r)&&(n=n.add(r))}),n}ns(t,e,n,r){if(null===t.limit)return!1;if(n.size!==e.size)return!0;const i="F"===t.limitType?e.last():e.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(r)>0)}Xi(t,e,n){return oe()<=E.DEBUG&&ae("QueryEngine","Using full collection scan to execute query:",Ti(e)),this.Ji.getDocumentsMatchingQuery(t,e,ze.min(),n)}rs(t,e,n,r){return this.Ji.getDocumentsMatchingQuery(t,n,r).next(t=>(e.forEach(e=>{t=t.insert(e.key,e)}),t))}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fc{constructor(t,e,n,r){this.persistence=t,this.ss=e,this.serializer=r,this.os=new Gn(Ce),this._s=new Di(t=>ci(t),ui),this.us=new Map,this.cs=t.getRemoteDocumentCache(),this.Ur=t.getTargetCache(),this.Gr=t.getBundleCache(),this.ls(n)}ls(t){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(t),this.indexManager=this.persistence.getIndexManager(t),this.mutationQueue=this.persistence.getMutationQueue(t,this.indexManager),this.localDocuments=new Ga(this.cs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.cs.setIndexManager(this.indexManager),this.ss.initialize(this.localDocuments,this.indexManager)}collectGarbage(t){return this.persistence.runTransaction("Collect garbage","readwrite-primary",e=>t.collect(e,this.os))}}function mc(t,e,n,r){return new fc(t,e,n,r)}async function gc(t,e){const n=fe(t);return await n.persistence.runTransaction("Handle user change","readonly",t=>{let r;return n.mutationQueue.getAllMutationBatches(t).next(i=>(r=i,n.ls(e),n.mutationQueue.getAllMutationBatches(t))).next(e=>{const i=[],s=[];let o=Bi();for(const t of r){i.push(t.batchId);for(const e of t.mutations)o=o.add(e.key)}for(const t of e){s.push(t.batchId);for(const e of t.mutations)o=o.add(e.key)}return n.localDocuments.getDocuments(t,o).next(t=>({hs:t,removedBatchIds:i,addedBatchIds:s}))})})}function pc(t){const e=fe(t);return e.persistence.runTransaction("Get last remote snapshot version","readonly",t=>e.Ur.getLastRemoteSnapshotVersion(t))}function yc(t,e){const n=fe(t),r=e.snapshotVersion;let i=n.os;return n.persistence.runTransaction("Apply remote event","readwrite-primary",t=>{const s=n.cs.newChangeBuffer({trackRemovals:!0});i=n.os;const o=[];e.targetChanges.forEach((s,a)=>{const c=i.get(a);if(!c)return;o.push(n.Ur.removeMatchingKeys(t,s.removedDocuments,a).next(()=>n.Ur.addMatchingKeys(t,s.addedDocuments,a)));let u=c.withSequenceNumber(t.currentSequenceNumber);var l,h,d;null!==e.targetMismatches.get(a)?u=u.withResumeToken(Zn.EMPTY_BYTE_STRING,ke.min()).withLastLimboFreeSnapshotVersion(ke.min()):s.resumeToken.approximateByteSize()>0&&(u=u.withResumeToken(s.resumeToken,r)),i=i.insert(a,u),h=u,d=s,(0===(l=c).resumeToken.approximateByteSize()||h.snapshotVersion.toMicroseconds()-l.snapshotVersion.toMicroseconds()>=3e8||d.addedDocuments.size+d.modifiedDocuments.size+d.removedDocuments.size>0)&&o.push(n.Ur.updateTargetData(t,u))});let a=Ni(),c=Bi();if(e.documentUpdates.forEach(r=>{e.resolvedLimboDocuments.has(r)&&o.push(n.persistence.referenceDelegate.updateLimboDocument(t,r))}),o.push(function(t,e,n){let r=Bi(),i=Bi();return n.forEach(t=>r=r.add(t)),e.getEntries(t,r).next(t=>{let r=Ni();return n.forEach((n,s)=>{const o=t.get(n);s.isFoundDocument()!==o.isFoundDocument()&&(i=i.add(n)),s.isNoDocument()&&s.version.isEqual(ke.min())?(e.removeEntry(n,s.readTime),r=r.insert(n,s)):!o.isValidDocument()||s.version.compareTo(o.version)>0||0===s.version.compareTo(o.version)&&o.hasPendingWrites?(e.addEntry(s),r=r.insert(n,s)):ae("LocalStore","Ignoring outdated watch update for ",n,". Current version:",o.version," Watch version:",s.version)}),{Ps:r,Is:i}})}(t,s,e.documentUpdates).next(t=>{a=t.Ps,c=t.Is})),!r.isEqual(ke.min())){const e=n.Ur.getLastRemoteSnapshotVersion(t).next(e=>n.Ur.setTargetsMetadata(t,t.currentSequenceNumber,r));o.push(e)}return He.waitFor(o).next(()=>s.apply(t)).next(()=>n.localDocuments.getLocalViewOfDocuments(t,a,c)).next(()=>a)}).then(t=>(n.os=i,t))}function vc(t,e){const n=fe(t);return n.persistence.runTransaction("Get next mutation batch","readonly",t=>(void 0===e&&(e=-1),n.mutationQueue.getNextMutationBatchAfterBatchId(t,e)))}async function wc(t,e,n){const r=fe(t),i=r.os.get(e),s=n?"readwrite":"readwrite-primary";try{n||await r.persistence.runTransaction("Release target",s,t=>r.persistence.referenceDelegate.removeTarget(t,i))}catch(o){if(!tn(o))throw o;ae("LocalStore",`Failed to update sequence numbers for target ${e}: ${o}`)}r.os=r.os.remove(e),r._s.delete(i.target)}function bc(t,e,n){const r=fe(t);let i=ke.min(),s=Bi();return r.persistence.runTransaction("Execute query","readwrite",t=>function(t,e,n){const r=fe(t),i=r._s.get(n);return void 0!==i?He.resolve(r.os.get(i)):r.Ur.getTargetData(e,n)}(r,t,wi(e)).next(e=>{if(e)return i=e.lastLimboFreeSnapshotVersion,r.Ur.getMatchingKeysForTargetId(t,e.targetId).next(t=>{s=t})}).next(()=>r.ss.getDocumentsMatchingQuery(t,e,n?i:ke.min(),n?s:Bi())).next(t=>(function(t,e,n){let r=t.us.get(e)||ke.min();n.forEach((t,e)=>{e.readTime.compareTo(r)>0&&(r=e.readTime)}),t.us.set(e,r)}(r,function(t){return t.collectionGroup||(t.path.length%2==1?t.path.lastSegment():t.path.get(t.path.length-2))}(e),t),{documents:t,Ts:s})))}class Ic{constructor(){this.activeTargetIds=Ui}fs(t){this.activeTargetIds=this.activeTargetIds.add(t)}gs(t){this.activeTargetIds=this.activeTargetIds.delete(t)}Vs(){const t={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(t)}}class _c{constructor(){this.so=new Ic,this.oo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(t){}updateMutationState(t,e,n){}addLocalQueryTarget(t,e=!0){return e&&this.so.fs(t),this.oo[t]||"not-current"}updateQueryState(t,e,n){this.oo[t]=e}removeLocalQueryTarget(t){this.so.gs(t)}isLocalQueryTarget(t){return this.so.activeTargetIds.has(t)}clearQueryState(t){delete this.oo[t]}getAllActiveQueryTargets(){return this.so.activeTargetIds}isActiveQueryTarget(t){return this.so.activeTargetIds.has(t)}start(){return this.so=new Ic,Promise.resolve()}handleUserChange(t,e,n){}setOnlineState(t){}shutdown(){}writeSequenceNumber(t){}notifyBundleLoaded(t){}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ec{_o(t){}shutdown(){}}
/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Tc{constructor(){this.ao=()=>this.uo(),this.co=()=>this.lo(),this.ho=[],this.Po()}_o(t){this.ho.push(t)}shutdown(){window.removeEventListener("online",this.ao),window.removeEventListener("offline",this.co)}Po(){window.addEventListener("online",this.ao),window.addEventListener("offline",this.co)}uo(){ae("ConnectivityMonitor","Network connectivity changed: AVAILABLE");for(const t of this.ho)t(0)}lo(){ae("ConnectivityMonitor","Network connectivity changed: UNAVAILABLE");for(const t of this.ho)t(1)}static D(){return"undefined"!=typeof window&&void 0!==window.addEventListener&&void 0!==window.removeEventListener}}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Sc=null;function xc(){return null===Sc?Sc=268435456+Math.round(2147483648*Math.random()):Sc++,"0x"+Sc.toString(16)
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}const Cc={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dc{constructor(t){this.Io=t.Io,this.To=t.To}Eo(t){this.Ao=t}Ro(t){this.Vo=t}mo(t){this.fo=t}onMessage(t){this.po=t}close(){this.To()}send(t){this.Io(t)}yo(){this.Ao()}wo(){this.Vo()}So(t){this.fo(t)}bo(t){this.po(t)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ac="WebChannelConnection";class Nc extends class{constructor(t){this.databaseInfo=t,this.databaseId=t.databaseId;const e=t.ssl?"https":"http",n=encodeURIComponent(this.databaseId.projectId),r=encodeURIComponent(this.databaseId.database);this.Do=e+"://"+t.host,this.vo=`projects/${n}/databases/${r}`,this.Co="(default)"===this.databaseId.database?`project_id=${n}`:`project_id=${n}&database_id=${r}`}get Fo(){return!1}Mo(t,e,n,r,i){const s=xc(),o=this.xo(t,e.toUriEncodedString());ae("RestConnection",`Sending RPC '${t}' ${s}:`,o,n);const a={"google-cloud-resource-prefix":this.vo,"x-goog-request-params":this.Co};return this.Oo(a,r,i),this.No(t,o,a,n).then(e=>(ae("RestConnection",`Received RPC '${t}' ${s}: `,e),e),e=>{throw ue("RestConnection",`RPC '${t}' ${s} failed with error: `,e,"url: ",o,"request:",n),e})}Lo(t,e,n,r,i,s){return this.Mo(t,e,n,r,i)}Oo(t,e,n){t["X-Goog-Api-Client"]="gl-js/ fire/"+ie,t["Content-Type"]="text/plain",this.databaseInfo.appId&&(t["X-Firebase-GMPID"]=this.databaseInfo.appId),e&&e.headers.forEach((e,n)=>t[n]=e),n&&n.headers.forEach((e,n)=>t[n]=e)}xo(t,e){const n=Cc[t];return`${this.Do}/v1/${e}:${n}`}terminate(){}}{constructor(t){super(t),this.forceLongPolling=t.forceLongPolling,this.autoDetectLongPolling=t.autoDetectLongPolling,this.useFetchStreams=t.useFetchStreams,this.longPollingOptions=t.longPollingOptions}No(t,e,n,r){const i=xc();return new Promise((s,o)=>{const a=new Qt;a.setWithCredentials(!0),a.listenOnce(Wt.COMPLETE,()=>{try{switch(a.getLastErrorCode()){case Jt.NO_ERROR:const e=a.getResponseJson();ae(Ac,`XHR for RPC '${t}' ${i} received:`,JSON.stringify(e)),s(e);break;case Jt.TIMEOUT:ae(Ac,`RPC '${t}' ${i} timed out`),o(new ge(me.DEADLINE_EXCEEDED,"Request time out"));break;case Jt.HTTP_ERROR:const n=a.getStatus();if(ae(Ac,`RPC '${t}' ${i} failed with status:`,n,"response text:",a.getResponseText()),n>0){let t=a.getResponseJson();Array.isArray(t)&&(t=t[0]);const e=null==t?void 0:t.error;if(e&&e.status&&e.message){const t=function(t){const e=t.toLowerCase().replace(/_/g,"-");return Object.values(me).indexOf(e)>=0?e:me.UNKNOWN}(e.status);o(new ge(t,e.message))}else o(new ge(me.UNKNOWN,"Server responded with status "+a.getStatus()))}else o(new ge(me.UNAVAILABLE,"Connection failed."));break;default:he()}}finally{ae(Ac,`RPC '${t}' ${i} completed.`)}});const c=JSON.stringify(r);ae(Ac,`RPC '${t}' ${i} sending request:`,r),a.send(e,"POST",c,n,15)})}Bo(t,e,n){const r=xc(),i=[this.Do,"/","google.firestore.v1.Firestore","/",t,"/channel"],s=te(),o=Zt(),a={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},c=this.longPollingOptions.timeoutSeconds;void 0!==c&&(a.longPollingTimeout=Math.round(1e3*c)),this.useFetchStreams&&(a.useFetchStreams=!0),this.Oo(a.initMessageHeaders,e,n),a.encodeInitMessageHeaders=!0;const u=i.join("");ae(Ac,`Creating RPC '${t}' stream ${r}: ${u}`,a);const l=s.createWebChannel(u,a);let h=!1,d=!1;const f=new Dc({Io:e=>{d?ae(Ac,`Not sending because RPC '${t}' stream ${r} is closed:`,e):(h||(ae(Ac,`Opening RPC '${t}' stream ${r} transport.`),l.open(),h=!0),ae(Ac,`RPC '${t}' stream ${r} sending:`,e),l.send(e))},To:()=>l.close()}),m=(t,e,n)=>{t.listen(e,t=>{try{n(t)}catch(e){setTimeout(()=>{throw e},0)}})};return m(l,Ht.EventType.OPEN,()=>{d||(ae(Ac,`RPC '${t}' stream ${r} transport opened.`),f.yo())}),m(l,Ht.EventType.CLOSE,()=>{d||(d=!0,ae(Ac,`RPC '${t}' stream ${r} transport closed`),f.So())}),m(l,Ht.EventType.ERROR,e=>{d||(d=!0,ue(Ac,`RPC '${t}' stream ${r} transport errored:`,e),f.So(new ge(me.UNAVAILABLE,"The operation could not be completed")))}),m(l,Ht.EventType.MESSAGE,e=>{var n;if(!d){const i=e.data[0];de(!!i);const s=i,o=s.error||(null===(n=s[0])||void 0===n?void 0:n.error);if(o){ae(Ac,`RPC '${t}' stream ${r} received error:`,o);const e=o.status;let n=function(t){const e=Es[t];if(void 0!==e)return Ss(e)}(e),i=o.message;void 0===n&&(n=me.INTERNAL,i="Unknown error status: "+e+" with message "+o.message),d=!0,f.So(new ge(n,i)),l.close()}else ae(Ac,`RPC '${t}' stream ${r} received:`,i),f.bo(i)}}),m(o,Xt.STAT_EVENT,e=>{e.stat===Yt.PROXY?ae(Ac,`RPC '${t}' stream ${r} detected buffering proxy`):e.stat===Yt.NOPROXY&&ae(Ac,`RPC '${t}' stream ${r} detected no buffering proxy`)}),setTimeout(()=>{f.wo()},0),f}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function kc(){return"undefined"!=typeof document?document:null}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Rc(t){return new zs(t,!0)}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oc{constructor(t,e,n=1e3,r=1.5,i=6e4){this.ui=t,this.timerId=e,this.ko=n,this.qo=r,this.Qo=i,this.Ko=0,this.$o=null,this.Uo=Date.now(),this.reset()}reset(){this.Ko=0}Wo(){this.Ko=this.Qo}Go(t){this.cancel();const e=Math.floor(this.Ko+this.zo()),n=Math.max(0,Date.now()-this.Uo),r=Math.max(0,e-n);r>0&&ae("ExponentialBackoff",`Backing off for ${r} ms (base delay: ${this.Ko} ms, delay with jitter: ${e} ms, last attempt: ${n} ms ago)`),this.$o=this.ui.enqueueAfterDelay(this.timerId,r,()=>(this.Uo=Date.now(),t())),this.Ko*=this.qo,this.Ko<this.ko&&(this.Ko=this.ko),this.Ko>this.Qo&&(this.Ko=this.Qo)}jo(){null!==this.$o&&(this.$o.skipDelay(),this.$o=null)}cancel(){null!==this.$o&&(this.$o.cancel(),this.$o=null)}zo(){return(Math.random()-.5)*this.Ko}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mc{constructor(t,e,n,r,i,s,o,a){this.ui=t,this.Ho=n,this.Jo=r,this.connection=i,this.authCredentialsProvider=s,this.appCheckCredentialsProvider=o,this.listener=a,this.state=0,this.Yo=0,this.Zo=null,this.Xo=null,this.stream=null,this.e_=0,this.t_=new Oc(t,e)}n_(){return 1===this.state||5===this.state||this.r_()}r_(){return 2===this.state||3===this.state}start(){this.e_=0,4!==this.state?this.auth():this.i_()}async stop(){this.n_()&&await this.close(0)}s_(){this.state=0,this.t_.reset()}o_(){this.r_()&&null===this.Zo&&(this.Zo=this.ui.enqueueAfterDelay(this.Ho,6e4,()=>this.__()))}a_(t){this.u_(),this.stream.send(t)}async __(){if(this.r_())return this.close(0)}u_(){this.Zo&&(this.Zo.cancel(),this.Zo=null)}c_(){this.Xo&&(this.Xo.cancel(),this.Xo=null)}async close(t,e){this.u_(),this.c_(),this.t_.cancel(),this.Yo++,4!==t?this.t_.reset():e&&e.code===me.RESOURCE_EXHAUSTED?(ce(e.toString()),ce("Using maximum backoff delay to prevent overloading the backend."),this.t_.Wo()):e&&e.code===me.UNAUTHENTICATED&&3!==this.state&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),null!==this.stream&&(this.l_(),this.stream.close(),this.stream=null),this.state=t,await this.listener.mo(e)}l_(){}auth(){this.state=1;const t=this.h_(this.Yo),e=this.Yo;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([t,n])=>{this.Yo===e&&this.P_(t,n)},e=>{t(()=>{const t=new ge(me.UNKNOWN,"Fetching auth token failed: "+e.message);return this.I_(t)})})}P_(t,e){const n=this.h_(this.Yo);this.stream=this.T_(t,e),this.stream.Eo(()=>{n(()=>this.listener.Eo())}),this.stream.Ro(()=>{n(()=>(this.state=2,this.Xo=this.ui.enqueueAfterDelay(this.Jo,1e4,()=>(this.r_()&&(this.state=3),Promise.resolve())),this.listener.Ro()))}),this.stream.mo(t=>{n(()=>this.I_(t))}),this.stream.onMessage(t=>{n(()=>1==++this.e_?this.E_(t):this.onNext(t))})}i_(){this.state=5,this.t_.Go(async()=>{this.state=0,this.start()})}I_(t){return ae("PersistentStream",`close with error: ${t}`),this.stream=null,this.close(4,t)}h_(t){return e=>{this.ui.enqueueAndForget(()=>this.Yo===t?e():(ae("PersistentStream","stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class Lc extends Mc{constructor(t,e,n,r,i,s){super(t,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",e,n,r,s),this.serializer=i}T_(t,e){return this.connection.Bo("Listen",t,e)}E_(t){return this.onNext(t)}onNext(t){this.t_.reset();const e=function(t,e){let n;if("targetChange"in e){e.targetChange;const i="NO_CHANGE"===(r=e.targetChange.targetChangeType||"NO_CHANGE")?0:"ADD"===r?1:"REMOVE"===r?2:"CURRENT"===r?3:"RESET"===r?4:he(),s=e.targetChange.targetIds||[],o=function(t,e){return t.useProto3Json?(de(void 0===e||"string"==typeof e),Zn.fromBase64String(e||"")):(de(void 0===e||e instanceof Buffer||e instanceof Uint8Array),Zn.fromUint8Array(e||new Uint8Array))}(t,e.targetChange.resumeToken),a=e.targetChange.cause,c=a&&function(t){const e=void 0===t.code?me.UNKNOWN:Ss(t.code);return new ge(e,t.message||"")}(a);n=new Ls(i,s,o,c||null)}else if("documentChange"in e){e.documentChange;const r=e.documentChange;r.document,r.document.name,r.document.updateTime;const i=Zs(t,r.document.name),s=Hs(r.document.updateTime),o=r.document.createTime?Hs(r.document.createTime):ke.min(),a=new Or({mapValue:{fields:r.document.fields}}),c=Lr.newFoundDocument(i,s,o,a),u=r.targetIds||[],l=r.removedTargetIds||[];n=new Os(u,l,c.key,c)}else if("documentDelete"in e){e.documentDelete;const r=e.documentDelete;r.document;const i=Zs(t,r.document),s=r.readTime?Hs(r.readTime):ke.min(),o=Lr.newNoDocument(i,s),a=r.removedTargetIds||[];n=new Os([],a,o.key,o)}else if("documentRemove"in e){e.documentRemove;const r=e.documentRemove;r.document;const i=Zs(t,r.document),s=r.removedTargetIds||[];n=new Os([],s,i,null)}else{if(!("filter"in e))return he();{e.filter;const t=e.filter;t.targetId;const{count:r=0,unchangedNames:i}=t,s=new _s(r,i),o=t.targetId;n=new Ms(o,s)}}var r;return n}(this.serializer,t),n=function(t){if(!("targetChange"in t))return ke.min();const e=t.targetChange;return e.targetIds&&e.targetIds.length?ke.min():e.readTime?Hs(e.readTime):ke.min()}(t);return this.listener.d_(e,n)}A_(t){const e={};e.database=no(this.serializer),e.addTarget=function(t,e){let n;const r=e.target;if(n=li(r)?{documents:ao(t,r)}:{query:co(t,r)._t},n.targetId=e.targetId,e.resumeToken.approximateByteSize()>0){n.resumeToken=$s(t,e.resumeToken);const r=Ks(t,e.expectedCount);null!==r&&(n.expectedCount=r)}else if(e.snapshotVersion.compareTo(ke.min())>0){n.readTime=Gs(t,e.snapshotVersion.toTimestamp());const r=Ks(t,e.expectedCount);null!==r&&(n.expectedCount=r)}return n}(this.serializer,t);const n=function(t,e){const n=function(t){switch(t){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return he()}}(e.purpose);return null==n?null:{"goog-listen-tags":n}}(this.serializer,t);n&&(e.labels=n),this.a_(e)}R_(t){const e={};e.database=no(this.serializer),e.removeTarget=t,this.a_(e)}}class Pc extends Mc{constructor(t,e,n,r,i,s){super(t,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",e,n,r,s),this.serializer=i}get V_(){return this.e_>0}start(){this.lastStreamToken=void 0,super.start()}l_(){this.V_&&this.m_([])}T_(t,e){return this.connection.Bo("Write",t,e)}E_(t){return de(!!t.streamToken),this.lastStreamToken=t.streamToken,de(!t.writeResults||0===t.writeResults.length),this.listener.f_()}onNext(t){de(!!t.streamToken),this.lastStreamToken=t.streamToken,this.t_.reset();const e=function(t,e){return t&&t.length>0?(de(void 0!==e),t.map(t=>function(t,e){let n=t.updateTime?Hs(t.updateTime):Hs(e);return n.isEqual(ke.min())&&(n=Hs(e)),new rs(n,t.transformResults||[])}(t,e))):[]}(t.writeResults,t.commitTime),n=Hs(t.commitTime);return this.listener.g_(n,e)}p_(){const t={};t.database=no(this.serializer),this.a_(t)}m_(t){const e={streamToken:this.lastStreamToken,writes:t.map(t=>so(this.serializer,t))};this.a_(e)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vc extends class{}{constructor(t,e,n,r){super(),this.authCredentials=t,this.appCheckCredentials=e,this.connection=n,this.serializer=r,this.y_=!1}w_(){if(this.y_)throw new ge(me.FAILED_PRECONDITION,"The client has already been terminated.")}Mo(t,e,n,r){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([i,s])=>this.connection.Mo(t,Js(e,n),r,i,s)).catch(t=>{throw"FirebaseError"===t.name?(t.code===me.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),t):new ge(me.UNKNOWN,t.toString())})}Lo(t,e,n,r,i){return this.w_(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([s,o])=>this.connection.Lo(t,Js(e,n),r,s,o,i)).catch(t=>{throw"FirebaseError"===t.name?(t.code===me.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),t):new ge(me.UNKNOWN,t.toString())})}terminate(){this.y_=!0,this.connection.terminate()}}class Fc{constructor(t,e){this.asyncQueue=t,this.onlineStateHandler=e,this.state="Unknown",this.S_=0,this.b_=null,this.D_=!0}v_(){0===this.S_&&(this.C_("Unknown"),this.b_=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this.b_=null,this.F_("Backend didn't respond within 10 seconds."),this.C_("Offline"),Promise.resolve())))}M_(t){"Online"===this.state?this.C_("Unknown"):(this.S_++,this.S_>=1&&(this.x_(),this.F_(`Connection failed 1 times. Most recent error: ${t.toString()}`),this.C_("Offline")))}set(t){this.x_(),this.S_=0,"Online"===t&&(this.D_=!1),this.C_(t)}C_(t){t!==this.state&&(this.state=t,this.onlineStateHandler(t))}F_(t){const e=`Could not reach Cloud Firestore backend. ${t}\nThis typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.D_?(ce(e),this.D_=!1):ae("OnlineStateTracker",e)}x_(){null!==this.b_&&(this.b_.cancel(),this.b_=null)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bc{constructor(t,e,n,r,i){this.localStore=t,this.datastore=e,this.asyncQueue=n,this.remoteSyncer={},this.O_=[],this.N_=new Map,this.L_=new Set,this.B_=[],this.k_=i,this.k_._o(t=>{n.enqueueAndForget(async()=>{Hc(this)&&(ae("RemoteStore","Restarting streams for network reachability change."),await async function(t){const e=fe(t);e.L_.add(4),await qc(e),e.q_.set("Unknown"),e.L_.delete(4),await Uc(e)}(this))})}),this.q_=new Fc(n,r)}}async function Uc(t){if(Hc(t))for(const e of t.B_)await e(!0)}async function qc(t){for(const e of t.B_)await e(!1)}function jc(t,e){const n=fe(t);n.N_.has(e.targetId)||(n.N_.set(e.targetId,e),Qc(n)?$c(n):du(n).r_()&&Kc(n,e))}function zc(t,e){const n=fe(t),r=du(n);n.N_.delete(e),r.r_()&&Gc(n,e),0===n.N_.size&&(r.r_()?r.o_():Hc(n)&&n.q_.set("Unknown"))}function Kc(t,e){if(t.Q_.xe(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(ke.min())>0){const n=t.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(n)}du(t).A_(e)}function Gc(t,e){t.Q_.xe(e),du(t).R_(e)}function $c(t){t.Q_=new Vs({getRemoteKeysForTarget:e=>t.remoteSyncer.getRemoteKeysForTarget(e),ot:e=>t.N_.get(e)||null,tt:()=>t.datastore.serializer.databaseId}),du(t).start(),t.q_.v_()}function Qc(t){return Hc(t)&&!du(t).n_()&&t.N_.size>0}function Hc(t){return 0===fe(t).L_.size}function Wc(t){t.Q_=void 0}async function Jc(t){t.q_.set("Online")}async function Yc(t){t.N_.forEach((e,n)=>{Kc(t,e)})}async function Xc(t,e){Wc(t),Qc(t)?(t.q_.M_(e),$c(t)):t.q_.set("Unknown")}async function Zc(t,e,n){if(t.q_.set("Online"),e instanceof Ls&&2===e.state&&e.cause)try{await async function(t,e){const n=e.cause;for(const r of e.targetIds)t.N_.has(r)&&(await t.remoteSyncer.rejectListen(r,n),t.N_.delete(r),t.Q_.removeTarget(r))}(t,e)}catch(r){ae("RemoteStore","Failed to remove targets %s: %s ",e.targetIds.join(","),r),await tu(t,r)}else if(e instanceof Os?t.Q_.Ke(e):e instanceof Ms?t.Q_.He(e):t.Q_.We(e),!n.isEqual(ke.min()))try{const e=await pc(t.localStore);n.compareTo(e)>=0&&await function(t,e){const n=t.Q_.rt(e);return n.targetChanges.forEach((n,r)=>{if(n.resumeToken.approximateByteSize()>0){const i=t.N_.get(r);i&&t.N_.set(r,i.withResumeToken(n.resumeToken,e))}}),n.targetMismatches.forEach((e,n)=>{const r=t.N_.get(e);if(!r)return;t.N_.set(e,r.withResumeToken(Zn.EMPTY_BYTE_STRING,r.snapshotVersion)),Gc(t,e);const i=new bo(r.target,e,n,r.sequenceNumber);Kc(t,i)}),t.remoteSyncer.applyRemoteEvent(n)}(t,n)}catch(i){ae("RemoteStore","Failed to raise snapshot:",i),await tu(t,i)}}async function tu(t,e,n){if(!tn(e))throw e;t.L_.add(1),await qc(t),t.q_.set("Offline"),n||(n=()=>pc(t.localStore)),t.asyncQueue.enqueueRetryable(async()=>{ae("RemoteStore","Retrying IndexedDB access"),await n(),t.L_.delete(1),await Uc(t)})}function eu(t,e){return e().catch(n=>tu(t,n,e))}async function nu(t){const e=fe(t),n=fu(e);let r=e.O_.length>0?e.O_[e.O_.length-1].batchId:-1;for(;ru(e);)try{const t=await vc(e.localStore,r);if(null===t){0===e.O_.length&&n.o_();break}r=t.batchId,iu(e,t)}catch(i){await tu(e,i)}su(e)&&ou(e)}function ru(t){return Hc(t)&&t.O_.length<10}function iu(t,e){t.O_.push(e);const n=fu(t);n.r_()&&n.V_&&n.m_(e.mutations)}function su(t){return Hc(t)&&!fu(t).n_()&&t.O_.length>0}function ou(t){fu(t).start()}async function au(t){fu(t).p_()}async function cu(t){const e=fu(t);for(const n of t.O_)e.m_(n.mutations)}async function uu(t,e,n){const r=t.O_.shift(),i=bs.from(r,e,n);await eu(t,()=>t.remoteSyncer.applySuccessfulWrite(i)),await nu(t)}async function lu(t,e){e&&fu(t).V_&&await async function(t,e){if(function(t){switch(t){default:return he();case me.CANCELLED:case me.UNKNOWN:case me.DEADLINE_EXCEEDED:case me.RESOURCE_EXHAUSTED:case me.INTERNAL:case me.UNAVAILABLE:case me.UNAUTHENTICATED:return!1;case me.INVALID_ARGUMENT:case me.NOT_FOUND:case me.ALREADY_EXISTS:case me.PERMISSION_DENIED:case me.FAILED_PRECONDITION:case me.ABORTED:case me.OUT_OF_RANGE:case me.UNIMPLEMENTED:case me.DATA_LOSS:return!0}}(n=e.code)&&n!==me.ABORTED){const n=t.O_.shift();fu(t).s_(),await eu(t,()=>t.remoteSyncer.rejectFailedWrite(n.batchId,e)),await nu(t)}var n}(t,e),su(t)&&ou(t)}async function hu(t,e){const n=fe(t);n.asyncQueue.verifyOperationInProgress(),ae("RemoteStore","RemoteStore received new credentials");const r=Hc(n);n.L_.add(3),await qc(n),r&&n.q_.set("Unknown"),await n.remoteSyncer.handleCredentialChange(e),n.L_.delete(3),await Uc(n)}function du(t){return t.K_||(t.K_=function(t,e,n){const r=fe(t);return r.w_(),new Lc(e,r.connection,r.authCredentials,r.appCheckCredentials,r.serializer,n)}(t.datastore,t.asyncQueue,{Eo:Jc.bind(null,t),Ro:Yc.bind(null,t),mo:Xc.bind(null,t),d_:Zc.bind(null,t)}),t.B_.push(async e=>{e?(t.K_.s_(),Qc(t)?$c(t):t.q_.set("Unknown")):(await t.K_.stop(),Wc(t))})),t.K_}function fu(t){return t.U_||(t.U_=function(t,e,n){const r=fe(t);return r.w_(),new Pc(e,r.connection,r.authCredentials,r.appCheckCredentials,r.serializer,n)}(t.datastore,t.asyncQueue,{Eo:()=>Promise.resolve(),Ro:au.bind(null,t),mo:lu.bind(null,t),f_:cu.bind(null,t),g_:uu.bind(null,t)}),t.B_.push(async e=>{e?(t.U_.s_(),await nu(t)):(await t.U_.stop(),t.O_.length>0&&(ae("RemoteStore",`Stopping write stream with ${t.O_.length} pending writes`),t.O_=[]))})),t.U_
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}class mu{constructor(t,e,n,r,i){this.asyncQueue=t,this.timerId=e,this.targetTimeMs=n,this.op=r,this.removalCallback=i,this.deferred=new pe,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(t=>{})}get promise(){return this.deferred.promise}static createAndSchedule(t,e,n,r,i){const s=Date.now()+n,o=new mu(t,e,s,r,i);return o.start(n),o}start(t){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),t)}skipDelay(){return this.handleDelayElapsed()}cancel(t){null!==this.timerHandle&&(this.clearTimeout(),this.deferred.reject(new ge(me.CANCELLED,"Operation cancelled"+(t?": "+t:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>null!==this.timerHandle?(this.clearTimeout(),this.op().then(t=>this.deferred.resolve(t))):Promise.resolve())}clearTimeout(){null!==this.timerHandle&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function gu(t,e){if(ce("AsyncQueue",`${e}: ${t}`),tn(t))return new ge(me.UNAVAILABLE,`${e}: ${t}`);throw t}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pu{constructor(t){this.comparator=t?(e,n)=>t(e,n)||Pe.comparator(e.key,n.key):(t,e)=>Pe.comparator(t.key,e.key),this.keyedMap=Ri(),this.sortedSet=new Gn(this.comparator)}static emptySet(t){return new pu(t.comparator)}has(t){return null!=this.keyedMap.get(t)}get(t){return this.keyedMap.get(t)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(t){const e=this.keyedMap.get(t);return e?this.sortedSet.indexOf(e):-1}get size(){return this.sortedSet.size}forEach(t){this.sortedSet.inorderTraversal((e,n)=>(t(e),!1))}add(t){const e=this.delete(t.key);return e.copy(e.keyedMap.insert(t.key,t),e.sortedSet.insert(t,null))}delete(t){const e=this.get(t);return e?this.copy(this.keyedMap.remove(t),this.sortedSet.remove(e)):this}isEqual(t){if(!(t instanceof pu))return!1;if(this.size!==t.size)return!1;const e=this.sortedSet.getIterator(),n=t.sortedSet.getIterator();for(;e.hasNext();){const t=e.getNext().key,r=n.getNext().key;if(!t.isEqual(r))return!1}return!0}toString(){const t=[];return this.forEach(e=>{t.push(e.toString())}),0===t.length?"DocumentSet ()":"DocumentSet (\n  "+t.join("  \n")+"\n)"}copy(t,e){const n=new pu;return n.comparator=this.comparator,n.keyedMap=t,n.sortedSet=e,n}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yu{constructor(){this.W_=new Gn(Pe.comparator)}track(t){const e=t.doc.key,n=this.W_.get(e);n?0!==t.type&&3===n.type?this.W_=this.W_.insert(e,t):3===t.type&&1!==n.type?this.W_=this.W_.insert(e,{type:n.type,doc:t.doc}):2===t.type&&2===n.type?this.W_=this.W_.insert(e,{type:2,doc:t.doc}):2===t.type&&0===n.type?this.W_=this.W_.insert(e,{type:0,doc:t.doc}):1===t.type&&0===n.type?this.W_=this.W_.remove(e):1===t.type&&2===n.type?this.W_=this.W_.insert(e,{type:1,doc:n.doc}):0===t.type&&1===n.type?this.W_=this.W_.insert(e,{type:2,doc:t.doc}):he():this.W_=this.W_.insert(e,t)}G_(){const t=[];return this.W_.inorderTraversal((e,n)=>{t.push(n)}),t}}class vu{constructor(t,e,n,r,i,s,o,a,c){this.query=t,this.docs=e,this.oldDocs=n,this.docChanges=r,this.mutatedKeys=i,this.fromCache=s,this.syncStateChanged=o,this.excludesMetadataChanges=a,this.hasCachedResults=c}static fromInitialDocuments(t,e,n,r,i){const s=[];return e.forEach(t=>{s.push({type:0,doc:t})}),new vu(t,e,pu.emptySet(e),s,n,r,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(t){if(!(this.fromCache===t.fromCache&&this.hasCachedResults===t.hasCachedResults&&this.syncStateChanged===t.syncStateChanged&&this.mutatedKeys.isEqual(t.mutatedKeys)&&_i(this.query,t.query)&&this.docs.isEqual(t.docs)&&this.oldDocs.isEqual(t.oldDocs)))return!1;const e=this.docChanges,n=t.docChanges;if(e.length!==n.length)return!1;for(let r=0;r<e.length;r++)if(e[r].type!==n[r].type||!e[r].doc.isEqual(n[r].doc))return!1;return!0}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wu{constructor(){this.z_=void 0,this.j_=[]}H_(){return this.j_.some(t=>t.J_())}}class bu{constructor(){this.queries=Iu(),this.onlineState="Unknown",this.Y_=new Set}terminate(){!function(t,e){const n=fe(t),r=n.queries;n.queries=Iu(),r.forEach((t,n)=>{for(const r of n.j_)r.onError(e)})}(this,new ge(me.ABORTED,"Firestore shutting down"))}}function Iu(){return new Di(t=>Ei(t),_i)}async function _u(t,e){const n=fe(t);let r=3;const i=e.query;let s=n.queries.get(i);s?!s.H_()&&e.J_()&&(r=2):(s=new wu,r=e.J_()?0:1);try{switch(r){case 0:s.z_=await n.onListen(i,!0);break;case 1:s.z_=await n.onListen(i,!1);break;case 2:await n.onFirstRemoteStoreListen(i)}}catch(o){const t=gu(o,`Initialization of query '${Ti(e.query)}' failed`);return void e.onError(t)}n.queries.set(i,s),s.j_.push(e),e.Z_(n.onlineState),s.z_&&e.X_(s.z_)&&xu(n)}async function Eu(t,e){const n=fe(t),r=e.query;let i=3;const s=n.queries.get(r);if(s){const t=s.j_.indexOf(e);t>=0&&(s.j_.splice(t,1),0===s.j_.length?i=e.J_()?0:1:!s.H_()&&e.J_()&&(i=2))}switch(i){case 0:return n.queries.delete(r),n.onUnlisten(r,!0);case 1:return n.queries.delete(r),n.onUnlisten(r,!1);case 2:return n.onLastRemoteStoreUnlisten(r);default:return}}function Tu(t,e){const n=fe(t);let r=!1;for(const i of e){const t=i.query,e=n.queries.get(t);if(e){for(const t of e.j_)t.X_(i)&&(r=!0);e.z_=i}}r&&xu(n)}function Su(t,e,n){const r=fe(t),i=r.queries.get(e);if(i)for(const s of i.j_)s.onError(n);r.queries.delete(e)}function xu(t){t.Y_.forEach(t=>{t.next()})}var Cu,Du;(Du=Cu||(Cu={})).ea="default",Du.Cache="cache";class Au{constructor(t,e,n){this.query=t,this.ta=e,this.na=!1,this.ra=null,this.onlineState="Unknown",this.options=n||{}}X_(t){if(!this.options.includeMetadataChanges){const e=[];for(const n of t.docChanges)3!==n.type&&e.push(n);t=new vu(t.query,t.docs,t.oldDocs,e,t.mutatedKeys,t.fromCache,t.syncStateChanged,!0,t.hasCachedResults)}let e=!1;return this.na?this.ia(t)&&(this.ta.next(t),e=!0):this.sa(t,this.onlineState)&&(this.oa(t),e=!0),this.ra=t,e}onError(t){this.ta.error(t)}Z_(t){this.onlineState=t;let e=!1;return this.ra&&!this.na&&this.sa(this.ra,t)&&(this.oa(this.ra),e=!0),e}sa(t,e){if(!t.fromCache)return!0;if(!this.J_())return!0;const n="Offline"!==e;return(!this.options._a||!n)&&(!t.docs.isEmpty()||t.hasCachedResults||"Offline"===e)}ia(t){if(t.docChanges.length>0)return!0;const e=this.ra&&this.ra.hasPendingWrites!==t.hasPendingWrites;return!(!t.syncStateChanged&&!e)&&!0===this.options.includeMetadataChanges}oa(t){t=vu.fromInitialDocuments(t.query,t.docs,t.mutatedKeys,t.fromCache,t.hasCachedResults),this.na=!0,this.ta.next(t)}J_(){return this.options.source!==Cu.Cache}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nu{constructor(t){this.key=t}}class ku{constructor(t){this.key=t}}class Ru{constructor(t,e){this.query=t,this.Ta=e,this.Ea=null,this.hasCachedResults=!1,this.current=!1,this.da=Bi(),this.mutatedKeys=Bi(),this.Aa=xi(t),this.Ra=new pu(this.Aa)}get Va(){return this.Ta}ma(t,e){const n=e?e.fa:new yu,r=e?e.Ra:this.Ra;let i=e?e.mutatedKeys:this.mutatedKeys,s=r,o=!1;const a="F"===this.query.limitType&&r.size===this.query.limit?r.last():null,c="L"===this.query.limitType&&r.size===this.query.limit?r.first():null;if(t.inorderTraversal((t,e)=>{const u=r.get(t),l=Si(this.query,e)?e:null,h=!!u&&this.mutatedKeys.has(u.key),d=!!l&&(l.hasLocalMutations||this.mutatedKeys.has(l.key)&&l.hasCommittedMutations);let f=!1;u&&l?u.data.isEqual(l.data)?h!==d&&(n.track({type:3,doc:l}),f=!0):this.ga(u,l)||(n.track({type:2,doc:l}),f=!0,(a&&this.Aa(l,a)>0||c&&this.Aa(l,c)<0)&&(o=!0)):!u&&l?(n.track({type:0,doc:l}),f=!0):u&&!l&&(n.track({type:1,doc:u}),f=!0,(a||c)&&(o=!0)),f&&(l?(s=s.add(l),i=d?i.add(t):i.delete(t)):(s=s.delete(t),i=i.delete(t)))}),null!==this.query.limit)for(;s.size>this.query.limit;){const t="F"===this.query.limitType?s.last():s.first();s=s.delete(t.key),i=i.delete(t.key),n.track({type:1,doc:t})}return{Ra:s,fa:n,ns:o,mutatedKeys:i}}ga(t,e){return t.hasLocalMutations&&e.hasCommittedMutations&&!e.hasLocalMutations}applyChanges(t,e,n,r){const i=this.Ra;this.Ra=t.Ra,this.mutatedKeys=t.mutatedKeys;const s=t.fa.G_();s.sort((t,e)=>function(t,e){const n=t=>{switch(t){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return he()}};return n(t)-n(e)}(t.type,e.type)||this.Aa(t.doc,e.doc)),this.pa(n),r=null!=r&&r;const o=e&&!r?this.ya():[],a=0===this.da.size&&this.current&&!r?1:0,c=a!==this.Ea;return this.Ea=a,0!==s.length||c?{snapshot:new vu(this.query,t.Ra,i,s,t.mutatedKeys,0===a,c,!1,!!n&&n.resumeToken.approximateByteSize()>0),wa:o}:{wa:o}}Z_(t){return this.current&&"Offline"===t?(this.current=!1,this.applyChanges({Ra:this.Ra,fa:new yu,mutatedKeys:this.mutatedKeys,ns:!1},!1)):{wa:[]}}Sa(t){return!this.Ta.has(t)&&!!this.Ra.has(t)&&!this.Ra.get(t).hasLocalMutations}pa(t){t&&(t.addedDocuments.forEach(t=>this.Ta=this.Ta.add(t)),t.modifiedDocuments.forEach(t=>{}),t.removedDocuments.forEach(t=>this.Ta=this.Ta.delete(t)),this.current=t.current)}ya(){if(!this.current)return[];const t=this.da;this.da=Bi(),this.Ra.forEach(t=>{this.Sa(t.key)&&(this.da=this.da.add(t.key))});const e=[];return t.forEach(t=>{this.da.has(t)||e.push(new ku(t))}),this.da.forEach(n=>{t.has(n)||e.push(new Nu(n))}),e}ba(t){this.Ta=t.Ts,this.da=Bi();const e=this.ma(t.documents);return this.applyChanges(e,!0)}Da(){return vu.fromInitialDocuments(this.query,this.Ra,this.mutatedKeys,0===this.Ea,this.hasCachedResults)}}class Ou{constructor(t,e,n){this.query=t,this.targetId=e,this.view=n}}class Mu{constructor(t){this.key=t,this.va=!1}}class Lu{constructor(t,e,n,r,i,s){this.localStore=t,this.remoteStore=e,this.eventManager=n,this.sharedClientState=r,this.currentUser=i,this.maxConcurrentLimboResolutions=s,this.Ca={},this.Fa=new Di(t=>Ei(t),_i),this.Ma=new Map,this.xa=new Set,this.Oa=new Gn(Pe.comparator),this.Na=new Map,this.La=new Wa,this.Ba={},this.ka=new Map,this.qa=Ta.kn(),this.onlineState="Unknown",this.Qa=void 0}get isPrimaryClient(){return!0===this.Qa}}async function Pu(t,e,n=!0){const r=nl(t);let i;const s=r.Fa.get(e);return s?(r.sharedClientState.addLocalQueryTarget(s.targetId),i=s.view.Da()):i=await Fu(r,e,n,!0),i}async function Vu(t,e){const n=nl(t);await Fu(n,e,!0,!1)}async function Fu(t,e,n,r){const i=await function(t,e){const n=fe(t);return n.persistence.runTransaction("Allocate target","readwrite",t=>{let r;return n.Ur.getTargetData(t,e).next(i=>i?(r=i,He.resolve(r)):n.Ur.allocateTargetId(t).next(i=>(r=new bo(e,i,"TargetPurposeListen",t.currentSequenceNumber),n.Ur.addTargetData(t,r).next(()=>r))))}).then(t=>{const r=n.os.get(t.targetId);return(null===r||t.snapshotVersion.compareTo(r.snapshotVersion)>0)&&(n.os=n.os.insert(t.targetId,t),n._s.set(e,t.targetId)),t})}(t.localStore,wi(e)),s=i.targetId,o=t.sharedClientState.addLocalQueryTarget(s,n);let a;return r&&(a=await async function(t,e,n,r,i){t.Ka=(e,n,r)=>async function(t,e,n,r){let i=e.view.ma(n);i.ns&&(i=await bc(t.localStore,e.query,!1).then(({documents:t})=>e.view.ma(t,i)));const s=r&&r.targetChanges.get(e.targetId),o=r&&null!=r.targetMismatches.get(e.targetId),a=e.view.applyChanges(i,t.isPrimaryClient,s,o);return Ju(t,e.targetId,a.wa),a.snapshot}(t,e,n,r);const s=await bc(t.localStore,e,!0),o=new Ru(e,s.Ts),a=o.ma(s.documents),c=Rs.createSynthesizedTargetChangeForCurrentChange(n,r&&"Offline"!==t.onlineState,i),u=o.applyChanges(a,t.isPrimaryClient,c);Ju(t,n,u.wa);const l=new Ou(e,n,o);return t.Fa.set(e,l),t.Ma.has(n)?t.Ma.get(n).push(e):t.Ma.set(n,[e]),u.snapshot}(t,e,s,"current"===o,i.resumeToken)),t.isPrimaryClient&&n&&jc(t.remoteStore,i),a}async function Bu(t,e,n){const r=fe(t),i=r.Fa.get(e),s=r.Ma.get(i.targetId);if(s.length>1)return r.Ma.set(i.targetId,s.filter(t=>!_i(t,e))),void r.Fa.delete(e);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(i.targetId),r.sharedClientState.isActiveQueryTarget(i.targetId)||await wc(r.localStore,i.targetId,!1).then(()=>{r.sharedClientState.clearQueryState(i.targetId),n&&zc(r.remoteStore,i.targetId),Hu(r,i.targetId)}).catch(Qe)):(Hu(r,i.targetId),await wc(r.localStore,i.targetId,!0))}async function Uu(t,e){const n=fe(t),r=n.Fa.get(e),i=n.Ma.get(r.targetId);n.isPrimaryClient&&1===i.length&&(n.sharedClientState.removeLocalQueryTarget(r.targetId),zc(n.remoteStore,r.targetId))}async function qu(t,e){const n=fe(t);try{const t=await yc(n.localStore,e);e.targetChanges.forEach((t,e)=>{const r=n.Na.get(e);r&&(de(t.addedDocuments.size+t.modifiedDocuments.size+t.removedDocuments.size<=1),t.addedDocuments.size>0?r.va=!0:t.modifiedDocuments.size>0?de(r.va):t.removedDocuments.size>0&&(de(r.va),r.va=!1))}),await Zu(n,t,e)}catch(r){await Qe(r)}}function ju(t,e,n){const r=fe(t);if(r.isPrimaryClient&&0===n||!r.isPrimaryClient&&1===n){const t=[];r.Fa.forEach((n,r)=>{const i=r.view.Z_(e);i.snapshot&&t.push(i.snapshot)}),function(t,e){const n=fe(t);n.onlineState=e;let r=!1;n.queries.forEach((t,n)=>{for(const i of n.j_)i.Z_(e)&&(r=!0)}),r&&xu(n)}(r.eventManager,e),t.length&&r.Ca.d_(t),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function zu(t,e,n){const r=fe(t);r.sharedClientState.updateQueryState(e,"rejected",n);const i=r.Na.get(e),s=i&&i.key;if(s){let t=new Gn(Pe.comparator);t=t.insert(s,Lr.newNoDocument(s,ke.min()));const n=Bi().add(s),i=new ks(ke.min(),new Map,new Gn(Ce),t,n);await qu(r,i),r.Oa=r.Oa.remove(s),r.Na.delete(e),Xu(r)}else await wc(r.localStore,e,!1).then(()=>Hu(r,e,n)).catch(Qe)}async function Ku(t,e){const n=fe(t),r=e.batch.batchId;try{const t=await function(t,e){const n=fe(t);return n.persistence.runTransaction("Acknowledge batch","readwrite-primary",t=>{const r=e.batch.keys(),i=n.cs.newChangeBuffer({trackRemovals:!0});return function(t,e,n,r){const i=n.batch,s=i.keys();let o=He.resolve();return s.forEach(t=>{o=o.next(()=>r.getEntry(e,t)).next(e=>{const s=n.docVersions.get(t);de(null!==s),e.version.compareTo(s)<0&&(i.applyToRemoteDocument(e,n),e.isValidDocument()&&(e.setReadTime(n.commitVersion),r.addEntry(e)))})}),o.next(()=>t.mutationQueue.removeMutationBatch(e,i))}(n,t,e,i).next(()=>i.apply(t)).next(()=>n.mutationQueue.performConsistencyCheck(t)).next(()=>n.documentOverlayCache.removeOverlaysForBatchId(t,r,e.batch.batchId)).next(()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(t,function(t){let e=Bi();for(let n=0;n<t.mutationResults.length;++n)t.mutationResults[n].transformResults.length>0&&(e=e.add(t.batch.mutations[n].key));return e}(e))).next(()=>n.localDocuments.getDocuments(t,r))})}(n.localStore,e);Qu(n,r,null),$u(n,r),n.sharedClientState.updateMutationState(r,"acknowledged"),await Zu(n,t)}catch(i){await Qe(i)}}async function Gu(t,e,n){const r=fe(t);try{const t=await function(t,e){const n=fe(t);return n.persistence.runTransaction("Reject batch","readwrite-primary",t=>{let r;return n.mutationQueue.lookupMutationBatch(t,e).next(e=>(de(null!==e),r=e.keys(),n.mutationQueue.removeMutationBatch(t,e))).next(()=>n.mutationQueue.performConsistencyCheck(t)).next(()=>n.documentOverlayCache.removeOverlaysForBatchId(t,r,e)).next(()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(t,r)).next(()=>n.localDocuments.getDocuments(t,r))})}(r.localStore,e);Qu(r,e,n),$u(r,e),r.sharedClientState.updateMutationState(e,"rejected",n),await Zu(r,t)}catch(i){await Qe(i)}}function $u(t,e){(t.ka.get(e)||[]).forEach(t=>{t.resolve()}),t.ka.delete(e)}function Qu(t,e,n){const r=fe(t);let i=r.Ba[r.currentUser.toKey()];if(i){const t=i.get(e);t&&(n?t.reject(n):t.resolve(),i=i.remove(e)),r.Ba[r.currentUser.toKey()]=i}}function Hu(t,e,n=null){t.sharedClientState.removeLocalQueryTarget(e);for(const r of t.Ma.get(e))t.Fa.delete(r),n&&t.Ca.$a(r,n);t.Ma.delete(e),t.isPrimaryClient&&t.La.gr(e).forEach(e=>{t.La.containsKey(e)||Wu(t,e)})}function Wu(t,e){t.xa.delete(e.path.canonicalString());const n=t.Oa.get(e);null!==n&&(zc(t.remoteStore,n),t.Oa=t.Oa.remove(e),t.Na.delete(n),Xu(t))}function Ju(t,e,n){for(const r of n)r instanceof Nu?(t.La.addReference(r.key,e),Yu(t,r)):r instanceof ku?(ae("SyncEngine","Document no longer in limbo: "+r.key),t.La.removeReference(r.key,e),t.La.containsKey(r.key)||Wu(t,r.key)):he()}function Yu(t,e){const n=e.key,r=n.path.canonicalString();t.Oa.get(n)||t.xa.has(r)||(ae("SyncEngine","New document in limbo: "+n),t.xa.add(r),Xu(t))}function Xu(t){for(;t.xa.size>0&&t.Oa.size<t.maxConcurrentLimboResolutions;){const e=t.xa.values().next().value;t.xa.delete(e);const n=new Pe(Oe.fromString(e)),r=t.qa.next();t.Na.set(r,new Mu(n)),t.Oa=t.Oa.insert(n,r),jc(t.remoteStore,new bo(wi(gi(n.path)),r,"TargetPurposeLimboResolution",cn.oe))}}async function Zu(t,e,n){const r=fe(t),i=[],s=[],o=[];r.Fa.isEmpty()||(r.Fa.forEach((t,a)=>{o.push(r.Ka(a,e,n).then(t=>{var e;if((t||n)&&r.isPrimaryClient){const i=t?!t.fromCache:null===(e=null==n?void 0:n.targetChanges.get(a.targetId))||void 0===e?void 0:e.current;r.sharedClientState.updateQueryState(a.targetId,i?"current":"not-current")}if(t){i.push(t);const e=lc.Wi(a.targetId,t);s.push(e)}}))}),await Promise.all(o),r.Ca.d_(i),await async function(t,e){const n=fe(t);try{await n.persistence.runTransaction("notifyLocalViewChanges","readwrite",t=>He.forEach(e,e=>He.forEach(e.$i,r=>n.persistence.referenceDelegate.addReference(t,e.targetId,r)).next(()=>He.forEach(e.Ui,r=>n.persistence.referenceDelegate.removeReference(t,e.targetId,r)))))}catch(r){if(!tn(r))throw r;ae("LocalStore","Failed to update sequence numbers: "+r)}for(const i of e){const t=i.targetId;if(!i.fromCache){const e=n.os.get(t),r=e.snapshotVersion,i=e.withLastLimboFreeSnapshotVersion(r);n.os=n.os.insert(t,i)}}}(r.localStore,s))}async function tl(t,e){const n=fe(t);if(!n.currentUser.isEqual(e)){ae("SyncEngine","User change. New user:",e.toKey());const t=await gc(n.localStore,e);n.currentUser=e,i="'waitForPendingWrites' promise is rejected due to a user change.",(r=n).ka.forEach(t=>{t.forEach(t=>{t.reject(new ge(me.CANCELLED,i))})}),r.ka.clear(),n.sharedClientState.handleUserChange(e,t.removedBatchIds,t.addedBatchIds),await Zu(n,t.hs)}var r,i}function el(t,e){const n=fe(t),r=n.Na.get(e);if(r&&r.va)return Bi().add(r.key);{let t=Bi();const r=n.Ma.get(e);if(!r)return t;for(const e of r){const r=n.Fa.get(e);t=t.unionWith(r.view.Va)}return t}}function nl(t){const e=fe(t);return e.remoteStore.remoteSyncer.applyRemoteEvent=qu.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=el.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=zu.bind(null,e),e.Ca.d_=Tu.bind(null,e.eventManager),e.Ca.$a=Su.bind(null,e.eventManager),e}function rl(t){const e=fe(t);return e.remoteStore.remoteSyncer.applySuccessfulWrite=Ku.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=Gu.bind(null,e),e}class il{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(t){this.serializer=Rc(t.databaseInfo.databaseId),this.sharedClientState=this.Wa(t),this.persistence=this.Ga(t),await this.persistence.start(),this.localStore=this.za(t),this.gcScheduler=this.ja(t,this.localStore),this.indexBackfillerScheduler=this.Ha(t,this.localStore)}ja(t,e){return null}Ha(t,e){return null}za(t){return mc(this.persistence,new dc,t.initialUser,this.serializer)}Ga(t){return new ec(rc.Zr,this.serializer)}Wa(t){return new _c}async terminate(){var t,e;null===(t=this.gcScheduler)||void 0===t||t.stop(),null===(e=this.indexBackfillerScheduler)||void 0===e||e.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}il.provider={build:()=>new il};class sl extends il{constructor(t,e,n){super(),this.Ja=t,this.cacheSizeBytes=e,this.forceOwnership=n,this.kind="persistent",this.synchronizeTabs=!1}async initialize(t){await super.initialize(t),await this.Ja.initialize(this,t),await rl(this.Ja.syncEngine),await nu(this.Ja.remoteStore),await this.persistence.yi(()=>(this.gcScheduler&&!this.gcScheduler.started&&this.gcScheduler.start(),this.indexBackfillerScheduler&&!this.indexBackfillerScheduler.started&&this.indexBackfillerScheduler.start(),Promise.resolve()))}za(t){return mc(this.persistence,new dc,t.initialUser,this.serializer)}ja(t,e){const n=this.persistence.referenceDelegate.garbageCollector;return new ka(n,t.asyncQueue,e)}Ha(t,e){const n=new an(e,this.persistence);return new on(t.asyncQueue,n)}Ga(t){const e=function(t,e){let n=t.projectId;return t.isDefaultDatabase||(n+="."+t.database),"firestore/"+e+"/"+n+"/"}(t.databaseInfo.databaseId,t.databaseInfo.persistenceKey),n=void 0!==this.cacheSizeBytes?pa.withCacheSize(this.cacheSizeBytes):pa.DEFAULT;return new ac(this.synchronizeTabs,e,t.clientId,n,t.asyncQueue,"undefined"!=typeof window?window:null,kc(),this.serializer,this.sharedClientState,!!this.forceOwnership)}Wa(t){return new _c}}class ol{async initialize(t,e){this.localStore||(this.localStore=t.localStore,this.sharedClientState=t.sharedClientState,this.datastore=this.createDatastore(e),this.remoteStore=this.createRemoteStore(e),this.eventManager=this.createEventManager(e),this.syncEngine=this.createSyncEngine(e,!t.synchronizeTabs),this.sharedClientState.onlineStateHandler=t=>ju(this.syncEngine,t,1),this.remoteStore.remoteSyncer.handleCredentialChange=tl.bind(null,this.syncEngine),await async function(t,e){const n=fe(t);e?(n.L_.delete(2),await Uc(n)):e||(n.L_.add(2),await qc(n),n.q_.set("Unknown"))}(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(t){return new bu}createDatastore(t){const e=Rc(t.databaseInfo.databaseId),n=(r=t.databaseInfo,new Nc(r));var r;return function(t,e,n,r){return new Vc(t,e,n,r)}(t.authCredentials,t.appCheckCredentials,n,e)}createRemoteStore(t){return e=this.localStore,n=this.datastore,r=t.asyncQueue,i=t=>ju(this.syncEngine,t,0),s=Tc.D()?new Tc:new Ec,new Bc(e,n,r,i,s);var e,n,r,i,s}createSyncEngine(t,e){return function(t,e,n,r,i,s,o){const a=new Lu(t,e,n,r,i,s);return o&&(a.Qa=!0),a}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,t.initialUser,t.maxConcurrentLimboResolutions,e)}async terminate(){var t,e;await async function(t){const e=fe(t);ae("RemoteStore","RemoteStore shutting down."),e.L_.add(5),await qc(e),e.k_.shutdown(),e.q_.set("Unknown")}(this.remoteStore),null===(t=this.datastore)||void 0===t||t.terminate(),null===(e=this.eventManager)||void 0===e||e.terminate()}}ol.provider={build:()=>new ol};
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class al{constructor(t){this.observer=t,this.muted=!1}next(t){this.muted||this.observer.next&&this.Ya(this.observer.next,t)}error(t){this.muted||(this.observer.error?this.Ya(this.observer.error,t):ce("Uncaught Error in snapshot listener:",t.toString()))}Za(){this.muted=!0}Ya(t,e){setTimeout(()=>{this.muted||t(e)},0)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cl{constructor(t,e,n,r,i){this.authCredentials=t,this.appCheckCredentials=e,this.asyncQueue=n,this.databaseInfo=r,this.user=re.UNAUTHENTICATED,this.clientId=xe.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(n,async t=>{ae("FirestoreClient","Received user=",t.uid),await this.authCredentialListener(t),this.user=t}),this.appCheckCredentials.start(n,t=>(ae("FirestoreClient","Received new app check token=",t),this.appCheckCredentialListener(t,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(t){this.authCredentialListener=t}setAppCheckTokenChangeListener(t){this.appCheckCredentialListener=t}terminate(){this.asyncQueue.enterRestrictedMode();const t=new pe;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),t.resolve()}catch(e){const n=gu(e,"Failed to shutdown persistence");t.reject(n)}}),t.promise}}async function ul(t,e){t.asyncQueue.verifyOperationInProgress(),ae("FirestoreClient","Initializing OfflineComponentProvider");const n=t.configuration;await e.initialize(n);let r=n.initialUser;t.setCredentialChangeListener(async t=>{r.isEqual(t)||(await gc(e.localStore,t),r=t)}),e.persistence.setDatabaseDeletedListener(()=>t.terminate()),t._offlineComponents=e}async function ll(t,e){t.asyncQueue.verifyOperationInProgress();const n=await async function(t){if(!t._offlineComponents)if(t._uninitializedComponentsProvider){ae("FirestoreClient","Using user provided OfflineComponentProvider");try{await ul(t,t._uninitializedComponentsProvider._offline)}catch(e){const i=e;if(!("FirebaseError"===(n=i).name?n.code===me.FAILED_PRECONDITION||n.code===me.UNIMPLEMENTED:!("undefined"!=typeof DOMException&&n instanceof DOMException)||22===n.code||20===n.code||11===n.code))throw i;ue("Error using user provided cache. Falling back to memory cache: "+i),await ul(t,new il)}}else ae("FirestoreClient","Using default OfflineComponentProvider"),await ul(t,new il);var n;return t._offlineComponents}(t);ae("FirestoreClient","Initializing OnlineComponentProvider"),await e.initialize(n,t.configuration),t.setCredentialChangeListener(t=>hu(e.remoteStore,t)),t.setAppCheckTokenChangeListener((t,n)=>hu(e.remoteStore,n)),t._onlineComponents=e}async function hl(t){return t._onlineComponents||(t._uninitializedComponentsProvider?(ae("FirestoreClient","Using user provided OnlineComponentProvider"),await ll(t,t._uninitializedComponentsProvider._online)):(ae("FirestoreClient","Using default OnlineComponentProvider"),await ll(t,new ol))),t._onlineComponents}async function dl(t){const e=await hl(t),n=e.eventManager;return n.onListen=Pu.bind(null,e.syncEngine),n.onUnlisten=Bu.bind(null,e.syncEngine),n.onFirstRemoteStoreListen=Vu.bind(null,e.syncEngine),n.onLastRemoteStoreUnlisten=Uu.bind(null,e.syncEngine),n}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function fl(t){const e={};return void 0!==t.timeoutSeconds&&(e.timeoutSeconds=t.timeoutSeconds),e
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}const ml=new Map;
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gl(t,e,n){if(!n)throw new ge(me.INVALID_ARGUMENT,`Function ${t}() cannot be called with an empty ${e}.`)}function pl(t){if(!Pe.isDocumentKey(t))throw new ge(me.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${t} has ${t.length}.`)}function yl(t){if(Pe.isDocumentKey(t))throw new ge(me.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${t} has ${t.length}.`)}function vl(t){if(void 0===t)return"undefined";if(null===t)return"null";if("string"==typeof t)return t.length>20&&(t=`${t.substring(0,20)}...`),JSON.stringify(t);if("number"==typeof t||"boolean"==typeof t)return""+t;if("object"==typeof t){if(t instanceof Array)return"an array";{const n=(e=t).constructor?e.constructor.name:null;return n?`a custom ${n} object`:"an object"}}var e;return"function"==typeof t?"a function":he()}function wl(t,e){if("_delegate"in t&&(t=t._delegate),!(t instanceof e)){if(e.name===t.constructor.name)throw new ge(me.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const n=vl(t);throw new ge(me.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${n}`)}}return t}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bl{constructor(t){var e,n;if(void 0===t.host){if(void 0!==t.ssl)throw new ge(me.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host="firestore.googleapis.com",this.ssl=!0}else this.host=t.host,this.ssl=null===(e=t.ssl)||void 0===e||e;if(this.credentials=t.credentials,this.ignoreUndefinedProperties=!!t.ignoreUndefinedProperties,this.localCache=t.localCache,void 0===t.cacheSizeBytes)this.cacheSizeBytes=41943040;else{if(-1!==t.cacheSizeBytes&&t.cacheSizeBytes<1048576)throw new ge(me.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=t.cacheSizeBytes}(function(t,e,n,r){if(!0===e&&!0===r)throw new ge(me.INVALID_ARGUMENT,`${t} and ${n} cannot be used together.`)})("experimentalForceLongPolling",t.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",t.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!t.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:void 0===t.experimentalAutoDetectLongPolling?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!t.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=fl(null!==(n=t.experimentalLongPollingOptions)&&void 0!==n?n:{}),function(t){if(void 0!==t.timeoutSeconds){if(isNaN(t.timeoutSeconds))throw new ge(me.INVALID_ARGUMENT,`invalid long polling timeout: ${t.timeoutSeconds} (must not be NaN)`);if(t.timeoutSeconds<5)throw new ge(me.INVALID_ARGUMENT,`invalid long polling timeout: ${t.timeoutSeconds} (minimum allowed value is 5)`);if(t.timeoutSeconds>30)throw new ge(me.INVALID_ARGUMENT,`invalid long polling timeout: ${t.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!t.useFetchStreams}isEqual(t){return this.host===t.host&&this.ssl===t.ssl&&this.credentials===t.credentials&&this.cacheSizeBytes===t.cacheSizeBytes&&this.experimentalForceLongPolling===t.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===t.experimentalAutoDetectLongPolling&&(e=this.experimentalLongPollingOptions,n=t.experimentalLongPollingOptions,e.timeoutSeconds===n.timeoutSeconds)&&this.ignoreUndefinedProperties===t.ignoreUndefinedProperties&&this.useFetchStreams===t.useFetchStreams;var e,n}}class Il{constructor(t,e,n,r){this._authCredentials=t,this._appCheckCredentials=e,this._databaseId=n,this._app=r,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new bl({}),this._settingsFrozen=!1,this._terminateTask="notTerminated"}get app(){if(!this._app)throw new ge(me.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return"notTerminated"!==this._terminateTask}_setSettings(t){if(this._settingsFrozen)throw new ge(me.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new bl(t),void 0!==t.credentials&&(this._authCredentials=function(t){if(!t)return new ve;switch(t.type){case"firstParty":return new _e(t.sessionIndex||"0",t.iamToken||null,t.authTokenFactory||null);case"provider":return t.client;default:throw new ge(me.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(t.credentials))}_getSettings(){return this._settings}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return"notTerminated"===this._terminateTask&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){"notTerminated"===this._terminateTask?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(t){const e=ml.get(t);e&&(ae("ComponentProvider","Removing Datastore"),ml.delete(t),e.terminate())}(this),Promise.resolve()}}function _l(t,e,n,i={}){var s;const o=(t=wl(t,Il))._getSettings(),a=`${e}:${n}`;if("firestore.googleapis.com"!==o.host&&o.host!==a&&ue("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used."),t._setSettings(Object.assign(Object.assign({},o),{host:a,ssl:!1})),i.mockUserToken){let e,n;if("string"==typeof i.mockUserToken)e=i.mockUserToken,n=re.MOCK_USER;else{e=function(t,e){if(t.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n=e||"demo-project",i=t.iat||0,s=t.sub||t.user_id;if(!s)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=Object.assign({iss:`https://securetoken.google.com/${n}`,aud:n,iat:i,exp:i+3600,auth_time:i,sub:s,user_id:s,firebase:{sign_in_provider:"custom",identities:{}}},t);return[r(JSON.stringify({alg:"none",type:"JWT"})),r(JSON.stringify(o)),""].join(".")}(i.mockUserToken,null===(s=t._app)||void 0===s?void 0:s.options.projectId);const o=i.mockUserToken.sub||i.mockUserToken.user_id;if(!o)throw new ge(me.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");n=new re(o)}t._authCredentials=new we(new ye(e,n))}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class El{constructor(t,e,n){this.converter=e,this._query=n,this.type="query",this.firestore=t}withConverter(t){return new El(this.firestore,t,this._query)}}class Tl{constructor(t,e,n){this.converter=e,this._key=n,this.type="document",this.firestore=t}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new Sl(this.firestore,this.converter,this._key.path.popLast())}withConverter(t){return new Tl(this.firestore,t,this._key)}}class Sl extends El{constructor(t,e,n){super(t,e,gi(n)),this._path=n,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const t=this._path.popLast();return t.isEmpty()?null:new Tl(this.firestore,null,new Pe(t))}withConverter(t){return new Sl(this.firestore,t,this._path)}}function xl(t,e,...n){if(t=v(t),gl("collection","path",e),t instanceof Il){const r=Oe.fromString(e,...n);return yl(r),new Sl(t,null,r)}{if(!(t instanceof Tl||t instanceof Sl))throw new ge(me.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=t._path.child(Oe.fromString(e,...n));return yl(r),new Sl(t.firestore,null,r)}}function Cl(t,e,...n){if(t=v(t),1===arguments.length&&(e=xe.newId()),gl("doc","path",e),t instanceof Il){const r=Oe.fromString(e,...n);return pl(r),new Tl(t,null,new Pe(r))}{if(!(t instanceof Tl||t instanceof Sl))throw new ge(me.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=t._path.child(Oe.fromString(e,...n));return pl(r),new Tl(t.firestore,t instanceof Sl?t.converter:null,new Pe(r))}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dl{constructor(t=Promise.resolve()){this.Pu=[],this.Iu=!1,this.Tu=[],this.Eu=null,this.du=!1,this.Au=!1,this.Ru=[],this.t_=new Oc(this,"async_queue_retry"),this.Vu=()=>{const t=kc();t&&ae("AsyncQueue","Visibility state changed to "+t.visibilityState),this.t_.jo()},this.mu=t;const e=kc();e&&"function"==typeof e.addEventListener&&e.addEventListener("visibilitychange",this.Vu)}get isShuttingDown(){return this.Iu}enqueueAndForget(t){this.enqueue(t)}enqueueAndForgetEvenWhileRestricted(t){this.fu(),this.gu(t)}enterRestrictedMode(t){if(!this.Iu){this.Iu=!0,this.Au=t||!1;const e=kc();e&&"function"==typeof e.removeEventListener&&e.removeEventListener("visibilitychange",this.Vu)}}enqueue(t){if(this.fu(),this.Iu)return new Promise(()=>{});const e=new pe;return this.gu(()=>this.Iu&&this.Au?Promise.resolve():(t().then(e.resolve,e.reject),e.promise)).then(()=>e.promise)}enqueueRetryable(t){this.enqueueAndForget(()=>(this.Pu.push(t),this.pu()))}async pu(){if(0!==this.Pu.length){try{await this.Pu[0](),this.Pu.shift(),this.t_.reset()}catch(t){if(!tn(t))throw t;ae("AsyncQueue","Operation failed with retryable error: "+t)}this.Pu.length>0&&this.t_.Go(()=>this.pu())}}gu(t){const e=this.mu.then(()=>(this.du=!0,t().catch(t=>{this.Eu=t,this.du=!1;throw ce("INTERNAL UNHANDLED ERROR: ",function(t){let e=t.message||"";return t.stack&&(e=t.stack.includes(t.message)?t.stack:t.message+"\n"+t.stack),e}(t)),t}).then(t=>(this.du=!1,t))));return this.mu=e,e}enqueueAfterDelay(t,e,n){this.fu(),this.Ru.indexOf(t)>-1&&(e=0);const r=mu.createAndSchedule(this,t,e,n,t=>this.yu(t));return this.Tu.push(r),r}fu(){this.Eu&&he()}verifyOperationInProgress(){}async wu(){let t;do{t=this.mu,await t}while(t!==this.mu)}Su(t){for(const e of this.Tu)if(e.timerId===t)return!0;return!1}bu(t){return this.wu().then(()=>{this.Tu.sort((t,e)=>t.targetTimeMs-e.targetTimeMs);for(const e of this.Tu)if(e.skipDelay(),"all"!==t&&e.timerId===t)break;return this.wu()})}Du(t){this.Ru.push(t)}yu(t){const e=this.Tu.indexOf(t);this.Tu.splice(e,1)}}function Al(t){return function(t,e){if("object"!=typeof t||null===t)return!1;const n=t;for(const r of e)if(r in n&&"function"==typeof n[r])return!0;return!1}(t,["next","error","complete"])}class Nl extends Il{constructor(t,e,n,r){super(t,e,n,r),this.type="firestore",this._queue=new Dl,this._persistenceKey=(null==r?void 0:r.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const t=this._firestoreClient.terminate();this._queue=new Dl(t),this._firestoreClient=void 0,await t}}}function kl(t,e,n){n||(n="(default)");const r=At(t,"firestore");if(r.isInitialized(n)){const t=r.getImmediate({identifier:n});if(p(r.getOptions(n),e))return t;throw new ge(me.FAILED_PRECONDITION,"initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.")}if(void 0!==e.cacheSizeBytes&&void 0!==e.localCache)throw new ge(me.INVALID_ARGUMENT,"cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object");if(void 0!==e.cacheSizeBytes&&-1!==e.cacheSizeBytes&&e.cacheSizeBytes<1048576)throw new ge(me.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");return r.initialize({options:e,instanceIdentifier:n})}function Rl(t,e){const n="string"==typeof t?t:e||"(default)",r=At("object"==typeof t?t:function(t=_t){const e=Tt.get(t);if(!e&&t===_t&&c())return Rt();if(!e)throw Nt.create("no-app",{appName:t});return e}(),"firestore").getImmediate({identifier:n});if(!r._initialized){const t=a("firestore");t&&_l(r,...t)}return r}function Ol(t){if(t._terminated)throw new ge(me.FAILED_PRECONDITION,"The client has already been terminated.");return t._firestoreClient||function(t){var e,n,r;const i=t._freezeSettings(),s=(o=t._databaseId,a=(null===(e=t._app)||void 0===e?void 0:e.options.appId)||"",c=t._persistenceKey,u=i,new ar(o,a,c,u.host,u.ssl,u.experimentalForceLongPolling,u.experimentalAutoDetectLongPolling,fl(u.experimentalLongPollingOptions),u.useFetchStreams));var o,a,c,u;t._componentsProvider||(null===(n=i.localCache)||void 0===n?void 0:n._offlineComponentProvider)&&(null===(r=i.localCache)||void 0===r?void 0:r._onlineComponentProvider)&&(t._componentsProvider={_offline:i.localCache._offlineComponentProvider,_online:i.localCache._onlineComponentProvider}),t._firestoreClient=new cl(t._authCredentials,t._appCheckCredentials,t._queue,s,t._componentsProvider&&function(t){const e=null==t?void 0:t._online.build();return{_offline:null==t?void 0:t._offline.build(e),_online:e}}(t._componentsProvider))}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(t),t._firestoreClient}class Ml{constructor(t){this._byteString=t}static fromBase64String(t){try{return new Ml(Zn.fromBase64String(t))}catch(e){throw new ge(me.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+e)}}static fromUint8Array(t){return new Ml(Zn.fromUint8Array(t))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(t){return this._byteString.isEqual(t._byteString)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ll{constructor(...t){for(let e=0;e<t.length;++e)if(0===t[e].length)throw new ge(me.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Le(t)}isEqual(t){return this._internalPath.isEqual(t._internalPath)}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pl{constructor(t){this._methodName=t}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vl{constructor(t,e){if(!isFinite(t)||t<-90||t>90)throw new ge(me.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+t);if(!isFinite(e)||e<-180||e>180)throw new ge(me.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+e);this._lat=t,this._long=e}get latitude(){return this._lat}get longitude(){return this._long}isEqual(t){return this._lat===t._lat&&this._long===t._long}toJSON(){return{latitude:this._lat,longitude:this._long}}_compareTo(t){return Ce(this._lat,t._lat)||Ce(this._long,t._long)}}
/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fl{constructor(t){this._values=(t||[]).map(t=>t)}toArray(){return this._values.map(t=>t)}isEqual(t){return function(t,e){if(t.length!==e.length)return!1;for(let n=0;n<t.length;++n)if(t[n]!==e[n])return!1;return!0}(this._values,t._values)}}
/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Bl=/^__.*__$/;class Ul{constructor(t,e,n){this.data=t,this.fieldMask=e,this.fieldTransforms=n}toMutation(t,e){return null!==this.fieldMask?new fs(t,this.data,this.fieldMask,e,this.fieldTransforms):new ds(t,this.data,e,this.fieldTransforms)}}class ql{constructor(t,e,n){this.data=t,this.fieldMask=e,this.fieldTransforms=n}toMutation(t,e){return new fs(t,this.data,this.fieldMask,e,this.fieldTransforms)}}function jl(t){switch(t){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw he()}}class zl{constructor(t,e,n,r,i,s){this.settings=t,this.databaseId=e,this.serializer=n,this.ignoreUndefinedProperties=r,void 0===i&&this.vu(),this.fieldTransforms=i||[],this.fieldMask=s||[]}get path(){return this.settings.path}get Cu(){return this.settings.Cu}Fu(t){return new zl(Object.assign(Object.assign({},this.settings),t),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}Mu(t){var e;const n=null===(e=this.path)||void 0===e?void 0:e.child(t),r=this.Fu({path:n,xu:!1});return r.Ou(t),r}Nu(t){var e;const n=null===(e=this.path)||void 0===e?void 0:e.child(t),r=this.Fu({path:n,xu:!1});return r.vu(),r}Lu(t){return this.Fu({path:void 0,xu:!0})}Bu(t){return sh(t,this.settings.methodName,this.settings.ku||!1,this.path,this.settings.qu)}contains(t){return void 0!==this.fieldMask.find(e=>t.isPrefixOf(e))||void 0!==this.fieldTransforms.find(e=>t.isPrefixOf(e.field))}vu(){if(this.path)for(let t=0;t<this.path.length;t++)this.Ou(this.path.get(t))}Ou(t){if(0===t.length)throw this.Bu("Document fields must not be empty");if(jl(this.Cu)&&Bl.test(t))throw this.Bu('Document fields cannot begin and end with "__"')}}class Kl{constructor(t,e,n){this.databaseId=t,this.ignoreUndefinedProperties=e,this.serializer=n||Rc(t)}Qu(t,e,n,r=!1){return new zl({Cu:t,methodName:e,qu:n,path:Le.emptyPath(),xu:!1,ku:r},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function Gl(t){const e=t._freezeSettings(),n=Rc(t._databaseId);return new Kl(t._databaseId,!!e.ignoreUndefinedProperties,n)}function $l(t,e,n,r,i,s={}){const o=t.Qu(s.merge||s.mergeFields?2:0,e,n,i);eh("Data must be an object, but it was:",o,r);const a=Zl(r,o);let c,u;if(s.merge)c=new Yn(o.fieldMask),u=o.fieldTransforms;else if(s.mergeFields){const t=[];for(const r of s.mergeFields){const i=nh(e,r,n);if(!o.contains(i))throw new ge(me.INVALID_ARGUMENT,`Field '${i}' is specified in your field mask but missing from your input data.`);oh(t,i)||t.push(i)}c=new Yn(t),u=o.fieldTransforms.filter(t=>c.covers(t.field))}else c=null,u=o.fieldTransforms;return new Ul(new Or(a),c,u)}class Ql extends Pl{_toFieldTransform(t){if(2!==t.Cu)throw 1===t.Cu?t.Bu(`${this._methodName}() can only appear at the top level of your update data`):t.Bu(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return t.fieldMask.push(t.path),null}isEqual(t){return t instanceof Ql}}class Hl extends Pl{_toFieldTransform(t){return new ns(t.path,new Hi)}isEqual(t){return t instanceof Hl}}class Wl extends Pl{constructor(t,e){super(t),this.Ku=e}_toFieldTransform(t){const e=function(t,e,n){return new zl({Cu:3,qu:e.settings.qu,methodName:t._methodName,xu:n},e.databaseId,e.serializer,e.ignoreUndefinedProperties)}(this,t,!0),n=this.Ku.map(t=>Xl(t,e)),r=new Wi(n);return new ns(t.path,r)}isEqual(t){return t instanceof Wl&&p(this.Ku,t.Ku)}}function Jl(t,e,n,r){const i=t.Qu(1,e,n);eh("Data must be an object, but it was:",i,r);const s=[],o=Or.empty();zn(r,(t,r)=>{const a=ih(e,t,n);r=v(r);const c=i.Nu(a);if(r instanceof Ql)s.push(a);else{const t=Xl(r,c);null!=t&&(s.push(a),o.set(a,t))}});const a=new Yn(s);return new ql(o,a,i.fieldTransforms)}function Yl(t,e,n,r,i,s){const o=t.Qu(1,e,n),a=[nh(e,r,n)],c=[i];if(s.length%2!=0)throw new ge(me.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let d=0;d<s.length;d+=2)a.push(nh(e,s[d])),c.push(s[d+1]);const u=[],l=Or.empty();for(let d=a.length-1;d>=0;--d)if(!oh(u,a[d])){const t=a[d];let e=c[d];e=v(e);const n=o.Nu(t);if(e instanceof Ql)u.push(t);else{const r=Xl(e,n);null!=r&&(u.push(t),l.set(t,r))}}const h=new Yn(u);return new ql(l,h,o.fieldTransforms)}function Xl(t,e){if(th(t=v(t)))return eh("Unsupported field value:",e,t),Zl(t,e);if(t instanceof Pl)return function(t,e){if(!jl(e.Cu))throw e.Bu(`${t._methodName}() can only be used with update() and set()`);if(!e.path)throw e.Bu(`${t._methodName}() is not currently supported inside arrays`);const n=t._toFieldTransform(e);n&&e.fieldTransforms.push(n)}(t,e),null;if(void 0===t&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),t instanceof Array){if(e.settings.xu&&4!==e.Cu)throw e.Bu("Nested arrays are not supported");return function(t,e){const n=[];let r=0;for(const i of t){let t=Xl(i,e.Lu(r));null==t&&(t={nullValue:"NULL_VALUE"}),n.push(t),r++}return{arrayValue:{values:n}}}(t,e)}return function(t,e){if(null===(t=v(t)))return{nullValue:"NULL_VALUE"};if("number"==typeof t)return zi(e.serializer,t);if("boolean"==typeof t)return{booleanValue:t};if("string"==typeof t)return{stringValue:t};if(t instanceof Date){const n=Ne.fromDate(t);return{timestampValue:Gs(e.serializer,n)}}if(t instanceof Ne){const n=new Ne(t.seconds,1e3*Math.floor(t.nanoseconds/1e3));return{timestampValue:Gs(e.serializer,n)}}if(t instanceof Vl)return{geoPointValue:{latitude:t.latitude,longitude:t.longitude}};if(t instanceof Ml)return{bytesValue:$s(e.serializer,t._byteString)};if(t instanceof Tl){const n=e.databaseId,r=t.firestore._databaseId;if(!r.isEqual(n))throw e.Bu(`Document reference is for database ${r.projectId}/${r.database} but should be for database ${n.projectId}/${n.database}`);return{referenceValue:Ws(t.firestore._databaseId||e.databaseId,t._key.path)}}if(t instanceof Fl)return n=e,{mapValue:{fields:{__type__:{stringValue:"__vector__"},value:{arrayValue:{values:t.toArray().map(t=>{if("number"!=typeof t)throw n.Bu("VectorValues must only contain numeric values.");return qi(n.serializer,t)})}}}}};var n;throw e.Bu(`Unsupported field value: ${vl(t)}`)}(t,e)}function Zl(t,e){const n={};return Kn(t)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):zn(t,(t,r)=>{const i=Xl(r,e.Mu(t));null!=i&&(n[t]=i)}),{mapValue:{fields:n}}}function th(t){return!("object"!=typeof t||null===t||t instanceof Array||t instanceof Date||t instanceof Ne||t instanceof Vl||t instanceof Ml||t instanceof Tl||t instanceof Pl||t instanceof Fl)}function eh(t,e,n){if(!th(n)||("object"!=typeof(r=n)||null===r||Object.getPrototypeOf(r)!==Object.prototype&&null!==Object.getPrototypeOf(r))){const r=vl(n);throw"an object"===r?e.Bu(t+" a custom object"):e.Bu(t+" "+r)}var r}function nh(t,e,n){if((e=v(e))instanceof Ll)return e._internalPath;if("string"==typeof e)return ih(t,e);throw sh("Field path arguments must be of type string or ",t,!1,void 0,n)}const rh=new RegExp("[~\\*/\\[\\]]");function ih(t,e,n){if(e.search(rh)>=0)throw sh(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,t,!1,void 0,n);try{return new Ll(...e.split("."))._internalPath}catch(r){throw sh(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,t,!1,void 0,n)}}function sh(t,e,n,r,i){const s=r&&!r.isEmpty(),o=void 0!==i;let a=`Function ${e}() called with invalid data`;n&&(a+=" (via `toFirestore()`)"),a+=". ";let c="";return(s||o)&&(c+=" (found",s&&(c+=` in field ${r}`),o&&(c+=` in document ${i}`),c+=")"),new ge(me.INVALID_ARGUMENT,a+t+c)}function oh(t,e){return t.some(t=>t.isEqual(e))}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ah{constructor(t,e,n,r,i){this._firestore=t,this._userDataWriter=e,this._key=n,this._document=r,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new Tl(this._firestore,this._converter,this._key)}exists(){return null!==this._document}data(){if(this._document){if(this._converter){const t=new ch(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(t)}return this._userDataWriter.convertValue(this._document.data.value)}}get(t){if(this._document){const e=this._document.data.field(uh("DocumentSnapshot.get",t));if(null!==e)return this._userDataWriter.convertValue(e)}}}class ch extends ah{data(){return super.data()}}function uh(t,e){return"string"==typeof e?ih(t,e):e instanceof Ll?e._internalPath:e._delegate._internalPath}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lh(t){if("L"===t.limitType&&0===t.explicitOrderBy.length)throw new ge(me.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class hh{}class dh extends hh{}function fh(t,e,...n){let r=[];e instanceof hh&&r.push(e),r=r.concat(n),function(t){const e=t.filter(t=>t instanceof ph).length,n=t.filter(t=>t instanceof mh).length;if(e>1||e>0&&n>0)throw new ge(me.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(r);for(const i of r)t=i._apply(t);return t}class mh extends dh{constructor(t,e,n){super(),this._field=t,this._op=e,this._value=n,this.type="where"}static _create(t,e,n){return new mh(t,e,n)}_apply(t){const e=this._parse(t);return Ih(t._query,e),new El(t.firestore,t.converter,bi(t._query,e))}_parse(t){const e=Gl(t.firestore),n=function(t,e,n,r,i,s,o){let a;if(i.isKeyField()){if("array-contains"===s||"array-contains-any"===s)throw new ge(me.INVALID_ARGUMENT,`Invalid Query. You can't perform '${s}' queries on documentId().`);if("in"===s||"not-in"===s){bh(o,s);const e=[];for(const n of o)e.push(wh(r,t,n));a={arrayValue:{values:e}}}else a=wh(r,t,o)}else"in"!==s&&"not-in"!==s&&"array-contains-any"!==s||bh(o,s),a=function(t,e,n,r=!1){return Xl(n,t.Qu(r?4:3,e))}(n,e,o,"in"===s||"not-in"===s);return jr.create(i,s,a)}(t._query,"where",e,t.firestore._databaseId,this._field,this._op,this._value);return n}}function gh(t,e,n){const r=e,i=uh("where",t);return mh._create(i,r,n)}class ph extends hh{constructor(t,e){super(),this.type=t,this._queryConstraints=e}static _create(t,e){return new ph(t,e)}_parse(t){const e=this._queryConstraints.map(e=>e._parse(t)).filter(t=>t.getFilters().length>0);return 1===e.length?e[0]:zr.create(e,this._getOperator())}_apply(t){const e=this._parse(t);return 0===e.getFilters().length?t:(function(t,e){let n=t;const r=e.getFlattenedFilters();for(const i of r)Ih(n,i),n=bi(n,i)}(t._query,e),new El(t.firestore,t.converter,bi(t._query,e)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return"and"===this.type?"and":"or"}}class yh extends dh{constructor(t,e){super(),this._field=t,this._direction=e,this.type="orderBy"}static _create(t,e){return new yh(t,e)}_apply(t){const e=function(t,e,n){if(null!==t.startAt)throw new ge(me.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(null!==t.endAt)throw new ge(me.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new Br(e,n)}(t._query,this._field,this._direction);return new El(t.firestore,t.converter,function(t,e){const n=t.explicitOrderBy.concat([e]);return new mi(t.path,t.collectionGroup,n,t.filters.slice(),t.limit,t.limitType,t.startAt,t.endAt)}(t._query,e))}}function vh(t,e="asc"){const n=e,r=uh("orderBy",t);return yh._create(r,n)}function wh(t,e,n){if("string"==typeof(n=v(n))){if(""===n)throw new ge(me.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!yi(e)&&-1!==n.indexOf("/"))throw new ge(me.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${n}' contains a '/' character.`);const r=e.path.child(Oe.fromString(n));if(!Pe.isDocumentKey(r))throw new ge(me.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return wr(t,new Pe(r))}if(n instanceof Tl)return wr(t,n._key);throw new ge(me.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${vl(n)}.`)}function bh(t,e){if(!Array.isArray(t)||0===t.length)throw new ge(me.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function Ih(t,e){const n=function(t,e){for(const n of t)for(const t of n.getFlattenedFilters())if(e.indexOf(t.op)>=0)return t.op;return null}(t.filters,function(t){switch(t){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(e.op));if(null!==n)throw n===e.op?new ge(me.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new ge(me.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${n.toString()}' filters.`)}class _h{convertValue(t,e="none"){switch(hr(t)){case 0:return null;case 1:return t.booleanValue;case 2:return nr(t.integerValue||t.doubleValue);case 3:return this.convertTimestamp(t.timestampValue);case 4:return this.convertServerTimestamp(t,e);case 5:return t.stringValue;case 6:return this.convertBytes(rr(t.bytesValue));case 7:return this.convertReference(t.referenceValue);case 8:return this.convertGeoPoint(t.geoPointValue);case 9:return this.convertArray(t.arrayValue,e);case 11:return this.convertObject(t.mapValue,e);case 10:return this.convertVectorValue(t.mapValue);default:throw he()}}convertObject(t,e){return this.convertObjectMap(t.fields,e)}convertObjectMap(t,e="none"){const n={};return zn(t,(t,r)=>{n[t]=this.convertValue(r,e)}),n}convertVectorValue(t){var e,n,r;const i=null===(r=null===(n=null===(e=t.fields)||void 0===e?void 0:e.value.arrayValue)||void 0===n?void 0:n.values)||void 0===r?void 0:r.map(t=>nr(t.doubleValue));return new Fl(i)}convertGeoPoint(t){return new Vl(nr(t.latitude),nr(t.longitude))}convertArray(t,e){return(t.values||[]).map(t=>this.convertValue(t,e))}convertServerTimestamp(t,e){switch(e){case"previous":const n=sr(t);return null==n?null:this.convertValue(n,e);case"estimate":return this.convertTimestamp(or(t));default:return null}}convertTimestamp(t){const e=er(t);return new Ne(e.seconds,e.nanos)}convertDocumentKey(t,e){const n=Oe.fromString(t);de(wo(n));const r=new cr(n.get(1),n.get(3)),i=new Pe(n.popFirst(5));return r.isEqual(e)||ce(`Document ${i} contains a document reference within a different database (${r.projectId}/${r.database}) which is not supported. It will be treated as a reference in the current database (${e.projectId}/${e.database}) instead.`),i}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Eh(t,e,n){let r;return r=t?n&&(n.merge||n.mergeFields)?t.toFirestore(e,n):t.toFirestore(e):e,r
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */}class Th{constructor(t,e){this.hasPendingWrites=t,this.fromCache=e}isEqual(t){return this.hasPendingWrites===t.hasPendingWrites&&this.fromCache===t.fromCache}}class Sh extends ah{constructor(t,e,n,r,i,s){super(t,e,n,r,s),this._firestore=t,this._firestoreImpl=t,this.metadata=i}exists(){return super.exists()}data(t={}){if(this._document){if(this._converter){const e=new xh(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(e,t)}return this._userDataWriter.convertValue(this._document.data.value,t.serverTimestamps)}}get(t,e={}){if(this._document){const n=this._document.data.field(uh("DocumentSnapshot.get",t));if(null!==n)return this._userDataWriter.convertValue(n,e.serverTimestamps)}}}class xh extends Sh{data(t={}){return super.data(t)}}class Ch{constructor(t,e,n,r){this._firestore=t,this._userDataWriter=e,this._snapshot=r,this.metadata=new Th(r.hasPendingWrites,r.fromCache),this.query=n}get docs(){const t=[];return this.forEach(e=>t.push(e)),t}get size(){return this._snapshot.docs.size}get empty(){return 0===this.size}forEach(t,e){this._snapshot.docs.forEach(n=>{t.call(e,new xh(this._firestore,this._userDataWriter,n.key,n,new Th(this._snapshot.mutatedKeys.has(n.key),this._snapshot.fromCache),this.query.converter))})}docChanges(t={}){const e=!!t.includeMetadataChanges;if(e&&this._snapshot.excludesMetadataChanges)throw new ge(me.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===e||(this._cachedChanges=function(t,e){if(t._snapshot.oldDocs.isEmpty()){let e=0;return t._snapshot.docChanges.map(n=>{const r=new xh(t._firestore,t._userDataWriter,n.doc.key,n.doc,new Th(t._snapshot.mutatedKeys.has(n.doc.key),t._snapshot.fromCache),t.query.converter);return n.doc,{type:"added",doc:r,oldIndex:-1,newIndex:e++}})}{let n=t._snapshot.oldDocs;return t._snapshot.docChanges.filter(t=>e||3!==t.type).map(e=>{const r=new xh(t._firestore,t._userDataWriter,e.doc.key,e.doc,new Th(t._snapshot.mutatedKeys.has(e.doc.key),t._snapshot.fromCache),t.query.converter);let i=-1,s=-1;return 0!==e.type&&(i=n.indexOf(e.doc.key),n=n.delete(e.doc.key)),1!==e.type&&(n=n.add(e.doc),s=n.indexOf(e.doc.key)),{type:Dh(e.type),doc:r,oldIndex:i,newIndex:s}})}}(this,e),this._cachedChangesIncludeMetadataChanges=e),this._cachedChanges}}function Dh(t){switch(t){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return he()}}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ah(t){t=wl(t,Tl);const e=wl(t.firestore,Nl);return function(t,e,n={}){const r=new pe;return t.asyncQueue.enqueueAndForget(async()=>function(t,e,n,r,i){const s=new al({next:a=>{s.Za(),e.enqueueAndForget(()=>Eu(t,o));const c=a.docs.has(n);!c&&a.fromCache?i.reject(new ge(me.UNAVAILABLE,"Failed to get document because the client is offline.")):c&&a.fromCache&&r&&"server"===r.source?i.reject(new ge(me.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):i.resolve(a)},error:t=>i.reject(t)}),o=new Au(gi(n.path),s,{includeMetadataChanges:!0,_a:!0});return _u(t,o)}(await dl(t),t.asyncQueue,e,n,r)),r.promise}(Ol(e),t._key).then(n=>Fh(e,t,n))}class Nh extends _h{constructor(t){super(),this.firestore=t}convertBytes(t){return new Ml(t)}convertReference(t){const e=this.convertDocumentKey(t,this.firestore._databaseId);return new Tl(this.firestore,null,e)}}function kh(t){t=wl(t,El);const e=wl(t.firestore,Nl),n=Ol(e),r=new Nh(e);return lh(t._query),function(t,e,n={}){const r=new pe;return t.asyncQueue.enqueueAndForget(async()=>function(t,e,n,r,i){const s=new al({next:n=>{s.Za(),e.enqueueAndForget(()=>Eu(t,o)),n.fromCache&&"server"===r.source?i.reject(new ge(me.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):i.resolve(n)},error:t=>i.reject(t)}),o=new Au(n,s,{includeMetadataChanges:!0,_a:!0});return _u(t,o)}(await dl(t),t.asyncQueue,e,n,r)),r.promise}(n,t._query).then(n=>new Ch(e,r,t,n))}function Rh(t,e,n){t=wl(t,Tl);const r=wl(t.firestore,Nl),i=Eh(t.converter,e,n);return Vh(r,[$l(Gl(r),"setDoc",t._key,i,null!==t.converter,n).toMutation(t._key,is.none())])}function Oh(t,e,n,...r){t=wl(t,Tl);const i=wl(t.firestore,Nl),s=Gl(i);let o;return o="string"==typeof(e=v(e))||e instanceof Ll?Yl(s,"updateDoc",t._key,e,n,r):Jl(s,"updateDoc",t._key,e),Vh(i,[o.toMutation(t._key,is.exists(!0))])}function Mh(t){return Vh(wl(t.firestore,Nl),[new ys(t._key,is.none())])}function Lh(t,e){const n=wl(t.firestore,Nl),r=Cl(t),i=Eh(t.converter,e);return Vh(n,[$l(Gl(t.firestore),"addDoc",r._key,i,null!==t.converter,{}).toMutation(r._key,is.exists(!1))]).then(()=>r)}function Ph(t,...e){var n,r,i;t=v(t);let s={includeMetadataChanges:!1,source:"default"},o=0;"object"!=typeof e[o]||Al(e[o])||(s=e[o],o++);const a={includeMetadataChanges:s.includeMetadataChanges,source:s.source};if(Al(e[o])){const t=e[o];e[o]=null===(n=t.next)||void 0===n?void 0:n.bind(t),e[o+1]=null===(r=t.error)||void 0===r?void 0:r.bind(t),e[o+2]=null===(i=t.complete)||void 0===i?void 0:i.bind(t)}let c,u,l;if(t instanceof Tl)u=wl(t.firestore,Nl),l=gi(t._key.path),c={next:n=>{e[o]&&e[o](Fh(u,t,n))},error:e[o+1],complete:e[o+2]};else{const n=wl(t,El);u=wl(n.firestore,Nl),l=n._query;const r=new Nh(u);c={next:t=>{e[o]&&e[o](new Ch(u,r,n,t))},error:e[o+1],complete:e[o+2]},lh(t._query)}return function(t,e,n,r){const i=new al(r),s=new Au(e,i,n);return t.asyncQueue.enqueueAndForget(async()=>_u(await dl(t),s)),()=>{i.Za(),t.asyncQueue.enqueueAndForget(async()=>Eu(await dl(t),s))}}(Ol(u),l,a,c)}function Vh(t,e){return function(t,e){const n=new pe;return t.asyncQueue.enqueueAndForget(async()=>async function(e,n,r){const i=rl(e);try{const t=await function(t,e){const n=fe(t),r=Ne.now(),i=e.reduce((t,e)=>t.add(e.key),Bi());let s,o;return n.persistence.runTransaction("Locally write mutations","readwrite",t=>{let a=Ni(),c=Bi();return n.cs.getEntries(t,i).next(t=>{a=t,a.forEach((t,e)=>{e.isValidDocument()||(c=c.add(t))})}).next(()=>n.localDocuments.getOverlayedDocuments(t,a)).next(i=>{s=i;const o=[];for(const t of e){const e=ls(t,s.get(t.key).overlayedDocument);null!=e&&o.push(new fs(t.key,e,Mr(e.value.mapValue),is.exists(!0)))}return n.mutationQueue.addMutationBatch(t,r,o,e)}).next(e=>{o=e;const r=e.applyToLocalDocumentSet(s,c);return n.documentOverlayCache.saveOverlays(t,e.batchId,r)})}).then(()=>({batchId:o.batchId,changes:Oi(s)}))}(i.localStore,n);i.sharedClientState.addPendingMutation(t.batchId),function(t,e,n){let r=t.Ba[t.currentUser.toKey()];r||(r=new Gn(Ce)),r=r.insert(e,n),t.Ba[t.currentUser.toKey()]=r}(i,t.batchId,r),await Zu(i,t.changes),await nu(i.remoteStore)}catch(t){const n=gu(t,"Failed to persist write");r.reject(n)}}(await function(t){return hl(t).then(t=>t.syncEngine)}(t),e,n)),n.promise}(Ol(t),e)}function Fh(t,e,n){const r=n.docs.get(e._key),i=new Nh(t);return new Sh(t,i,e._key,r,new Th(n.hasPendingWrites,n.fromCache),e.converter)}class Bh{constructor(t){let e;this.kind="persistent",(null==t?void 0:t.tabManager)?(t.tabManager._initialize(t),e=t.tabManager):(e=function(t){return new qh(null==t?void 0:t.forceOwnership)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(void 0),e._initialize(t)),this._onlineComponentProvider=e._onlineComponentProvider,this._offlineComponentProvider=e._offlineComponentProvider}toJSON(){return{kind:this.kind}}}function Uh(t){return new Bh(t)}class qh{constructor(t){this.forceOwnership=t,this.kind="persistentSingleTab"}toJSON(){return{kind:this.kind}}_initialize(t){this._onlineComponentProvider=ol.provider,this._offlineComponentProvider={build:e=>new sl(e,null==t?void 0:t.cacheSizeBytes,this.forceOwnership)}}}class jh{constructor(t,e){this._firestore=t,this._commitHandler=e,this._mutations=[],this._committed=!1,this._dataReader=Gl(t)}set(t,e,n){this._verifyNotCommitted();const r=zh(t,this._firestore),i=Eh(r.converter,e,n),s=$l(this._dataReader,"WriteBatch.set",r._key,i,null!==r.converter,n);return this._mutations.push(s.toMutation(r._key,is.none())),this}update(t,e,n,...r){this._verifyNotCommitted();const i=zh(t,this._firestore);let s;return s="string"==typeof(e=v(e))||e instanceof Ll?Yl(this._dataReader,"WriteBatch.update",i._key,e,n,r):Jl(this._dataReader,"WriteBatch.update",i._key,e),this._mutations.push(s.toMutation(i._key,is.exists(!0))),this}delete(t){this._verifyNotCommitted();const e=zh(t,this._firestore);return this._mutations=this._mutations.concat(new ys(e._key,is.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new ge(me.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function zh(t,e){if((t=v(t)).firestore!==e)throw new ge(me.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return t}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Kh(){return new Ql("deleteField")}function Gh(){return new Hl("serverTimestamp")}function $h(...t){return new Wl("arrayUnion",t)}
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qh(t){return Ol(t=wl(t,Nl)),new jh(t,e=>Vh(t,e))}!function(t,e=!0){ie="10.14.1",Dt(new w("firestore",(t,{instanceIdentifier:n,options:r})=>{const i=t.getProvider("app").getImmediate(),s=new Nl(new be(t.getProvider("auth-internal")),new Te(t.getProvider("app-check-internal")),function(t,e){if(!Object.prototype.hasOwnProperty.apply(t.options,["projectId"]))throw new ge(me.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new cr(t.options.projectId,e)}(i,n),i);return r=Object.assign({useFetchStreams:e},r),s._setSettings(r),s},"PUBLIC").setMultipleInstances(!0)),Ot(ne,"4.7.3",t),Ot(ne,"4.7.3","esm2017")}();
/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Ot("firebase","10.14.1","app");export{kl as a,$h as b,xl as c,Cl as d,Lh as e,Mh as f,Rl as g,Ah as h,Rt as i,kh as j,Qh as k,Kh as l,vh as m,Gh as n,Ph as o,Uh as p,fh as q,Rh as s,Oh as u,gh as w};
