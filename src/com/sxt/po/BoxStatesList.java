package com.sxt.po;

import java.util.List;

public class BoxStatesList {
	private List<StateKey> sks;
	private List<StateValue> svs;
	private int resultMark;
	public List<StateKey> getSks() {
		return sks;
	}
	public void setSks(List<StateKey> sks) {
		this.sks = sks;
	}
	public List<StateValue> getSvs() {
		return svs;
	}
	public void setSvs(List<StateValue> svs) {
		this.svs = svs;
	}
	public int getResultMark() {
		return resultMark;
	}
	public void setResultMark(int resultMark) {
		this.resultMark = resultMark;
	}
}
