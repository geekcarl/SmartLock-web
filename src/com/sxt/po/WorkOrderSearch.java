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


public class WorkOrderSearch {
	private int page;
	private int rows;
	private String sort;
	private String order;
	private int id;
	private String order_no;
	private Integer type;
	private Integer create_user_id;
	private Integer create_type;
	private Integer done_type;
	private Integer department_id;
	private Integer receive_user_id;
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
	public String getOrder_no() {
		return order_no;
	}
	public void setOrder_no(String order_no) {
		this.order_no = order_no;
	}
	public Integer getType() {
		return type;
	}
	public void setType(Integer type) {
		this.type = type;
	}
	public Integer getCreate_user_id() {
		return create_user_id;
	}
	public void setCreate_user_id(Integer create_user_id) {
		this.create_user_id = create_user_id;
	}
	public Integer getCreate_type() {
		return create_type;
	}
	public void setCreate_type(Integer create_type) {
		this.create_type = create_type;
	}
	public Integer getDone_type() {
		return done_type;
	}
	public void setDone_type(Integer done_type) {
		this.done_type = done_type;
	}
	public Integer getDepartment_id() {
		return department_id;
	}
	public void setDepartment_id(Integer department_id) {
		this.department_id = department_id;
	}
	public Integer getReceive_user_id() {
		return receive_user_id;
	}
	public void setReceive_user_id(Integer receive_user_id) {
		this.receive_user_id = receive_user_id;
	}
}
