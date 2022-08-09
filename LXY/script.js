async function commandLXY() {
	// 捕获元素聊天输入框的值
	var content = ElementValue("InputChat").trim();
	// 处于聊天室中
	if (CurrentScreen == "ChatRoom") {
		// 聊天室指令监测
		if (content.indexOf("/lxy")) {
			ChatRoomSendLocal("插件安装成功啦~");
		}
	}
	if (content != "") {
	
		// Keeps the chat log in memory so it can be accessed with pageup/pagedown
		ChatRoomLastMessage.push(content);
		ChatRoomLastMessageIndex = ChatRoomLastMessage.length;
	
		CommandParse(content);
	}
}

var ChatRoomSendChat = commandLXY;
