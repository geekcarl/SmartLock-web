package com.sxt.po;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

@Entity
public class Role{
	private int id;
	private String name;
	private String remark;
	private List<RolePrivileges> rps;
	@Id
	@GeneratedValue
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	@OneToMany(fetch=FetchType.EAGER, mappedBy="role")
	public List<RolePrivileges> getRps() {
		return rps;
	}
	public void setRps(List<RolePrivileges> rps) {
		this.rps = rps;
	}
	
}
