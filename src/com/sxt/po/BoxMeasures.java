package com.sxt.po;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

@Entity
@JsonIgnoreProperties(value={"boxInfo"}) 
public class BoxMeasures {
	private int id;
	private BoxInfo boxinfo;
	private String doors;
	private double voltage;
	private int pose_x;
	private int pose_y;
	private int pose_z;
	private double temperature;
	private int humidity;
	private int dbm;
	private Date update_time;
	@Id
	@GeneratedValue
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	@OneToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="box_id")
	public BoxInfo getBoxinfo() {
		return boxinfo;
	}
	public void setBoxinfo(BoxInfo boxinfo) {
		this.boxinfo = boxinfo;
	}
	public String getDoors() {
		return doors;
	}
	public void setDoors(String doors) {
		this.doors = doors;
	}
	public double getVoltage() {
		return voltage;
	}
	public void setVoltage(double voltage) {
		this.voltage = voltage;
	}
	public int getPose_x() {
		return pose_x;
	}
	public void setPose_x(int poseX) {
		pose_x = poseX;
	}
	public int getPose_y() {
		return pose_y;
	}
	public void setPose_y(int poseY) {
		pose_y = poseY;
	}
	public int getPose_z() {
		return pose_z;
	}
	public void setPose_z(int poseZ) {
		pose_z = poseZ;
	}
	public double getTemperature() {
		return temperature;
	}
	public void setTemperature(double temperature) {
		this.temperature = temperature;
	}
	public int getHumidity() {
		return humidity;
	}
	public void setHumidity(int humidity) {
		this.humidity = humidity;
	}
	public int getDbm() {
		return dbm;
	}
	public void setDbm(int dbm) {
		this.dbm = dbm;
	}
	public Date getUpdate_time() {
		return update_time;
	}
	public void setUpdate_time(Date updateTime) {
		update_time = updateTime;
	}
}
