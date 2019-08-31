package com.sxt.po;

public class KeyInfoSearch {

	private int page;
	private int rows;
	private String sort;
	private String order;
	private int id;
	private String key_no;
	private String rfid;
	private String key_code;
	private String department_name;
	private String op_no;
	private String op_name;
	private String key_type;
	private int auth_locks_count;
	private int auth_boxes_count;
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
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getKey_no() {
		return key_no;
	}
	public void setKey_no(String keyNo) {
		key_no = keyNo;
	}
	public String getRfid() {
		return rfid;
	}
	public void setRfid(String rfid) {
		this.rfid = rfid;
	}
	public String getKey_code() {
		return key_code;
	}
	public void setKey_code(String keyCode) {
		key_code = keyCode;
	}
	public String getDepartment_name() {
		return department_name;
	}
	public void setDepartment_name(String departmentName) {
		department_name = departmentName;
	}
	public String getOp_no() {
		return op_no;
	}
	public void setOp_no(String opNo) {
		op_no = opNo;
	}
	public String getOp_name() {
		return op_name;
	}
	public void setOp_name(String opName) {
		op_name = opName;
	}
	public String getKey_type() {
		return key_type;
	}
	public void setKey_type(String keyType) {
		key_type = keyType;
	}
	public int getAuth_locks_count() {
		return auth_locks_count;
	}
	public void setAuth_locks_count(int authLocksCount) {
		auth_locks_count = authLocksCount;
	}
	public int getAuth_boxes_count() {
		return auth_boxes_count;
	}
	public void setAuth_boxes_count(int authBoxesCount) {
		auth_boxes_count = authBoxesCount;
	}
	
}
