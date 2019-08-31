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


public class UserSearch {
	private int page;
	private int rows;
	private String sort;
	private String order;
	private int id;
	private String user_name;
	private String passwd;
	private int user_type;
	private String full_name;
	private String department_name;
	private int sex;
	private String phone_no;
	private int role_id;
	private int is_login;
	private Date last_login_time;
	private String last_login_ip;
	private int is_deleted;
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
	public String getUser_name() {
		return user_name;
	}
	public void setUser_name(String userName) {
		user_name = userName;
	}
	public String getPasswd() {
		return passwd;
	}
	public void setPasswd(String passwd) {
		this.passwd = passwd;
	}
	public int getUser_type() {
		return user_type;
	}
	public void setUser_type(int userType) {
		user_type = userType;
	}
	public String getFull_name() {
		return full_name;
	}
	public void setFull_name(String fullName) {
		full_name = fullName;
	}
	public String getDepartment_name() {
		return department_name;
	}
	public void setDepartment_name(String departmentName) {
		department_name = departmentName;
	}
	public int getSex() {
		return sex;
	}
	public void setSex(int sex) {
		this.sex = sex;
	}
	public String getPhone_no() {
		return phone_no;
	}
	public void setPhone_no(String phoneNo) {
		phone_no = phoneNo;
	}
	public int getRole_id() {
		return role_id;
	}
	public void setRole_id(int roleId) {
		role_id = roleId;
	}
	public int getIs_login() {
		return is_login;
	}
	public void setIs_login(int isLogin) {
		is_login = isLogin;
	}
	public Date getLast_login_time() {
		return last_login_time;
	}
	public void setLast_login_time(Date lastLoginTime) {
		last_login_time = lastLoginTime;
	}
	public String getLast_login_ip() {
		return last_login_ip;
	}
	public void setLast_login_ip(String lastLoginIp) {
		last_login_ip = lastLoginIp;
	}
	public int getIs_deleted() {
		return is_deleted;
	}
	public void setIs_deleted(int isDeleted) {
		is_deleted = isDeleted;
	}
}
