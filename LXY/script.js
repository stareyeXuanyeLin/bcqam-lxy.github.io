(()=> {
	// 捕获元素聊天输入框的值
	var content = ElementValue("InputChat").trim();
	
	// 聊天室指令输入
	function commandLxy(event) {
		// 处于聊天室中
		if (CurrentScreen == "ChatRoom" && event.keyCode == 13) {
			if (content.indexOf("/lxy")) {
				ChatRoomSendLocal("插件安装成功啦~");
			}
		}
	}
	
	document.getElementById("InputChat").addEventListener("keyup",commandLxy);
})();
