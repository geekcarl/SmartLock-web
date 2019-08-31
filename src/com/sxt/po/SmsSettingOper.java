package com.sxt.po;

import java.util.List;

public class SmsSettingOper {
	private List<BoxInfoNew> bis;
	private List<StateValue> svs;
	private List<User> us;
	private String remarks;
	
	public List<BoxInfoNew> getBis() {
		return bis;
	}
	public void setBis(List<BoxInfoNew> bis) {
		this.bis = bis;
	}
	public List<StateValue> getSvs() {
		return svs;
	}
	public void setSvs(List<StateValue> svs) {
		this.svs = svs;
	}
	public List<User> getUs() {
		return us;
	}
	public void setUs(List<User> us) {
		this.us = us;
	}
	public String getRemarks() {
		return remarks;
	}
	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
}
