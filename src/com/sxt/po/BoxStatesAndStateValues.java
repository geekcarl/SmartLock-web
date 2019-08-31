package com.sxt.po;

import java.util.List;
import java.util.Map;

public class BoxStatesAndStateValues {
	private List<Map<String, Object>> bis;
	
	//获取的时候按照等级排序
	private List<DTO_BoxStates_Values_Levels> bss;

	//获取的时候按照等级排序
	private List<StateValue> svs;
	public List<Map<String, Object>> getBis() {
		return bis;
	}
	public void setBis(List<Map<String, Object>> bis) {
		this.bis = bis;
	}
	public List<DTO_BoxStates_Values_Levels> getBss() {
		return bss;
	}
	public void setBss(List<DTO_BoxStates_Values_Levels> bss) {
		this.bss = bss;
	}
	public List<StateValue> getSvs() {
		return svs;
	}
	public void setSvs(List<StateValue> svs) {
		this.svs = svs;
	}
}
