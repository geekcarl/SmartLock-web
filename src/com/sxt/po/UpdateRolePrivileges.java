package com.sxt.po;

import java.util.List;

public class UpdateRolePrivileges {
	private int role_id;
	private List<RolePrivileges> rps;
	public int getRole_id() {
		return role_id;
	}
	public void setRole_id(int role_id) {
		this.role_id = role_id;
	}
	public List<RolePrivileges> getRps() {
		return rps;
	}
	public void setRps(List<RolePrivileges> rps) {
		this.rps = rps;
	}
}
