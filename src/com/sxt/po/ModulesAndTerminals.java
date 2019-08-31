package com.sxt.po;

import java.util.List;

public class ModulesAndTerminals {
	private List<BoxModule> bms;
	private List<BoxTerminalUsed> bts;
	public List<BoxModule> getBms() {
		return bms;
	}
	public void setBms(List<BoxModule> bms) {
		this.bms = bms;
	}
	public List<BoxTerminalUsed> getBts() {
		return bts;
	}
	public void setBts(List<BoxTerminalUsed> bts) {
		this.bts = bts;
	}
}
