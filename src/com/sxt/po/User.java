package com.sxt.po;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

@Entity
@Table(name="userinfo")
public class User {
	
	private int id;
	private String user_name;
	private String passwd;
	private int user_type;
	private String full_name;
	private Department department;
	private int sex;
	private String phone_no;
	private Role role;
	private int is_login;
	private Date last_login_time;
	private String last_login_ip;
	private String remarks;
	private int is_deleted;
	
	@Id
	@GeneratedValue
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
	@Column(updatable=false)
	public String getPasswd() {
		return passwd;
	}
	public void setPasswd(String passwd) {
		this.passwd = passwd;
	}
	public String getFull_name() {
		return full_name;
	}
	public void setFull_name(String fullName) {
		full_name = fullName;
	}
	@OneToOne
	@JoinColumn(name="department_id")
	public Department getDepartment() {
		return department;
	}
	public void setDepartment(Department department) {
		this.department = department;
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
	@ManyToOne
	@JoinColumn(name="role_id")
	public Role getRole() {
		return role;
	}
	public void setRole(Role role) {
		this.role = role;
	}
	@Column(updatable=false)
	public Date getLast_login_time() {
		return last_login_time;
	}
	public void setLast_login_time(Date lastLoginTime) {
		last_login_time = lastLoginTime;
	}
	@Column(updatable=false)
	public String getLast_login_ip() {
		return last_login_ip;
	}
	public void setLast_login_ip(String lastLoginIp) {
		last_login_ip = lastLoginIp;
	}
	public String getRemarks() {
		return remarks;
	}
	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
	public int getUser_type() {
		return user_type;
	}
	public void setUser_type(int userType) {
		user_type = userType;
	}
	public int getIs_login() {
		return is_login;
	}
	public void setIs_login(int isLogin) {
		is_login = isLogin;
	}
	@Column(updatable=false)
	public int getIs_deleted() {
		return is_deleted;
	}
	public void setIs_deleted(int isDeleted) {
		is_deleted = isDeleted;
	}
	
	
	
}
