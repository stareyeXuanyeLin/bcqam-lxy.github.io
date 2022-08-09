(()=> {
	// 捕获元素聊天输入框的值
	var content = ElementValue("InputChat").trim();
	var cs = document.getElementById("InputChat");
	cs.addEventListener("keyup",(event)=>{
		if (event.keyCode == 13) {
			if (CurrentScreen == "ChatRoom") {
				if (content.indexOf("/lxy")) {
					ChatRoomSendLocal("插件安装成功啦~");
				}
			}
		}
	});
	
	// 处于聊天室中
	if (CurrentScreen == "ChatRoom") {
		if (content.indexOf("/lxy")) {
			ChatRoomSendLocal("插件安装成功啦~");
		}
	}
})();
