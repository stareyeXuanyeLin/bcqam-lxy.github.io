// 重写原版ChatRoomSendChat方法
function ChatRoomSendChatNew() {
	// 获取输入栏文本
	const msg = ElementValue("InputChat").trim();
	// 检查是否为控制台指令
	if(msg[0] == "/") {
		// 去除反斜杠并将首字母转换成大写
		let inst = msg.substring(1)[0].toUpperCase()+msg.substring(2);
		// 查找对应的函数并执行
		InstructionsCall("Instructions"+inst+"Call",msg);
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
	ChatRoomSendLocal("插件安装成功啦~");
	CommandParse("欢迎使用小夜的自定义插件，目前还在施工中呢~");
}

// 另存旧版方法
var ChatRoomSendChatUsed = ChatRoomSendChat;
// 重写原版方法
var ChatRoomSendChat = ChatRoomSendChatNew;
