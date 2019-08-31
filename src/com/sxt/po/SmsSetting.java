package com.sxt.po;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
public class SmsSetting {
	private int id;
	private BoxInfoNew box;
	private StateValue stateValue;
	private User user;
	private String remarks;
	@Id
	@GeneratedValue
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	@ManyToOne
	@JoinColumn(name="box_id")
	public BoxInfoNew getBox() {
		return box;
	}
	public void setBox(BoxInfoNew box) {
		this.box = box;
	}
	@ManyToOne
	@JoinColumn(name="type_id")
	public StateValue getStateValue() {
		return stateValue;
	}
	public void setStateValue(StateValue stateValue) {
		this.stateValue = stateValue;
	}
	@ManyToOne
	@JoinColumn(name="receiver")
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}
	public String getRemarks() {
		return remarks;
	}
	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
	
}
