package com.sxt.po;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;

import org.codehaus.jackson.annotate.JsonBackReference;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

@Entity
@JsonIgnoreProperties(value={"boxInfo"}) 
public class BoxVarInfo {
	private int id;
	private BoxInfo boxInfo;
	private Date last_heard;
	private Date power_on;
	private String last_controller_msg;
	private int pose_initial_x;
	private int pose_initial_y;
	private int pose_initial_z;
	
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
	public BoxInfo getBoxInfo() {
		return boxInfo;
	}
	public void setBoxInfo(BoxInfo boxInfo) {
		this.boxInfo = boxInfo;
	}
	
	@NotFound(action=NotFoundAction.IGNORE)
	public Date getLast_heard() {
		return last_heard;
	}
	public void setLast_heard(Date lastHeard) {
		last_heard = lastHeard;
	}
	public Date getPower_on() {
		return power_on;
	}
	public void setPower_on(Date powerOn) {
		power_on = powerOn;
	}
	@Column(updatable=false)
	public String getLast_controller_msg() {
		return last_controller_msg;
	}
	public void setLast_controller_msg(String lastControllerMsg) {
		last_controller_msg = lastControllerMsg;
	}
	@Column(updatable=false)
	public int getPose_initial_x() {
		return pose_initial_x;
	}
	public void setPose_initial_x(int poseInitialX) {
		pose_initial_x = poseInitialX;
	}
	@Column(updatable=false)
	public int getPose_initial_y() {
		return pose_initial_y;
	}
	public void setPose_initial_y(int poseInitialY) {
		pose_initial_y = poseInitialY;
	}
	@Column(updatable=false)
	public int getPose_initial_z() {
		return pose_initial_z;
	}
	public void setPose_initial_z(int poseInitialZ) {
		pose_initial_z = poseInitialZ;
	}
}
