package com.sxt.po;

public class DTO_BoxStates_Values_Levels {
	private int id;
	private String key;
	private String value;
	private int level;
	private String state_image;
	
	public DTO_BoxStates_Values_Levels(int id, String key, String value, int level, String state_image) {
		super();
		this.id = id;
		this.key = key;
		this.value = value;
		this.level = level;
		this.state_image = state_image;
	}
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getKey() {
		return key;
	}
	public void setKey(String key) {
		this.key = key;
	}
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}
	public int getLevel() {
		return level;
	}
	public void setLevel(int level) {
		this.level = level;
	}
	public String getState_image() {
		return state_image;
	}
	public void setState_image(String stateImage) {
		state_image = stateImage;
	}
	
}
