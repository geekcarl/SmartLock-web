package com.sxt.po;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

@Entity
public class StateValue {
	private int id;
	private StateKey stateKey;
	private String state_value;
	private StateLevel stateLevel;
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
	@JoinColumn(name="key_id")
	public StateKey getStateKey() {
		return stateKey;
	}
	
	public void setStateKey(StateKey stateKey) {
		this.stateKey = stateKey;
	}
	public String getState_value() {
		return state_value;
	}
	public void setState_value(String stateValue) {
		state_value = stateValue;
	}
	
	@ManyToOne
	@JoinColumn(name="state_level")
	public StateLevel getStateLevel() {
		return stateLevel;
	}
	public void setStateLevel(StateLevel stateLevel) {
		this.stateLevel = stateLevel;
	}
	public String getRemarks() {
		return remarks;
	}
	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
}
