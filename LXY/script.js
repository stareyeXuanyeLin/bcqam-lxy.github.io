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
}
var OLDmenu = ChatRoomSendChat;
var ChatRoomSendChat = BondageClubLinXuanye;
