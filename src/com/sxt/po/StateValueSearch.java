package com.sxt.po;

import java.math.BigInteger;
import java.sql.Timestamp;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;


public class StateValueSearch {
	private int page;
	private int rows;
	private String sort;
	private String order;
	private int id;
	private int key_id;
	private String state_value;
	private int state_level;
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
	public int getKey_id() {
		return key_id;
	}
	public void setKey_id(int keyId) {
		key_id = keyId;
	}
	public String getState_value() {
		return state_value;
	}
	public void setState_value(String stateValue) {
		state_value = stateValue;
	}
	public int getState_level() {
		return state_level;
	}
	public void setState_level(int stateLevel) {
		state_level = stateLevel;
	}
}
