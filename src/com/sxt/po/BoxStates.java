package com.sxt.po;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;

import org.codehaus.jackson.annotate.JsonBackReference;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

@Entity
@JsonIgnoreProperties(value={"boxInfo"})
public class BoxStates implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private int id;
	private BoxInfo boxInfo;
	private StateKey stateKey;
	private String state_key;
	private StateValue stateValue;
	private String state_value;
	private Date timestamp;
	
	@Id
	@GeneratedValue
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="box_id")
	public BoxInfo getBoxInfo() {
		return boxInfo;
	}
	public void setBoxInfo(BoxInfo boxInfo) {
		this.boxInfo = boxInfo;
	}
	@ManyToOne
	@JoinColumn(name="state_key_id")
	public StateKey getStateKey() {
		return stateKey;
	}
	public void setStateKey(StateKey stateKey) {
		this.stateKey = stateKey;
	}
	@ManyToOne
	@JoinColumn(name="state_value_id")
	public StateValue getStateValue() {
		return stateValue;
	}
	public void setStateValue(StateValue stateValue) {
		this.stateValue = stateValue;
	}
	public Date getTimestamp() {
		return timestamp;
	}
	public void setTimestamp(Date timestamp) {
		this.timestamp = timestamp;
	}
	public String getState_key() {
		return state_key;
	}
	public void setState_key(String stateKey) {
		state_key = stateKey;
	}
	public String getState_value() {
		return state_value;
	}
	public void setState_value(String stateValue) {
		state_value = stateValue;
	}
}
