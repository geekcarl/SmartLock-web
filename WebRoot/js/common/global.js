function isOvertime(resultMark) {
	if (resultMark == -1) {
		alert('会话超时，请重新登录');
		window.parent.reLogin();
		return false;
	}
}