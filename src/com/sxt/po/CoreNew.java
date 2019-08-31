package com.sxt.po;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="core")
public class CoreNew {
	private int id;
	private Integer opticalcable_id;
	private int sequence;
	private String name;
	@Id
	@GeneratedValue
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	
	public int getSequence() {
		return sequence;
	}
	public void setSequence(int sequence) {
		this.sequence = sequence;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Integer getOpticalcable_id() {
		return opticalcable_id;
	}
	public void setOpticalcable_id(Integer opticalcable_id) {
		this.opticalcable_id = opticalcable_id;
	}

	
}
