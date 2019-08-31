package com.sxt.po;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class VersionManage {
	
	private int id;
	private String url;
	private String remark;
	private Integer versioncode;
	private String versionname;
	private String versiontime;
	private String edittime;

	@Id
	@GeneratedValue
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	
	public String getVersiontime() {
		return versiontime;
	}
	public void setVersiontime(String versiontime) {
		this.versiontime = versiontime;
	}
	public String getEdittime() {
		return edittime;
	}
	public void setEdittime(String edittime) {
		this.edittime = edittime;
	}
	
	public Integer getVersioncode() {
		return versioncode;
	}
	
	public void setVersioncode(Integer versioncode) {
		this.versioncode = versioncode;
	}
	
	public String getVersionname() {
		return versionname;
	}
	
	public void setVersionname(String versionname) {
		this.versionname = versionname;
	}

}
