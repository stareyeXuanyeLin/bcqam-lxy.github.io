// ==UserScript==
// @name         lxy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  小夜的BondageClub自用插件
// @author       You
// @match        https://bondageprojects.elementfx.com/R82/BondageClub/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=elementfx.com
// @grant        none
// ==/UserScript==

setTimeout(
	function () {
			let n = document.createElement("script");
			n.setAttribute("language", "JavaScript");
			n.setAttribute("crossorigin", "anonymous");
			n.setAttribute("src", "https://stareyexuanyelin.github.io/LXY/script.js?_=" + Date.now());
			n.onload = () => n.remove();
			document.head.appendChild(n);
		}
);