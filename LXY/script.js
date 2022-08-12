// 房间背景通用路径
const roomBackgroundRoute = [
	"Platform/Background/Castle/",
	"Platform/Background/Castle/Orig/",
	"Platform/Background/Forest/",
	"Platform/Background/Forest/Orig/",
	"Platform/Background/College/",
	"PlatformDialog/Background/",
];
// 房间背景名字
			const roomBackgroundName = [
				`${roomBackgroundRoute[0]}Balcony`,
				`${roomBackgroundRoute[5]}Balcony`,
				`${roomBackgroundRoute[0]}Ballroom`,
				`${roomBackgroundRoute[1]}BathroomOlivia`,
				`${roomBackgroundRoute[0]}BathroomOlivia`,
				`${roomBackgroundRoute[5]}BathroomOlivia`,
				`${roomBackgroundRoute[0]}BedroomDungeon`,
				`${roomBackgroundRoute[0]}BedroomEdward`,
				`${roomBackgroundRoute[0]}BedroomIsabella`,
				`${roomBackgroundRoute[5]}BedroomIsabella`,
				`${roomBackgroundRoute[0]}BedroomMelody`,
				`${roomBackgroundRoute[0]}BedroomOlivia`,
				`${roomBackgroundRoute[5]}BedroomOlivia`,
				`${roomBackgroundRoute[5]}BedroomOliviaDark`,
				`${roomBackgroundRoute[5]}Black`,
				`${roomBackgroundRoute[3]}CastleEntrance`,
				`${roomBackgroundRoute[5]}CastleHall`,
				`${roomBackgroundRoute[2]}CastleWall`,
				`${roomBackgroundRoute[3]}ClearPath`,
				`${roomBackgroundRoute[4]}CollegeArt1`,
				`${roomBackgroundRoute[4]}CollegeClass1`,
				`${roomBackgroundRoute[4]}CollegeHall1`,
				`${roomBackgroundRoute[0]}CountessHall`,
				`${roomBackgroundRoute[5]}CountessHall`,
				`${roomBackgroundRoute[0]}CountessHallDeadEnd`,
				`${roomBackgroundRoute[0]}Dungeon1C`,
				`${roomBackgroundRoute[0]}Dungeon1W`,
				`${roomBackgroundRoute[0]}DungeonCell`,
				`${roomBackgroundRoute[5]}DungeonCell`,
				`${roomBackgroundRoute[0]}DungeonStorage`,
				`${roomBackgroundRoute[5]}DungeonStorage`,
				`${roomBackgroundRoute[5]}DungeonStorageDark`,
				`${roomBackgroundRoute[2]}CabinInterior`,
				`${roomBackgroundRoute[2]}CabinPath`,
				`${roomBackgroundRoute[5]}ForestCabin`,
				`${roomBackgroundRoute[3]}WoodCabin`,
				`${roomBackgroundRoute[3]}GreenPlain`,
				`${roomBackgroundRoute[0]}Hall1C`,
				`${roomBackgroundRoute[0]}Hall1W`,
				`${roomBackgroundRoute[0]}Hall2C`,
				`${roomBackgroundRoute[0]}Hall3C`,
				`${roomBackgroundRoute[0]}Hall3Cv2`,
				`${roomBackgroundRoute[0]}Hall3E`,
				`${roomBackgroundRoute[0]}Hall3W`,
				`${roomBackgroundRoute[0]}Hall4C`,
				`${roomBackgroundRoute[0]}Hall4E`,
				`${roomBackgroundRoute[0]}Hall4W1`,
				`${roomBackgroundRoute[0]}Hall4W2`,
				`${roomBackgroundRoute[5]}MaidBed`,
				`${roomBackgroundRoute[3]}MountainPath`,
				`${roomBackgroundRoute[0]}Terrace`,
				`${roomBackgroundRoute[5]}Terrace`,
				`${roomBackgroundRoute[3]}VulturePlain`,
				`${roomBackgroundRoute[0]}WineCellar`,
				`${roomBackgroundRoute[5]}WineCellar`,
			];

// 重写原版ChatRoomSendChat方法
function ChatRoomSendChatNew() {
	// 获取输入栏文本
	const msg = ElementValue("InputChat").trim();
	// 检查是否为控制台指令
	if(msg[0] == "/") {
		// 去除反斜杠并将首字母转换成大写
		let inst = msg.substring(1).replace(msg[1],msg[1].toUpperCase());
		// 创建变量传入
		let funVal = inst;
		// 清除所有空格并将之后的字母替换成大写，如果是数字则截取作为参数传入
		while(inst.indexOf(" ") != -1) {
			// 如果空格之后的字符不是数字
			if(isNaN(inst.substring(inst.indexOf(" ")+1))) {
				// 获取空格位置索引
				let i = inst.indexOf(" ");
				// 删除空格并将之后的字母替换成大写
				inst = inst.replace(inst[i]+inst[i+1],inst[i+1].toLocaleUpperCase());
				funVal = inst;
			}
			// 如果是数字则截取数字用做变量
			if(!isNaN(inst.substring(inst.indexOf(" ")+1))) {
				// 截取末尾数字字符串用作变量
				funVal = inst.substring(inst.indexOf(" ")+1);
				inst = inst.replace(inst.substring(inst.indexOf(" ")),"");
			}
		}
		// 查找对应的函数并执行
		InstructionsCall("Instructions"+inst+"Call",funVal);
	}
	// 调用旧版方法
	ChatRoomSendChatUsed();
}

// 指令调用方法
function InstructionsCall(funName,...val) {
	if (typeof window[funName] === "function") {
		let rut = window[funName](...val);
		if (rut !== undefined) return rut;
	}
}

// 插件自定义指令
function InstructionsLxyCall() {
	ChatRoomSendLocal("插件安装成功啦~欢迎使用小夜的自定义插件，目前还在施工中呢~");
}

// 房间背景替换指令
function InstructionsBg2Call(bgName) {
	if (bgName == 0) {
		ChatRoomSendLocal(
			"<b>快速访问菜单2</b>：隐藏平台背景列表：\n"+
			"1，2阳台-3宴会厅\n"+
			"4到6浴室奥利维亚\n"+
			"7卧室地牢-8卧室爱德华\n"+
			"9，10卧室伊莎贝拉-11卧室旋律\n"+
			"12至14卧室Olivia-15黑色\n"+
			"16到18城堡-19畅通路径\n"+
			"20至22学院-23至25伯爵夫人厅\n"+
			"26、27地牢1-28、29地牢牢房\n"+
			"30到32个地下城存储\n"+
			"33至36森林小屋-37绿色平原\n"+
			"38至48号厅（1至4）-49号女仆床\n"+
			"50山路-51，52阶地\n"+
			"53秃鹫平原-54，55酒窖"
		);
	} else {
		if (bgName - 1 < 0 || bgName > roomBackgroundName.length) {
			ChatRoomSendLocal("错误，该编号的房间背景不存在！");
		} else {
			ChatCreateBackgroundSelect = `../Screens/Room/${roomBackgroundName[bgName-1]}`;
			updateBackground();
		}
	}
}

// QAM插件指令
function InstructionsBg2Call(inst) {
	
}

// 另存旧版方法
var ChatRoomSendChatUsed = ChatRoomSendChat;
// 重写原版方法
var ChatRoomSendChat = ChatRoomSendChatNew;
