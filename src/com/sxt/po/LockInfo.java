package com.sxt.po;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;

@Entity
public class LockInfo {
	private int id;
	private String lock_code;
	private BoxInfo boxInfo;
	private LockTypeInfo lockTypeInfo;
	private String remarks;
	@Id
	@GeneratedValue
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getLock_code() {
		return lock_code;
	}
	public void setLock_code(String lockCode) {
		lock_code = lockCode;
	}
	@ManyToOne
	@JoinColumn(name="box_id")
	public BoxInfo getBoxInfo() {
		return boxInfo;
	}
	public void setBoxInfo(BoxInfo boxInfo) {
		this.boxInfo = boxInfo;
	}
	@ManyToOne
	@JoinColumn(name="type_id")
	public LockTypeInfo getLockTypeInfo() {
		return lockTypeInfo;
	}
	public void setLockTypeInfo(LockTypeInfo lockTypeInfo) {
		this.lockTypeInfo = lockTypeInfo;
	}
	public String getRemarks() {
		return remarks;
	}
	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
}
