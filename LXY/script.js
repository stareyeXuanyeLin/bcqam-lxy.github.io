// 脚本本体
async function BondageClubLinXuanye() {
	// 捕获元素聊天输入框的值
	var content = ElementValue("InputChat").trim();
	// 处于聊天室中
	if (CurrentScreen == "ChatRoom") {
		if (content.indexOf("/lxy")) {
			ChatRoomSendLocal("插件安装成功啦~");
		}
	}
	
	var ChatRoomInput = document.getElementById("InputChat");
	ChatRoomInput.addEventListener("keyup",(event)=>{
		event.preventDefault();
		if (event.keyCode == 13) {
			console.log("插件安装成功~");
		}
	});
}

BondageClubLinXuanye();
