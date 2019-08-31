package com.sxt.po;

import java.util.Date;

public class DoorEventSearch {

	private int page;
	private int rows;
	private String sort;
	private String order;
	private int box_id;
	private String box_no;
	private long controller_id;
	private String address;
	private String department;
	private Date open_time;
	private String open_keys;
	private String open_operators;
	private String open_rfids;
	private Date close_time;
	private String close_keys;
	private String close_operators;
	private String close_rfids;
	
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
	public Date getOpen_time() {
		return open_time;
	}
	public void setOpen_time(Date openTime) {
		open_time = openTime;
	}
	public String getOpen_keys() {
		return open_keys;
	}
	public void setOpen_keys(String openKeys) {
		open_keys = openKeys;
	}
	public String getOpen_operators() {
		return open_operators;
	}
	public void setOpen_operators(String openOperators) {
		open_operators = openOperators;
	}
	public String getOpen_rfids() {
		return open_rfids;
	}
	public void setOpen_rfids(String openRfids) {
		open_rfids = openRfids;
	}
	public Date getClose_time() {
		return close_time;
	}
	public void setClose_time(Date closeTime) {
		close_time = closeTime;
	}
	public String getClose_keys() {
		return close_keys;
	}
	public void setClose_keys(String closeKeys) {
		close_keys = closeKeys;
	}
	public String getClose_operators() {
		return close_operators;
	}
	public void setClose_operators(String closeOperators) {
		close_operators = closeOperators;
	}
	public String getClose_rfids() {
		return close_rfids;
	}
	public void setClose_rfids(String closeRfids) {
		close_rfids = closeRfids;
	}
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
	public void setBox_no(String box_no) {
		this.box_no = box_no;
	}
}
