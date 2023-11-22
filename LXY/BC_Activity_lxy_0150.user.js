(function() {
	'use strict';
	var bcModSdk = function() {
		"use strict";
		const e = "1.1.0";

		function o(e) {
			alert("Mod ERROR:\n" + e);
			const o = new Error(e);
			throw console.error(o), o
		}
		const t = new TextEncoder;

		function n(e) {
			return !!e && "object" == typeof e && !Array.isArray(e)
		}

		function r(e) {
			const o = new Set;
			return e.filter((e => !o.has(e) && o.add(e)))
		}
		const i = new Map,
			a = new Set;

		function d(e) {
			a.has(e) || (a.add(e), console.warn(e))
		}

		function s(e) {
			const o = [],
				t = new Map,
				n = new Set;
			for (const r of p.values()) {
				const i = r.patching.get(e.name);
				if (i) {
					o.push(...i.hooks);
					for (const [o, a] of i.patches.entries()) t.has(o) && t.get(o) !== a && d(
						`ModSDK: Mod '${r.name}' is patching function ${e.name} with same pattern that is already applied by different mod, but with different pattern:\nPattern:\n${o}\nPatch1:\n${t.get(o) || ""}\nPatch2:\n${a}`
						), t.set(o, a), n.add(r.name)
				}
			}
			o.sort(((e, o) => o.priority - e.priority));
			const r = function(e, o) {
				if (0 === o.size) return e;
				let t = e.toString().replaceAll("\r\n", "\n");
				for (const [n, r] of o.entries()) t.includes(n) || d(
					`ModSDK: Patching ${e.name}: Patch ${n} not applied`), t = t.replaceAll(n, r);
				return (0, eval)(`(${t})`)
			}(e.original, t);
			let i = function(o) {
				var t, i;
				const a = null === (i = (t = m.errorReporterHooks).hookChainExit) || void 0 === i ? void 0 :
					i.call(t, e.name, n),
					d = r.apply(this, o);
				return null == a || a(), d
			};
			for (let t = o.length - 1; t >= 0; t--) {
				const n = o[t],
					r = i;
				i = function(o) {
					var t, i;
					const a = null === (i = (t = m.errorReporterHooks).hookEnter) || void 0 === i ? void 0 :
						i.call(t, e.name, n.mod),
						d = n.hook.apply(this, [o, e => {
							if (1 !== arguments.length || !Array.isArray(o)) throw new Error(
								`Mod ${n.mod} failed to call next hook: Expected args to be array, got ${typeof e}`
								);
							return r.call(this, e)
						}]);
					return null == a || a(), d
				}
			}
			return {
				hooks: o,
				patches: t,
				patchesSources: n,
				enter: i,
				final: r
			}
		}

		function c(e, o = !1) {
			let r = i.get(e);
			if (r) o && (r.precomputed = s(r));
			else {
				let o = window;
				const a = e.split(".");
				for (let t = 0; t < a.length - 1; t++)
					if (o = o[a[t]], !n(o)) throw new Error(
						`ModSDK: Function ${e} to be patched not found; ${a.slice(0, t + 1).join(".")} is not object`
						);
				const d = o[a[a.length - 1]];
				if ("function" != typeof d) throw new Error(`ModSDK: Function ${e} to be patched not found`);
				const c = function(e) {
						let o = -1;
						for (const n of t.encode(e)) {
							let e = 255 & (o ^ n);
							for (let o = 0; o < 8; o++) e = 1 & e ? -306674912 ^ e >>> 1 : e >>> 1;
							o = o >>> 8 ^ e
						}
						return ((-1 ^ o) >>> 0).toString(16).padStart(8, "0").toUpperCase()
					}(d.toString().replaceAll("\r\n", "\n")),
					l = {
						name: e,
						original: d,
						originalHash: c
					};
				r = Object.assign(Object.assign({}, l), {
					precomputed: s(l),
					router: () => {},
					context: o,
					contextProperty: a[a.length - 1]
				}), r.router = function(e) {
					return function(...o) {
						return e.precomputed.enter.apply(this, [o])
					}
				}(r), i.set(e, r), o[r.contextProperty] = r.router
			}
			return r
		}

		function l() {
			const e = new Set;
			for (const o of p.values())
				for (const t of o.patching.keys()) e.add(t);
			for (const o of i.keys()) e.add(o);
			for (const o of e) c(o, !0)
		}

		function f() {
			const e = new Map;
			for (const [o, t] of i) e.set(o, {
				name: o,
				original: t.original,
				originalHash: t.originalHash,
				sdkEntrypoint: t.router,
				currentEntrypoint: t.context[t.contextProperty],
				hookedByMods: r(t.precomputed.hooks.map((e => e.mod))),
				patchedByMods: Array.from(t.precomputed.patchesSources)
			});
			return e
		}
		const p = new Map;

		function u(e) {
			p.get(e.name) !== e && o(`Failed to unload mod '${e.name}': Not registered`), p.delete(e.name), e
				.loaded = !1, l()
		}

		function g(e, t, r) {
			"string" == typeof e && "string" == typeof t && (alert(
				`Mod SDK warning: Mod '${e}' is registering in a deprecated way.\nIt will work for now, but please inform author to update.`
				), e = {
				name: e,
				fullName: e,
				version: t
			}, t = {
				allowReplace: !0 === r
			}), e && "object" == typeof e || o("Failed to register mod: Expected info object, got " +
				typeof e), "string" == typeof e.name && e.name || o(
				"Failed to register mod: Expected name to be non-empty string, got " + typeof e.name);
			let i = `'${e.name}'`;
			"string" == typeof e.fullName && e.fullName || o(
					`Failed to register mod ${i}: Expected fullName to be non-empty string, got ${typeof e.fullName}`
					), i = `'${e.fullName} (${e.name})'`, "string" != typeof e.version && o(
					`Failed to register mod ${i}: Expected version to be string, got ${typeof e.version}`), e
				.repository || (e.repository = void 0), void 0 !== e.repository && "string" != typeof e
				.repository && o(
					`Failed to register mod ${i}: Expected repository to be undefined or string, got ${typeof e.version}`
					), null == t && (t = {}), t && "object" == typeof t || o(
					`Failed to register mod ${i}: Expected options to be undefined or object, got ${typeof t}`);
			const a = !0 === t.allowReplace,
				d = p.get(e.name);
			d && (d.allowReplace && a || o(
				`Refusing to load mod ${i}: it is already loaded and doesn't allow being replaced.\nWas the mod loaded multiple times?`
				), u(d));
			const s = e => {
					"string" == typeof e && e || o(
						`Mod ${i} failed to patch a function: Expected function name string, got ${typeof e}`
						);
					let t = g.patching.get(e);
					return t || (t = {
						hooks: [],
						patches: new Map
					}, g.patching.set(e, t)), t
				},
				f = {
					unload: () => u(g),
					hookFunction: (e, t, n) => {
						g.loaded || o(`Mod ${i} attempted to call SDK function after being unloaded`);
						const r = s(e);
						"number" != typeof t && o(
							`Mod ${i} failed to hook function '${e}': Expected priority number, got ${typeof t}`
							), "function" != typeof n && o(
							`Mod ${i} failed to hook function '${e}': Expected hook function, got ${typeof n}`
							);
						const a = {
							mod: g.name,
							priority: t,
							hook: n
						};
						return r.hooks.push(a), l(), () => {
							const e = r.hooks.indexOf(a);
							e >= 0 && (r.hooks.splice(e, 1), l())
						}
					},
					patchFunction: (e, t) => {
						g.loaded || o(`Mod ${i} attempted to call SDK function after being unloaded`);
						const r = s(e);
						n(t) || o(
							`Mod ${i} failed to patch function '${e}': Expected patches object, got ${typeof t}`
							);
						for (const [n, a] of Object.entries(t)) "string" == typeof a ? r.patches.set(n, a) :
							null === a ? r.patches.delete(n) : o(
								`Mod ${i} failed to patch function '${e}': Invalid format of patch '${n}'`);
						l()
					},
					removePatches: e => {
						g.loaded || o(`Mod ${i} attempted to call SDK function after being unloaded`);
						s(e).patches.clear(), l()
					},
					callOriginal: (e, t, n) => (g.loaded || o(
							`Mod ${i} attempted to call SDK function after being unloaded`), "string" ==
						typeof e && e || o(
							`Mod ${i} failed to call a function: Expected function name string, got ${typeof e}`
							), Array.isArray(t) || o(
							`Mod ${i} failed to call a function: Expected args array, got ${typeof t}`),
						function(e, o, t = window) {
							return c(e).original.apply(t, o)
						}(e, t, n)),
					getOriginalHash: e => ("string" == typeof e && e || o(
							`Mod ${i} failed to get hash: Expected function name string, got ${typeof e}`),
						c(e).originalHash)
				},
				g = {
					name: e.name,
					fullName: e.fullName,
					version: e.version,
					repository: e.repository,
					allowReplace: a,
					api: f,
					loaded: !0,
					patching: new Map
				};
			return p.set(e.name, g), Object.freeze(f)
		}

		function h() {
			const e = [];
			for (const o of p.values()) e.push({
				name: o.name,
				fullName: o.fullName,
				version: o.version,
				repository: o.repository
			});
			return e
		}
		let m;
		const y = function() {
			if (void 0 === window.bcModSdk) return window.bcModSdk = function() {
				const o = {
					version: e,
					apiVersion: 1,
					registerMod: g,
					getModsInfo: h,
					getPatchingInfo: f,
					errorReporterHooks: Object.seal({
						hookEnter: null,
						hookChainExit: null
					})
				};
				return m = o, Object.freeze(o)
			}();
			if (n(window.bcModSdk) || o("Failed to init Mod SDK: Name already in use"), 1 !== window
				.bcModSdk.apiVersion && o(
					`Failed to init Mod SDK: Different version already loaded ('1.1.0' vs '${window.bcModSdk.version}')`
					), window.bcModSdk.version !== e && (alert(
						`Mod SDK warning: Loading different but compatible versions ('1.1.0' vs '${window.bcModSdk.version}')\nOne of mods you are using is using an old version of SDK. It will work for now but please inform author to update`
						), window.bcModSdk.version.startsWith("1.0.") && void 0 === window.bcModSdk
					._shim10register)) {
				const e = window.bcModSdk,
					o = Object.freeze(Object.assign(Object.assign({}, e), {
						registerMod: (o, t, n) => o && "object" == typeof o && "string" == typeof o
							.name && "string" == typeof o.version ? e.registerMod(o.name, o.version,
								"object" == typeof t && !!t && !0 === t.allowReplace) : e
							.registerMod(o, t, n),
						_shim10register: !0
					}));
				window.bcModSdk = o
			}
			return window.bcModSdk
		}();
		return "undefined" != typeof exports && (Object.defineProperty(exports, "__esModule", {
			value: !0
		}), exports.default = y), y
	}();
	const MOD_NAME = "动作拓展";
	const MOD_FULL_NAME = "动作拓展";
	const MOD_VERSION = "0.1.57";
	const mod = bcModSdk.registerMod({
		name: MOD_NAME,
		fullName: MOD_FULL_NAME,
		version: MOD_VERSION
	});
	const w = window;
	mod.hookFunction("ServerSend", 5, (args, next) => {
		if (args[0] == "ChatRoomChat" && args[1]?.Type == "Activity") {
			let data = args[1];
			let actName = data.Dictionary[3]?.ActivityName ?? "";
			if (actName.indexOf("Act_") == 0) {
				let {
					metadata,
					substitutions
				} = ChatRoomMessageRunExtractors(data, Player) let msg = ActivityDictionaryText(data
					.Content);
				msg = CommonStringSubstitute(msg, substitutions ?? []) data.Dictionary.push({
					Tag: "MISSING ACTIVITY DESCRIPTION FOR KEYWORD " + data.Content,
					Text: msg
				});
			}
		}
		return next(args);
	});
	mod.hookFunction("ActivityCheckPrerequisite", 5, (args, next) => {
		var prereqName = args[0];
		if (CustomPrerequisiteFuncs.has(prereqName)) {
			var acting = args[1];
			var acted = args[2];
			var targetGrp = args[3];
			var customPrereqFunc = CustomPrerequisiteFuncs.get(prereqName);
			if (!customPrereqFunc) return next(args);
			else {
				return customPrereqFunc(acting, acted, targetGrp);
			}
		}
		elsereturn next(args);
	});
	mod.hookFunction("DrawImageResize", 1, (args, next) => {
		var path = args[0];
		if (!!path && path.indexOf("Act_") > -1) {
			var activityName = path.substring(path.indexOf("Act_"));
			activityName = activityName.substring(0, activityName.indexOf(".png")) if (CustomImages.has(
					activityName)) args[0] = CustomImages.get(activityName);
		}
		return next(args);
	});
	const CustomImages = new Map();
	const Act_AFA = "Assets/Female3DCG/Activity/"
	const Act_手套 = "Assets/Female3DCG/ItemHands/Preview/"
	const Act_PNG = ".png"
	var activitiesToAdd = [{
		Name: "Act_歪头",
		Target: [],
		TargetSelf: ["ItemNeck"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: [],
	}, {
		Name: "Act_环顾四周",
		Target: [],
		TargetSelf: ["ItemNeck"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: [],
	}, {
		Name: "Act_上下打量",
		Target: ["ItemHead"],
		TargetSelf: [],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: [],
	}, {
		Name: "Act_闭上眼睛",
		Target: [],
		TargetSelf: ["ItemHead"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: [],
	}, {
		Name: "Act_眼神呆滞",
		Target: [],
		TargetSelf: ["ItemHead"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: [],
	}, {
		Name: "Act_眼睛湿润",
		Target: [],
		TargetSelf: ["ItemHead"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: [],
	}, {
		Name: "Act_流眼泪",
		Target: [],
		TargetSelf: ["ItemHead"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: [],
	}, {
		Name: "Act_张开嘴",
		Target: [],
		TargetSelf: ["ItemMouth"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["UseMouth"]
	}, {
		Name: "Act_流口水",
		Target: [],
		TargetSelf: ["ItemMouth"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["IsGagged"]
	}, {
		Name: "Act_吞咽口水",
		Target: [],
		TargetSelf: ["ItemNeck"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: []
	}, {
		Name: "Act_轻声喘息",
		Target: [],
		TargetSelf: ["ItemMouth"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: [],
		StimulationAction: "Talk"
	}, {
		Name: "Act_打哈欠",
		Target: [],
		TargetSelf: ["ItemMouth"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["UseMouth"],
	}, {
		Name: "Act_嘘",
		Target: [],
		TargetSelf: ["ItemMouth"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: [],
	}, {
		Name: "Act_舔脚",
		Target: ["ItemBoots"],
		TargetSelf: [],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["UseTongue"]
	}, {
		Name: "Act_舔手",
		Target: ["ItemHands"],
		TargetSelf: ["ItemHands"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["UseMouth"]
	}, {
		Name: "Act_舔手指",
		Target: ["ItemHands"],
		TargetSelf: ["ItemHands"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["UseMouth"]
	}, {
		Name: "Act_吮吸手指",
		Target: ["ItemHands"],
		TargetSelf: ["ItemHands"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["UseMouth"]
	}, {
		Name: "Act_舔脸",
		Target: ["ItemMouth"],
		TargetSelf: [],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["UseMouth"]
	}, {
		Name: "Act_嗅",
		Target: ["ItemHands"],
		TargetSelf: [],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: []
	}, {
		Name: "Act_跪下",
		Target: [],
		TargetSelf: ["ItemLegs"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["UseArms"],
	}, {
		Name: "Act_手放身后",
		Target: [],
		TargetSelf: ["ItemArms"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["UseArms"]
	}, {
		Name: "Act_趴下",
		Target: [],
		TargetSelf: ["ItemBoots"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["UseArms"]
	}, {
		Name: "Act_四肢着地",
		Target: [],
		TargetSelf: ["ItemBoots"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["UseArms"]
	}, {
		Name: "Act_跪着张开双腿",
		Target: [],
		TargetSelf: ["ItemLegs"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["UseArms"],
		ActivityExpression: [{
			Group: "Blush",
			Name: "High",
			Timer: 10
		}]
	}, {
		Name: "Act_爬到脚边",
		Target: ["ItemBoots"],
		TargetSelf: [],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["UseArms"]
	}, {
		Name: "Act_蹭腿",
		Target: ["ItemLegs", "ItemFeet"],
		TargetSelf: [],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["UseArms"]
	}, {
		Name: "Act_踮起双脚",
		Target: [],
		TargetSelf: ["ItemBoots"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: [""]
	}, {
		Name: "Act_摇晃脚踝",
		Target: [],
		TargetSelf: ["ItemBoots"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: []
	}, {
		Name: "Act_伸出脚",
		Target: [],
		TargetSelf: ["ItemBoots"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["UseFeet"]
	}, {
		Name: "Act_夹紧双腿",
		Target: [],
		TargetSelf: ["ItemLegs"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: []
	}, {
		Name: "Act_掰开双腿",
		Target: ["ItemLegs"],
		TargetSelf: [],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: []
	}, {
		Name: "Act_戳脸",
		Target: ["ItemMouth"],
		TargetSelf: ["ItemMouth"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["UseHands"],
	}, {
		Name: "Act_捏脸",
		Target: ["ItemMouth"],
		TargetSelf: ["ItemMouth"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["UseHands"],
	}, {
		Name: "Act_戳手臂",
		Target: ["ItemArms"],
		TargetSelf: ["ItemArms"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["UseHands"],
	}, {
		Name: "Act_揉脸",
		Target: ["ItemMouth"],
		TargetSelf: ["ItemMouth"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["UseHands"],
	}, {
		Name: "Act_摇晃手臂",
		Target: ["ItemArms"],
		TargetSelf: ["ItemArms"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["UseHands"],
	}, {
		Name: "Act_轻推",
		Target: ["ItemTorso", "ItemTorso2"],
		TargetSelf: [],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["UseArms"]
	}, {
		Name: "Act_托起脚",
		Target: ["ItemBoots"],
		TargetSelf: [],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["UseHands"]
	}, {
		Name: "Act_扭动手腕",
		Target: [],
		TargetSelf: ["ItemHands"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: []
	}, {
		Name: "Act_挠头",
		Target: [],
		TargetSelf: ["ItemHead"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["UseHands", "UseArms"]
	}, {
		Name: "Act_捂住耳朵",
		Target: ["ItemEars"],
		TargetSelf: ["ItemEars"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["UseHands", "UseArms"]
	}, {
		Name: "Act_捂住眼睛",
		Target: ["ItemHead"],
		TargetSelf: ["ItemHead"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["UseHands", "UseArms"],
	}, {
		Name: "Act_捂住头",
		Target: ["ItemHead"],
		TargetSelf: ["ItemHead"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["UseHands", "UseArms"],
	}, {
		Name: "Act_捂住下体",
		Target: ["ItemVulva"],
		TargetSelf: ["ItemVulva"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["UseHands", "UseArms"],
	}, {
		Name: "Act_拍打头",
		Target: ["ItemHead"],
		TargetSelf: ["ItemHead"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["UseHands", "UseArms"],
	}, {
		Name: "Act_掀开裙子",
		Target: ["ItemButt"],
		TargetSelf: ["ItemButt"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["UseHands", "UseArms"] /*记得添加裙子*/
	}, {
		Name: "Act_挥手",
		Target: ["ItemHands"],
		TargetSelf: [],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["UseHands", "UseArms"],
	}, {
		Name: "Act_伸出手",
		Target: [],
		TargetSelf: ["ItemHands"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["UseHands", "UseArms"],
	}, {
		Name: "Act_拉扯衣角",
		Target: ["ItemPelvis"],
		TargetSelf: [],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["UseHands", "UseArms"]
	}, {
		Name: "Act_捂住胸",
		Target: [],
		TargetSelf: ["ItemBreast"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["UseHands", "UseArms"]
	}, {
		Name: "Act_弹",
		Target: ["ItemHead", "ItemVulvaPiercings"],
		TargetSelf: [],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["UseHands"],
	}, {
		Name: "Act_抱",
		Target: ["ItemLegs"],
		TargetSelf: [],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["UseHands", "UseArms"],
	}, {
		Name: "Act_脚托起下巴",
		Target: ["ItemMouth"],
		TargetSelf: [],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["Haskneel"],
	}, {
		Name: "Act_脚托起下巴2",
		Target: ["ItemMouth"],
		TargetSelf: [],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["Hasprone"],
	}, {
		Name: "Act_手托起下巴",
		Target: ["ItemMouth"],
		TargetSelf: [],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["UseHands"],
	}, {
		Name: "Act_拽链子",
		Target: ["ItemNeck"],
		TargetSelf: [],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["Hasleash"],
	}, {
		Name: "Act_摇晃尾巴",
		Target: [],
		TargetSelf: ["ItemButt"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["HasTail"]
	}, {
		Name: "Act_竖起尾巴",
		Target: [],
		TargetSelf: ["ItemButt"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["HasTailCat"]
	}, {
		Name: "Act_炸毛",
		Target: [],
		TargetSelf: ["ItemButt"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["HasTailCat"]
	}, {
		Name: "Act_舔尾巴",
		Target: ["ItemButt"],
		TargetSelf: ["ItemButt"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["HasTailCat"]
	}, {
		Name: "Act_轻抚尾巴",
		Target: ["ItemButt"],
		TargetSelf: ["ItemButt"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["HasTailCat"]
	}, {
		Name: "Act_尾巴叼在嘴里",
		Target: ["ItemButt"],
		TargetSelf: ["ItemButt"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["HasTailCat"]
	}, {
		Name: "Act_抬起屁股",
		Target: [],
		TargetSelf: ["ItemButt"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: []
	}, {
		Name: "Act_扇动翅膀",
		Target: [],
		TargetSelf: ["ItemArms"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["HasWings"]
	}, {
		Name: "Act_躲到身后",
		Target: ["ItemTorso"],
		TargetSelf: [],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: []
	}, {
		Name: "Act_移动到身后",
		Target: ["ItemTorso"],
		TargetSelf: [],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: [],
	}, {
		Name: "Act_下巴搭在肩膀上",
		Target: ["ItemNeck"],
		TargetSelf: [],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["UseHands"],
	}, {
		Name: "Act_手臂搭在肩膀上",
		Target: ["ItemNeck"],
		TargetSelf: [],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["UseHands"],
	}, {
		Name: "Act_搂腰",
		Target: ["ItemTorso"],
		TargetSelf: [],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["UseHands"],
	}, {
		Name: "Act_身体颤抖",
		Target: [],
		TargetSelf: ["ItemTorso"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: [],
	}, {
		Name: "Act_身体抽搐",
		Target: [],
		TargetSelf: ["ItemTorso"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: [],
	}, {
		Name: "Act_托起乳房",
		Target: ["ItemBreast"],
		TargetSelf: ["ItemBreast"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: []
	}, {
		Name: "Act_揉搓乳头",
		Target: ["ItemNipples"],
		TargetSelf: ["ItemNipples"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["UseHands", "ZoneNaked", "UseArms"]
	}, {
		Name: "Act_双腿颤抖",
		Target: [],
		TargetSelf: ["ItemLegs"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: []
	}, {
		Name: "Act_摇晃双腿",
		Target: [],
		TargetSelf: ["ItemLegs"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: []
	}, {
		Name: "Act_流出液体",
		Target: [],
		TargetSelf: ["ItemVulva"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: []
	}, {
		Name: "Act_失禁",
		Target: [],
		TargetSelf: ["ItemVulva"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: []
	}, {
		Name: "Act_手指插进阴道",
		Target: ["ItemVulva"],
		TargetSelf: ["ItemVulva"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["UseHands", "ZoneNaked", "TargetZoneNaked"]
	}, {
		Name: "Act_蠕动手指",
		Target: ["ItemVulva"],
		TargetSelf: ["ItemVulva"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["UseHands", "ZoneNaked", "TargetZoneNaked"]
	}, {
		Name: "Act_快速抽插",
		Target: ["ItemVulva"],
		TargetSelf: ["ItemVulva"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["UseHands", "ZoneNaked", "TargetZoneNaked"]
	}, {
		Name: "Act_钩住阴蒂环",
		Target: ["ItemVulvaPiercings"],
		TargetSelf: ["ItemVulvaPiercings"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["UseHands"],
	}, {
		Name: "Act_宠物服爬到脚边",
		Target: ["ItemBoots"],
		TargetSelf: [],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["HasPet"]
	}, {
		Name: "Act_宠物服蹭腿",
		Target: ["ItemLegs", "ItemFeet"],
		TargetSelf: [],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["HasPet"]
	}, {
		Name: "Act_宠物服趴下",
		Target: [],
		TargetSelf: ["ItemLegs"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["HasPet"]
	}, {
		Name: "Act_扑",
		Target: ["ItemArms"],
		TargetSelf: [],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["HasPet"]
	}, {
		Name: "Act_猫爪手套挠",
		Target: ["ItemHands", "ItemArms"],
		TargetSelf: [],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["HasPawMittens"]
	}, {
		Name: "Act_猫爪手套舔",
		Target: [],
		TargetSelf: ["ItemHands"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["HasPawMittens"]
	}, {
		Name: "Act_猫爪手套戳",
		Target: ["ItemMouth", "ItemNose"],
		TargetSelf: ["ItemMouth"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["HasPawMittens"],
	}, {
		Name: "Act_猫爪手套揉",
		Target: ["ItemMouth", "ItemNose"],
		TargetSelf: ["ItemMouth"],
		MaxProgress: 50,
		MaxProgressSelf: 50,
		Prerequisite: ["HasPawMittens"],
	}, ];

	function addActivityEntry(activityName, label, description) {
		ActivityDictionary.push([`ActivityAct_${activityName}`, activityName]);
		ActivityDictionary.push([`Label-Chat${label}`, activityName]);
		ActivityDictionary.push([`Chat${label}`, description]);
	}

	function addAccAction1(actionName, target, bodyPart, group, actionText, image, imageName) {
		addActivityEntry(actionName, `${target}-${bodyPart}-${group}`, actionText);
		CustomImages.set(`${group}`, `${image}${imageName}${Act_PNG}`);
	}

	function addAccAction2(actionName, bodyPart, group, selfText, otherText, image, imageName) {
		addActivityEntry(actionName, `Self-${bodyPart}-${group}`, selfText);
		addActivityEntry(actionName, `Other-${bodyPart}-${group}`, otherText);
		CustomImages.set(`${group}`, `${image}${imageName}${Act_PNG}`);
	}
	mod.hookFunction("LoginResponse", 10, (args, next) => {
		addAccAction1("歪头", "Self", "ItemNeck", "Act_歪头", "SourceCharacter歪头.", Act_AFA, "Wiggle");
		addAccAction1("环顾四周", "Self", "ItemNeck", "Act_环顾四周", "SourceCharacter慢慢地环视了周围.", Act_AFA,
		"Wiggle");
		addAccAction1("上下打量", "Other", "ItemHead", "Act_上下打量", "SourceCharacter仔细打量了一下TargetCharacter.",
			Act_AFA, "Wiggle");
		addAccAction1("闭上眼睛", "Self", "ItemHead", "Act_闭上眼睛", "SourceCharacter闭上了自己的眼睛.", Act_AFA,
		"Wiggle");
		addAccAction1("眼神呆滞", "Self", "ItemHead", "Act_眼神呆滞", "SourceCharacter眼神呆滞地看着前方.", Act_AFA,
			"Wiggle");
		addAccAction1("眼睛湿润", "Self", "ItemHead", "Act_眼睛湿润", "SourceCharacter的眼睛湿润了.", Act_AFA,
			"MoanGagWhimper");
		addAccAction1("流眼泪", "Self", "ItemHead", "Act_流眼泪", "SourceCharacter的眼泪从眼角流下.", Act_AFA,
			"MoanGagWhimper");
		addAccAction1("张开嘴", "Self", "ItemMouth", "Act_张开嘴", "SourceCharacter张开了PronounPossessive的嘴.",
			Act_AFA, "Kiss");
		addAccAction1("吞咽口水", "Self", "ItemNeck", "Act_吞咽口水", "SourceCharacter吞咽PronounPossessive嘴里的口水.",
			Act_AFA, "MoanGagWhimper");
		addAccAction1("流口水", "Self", "ItemMouth", "Act_流口水", "SourceCharacter的口水顺着嘴角流下.", Act_AFA,
			"MoanGagWhimper");
		addAccAction1("轻声喘息", "Self", "ItemMouth", "Act_轻声喘息", "SourceCharacter发出轻声地喘息.", Act_AFA,
			"MoanGagGroan");
		addAccAction1("打哈欠", "Self", "ItemMouth", "Act_打哈欠", "SourceCharacter张嘴打哈欠.", Act_AFA, "Kiss");
		addAccAction1("嘘", "Self", "ItemMouth", "Act_嘘", "SourceCharacter食指伸到自己嘴前发出嘘的声音.", Act_AFA,
			"MoanGagTalk");
		addAccAction2("舔手", "ItemHands", "Act_舔手", "SourceCharacter舔PronounPossessive自己的手.",
			"SourceCharacter舔TargetCharacter的手.", Act_AFA, "MasturbateTongue");
		addAccAction2("舔手指", "ItemHands", "Act_舔手指", "SourceCharacter舔PronounPossessive自己的手指.",
			"SourceCharacter舔TargetCharacter的手指.", Act_AFA, "MasturbateTongue");
		addAccAction2("吮吸手指", "ItemHands", "Act_吮吸手指", "SourceCharacter吮吸PronounPossessive的手指.",
			"SourceCharacter吮吸TargetCharacter的手指.", Act_AFA, "FrenchKiss");
		addAccAction1("舔脸", "Other", "ItemMouth", "Act_舔脸", "SourceCharacter舔TargetCharacter的脸.", Act_AFA,
			"MasturbateTongue");
		addAccAction1("舔脚", "Other", "ItemBoots", "Act_舔脚", "SourceCharacter舔TargetCharacter的脚.", Act_AFA,
			"MasturbateTongue");
		addAccAction1("嗅", "Other", "ItemHands", "Act_嗅", "SourceCharacter用鼻子嗅了嗅TargetCharacter的手.",
			Act_AFA, "Kiss");
		addAccAction1("跪下", "Self", "ItemLegs", "Act_跪下", "SourceCharacter轻轻地跪了下来.", Act_AFA, "Wiggle");
		addAccAction1("站起来", "Self", "ItemLegs", "Act_站起来", "SourceCharacter手扶着地站了起来.", Act_AFA, "Wiggle");
		addAccAction1("跪着张开腿", "Self", "ItemLegs", "Act_跪着张开双腿", "SourceCharacter张开了PronounPossessive的腿.",
			Act_AFA, "Wiggle");
		addAccAction1("跪着合并腿", "Self", "ItemLegs", "Act_跪着合并双腿", "SourceCharacter并拢了PronounPossessive的腿.",
			Act_AFA, "Wiggle");
		addAccAction1("手放身后", "Self", "ItemArms", "Act_手放身后", "SourceCharacter把PronounPossessive的手放在了身后.",
			Act_AFA, "Caress");
		addAccAction1("手放身前", "Self", "ItemArms", "Act_手放身前", "SourceCharacter把PronounPossessive的手放在了身后.",
			Act_AFA, "Caress");
		addAccAction1("趴下", "Self", "ItemBoots", "Act_趴下", "SourceCharacter手放身后趴在地上.", Act_AFA, "Wiggle");
		addAccAction1("四肢着地", "Self", "ItemBoots", "Act_四肢着地", "SourceCharacter四肢着地趴在地上.", Act_AFA,
			"Wiggle");
		addAccAction1("起身跪下", "Self", "ItemBoots", "Act_起身跪下", "SourceCharacter起身跪下.", Act_AFA, "Wiggle");
		addAccAction1("起身跪下", "Self", "ItemBoots", "Act_起身跪下2", "SourceCharacter起身跪下.", Act_AFA, "Wiggle");
		addAccAction1("爬到脚边", "Other", "ItemBoots", "Act_爬到脚边", "SourceCharacter爬到TargetCharacter的脚边.",
			Act_AFA, "Wiggle");
		addAccAction1("蹭腿", "Other", "ItemLegs", "Act_蹭腿", "SourceCharacter用头轻轻蹭TargetCharacter的腿.",
			Act_AFA, "Wiggle");
		addAccAction1("蹭腿", "Other", "ItemFeet", "Act_蹭腿", "SourceCharacter用头轻轻蹭TargetCharacter的腿.",
			Act_AFA, "Wiggle");
		addAccAction1("踮起双脚", "Self", "ItemBoots", "Act_踮起双脚", "SourceCharacter踮起PronounPossessive的双脚.",
			Act_AFA, "Kick");
		addAccAction1("摇晃脚踝", "Self", "ItemBoots", "Act_摇晃脚踝", "SourceCharacter摇晃PronounPossessive的脚踝.",
			Act_AFA, "Wiggle");
		addAccAction1("伸出脚", "Self", "ItemBoots", "Act_伸出脚", "SourceCharacter伸出PronounPossessive的脚.",
			Act_AFA, "Kick");
		addAccAction1("夹紧双腿", "Self", "ItemLegs", "Act_夹紧双腿", "SourceCharacter夹紧TargetCharacter的双腿.",
			Act_AFA, "Wiggle");
		addAccAction1("掰开双腿", "Other", "ItemLegs", "Act_掰开双腿", "SourceCharacter掰开TargetCharacter的双腿.",
			Act_AFA, "Wiggle");
		addAccAction1("脚托起下巴", "Other", "ItemMouth", "Act_脚托起下巴", "SourceCharacter用脚托起TargetCharacter的下巴.",
			Act_AFA, "Kick");
		addAccAction1("脚托起下巴2", "Other", "ItemMouth", "Act_脚托起下巴2",
			"SourceCharacter用脚托起TargetCharacter的下巴.", Act_AFA, "Kick");
		addAccAction2("戳脸", "ItemMouth", "Act_戳脸", "SourceCharacter戳了戳自己的脸.",
			"SourceCharacter戳了戳TargetCharacter的脸.", Act_AFA, "Caress");
		addAccAction2("捏脸", "ItemMouth", "Act_捏脸", "SourceCharacter捏了捏自己的脸.",
			"SourceCharacter捏了捏TargetCharacter的脸.", Act_AFA, "Pinch");
		addAccAction2("戳手臂", "ItemArms", "Act_戳手臂", "SourceCharacter戳了戳自己的手臂.",
			"SourceCharacter戳了戳TargetCharacter的手臂.", Act_AFA, "Caress");
		addAccAction2("揉脸", "ItemMouth", "Act_揉脸", "SourceCharacter揉了揉自己的脸.",
			"SourceCharacter揉了揉TargetCharacter的脸.", Act_AFA, "Wiggle");
		addAccAction2("摇晃手臂", "ItemArms", "Act_摇晃手臂", "SourceCharacter摇晃自己的手臂.",
			"SourceCharacter摇晃TargetCharacter的手臂.", Act_AFA, "Wiggle");
		addAccAction1("轻推", "Other", "ItemTorso", "Act_轻推", "SourceCharacter用手轻推TargetCharacter的身体.",
			Act_AFA, "Slap");
		addAccAction1("托起脚", "Other", "ItemBoots", "Act_托起脚", "SourceCharacter托起TargetCharacter的脚.",
			Act_AFA, "Caress");
		addAccAction1("扭动手腕", "Self", "ItemHands", "Act_扭动手腕", "SourceCharacter扭动PronounPossessive的手腕.",
			Act_AFA, "Wiggle");
		addAccAction1("挠头", "Self", "ItemHead", "Act_挠头", "SourceCharacter用手挠了挠PronounPossessive的头.",
			Act_AFA, "Pull");
		addAccAction2("盖住耳朵", "ItemEars", "Act_捂住耳朵", "SourceCharacter用手盖住了自己的耳朵.",
			"SourceCharacter用手盖住了TargetCharacter的耳朵.", Act_AFA, "HandGag");
		addAccAction2("捂住眼睛", "ItemHead", "Act_捂住眼睛", "SourceCharacter捂住自己的眼睛.",
			"SourceCharacter捂住TargetCharacter的眼睛.", Act_AFA, "HandGag");
		addAccAction2("捂住头", "ItemHead", "Act_捂住头", "SourceCharacter捂住自己的头.",
			"SourceCharacter捂住TargetCharacter的头.", Act_AFA, "HandGag");
		addAccAction2("捂住下体", "ItemVulva", "Act_捂住下体", "SourceCharacter捂住自己的下体.",
			"SourceCharacter捂住TargetCharacter的下体.", Act_AFA, "HandGag");
		addAccAction2("拍头", "ItemHead", "Act_拍打头", "SourceCharacter拍打自己的头.",
			"SourceCharacter拍了拍TargetCharacter的头.", Act_AFA, "Slap");
		addAccAction2("掀开裙子", "ItemButt", "Act_掀开裙子", "SourceCharacter掀开PronounPossessive的裙子.",
			"SourceCharacter掀开TargetCharacter的裙子.", Act_AFA, "MasturbateHand");
		addAccAction1("挥手", "Other", "ItemHands", "Act_挥手", "SourceCharacter向TargetCharacter挥手.", Act_AFA,
			"Slap");
		addAccAction1("伸出手", "Self", "ItemHands", "Act_伸出手", "SourceCharacter伸出自己的手.", Act_AFA, "Caress");
		addAccAction1("拉扯衣角", "Other", "ItemPelvis", "Act_拉扯衣角", "SourceCharacter用手拉扯TargetCharacter的衣角.",
			Act_AFA, "Pull");
		addAccAction1("捂住胸", "Self", "ItemBreast", "Act_捂住胸", "SourceCharacter捂住自己的胸.", Act_AFA, "Pull");
		addAccAction1("手托起下巴", "Other", "ItemMouth", "Act_手托起下巴", "SourceCharacter用手托起TargetCharacter的下巴.",
			Act_AFA, "Caress");
		addAccAction1("拽链子", "Other", "ItemNeck", "Act_拽链子", "SourceCharacter拽TargetCharacter的链子.", Act_AFA,
			"MasturbateHand");
		addAccAction1("弹", "Other", "ItemHead", "Act_弹", "SourceCharacter弹了一下TargetCharacter的额头.", Act_AFA,
			"Pinch");
		addAccAction1("弹", "Other", "ItemVulvaPiercings", "Act_弹", "SourceCharacter弹了一下TargetCharacter的阴蒂.",
			Act_AFA, "Pinch");
		addAccAction1("摇晃尾巴", "Self", "ItemButt", "Act_摇晃尾巴", "SourceCharacter摇晃PronounPossessive的尾巴.",
			Act_AFA, "Wiggle");
		addAccAction1("竖起尾巴", "Self", "ItemButt", "Act_竖起尾巴", "SourceCharacter的尾巴竖了起来.", Act_AFA, "Wiggle");
		addAccAction1("炸毛", "Self", "ItemButt", "Act_炸毛", "SourceCharacter弓起后背,身体的毛发立了起来,发出嘶的声音.", Act_AFA,
			"Bite");
		addAccAction2("舔尾巴", "ItemButt", "Act_舔尾巴", "SourceCharacter舔自己的尾巴.",
			"SourceCharacter舔TargetCharacter的尾巴.", Act_AFA, "MasturbateTongue");
		addAccAction2("轻抚尾巴", "ItemButt", "Act_轻抚尾巴", "SourceCharacter轻抚PronounPossessive的尾巴.",
			"SourceCharacter轻抚TargetCharacter的尾巴.", Act_AFA, "Caress");
		addAccAction2("尾巴叼在嘴里", "ItemButt", "Act_尾巴叼在嘴里", "SourceCharacter把自己的尾巴叼在嘴里.",
			"SourceCharacter叼起PronounPossessive的尾巴.", Act_AFA, "Kiss");
		addAccAction1("抬起屁股", "Self", "ItemButt", "Act_抬起屁股", "SourceCharacter弯腰抬起PronounPossessive的屁股.",
			Act_AFA, "Wiggle");
		addAccAction1("扇动翅膀", "Self", "ItemArms", "Act_扇动翅膀", "SourceCharacter扇动PronounPossessive的翅膀.",
			Act_AFA, "Wiggle");
		addAccAction1("躲到身后", "Other", "ItemTorso", "Act_躲到身后", "SourceCharacter躲到TargetCharacter的身后.",
			Act_AFA, "SistersHug");
		addAccAction1("移动到身后", "Other", "ItemTorso", "Act_移动到身后", "SourceCharacter移动到TargetCharacter的身后.",
			Act_AFA, "SistersHug");
		addAccAction1("下巴搭在肩膀上", "Other", "ItemNeck", "Act_下巴搭在肩膀上",
			"SourceCharacter把下巴搭在TargetCharacter的肩膀上.", Act_AFA, "RestHead");
		addAccAction1("手臂搭在肩膀上", "Other", "ItemNeck", "Act_手臂搭在肩膀上",
			"SourceCharacter把手臂搭在TargetCharacter的肩膀上.", Act_AFA, "Slap");
		addAccAction1("搂腰", "Other", "ItemTorso", "Act_搂腰", "SourceCharacter搂住TargetCharacter的腰.", Act_AFA,
			"SistersHug");
		addAccAction1("身体颤抖", "Self", "ItemTorso", "Act_身体颤抖", "SourceCharacter身体在颤抖.", Act_AFA, "Wiggle");
		addAccAction1("身体抽搐", "Self", "ItemTorso", "Act_身体抽搐", "SourceCharacter身体在抽搐.", Act_AFA, "Wiggle");
		addAccAction2("托起乳房", "ItemBreast", "Act_托起乳房", "SourceCharacter托起PronounPossessive的双乳.",
			"SourceCharacter托起TargetCharacter的双乳.", Act_AFA, "Wiggle");
		addAccAction2("揉搓乳头", "ItemNipples", "Act_揉搓乳头", "SourceCharacter用手捏住PronounPossessive的乳头,开始揉搓.",
			"SourceCharacter用手捏住TargetCharacter的乳头,开始揉搓.", Act_AFA, "Pinch");
		addAccAction1("双腿颤抖", "Self", "ItemLegs", "Act_双腿颤抖", "SourceCharacter的双腿颤抖着.", Act_AFA, "Wiggle");
		addAccAction1("摇晃双腿", "Self", "ItemLegs", "Act_摇晃双腿", "SourceCharacter摇晃自己的双腿.", Act_AFA, "Wiggle");
		addAccAction1("流出液体", "Self", "ItemVulva", "Act_流出液体", "有液体顺着SourceCharacter的大腿流了下来.", Act_AFA,
			"MoanGagWhimper");
		addAccAction1("失禁", "Self", "ItemVulva", "Act_失禁", "SourceCharacter的尿液顺着PronounPossessive大腿流了下来.",
			Act_AFA, "MoanGagWhimper");
		addAccAction1("抱", "Other", "ItemLegs", "Act_抱", "SourceCharacter抱住TargetCharacter的腿.", Act_AFA,
			"Wiggle");
		addAccAction2("手指插进阴道", "ItemVulva", "Act_手指插进阴道", "SourceCharacter手指插进自己的的阴道内.",
			"SourceCharacter手指插进TargetCharacter的阴道内.", Act_AFA, "MasturbateHand");
		addAccAction2("拔出自己的手指", "ItemVulva", "Act_拔出自己的手指",
			"SourceCharacter从PronounPossessive的阴道内拔出自己的手指,手指连着自己的爱液.",
			"SourceCharacter从TargetCharacter的阴道内拔出自己的手指,手指连着PronounPossessive的爱液.", Act_AFA,
			"MasturbateHand");
		addAccAction2("蠕动手指", "ItemVulva", "Act_蠕动手指", "SourceCharacter在PronounPossessive的阴道内蠕动手指.",
			"SourceCharacter在TargetCharacter的阴道内蠕动手指.", Act_AFA, "Grope");
		addAccAction2("快速抽插", "ItemVulva", "Act_快速抽插", "SourceCharacter的手在PronounPossessive的阴道内快速抽插,开始揉搓.",
			"SourceCharacter的手在TargetCharacter的阴道内快速抽插,开始揉搓.", Act_AFA, "Grope");
		addAccAction2("钩住阴蒂环", "ItemVulvaPiercings", "Act_钩住阴蒂环", "SourceCharacter钩住自己的阴蒂环.",
			"SourceCharacter钩住TargetCharacter的阴蒂环.", Act_AFA, "Pinch");
		addAccAction2("拉扯阴蒂环", "ItemVulvaPiercings", "Act_拉扯阴蒂环", "SourceCharacter拉了一下自己的阴蒂环又松开了.",
			"SourceCharacter拉了一下TargetCharacter的阴蒂环又松开了.", Act_AFA, "Pinch");
		addAccAction1("爬到脚边", "Other", "ItemBoots", "Act_宠物服爬到脚边", "SourceCharacter爬到TargetCharacter脚边.",
			Act_AFA, "Wiggle");
		addAccAction1("蹭腿", "Other", "ItemLegs", "Act_宠物服蹭腿", "SourceCharacter蹭TargetCharacter的腿.", Act_AFA,
			"Wiggle");
		addAccAction1("蹭腿", "Other", "ItemFeet", "Act_宠物服蹭腿", "SourceCharacter蹭TargetCharacter的腿.", Act_AFA,
			"Wiggle");
		addAccAction1("宠物服趴下", "Self", "ItemLegs", "Act_宠物服趴下", "SourceCharacter四肢着地趴在地上.", Act_AFA,
			"Wiggle");
		addAccAction1("手臂离地跪立", "Self", "ItemLegs", "Act_宠物服立起来", "SourceCharacter手臂离地跪立.", Act_AFA,
			"Wiggle");
		addAccAction1("扑", "Other", "ItemArms", "Act_扑", "SourceCharacter扑到TargetCharacter身上.", Act_AFA,
			"Wiggle");
		addAccAction1("挠", "Other", "ItemHands", "Act_猫爪手套挠", "SourceCharacter用爪子挠了一下TargetCharacter的手.",
			Act_手套, "PawMittens");
		addAccAction1("挠", "Other", "ItemArms", "Act_猫爪手套挠", "SourceCharacter用爪子挠了一下TargetCharacter的手臂.",
			Act_手套, "PawMittens");
		addAccAction1("舔", "Self", "ItemHands", "Act_猫爪手套舔", "SourceCharacter舔自己的爪子.", Act_手套,
		"PawMittens");
		addAccAction2("戳", "ItemMouth", "Act_猫爪手套戳", "SourceCharacter用爪子戳了戳自己的脸.",
			"SourceCharacter用爪子戳了戳TargetCharacter的脸.", Act_手套, "PawMittens");
		addAccAction2("戳", "ItemNose", "Act_猫爪手套戳", "SourceCharacter用爪子戳了戳自己的鼻子.",
			"SourceCharacter用爪子戳了戳TargetCharacter的鼻子.", Act_手套, "PawMittens");
		addAccAction2("揉", "ItemMouth", "Act_猫爪手套揉", "SourceCharacter用爪子揉了揉自己的脸.",
			"SourceCharacter用爪子揉了揉TargetCharacter的脸.", Act_手套, "PawMittens");
		addAccAction2("揉", "ItemNose", "Act_猫爪手套揉", "SourceCharacter用爪子揉了揉自己的鼻子.",
			"SourceCharacter用爪子揉了揉TargetCharacter的鼻子.", Act_手套, "PawMittens");
		next(args)
	});

	function processActivity3(data, 原本内容, 替换内容) {
		if (data.Sender === Player.MemberNumber && data.Content.includes(原本内容)) {
			activitiesToAdd.forEach(activity => {
				if (activity.Name === 原本内容) {
					activity.Name = 替换内容;
				}
			});
		}
		elseif(data.Sender === Player.MemberNumber && data.Content.includes(替换内容)) {
			activitiesToAdd.forEach(activity => {
				if (activity.Name === 替换内容) {
					activity.Name = 原本内容;
				}
			});
		}
	}
	mod.hookFunction("ChatRoomMessage", 0, (args, next) => {
		const data = args[0];
		processActivity3(data, "Act_跪下", "Act_站起来");
		processActivity3(data, "Act_跪着张开双腿", "Act_跪着合并双腿");
		processActivity3(data, "Act_手放身后", "Act_手放身前");
		processActivity3(data, "Act_趴下", "Act_起身跪下");
		processActivity3(data, "Act_四肢着地", "Act_起身跪下2");
		processActivity3(data, "Act_手指插进阴道", "Act_拔出自己的手指");
		processActivity3(data, "Act_钩住阴蒂环", "Act_拉扯阴蒂环");
		processActivity3(data, "Act_宠物服趴下", "Act_宠物服立起来");
		next(args);
	});
	activitiesToAdd.forEach((activity) => {
		ActivityFemale3DCG.push(activity);
		ActivityFemale3DCGOrdering.push(activity.Name);
	});
	mod.hookFunction("ActivityCheckPrerequisite", 5, (args, next) => {
		var prereqName = args[0];
		if (CustomPrerequisiteFuncs.has(prereqName)) {
			var acting = args[1];
			var acted = args[2];
			var targetGrp = args[3];
			var customPrereqFunc = CustomPrerequisiteFuncs.get(prereqName);
			if (!customPrereqFunc) return next(args);
			else {
				return customPrereqFunc(acting, acted, targetGrp);
			}
		}
		elsereturn next(args);
	});
	const CustomPrerequisiteFuncs = new Map();
	CustomPrerequisiteFuncs.set("HasTail", (acting, acted, group) => !!InventoryGet(acted, "TailStraps"));
	CustomPrerequisiteFuncs.set("HasWings", (acting, acted, group) => !!InventoryGet(acted, "Wings"));
	CustomPrerequisiteFuncs.set("Haskneel", (acting, acted, group) => !!acted.IsKneeling());
	CustomPrerequisiteFuncs.set("Hasprone", (acting, acted, group) => !!acted.IsProne());
	CustomPrerequisiteFuncs.set("Hasleash", (acting, acted, group) => !!ChatRoomCanBeLeashed(acted));
	CustomPrerequisiteFuncs.set("HasTailCat", (acting, acted, group) => !!InventoryIsItemInList(acted, "TailStraps",
		"TailStrap") || !!InventoryIsItemInList(acted, "TailStraps", "KittenTailStrap1"));
	CustomPrerequisiteFuncs.set("HasPawMittens", (acting, acted, group) => !!InventoryIsItemInList(acting,
		"ItemHands", "PawMittens"));
	CustomPrerequisiteFuncs.set("HasPet", (acting, acted, group) => !!InventoryIsItemInList(acting, "ItemArms",
			"BitchSuit") || !!InventoryIsItemInList(acting, "ItemArms", "PetCrawler") || !!
		InventoryIsItemInList(acting, "ItemArms", "StrictLeatherPetCrawler") || !!InventoryIsItemInList(acting,
			"ItemArms", "ShinyPetSuit"));
	const poseMapping = {
		"ChatSelf-ItemLegs-Act_跪下": "Kneel",
		"ChatSelf-ItemBoots-Act_起身跪下": "Kneel",
		"ChatSelf-ItemBoots-Act_起身跪下2": "Kneel",
		"ChatSelf-ItemLegs-Act_跪着合并双腿": "Kneel",
		"ChatSelf-ItemLegs-Act_跪着张开双腿": "KneelingSpread",
		"ChatSelf-ItemArms-Act_手放身后": "BackBoxTie",
		"ChatSelf-ItemBoots-Act_趴下": "Hogtied",
		"ChatSelf-ItemBoots-Act_四肢着地": "AllFours",
		"ChatSelf-ItemLegs-Act_站起来": null,
		"ChatSelf-ItemArms-Act_手放身前": null,
		"ChatSelf-ItemLegs-Act_宠物服立起来": "Hogtied",
		"ChatSelf-ItemLegs-Act_宠物服趴下": "AllFours"
	};
	mod.hookFunction("ChatRoomMessage", 0, (args, next) => {
		const data = args[0];
		const content = data.Content;
		if (data.Sender === Player.MemberNumber && poseMapping.hasOwnProperty(content)) {
			const poseName = poseMapping[content];
			CharacterSetActivePose(Player, poseName);
		}
		next(args);
	});
	mod.hookFunction("ChatRoomMessage", 0, (args, next) => {
		let data = args[0];
		if ((data.Sender === Player.MemberNumber || data.Sender !== Player.MemberNumber)) {
			const match = data.Content.match(/网易云 (\d+)/);
			if (match) {
				const 数字 = match[1];
				const iframe =
					`<iframe frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86 src="//music.163.com/outchain/player?type=2&id=${数字}&auto=1&height=66"></iframe>`;
				ChatRoomSendLocal(iframe);
			}
		}
		if ((data.Sender === Player.MemberNumber || data.Sender !== Player.MemberNumber)) {
			const match = data.Content.match(/哔哩哔哩 (.+)/);
			if (match) {
				const 参数字符串 = match[1];
				const aidMatch = 参数字符串.match(/aid=(\d+)/);
				const bvidMatch = 参数字符串.match(/bvid=([A-Za-z0-9]+)/);
				if (aidMatch && bvidMatch) {
					const aid = aidMatch[1];
					const bvid = bvidMatch[1];
					const iframe =
						`<iframe src="//player.bilibili.com/player.html?aid=${aid}&bvid=${bvid}&cid=1215423721&p=1" width="500" height="300" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"> </iframe>`;
					ChatRoomSendLocal(iframe);
				}
			}
		}
		if ((data.Sender === Player.MemberNumber || data.Sender !== Player.MemberNumber)) {
			const match = data.Content.match(/youtube (.+)/);
			if (match) {
				const 视频ID = match[1];
				const iframe =
					`<iframe width="560" height="315" src="https://www.youtube.com/embed/${视频ID}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
				ChatRoomSendLocal(iframe);
			}
		}
		next(args);
	});
	let currentLanguage = '';
	let currentLanguage2 = '';
	mod.hookFunction("ChatRoomMessage", 0, (args, next) => {
		const data = args[0];
		console.log(data);
		let luzi = InventoryGet(Player, "ItemEars");
		if (luzi === null) {
			currentLanguage = '';
		} else if (luzi && luzi.Asset.Name === "FuturisticEarphones" && luzi.Craft && luzi.Craft
			.Description) {
			currentLanguage = luzi.Craft.Description.replace(/["'‘’“”]/g, '');
		} else {}
		let luzi2 = InventoryGet(Player, "ItemMisc");
		if ((data.Sender === Player.MemberNumber && data.Content === "ActionRemove" && data.Dictionary[3]
				.GroupName === "ItemMisc") || (data.Sender === Player.MemberNumber && data.Content ===
				"ActionSwap" && data.Dictionary[3].GroupName === "ItemMisc")) {
			currentLanguage2 = '';
		}
		if (luzi2 !== null) {
			if (luzi2.Craft && luzi2.Craft.Description && (luzi2.Craft.Description.includes('"') || luzi2
					.Craft.Description.includes("'"))) {
				const validAssetNames = ["TeddyBear", "PetPotato", "BunPlush", "FoxPlush", "Karl"];
				if (validAssetNames.includes(luzi2.Asset.Name)) {
					currentLanguage2 = luzi2.Craft.Description.replace(/["'‘’“”]/g, '');
				}
			}
		}
		if (data.Sender !== Player.MemberNumber && (data.Type === "Chat" || data.Type === "Whisper" || data
				.Type === "Emote") && !data.Content.includes("[T]") && !data.Content.includes("📞") && !data
			.Content.includes("🔊") && !data.Content.includes("\\") && !data.Content.includes("/")) {
			let sourceText = data.Dictionary?.find(d => d.Tag === "BCX_ORIGINAL_MESSAGE")?.Text ?? data
				.Content;
			let sourceLang = 'auto';
			let targetLang = currentLanguage;
			if (targetLang !== sourceLang) {
				let url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" +
					sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURI(sourceText);
				fetch(url).then(response => response.json()).then((dt) => {
					if (dt && dt[0] && dt[0][0] && dt[0][0][0]) {
						let translatedText = dt[0][0][0].replace("[T]", "");
						if (translatedText !== sourceText) {
							ChatRoomMessage({
								Content: "📞 " + translatedText,
								Type: "Chat",
								Sender: Player.MemberNumber,
								Dictionary: [{
									Tag: '发送私聊',
									Text: 1
								}]
							});
						}
					} else {}
				}).catch(error => {});
			}
		}
		if (data.Sender === Player.MemberNumber && (data.Type === "Chat" || data.Type === "Whisper" || data
				.Type === "Emote") && !data.Content.includes("[T]") && !data.Content.includes("📞") && !data
			.Content.includes("🔊") && !data.Content.includes("\\") && !data.Content.includes("/")) {
			let sourceText = data.Dictionary?.find(d => d.Tag === "BCX_ORIGINAL_MESSAGE")?.Text ?? data
				.Content;
			let sourceLang = 'auto';
			let targetLang = currentLanguage2;
			if (targetLang !== sourceLang) {
				let url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" +
					sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURI(sourceText);
				fetch(url).then(response => response.json()).then((dt) => {
					if (dt && dt[0] && dt[0][0] && dt[0][0][0]) {
						let translatedText = dt[0][0][0].replace("[T]", "");
						if (translatedText !== sourceText) {
							ServerSend("ChatRoomChat", {
								Content: "🔊 " + translatedText,
								Type: "Chat",
								Dictionary: [{
									SourceCharacter: !Player.MemberNumber
								}, {
									TargetCharacter: Player.MemberNumber
								}, {
									Tag: 'FocusAssetGroup',
									FocusGroupName: '0 0'
								}, {
									ActivityName: '0 0'
								}, {
									Tag: '0 0',
									Text: 10
								}, ]
							});
						}
					} else {}
				}).catch(error => {});
			}
		}
		next(args);
	});
})();
