(()=> {
	// 捕获元素聊天输入框的值
	var content = ElementValue("InputChat").trim();
	
	// 处于聊天室中
	if (CurrentScreen == "ChatRoom") {
		if (content.indexOf("/lxy") == 0 && content.endsWith("/lxy")) {
			ChatRoomSendLocal("插件安装成功啦~")
		}
	}
})();
