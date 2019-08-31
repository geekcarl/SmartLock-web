package com.sxt.po;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
public class BoxPrivilege implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Integer id;
	private BoxInfo boxinfo;
	private User user;
	private User setuser;
	private Date set_date;
	@Id
	@GeneratedValue
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	@ManyToOne
	@JoinColumn(name="box_id")
	public BoxInfo getBoxinfo() {
		return boxinfo;
	}
	public void setBoxinfo(BoxInfo boxinfo) {
		this.boxinfo = boxinfo;
	}
	@ManyToOne
	@JoinColumn(name="user_id")
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}
	@ManyToOne
	@JoinColumn(name="set_user_id")
	public User getSetuser() {
		return setuser;
	}
	public void setSetuser(User setuser) {
		this.setuser = setuser;
	}
	public Date getSet_date() {
		return set_date;
	}
	public void setSet_date(Date set_date) {
		this.set_date = set_date;
	}
	
}
