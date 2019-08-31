package com.sxt.po;

import java.util.List;

public class AjaxRetObjTemplate {
	private Object object;
	private int resultMark = 1;
	private String errMessage;
	public Object getObject() {
		return object;
	}
	public void setObject(Object object) {
		this.object = object;
	}
	public int getResultMark() {
		return resultMark;
	}
	public void setResultMark(int resultMark) {
		this.resultMark = resultMark;
	}
	public String getErrMessage() {
		return errMessage;
	}
	public void setErrMessage(String errMessage) {
		this.errMessage = errMessage;
	}
	
	
}
