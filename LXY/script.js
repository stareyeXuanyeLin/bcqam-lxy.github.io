class ChatRoomNew {
	roomBackRoute = [
		"Platform/Background/Castle/",
		"Platform/Background/Castle/Orig/",
		"Platform/Background/Forest/",
		"Platform/Background/Forest/Orig/",
		"Platform/Background/College/",
		"PlatformDialog/Background/",
	];
	roomBackName = [
		"$0Balcony",
		"$5Balcony",
		"$0Ballroom",
		"$1BathroomOlivia",
		"$0BathroomOlivia",
		"$5BathroomOlivia",
		"$0BedroomDungeon",
		"$0BedroomEdward",
		"$0BedroomIsabella",
		"$5BedroomIsabella",
		"$0BedroomMelody",
		"$0BedroomOlivia",
		"$5BedroomOlivia",
		"$5BedroomOliviaDark",
		"$5Black",
		"$3CastleEntrance",
		"$5CastleHall",
		"$2CastleWall",
		"$3ClearPath",
		"$4CollegeArt1",
		"$4CollegeClass1",
		"$4CollegeHall1",
		"$0CountessHall",
		"$5CountessHall",
		"$0CountessHallDeadEnd",
		"$0Dungeon1C",
		"$0Dungeon1W",
		"$0DungeonCell",
		"$5DungeonCell",
		"$0DungeonStorage",
		"$5DungeonStorage",
		"$5DungeonStorageDark",
		"$2CabinInterior",
		"$2CabinPath",
		"$5ForestCabin",
		"$3WoodCabin",
		"$3GreenPlain",
		"$0Hall1C",
		"$0Hall1W",
		"$0Hall2C",
		"$0Hall3C",
		"$0Hall3Cv2",
		"$0Hall3E",
		"$0Hall3W",
		"$0Hall4C",
		"$0Hall4E",
		"$0Hall4W1",
		"$0Hall4W2",
		"$5MaidBed",
		"$3MountainPath",
		"$0Terrace",
		"$5Terrace",
		"$3VulturePlain",
		"$0WineCellar",
		"$5WineCellar",
	];
	constructor(ChatRoomData, ChatCreateBackgroundSelect) {
		this.UpdatedRoom = {
			Name: ChatRoomData.Name,
			Description: ChatRoomData.Description,
			Language: ChatRoomData.Language,
			Background: ChatCreateBackgroundSelect,
			Limit: "" + ChatRoomData.Limit,
			Admin: ChatRoomData.Admin,
			Ban: ChatRoomData.Ban,
			BlockCategory: ChatRoomData.BlockCategory,
			Game: ChatRoomData.Game,
			Private: ChatRoomData.Private,
			Locked: ChatRoomData.Locked,
		};
	};
	// 根据索引获取聊天室背景名字
	getRoomBackNameByIndex(index) {
		let name = this.roomBackName[index];
		return "../Screens/Room/"+name.replace(name[0]+name[1],roomBackRoute[Number(name[1])]);
	}
	// 设置聊天室创建背景
	setBackground(ChatCreateBackgroundSelect) {
		this.UpdatedRoom.Background = ChatCreateBackgroundSelect;
	}
	// 将数据更新至服务器
	toupServerSend(playerID) {
		ServerSend("ChatRoomAdmin", {
			MemberNumber: playerID,
			Room: this.UpdatedRoom,
			Action: "Update",
		});
	}
}

// 重写原版ChatRoomSendChat方法
function ChatRoomSendChatNew() {
	// 获取输入栏文本
	const msg = ElementValue("InputChat").trim();
	// 检查是否为控制台指令
	if (msg[0] == "/") {
		// 去除反斜杠并将首字母转换成大写
		let inst = msg.substring(1).replace(msg[1], msg[1].toUpperCase());
		// 创建变量传入
		let funVal = inst;
		// 清除所有空格并将之后的字母转换成大写，如果最后一个空格后是数字则截取作为变量传入
		while (inst.indexOf(" ") != -1) {
			// 如果空格之后的字符不是数字
			if (isNaN(inst.substring(inst.indexOf(" ") + 1))) {
				// 获取空格位置索引
				let i = inst.indexOf(" ");
				// 删除空格并将之后的字母替换成大写
				inst = inst.replace(inst[i] + inst[i + 1], inst[i + 1].toLocaleUpperCase());
				funVal = inst;
			}
			// 如果是数字则截取数字用做变量
			if (!isNaN(inst.substring(inst.indexOf(" ") + 1))) {
				// 截取末尾数字字符串用作变量
				funVal = inst.substring(inst.indexOf(" ") + 1);
				inst = inst.replace(inst.substring(inst.indexOf(" ")), "");
			}
		}
		// 查找对应的函数并执行
		InstructionsCall("Instructions" + inst + "Call", funVal);
	}
	// 调用旧版方法
	ChatRoomSendChatUsed();
}

// 指令调用方法
function InstructionsCall(funName, ...val) {
	if (typeof window[funName] === "function") {
		let rut = window[funName](...val);
		if (rut !== undefined) return rut;
	}
}

// 插件自定义指令
function InstructionsLxyCall() {
	ChatRoomSendLocal("插件安装成功啦~欢迎使用小夜的自定义插件，目前还在施工中呢~");
}

// QAM-房间背景替换指令
function InstructionsBg2Call(bgName) {
	if (bgName == 0) {
		ChatRoomSendLocal(
			"<b>快速访问菜单2</b>：隐藏平台背景列表：\n" +
			"1，2阳台-3宴会厅\n" +
			"4到6浴室奥利维亚\n" +
			"7卧室地牢-8卧室爱德华\n" +
			"9，10卧室伊莎贝拉-11卧室旋律\n" +
			"12至14卧室Olivia-15黑色\n" +
			"16到18城堡-19畅通路径\n" +
			"20至22学院-23至25伯爵夫人厅\n" +
			"26、27地牢1-28、29地牢牢房\n" +
			"30到32个地下城存储\n" +
			"33至36森林小屋-37绿色平原\n" +
			"38至48号厅（1至4）-49号女仆床\n" +
			"50山路-51，52阶地\n" +
			"53秃鹫平原-54，55酒窖"
		);
	} else {
		if (bgName - 1 < 0 || bgName > chatRoomNew.roomBackName.length) {
			ChatRoomSendLocal("错误，该编号的房间背景不存在！");
		} else {
			// 修改本地房间背景路径
			// var ChatCreateBackgroundSelect = `../Screens/Room/${roomBackgroundName[bgName-1]}`;
			chatRoomNew.setBackground(bgName);
			// 更新至服务器中
			// updateBackground();
			chatRoomNew.toupServerSend(Player.ID);
		}
	}
}

// 另存旧版方法
var ChatRoomSendChatUsed = ChatRoomSendChat;
// 重写原版方法
var ChatRoomSendChat = ChatRoomSendChatNew;
// 声明
var chatRoomNew = new ChatRoomNew(ChatRoomData,ChatCreateBackgroundSelect);
