// 重写原版ChatRoomSendChat方法
async function ChatRoomSendChatNew() {
	// If there's a message to send
	// 如果有消息要发送
	const msg = ElementValue("InputChat").trim();
	if (msg != "") {
		// 检查是否为控制台指令
		if(msg[0] == "/") {
			// 去除反斜杠并将首字母转换成大写
			let inst = msg[0].toLocaleUpperCase()+msg.substring(1);
			// 查找对应的函数并执行
			InstructionsCall("Instructions"+inst+"Call",msg);
		}
		// Keeps the chat log in memory so it can be accessed with pageup/pagedown
		// 将聊天日志保存在内存中，以便使用pageup/pagedown访问
		else {
			ChatRoomLastMessage.push(msg);
			ChatRoomLastMessageIndex = ChatRoomLastMessage.length;
			CommandParse(msg);
		}
	}
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
	CommandParse("欢迎使用小夜的自定义插件，目前还在施工中呢~")
}

// 重写原版方法
var ChatRoomSendChat = ChatRoomSendChatNew;
