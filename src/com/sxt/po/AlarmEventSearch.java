package com.sxt.po;

import java.util.Date;

public class AlarmEventSearch {
	
	private int page;
	private int rows;
	private String sort;
	private String order;
	private int box_id;
	private String box_no;
	private String alarm_type;
	private long controller_id;
	private String address;
	private String department;
	private Date alarm_time;
	private String alarm_keys;
	private String alarm_operators;
	private String alarm_rfids;
	private Date settled_time;
	private String settled_keys;
	private String settled_operators;
	private String settled_rfids;
	private int is_affirmed;
	private Date affirm_time;
	private String affirm_user;
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
	public int getBox_id() {
		return box_id;
	}
	public void setBox_id(int box_id) {
		this.box_id = box_id;
	}
	public String getBox_no() {
		return box_no;
	}
	public void setBox_no(String boxNo) {
		box_no = boxNo;
	}
	public String getAlarm_type() {
		return alarm_type;
	}
	public void setAlarm_type(String alarmType) {
		alarm_type = alarmType;
	}
	public long getController_id() {
		return controller_id;
	}
	public void setController_id(long controllerId) {
		controller_id = controllerId;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getDepartment() {
		return department;
	}
	public void setDepartment(String department) {
		this.department = department;
	}
	public Date getAlarm_time() {
		return alarm_time;
	}
	public void setAlarm_time(Date alarmTime) {
		alarm_time = alarmTime;
	}
	public String getAlarm_keys() {
		return alarm_keys;
	}
	public void setAlarm_keys(String alarmKeys) {
		alarm_keys = alarmKeys;
	}
	public String getAlarm_operators() {
		return alarm_operators;
	}
	public void setAlarm_operators(String alarmOperators) {
		alarm_operators = alarmOperators;
	}
	public String getAlarm_rfids() {
		return alarm_rfids;
	}
	public void setAlarm_rfids(String alarmRfids) {
		alarm_rfids = alarmRfids;
	}
	public Date getSettled_time() {
		return settled_time;
	}
	public void setSettled_time(Date settledTime) {
		settled_time = settledTime;
	}
	public String getSettled_keys() {
		return settled_keys;
	}
	public void setSettled_keys(String settledKeys) {
		settled_keys = settledKeys;
	}
	public String getSettled_operators() {
		return settled_operators;
	}
	public void setSettled_operators(String settledOperators) {
		settled_operators = settledOperators;
	}
	public String getSettled_rfids() {
		return settled_rfids;
	}
	public void setSettled_rfids(String settledRfids) {
		settled_rfids = settledRfids;
	}
	public int getIs_affirmed() {
		return is_affirmed;
	}
	public void setIs_affirmed(int isAffirmed) {
		is_affirmed = isAffirmed;
	}
	public Date getAffirm_time() {
		return affirm_time;
	}
	public void setAffirm_time(Date affirmTime) {
		affirm_time = affirmTime;
	}
	public String getAffirm_user() {
		return affirm_user;
	}
	public void setAffirm_user(String affirmUser) {
		affirm_user = affirmUser;
	}
}
