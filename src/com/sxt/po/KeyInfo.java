package com.sxt.po;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
public class KeyInfo {
	private int id;
	private String key_no;
	private String rfid;
	private String key_code;
	private Department department;
	private KeyTypeInfo keyTypeInfo;
	private UserNew operators;
	private int auth_locks_count;
	private int auth_boxes_count;
	private String remarks;
	@Id
	@GeneratedValue
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
	@ManyToOne
	@JoinColumn(name="department_id")
	public Department getDepartment() {
		return department;
	}
	public void setDepartment(Department department) {
		this.department = department;
	}
	@ManyToOne
	@JoinColumn(name="type_id")
	public KeyTypeInfo getKeyTypeInfo() {
		return keyTypeInfo;
	}
	public void setKeyTypeInfo(KeyTypeInfo keyTypeInfo) {
		this.keyTypeInfo = keyTypeInfo;
	}
	@ManyToOne
	@JoinColumn(name="operators_id")
	public UserNew getOperators() {
		return operators;
	}
	public void setOperators(UserNew operators) {
		this.operators = operators;
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
	public String getRemarks() {
		return remarks;
	}
	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
}
