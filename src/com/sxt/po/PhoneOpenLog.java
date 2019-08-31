package com.sxt.po;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;


@Entity
public class PhoneOpenLog {
	
	private Integer id; 
	private Date applytime;
	private String username;
	private Integer userid;
	private String lockid;
	private Integer boxid;
	private Integer type;
	
	@Id
	@GeneratedValue
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public Date getApplytime() {
		return applytime;
	}
	public void setApplytime(Date applytime) {
		this.applytime = applytime;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public Integer getUserid() {
		return userid;
	}
	public void setUserid(Integer userid) {
		this.userid = userid;
	}
	public String getLockid() {
		return lockid;
	}
	public void setLockid(String lockid) {
		this.lockid = lockid;
	}
	public Integer getBoxid() {
		return boxid;
	}
	public void setBoxid(Integer boxid) {
		this.boxid = boxid;
	}
	public Integer getType() {
		return type;
	}
	public void setType(Integer type) {
		this.type = type;
	}
	
	
	

}
