package com.sxt.po;

public class GrantLogSearch {

	private int page;
	private int rows;
	private String sort;
	private String order;
	private String log_name;
	private String grant_user;
	private String grant_time;
	private String key_no;
	private String rfid;
	private String key_code;
	private String card_no;
	private String card_rfid;
	private String operator_name;  //中文名
	private String operator_username;  //登录用户名
	
	public int getPage() {
		return page;
	}
	public void setPage(int page) {
		this.page = page;
	}
	public int getRows() {
		return rows;
	}
	public void setRows(int rows) {
		this.rows = rows;
	}
	public String getSort() {
		return sort;
	}
	public void setSort(String sort) {
		this.sort = sort;
	}
	public String getOrder() {
		return order;
	}
	public void setOrder(String order) {
		this.order = order;
	}
	public String getLog_name() {
		return log_name;
	}
	public void setLog_name(String logName) {
		log_name = logName;
	}
	public String getGrant_user() {
		return grant_user;
	}
	public void setGrant_user(String grantUser) {
		grant_user = grantUser;
	}
	public String getKey_no() {
		return key_no;
	}
	public void setKey_no(String keyNo) {
		key_no = keyNo;
	}
	public String getKey_code() {
		return key_code;
	}
	public void setKey_code(String keyCode) {
		key_code = keyCode;
	}
	public String getOperator_name() {
		return operator_name;
	}
	public void setOperator_name(String operatorName) {
		operator_name = operatorName;
	}
	public String getRfid() {
		return rfid;
	}
	public void setRfid(String rfid) {
		this.rfid = rfid;
	}
	public String getCard_no() {
		return card_no;
	}
	public void setCard_no(String card_no) {
		this.card_no = card_no;
	}
	public String getCard_rfid() {
		return card_rfid;
	}
	public void setCard_rfid(String card_rfid) {
		this.card_rfid = card_rfid;
	}
	public String getOperator_username() {
		return operator_username;
	}
	public void setOperator_username(String operator_username) {
		this.operator_username = operator_username;
	}
	public String getGrant_time() {
		return grant_time;
	}
	public void setGrant_time(String grant_time) {
		this.grant_time = grant_time;
	}
	
}
