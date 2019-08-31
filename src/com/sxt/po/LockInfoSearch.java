package com.sxt.po;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.hibernate.validator.constraints.Length;

public class LockInfoSearch {
	private int page;
	private int rows;
	private String sort;
	private String order;
	private int id;
	private String lock_code;
	private int boxInfo_id;
	private LockTypeInfo lockTypeInfo;
	private String remarks;
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
	public String getLock_code() {
		return lock_code;
	}
	public void setLock_code(String lockCode) {
		lock_code = lockCode;
	}
	public int getBoxInfo_id() {
		return boxInfo_id;
	}
	public void setBoxInfo_id(int boxInfoId) {
		boxInfo_id = boxInfoId;
	}
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
