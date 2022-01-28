(self.webpackChunkpes_teams=self.webpackChunkpes_teams||[]).push([[179],{45:(t,e,s)=>{"use strict";s.r(e)},801:(t,e,s)=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.Stars=e.Teams=e.Player=void 0;const a=s(604);Object.defineProperty(e,"Player",{enumerable:!0,get:function(){return a.Player}});const i=s(64);Object.defineProperty(e,"Teams",{enumerable:!0,get:function(){return i.Teams}});const l=s(373);Object.defineProperty(e,"Stars",{enumerable:!0,get:function(){return l.Stars}})},604:(t,e,s)=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.Player=void 0;const a=s(699);e.Player=class{constructor(t,e,s){this.name=t,this.surname=e,this.nickname=s,this.idx=-1,this.status=a.Status.off,this.roll=42,this.fullName=`${t} ${e}`,this.camelCase=t[0].toLowerCase()+e}}},373:function(t,e){"use strict";var s,a,i=this&&this.__classPrivateFieldSet||function(t,e,s,a,i){if("m"===a)throw new TypeError("Private method is not writable");if("a"===a&&!i)throw new TypeError("Private accessor was defined without a setter");if("function"==typeof e?t!==e||!i:!e.has(t))throw new TypeError("Cannot write private member to an object whose class did not declare it");return"a"===a?i.call(t,s):i?i.value=s:e.set(t,s),s},l=this&&this.__classPrivateFieldGet||function(t,e,s,a){if("a"===s&&!a)throw new TypeError("Private accessor was defined without a getter");if("function"==typeof e?t!==e||!a:!e.has(t))throw new TypeError("Cannot read private member from an object whose class did not declare it");return"m"===s?a:"a"===s?a.call(t):a?a.value:e.get(t)};Object.defineProperty(e,"__esModule",{value:!0}),e.Stars=void 0,e.Stars=class{constructor(t){this.parentElement=t,this.inSessionStorage="stars",this.darkColour="#333",this.lightColour="#ffb000",this.lvls=[1,1.5,2,2.5,3,3.5,4,4.5,5],s.set(this,void 0),a.set(this,void 0),this.lvlvsForRoll=[],this.lastRoll=0;const e=sessionStorage.getItem(this.inSessionStorage);if(e){const t=JSON.parse(e);i(this,s,t[0],"f"),i(this,a,t[1],"f")}else i(this,s,1.5,"f"),i(this,a,5,"f");this.selectedLvls=this.lvls.slice(this.lvls.indexOf(l(this,s,"f")),this.lvls.indexOf(l(this,a,"f"))+1);for(let t=0;t<5;t++)this.parentElement.innerHTML+=this.starCreator("black",t)}get max(){return l(this,a,"f")}set max(t){if(t<=l(this,s,"f"))throw new Error("maximum must be at least 0.5 more than min");i(this,a,t,"f"),sessionStorage.setItem(this.inSessionStorage,`[${l(this,s,"f")}, ${l(this,a,"f")}]`),this.lvlvsForRoll=[],this.selectedLvls=this.lvls.slice(this.lvls.indexOf(l(this,s,"f")),this.lvls.indexOf(l(this,a,"f"))+1)}get min(){return l(this,s,"f")}set min(t){if(t>=l(this,a,"f"))throw new Error("minimum must be at least 0.5 less than max");i(this,s,t,"f"),sessionStorage.setItem(this.inSessionStorage,`[${l(this,s,"f")}, ${l(this,a,"f")}]`),this.lvlvsForRoll=[],this.selectedLvls=this.lvls.slice(this.lvls.indexOf(l(this,s,"f")),this.lvls.indexOf(l(this,a,"f"))+1)}roll(){this.lvlvsForRoll.length||(this.lvlvsForRoll=[...this.selectedLvls]);const t=Math.floor(Math.random()*this.lvlvsForRoll.length),e=this.lvlvsForRoll.splice(t,1)[0];e===this.lastRoll?this.roll():(this.lastRoll=e,this.render(e))}render(t){for(;this.parentElement.lastChild;)this.parentElement.lastChild.remove();let e=0,s=0;Number.isInteger(t)?e=t:(e=t-.5,s=1);let a="";for(let t=0;t<e;t++)a+=this.starCreator("full",t);for(let t=0;t<s;t++)a+=this.starCreator("half",t+e);for(let t=0;t<5-e-s;t++)a+=this.starCreator("black",t+e+s);this.parentElement.innerHTML=a}starCreator(t,e=0){const s=(t,s)=>`\n\t\t\t\t<svg width="2.1em" height="2em" viewBox="0 0 32 30" fill="none" xmlns="http://www.w3.org/2000/svg">\n\t\t\t\t\t<path d="M16 0L19.5922 10.3647H31.2169L21.8123 16.7705L25.4046 27.1353L16 20.7295L6.59544 27.1353L10.1877 16.7705L0.783095 10.3647H12.4078L16 0Z" fill="url(#solids${e})" />\n\t\t\t\t\t<defs>\n\t\t\t\t\t\t<linearGradient id="solids${e}" x1="0%" y1="0%" x2="100%" y2="0%">\n\t\t\t\t\t\t\t<stop offset="0%" stop-color="${t}" />\n\t\t\t\t\t\t\t<stop offset="50%" stop-color="${t}" />\n\t\t\t\t\t\t\t<stop offset="50%" stop-color="${s}" />\n\t\t\t\t\t\t\t<stop offset="100%" stop-color="${s}" />\n\t\t\t\t\t\t</linearGradient>\n\t\t\t\t\t</defs>\n\t\t\t\t</svg>\n\t\t\t`;switch(t){case"black":return s(this.darkColour,this.darkColour);case"half":return s(this.lightColour,this.darkColour);case"full":return s(this.lightColour,this.lightColour)}}},s=new WeakMap,a=new WeakMap},64:function(t,e,s){"use strict";var a,i,l=this&&this.__classPrivateFieldSet||function(t,e,s,a,i){if("m"===a)throw new TypeError("Private method is not writable");if("a"===a&&!i)throw new TypeError("Private accessor was defined without a setter");if("function"==typeof e?t!==e||!i:!e.has(t))throw new TypeError("Cannot write private member to an object whose class did not declare it");return"a"===a?i.call(t,s):i?i.value=s:e.set(t,s),s},o=this&&this.__classPrivateFieldGet||function(t,e,s,a){if("a"===s&&!a)throw new TypeError("Private accessor was defined without a getter");if("function"==typeof e?t!==e||!a:!e.has(t))throw new TypeError("Cannot read private member from an object whose class did not declare it");return"m"===s?a:"a"===s?a.call(t):a?a.value:e.get(t)};Object.defineProperty(e,"__esModule",{value:!0}),e.Teams=void 0;const r=s(699),n=s(604);e.Teams=class{constructor(t,e,s,d,h){this.playerList=t,this.language=e,this.availablesElement=s,this.numberButtonsList=d,this.allElement=h,this.inSessionStoragePlayerPool="playerPool",this.inSessionStorageTeamSize="teamSize",this.inLocalStorageNameFormat="nameFormat",a.set(this,void 0),this.pool=[],i.set(this,void 0);const c=localStorage.getItem(this.inLocalStorageNameFormat);l(this,a,c||r.NameFormat.fullName,"f");const u=sessionStorage.getItem(this.inSessionStoragePlayerPool);u?this.pool=JSON.parse(u):this.playerList.forEach((t=>{const e=new n.Player(...t);this.pool.push(e),this.pool.sort(((t,e)=>t[o(this,a,"f")].localeCompare(e[o(this,a,"f")],this.language))),this.pool.forEach(((t,e)=>{t.idx=e}))})),this.availablePool=this.pool.filter((t=>t.status!==r.Status.off));const m=sessionStorage.getItem(this.inSessionStorageTeamSize);l(this,i,m?JSON.parse(m):this.availablePool.length>8?8:this.availablePool.length,"f"),this.blueLastRoster=[],this.redLastRoster=[],this.setNumberBtnList(),this.renderPlayers(),this.renderAvailable()}add(t){const e=new n.Player(...t);e.status=r.Status.available,this.pool.push(e),this.sortPool(),this.setAvailable(),this.setTeamSize(),this.renderPlayers(),this.renderAvailable(),this.setNumberBtnList()}get nameFormat(){return o(this,a,"f")}set nameFormat(t){l(this,a,t,"f"),this.sortPool(),this.setAvailable(),this.renderPlayers(),this.renderAvailable(),localStorage.setItem(this.inLocalStorageNameFormat,o(this,a,"f"))}roll(){if(!(this.availablePool.length<3)){this.availablePool.forEach((t=>{t.status===r.Status.defeated?t.roll=Math.random()+2:t.status===r.Status.red||t.status===r.Status.blue?t.roll=Math.random()+1:t.roll=Math.random()})),this.availablePool.sort(((t,e)=>t.roll-e.roll));for(let t=0;t<o(this,i,"f");t++)this.availablePool[t].roll=Math.random();this.availablePool.sort(((t,e)=>t.roll-e.roll)),this.availablePool.forEach(((t,e)=>{e<Math.ceil(o(this,i,"f")/2)?t.status=r.Status.blue:e<o(this,i,"f")?t.status=r.Status.red:t.status=r.Status.available})),this.checkRoster()||this.roll(),this.setRoster(),this.renderAvailable(),this.savePool()}}set teamSize(t){if(t>8||t<3)throw new Error("team size must be between 3 and 8");l(this,i,t,"f"),sessionStorage.setItem(this.inSessionStorageTeamSize,`${o(this,i,"f")}`),this.setNumberBtnList()}checkRoster(){const t=[],e=[];return this.availablePool.forEach((({status:s,idx:a})=>{switch(s){case"blue":t.push(a);break;case"red":e.push(a)}})),!(t.every((t=>this.blueLastRoster.includes(t)))||t.every((t=>this.redLastRoster.includes(t)))||e.every((t=>this.blueLastRoster.includes(t)))||e.every((t=>this.redLastRoster.includes(t))))}positionInTeamCssClass(t,e,s){let a=null,i=null;for(let t=0;t<this.availablePool.length;t++)this.availablePool[t].status===e&&(a=null!=a?a:t,i=t);a===i&&a===t||(t===a?s.classList.add("first"):t===i?s.classList.add("last"):s.classList.add("middle"))}renderAvailable(){for(;this.availablesElement.lastChild;)this.availablesElement.lastChild.remove();this.availablePool.sort(((t,e)=>t.roll-e.roll)),this.availablePool.forEach(((t,e)=>{const s=document.createElement("div");switch(s.id=t.idx.toString(),s.classList.add("player"),s.classList.add("available"),s.innerText=t[o(this,a,"f")],t.status){case r.Status.blue:case r.Status.red:case r.Status.defeated:s.classList.add(t.status),this.positionInTeamCssClass(e,t.status,s)}let i=null;s.addEventListener("click",(t=>{const e=t.target;if(null===i)i=window.setTimeout((()=>{const t=this.pool[parseInt(e.id)].status;if(t===r.Status.blue||t===r.Status.red){if(this.availablePool.some((t=>t.status===r.Status.defeated)))return;this.availablePool.forEach((e=>{t===e.status&&(e.status=r.Status.defeated)}))}if(t===r.Status.defeated){const e=this.availablePool.some((t=>t.status===r.Status.blue));this.availablePool.forEach((s=>{s.status===t&&(s.status=e?r.Status.red:r.Status.blue)}))}this.renderAvailable(),this.savePool()}),250);else{clearTimeout(i),i=null;const t=this.pool[parseInt(e.id)];t.status=r.Status.off,t.roll=42,this.setAvailable(),this.setTeamSize(),this.renderAvailable(),this.allElement.childNodes.forEach((t=>{const s=t;s.id===e.id&&s.classList.remove(r.Status.off)})),this.setNumberBtnList(),this.savePool()}})),this.availablesElement.appendChild(s)}))}renderPlayers(){for(;this.allElement.lastChild;)this.allElement.lastChild.remove();this.pool.forEach((t=>{const e=document.createElement("div");switch(e.id=t.idx.toString(),e.classList.add("player"),e.innerText=t[o(this,a,"f")],e.addEventListener("click",(t=>{const e=t.target;e.classList.add(r.Status.off),this.pool[parseInt(e.id)].status=r.Status.available,this.pool[parseInt(e.id)].roll=42,this.setAvailable(),this.setTeamSize(),this.renderAvailable(),this.setNumberBtnList(),this.savePool()})),t.status){case r.Status.off:e.classList.remove(r.Status.off);break;default:e.classList.add(r.Status.off)}this.allElement.appendChild(e)}))}savePool(){sessionStorage.setItem(this.inSessionStoragePlayerPool,JSON.stringify(this.pool))}setAvailable(){this.availablePool=this.pool.filter((t=>t.status!==r.Status.off))}setNumberBtnList(){this.numberButtonsList.forEach((t=>{t.classList.remove("selected-number"),t.disabled=!0,parseInt(t.value)<=this.availablePool.length&&(t.disabled=!1,parseInt(t.value)===o(this,i,"f")&&t.classList.add("selected-number"))}))}setRoster(){this.blueLastRoster=[],this.redLastRoster=[],this.availablePool.forEach((({status:t,idx:e})=>{switch(t){case"blue":this.blueLastRoster.push(e);break;case"red":this.redLastRoster.push(e)}}))}setTeamSize(){l(this,i,this.availablePool.length>8?8:this.availablePool.length,"f"),sessionStorage.setItem(this.inSessionStorageTeamSize,`${o(this,i,"f")}`)}sortPool(){this.pool.sort(((t,e)=>t[o(this,a,"f")].localeCompare(e[o(this,a,"f")],this.language))),this.pool.forEach(((t,e)=>{t.idx=e})),this.savePool()}},a=new WeakMap,i=new WeakMap},834:(t,e)=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.pesCrew=e.locale=void 0,e.locale="sr",e.pesCrew=[["Aca","Todorović","Todor"],["Boki","Timotijević","Boki-Đole"],["Branko","Tošković","Shoomar"],["Bojan","Zlatković","Boki"],["Đorđe","Babić","Babić"],["Dragoslav","Banašević","Gnjurac"],["Dejan","Ćurković","Deki"],["Dušan","Radulaški","Dući"],["Filip","Sabo Batanč","Batanč"],["Ivan","Nastić","Nasti"],["Igor","Savin","Zec"],["Marko","Stamenković","Stameni"],["Nemanja","Nikolić","Neksi"],["Nebojša","Petković","Petko"],["Nikola","Rončević","Ronča"],["Nikola","Vrhovac","Vrle"],["Predrag","Novaković","Đops"],["Predrag","Novković","Peđa"],["Vedran","Marjanović","Veki"],["Vlada","Popović","Lima"],["Vladimir","Atlagić","Smo"],["Vuk","Mandić","Vuk"]]},430:(t,e)=>{"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.backOptBtn=e.resetBtn=e.maxSelectOpt=e.maxSelect=e.minSelectOpt=e.minSelect=e.nameFormatInputs=e.optionsDiv=e.backGuestBtn=e.guestNameInput=e.addGuestForm=e.addGuestDiv=e.backAllPlyBtn=e.allPlayersDiv=e.guestBtn=e.allContainerDiv=e.splitBtn=e.starBtn=e.starsDiv=e.addBtn=e.optBtn=e.numberButtonList=e.availablePlayersDiv=e.viewport=void 0,e.viewport=document.querySelector("meta[name=viewport]"),e.availablePlayersDiv=document.getElementById("available-players"),e.numberButtonList=document.querySelectorAll(".number-btn"),e.optBtn=document.getElementById("opt-btn"),e.addBtn=document.getElementById("add-btn"),e.starsDiv=document.getElementById("stars"),e.starBtn=document.getElementById("star-btn"),e.splitBtn=document.getElementById("split-btn"),e.allContainerDiv=document.getElementById("all-container"),e.guestBtn=document.getElementById("guest-btn"),e.allPlayersDiv=document.getElementById("all-players"),e.backAllPlyBtn=document.getElementById("back-all-btn"),e.addGuestDiv=document.getElementById("add-guest"),e.addGuestForm=document.getElementById("add-guest-form"),e.guestNameInput=document.getElementById("guest-name"),e.backGuestBtn=document.getElementById("back-guest-btn"),e.optionsDiv=document.getElementById("options"),e.nameFormatInputs=document.getElementsByName("name-format"),e.minSelect=document.getElementById("min-select"),e.minSelectOpt=e.minSelect.querySelectorAll("option"),e.maxSelect=document.getElementById("max-select"),e.maxSelectOpt=e.maxSelect.querySelectorAll("option"),e.resetBtn=document.getElementById("reset-btn"),e.backOptBtn=document.getElementById("back-opt-btn")},607:(t,e,s)=>{"use strict";s(45);const a=s(801),i=s(834),l=s(430);["iPad Simulator","iPhone Simulator","iPod Simulator","iPad","iPhone","iPod"].includes(navigator.platform)||navigator.userAgent.includes("Mac")&&"ontouchend"in document||l.viewport.setAttribute("content",`${l.viewport.content}, height=${window.innerHeight}`);const o=new a.Teams(i.pesCrew,i.locale,l.availablePlayersDiv,l.numberButtonList,l.allPlayersDiv),r=new a.Stars(l.starsDiv);l.numberButtonList.forEach((t=>{t.addEventListener("click",(t=>{const e=t.target;o.teamSize=parseInt(e.value)}))})),l.starBtn.addEventListener("click",(()=>{r.roll()})),l.optBtn.addEventListener("click",(()=>{l.optionsDiv.classList.add("open")})),l.addBtn.addEventListener("click",(()=>{l.allContainerDiv.classList.add("open")})),l.splitBtn.addEventListener("click",(()=>o.roll())),l.addGuestDiv.addEventListener("transitionend",(()=>{l.guestNameInput.focus()})),l.guestBtn.addEventListener("click",(()=>{l.addGuestDiv.classList.add("open")})),l.backAllPlyBtn.addEventListener("click",(()=>{l.allContainerDiv.classList.remove("open")})),l.backGuestBtn.addEventListener("click",(()=>{l.addGuestDiv.classList.remove("open")})),l.addGuestForm.onsubmit=()=>{const t=new FormData(l.addGuestForm),e=t.get("name"),s=t.get("surname"),a=t.get("nickname");return o.add([e,s,a]),l.addGuestForm.reset(),l.addGuestDiv.classList.remove("open"),!1},l.nameFormatInputs.forEach((t=>{t.value===o.nameFormat&&(t.checked=!0),t.addEventListener("change",(()=>o.nameFormat=t.value))})),l.minSelect.addEventListener("change",(t=>{const e=t.target;r.min=parseFloat(e.value),l.maxSelectOpt.forEach((t=>{parseFloat(t.value)<=r.min?t.disabled=!0:t.disabled=!1}))})),l.minSelectOpt.forEach((t=>{parseFloat(t.value)===r.min&&(t.selected=!0)})),l.maxSelect.addEventListener("change",(t=>{const e=t.target;r.max=parseFloat(e.value),l.minSelectOpt.forEach((t=>{parseFloat(t.value)>=r.max?t.disabled=!0:t.disabled=!1}))})),l.maxSelectOpt.forEach((t=>{parseFloat(t.value)===r.max&&(t.selected=!0)})),l.resetBtn.addEventListener("click",(()=>{localStorage.clear(),sessionStorage.clear(),window.location.reload()})),l.backOptBtn.addEventListener("click",(()=>{l.optionsDiv.classList.remove("open")}))},699:(t,e)=>{"use strict";var s,a;Object.defineProperty(e,"__esModule",{value:!0}),e.Status=e.NameFormat=void 0,(a=e.NameFormat||(e.NameFormat={})).fullName="fullName",a.camelCase="camelCase",a.name="name",a.surname="surname",a.nickname="nickname",(s=e.Status||(e.Status={})).available="available",s.blue="blue",s.red="red",s.defeated="defeated",s.off="off"}},t=>{"use strict";t(t.s=607)}]);