package com.sxt.utils;

public class BaiduLocation {
	public Double gpsx, gpsy;
	public Double baidux, baiduy;
	public boolean ok = false;

	public Double getGpsx() {
		return gpsx;
	}

	public void setGpsx(Double gpsx) {
		this.gpsx = gpsx;
	}

	public Double getGpsy() {
		return gpsy;
	}

	public void setGpsy(Double gpsy) {
		this.gpsy = gpsy;
	}

	public Double getBaidux() {
		return baidux;
	}

	public void setBaidux(Double baidux) {
		this.baidux = baidux;
	}

	public Double getBaiduy() {
		return baiduy;
	}

	public void setBaiduy(Double baiduy) {
		this.baiduy = baiduy;
	}

	public boolean isOk() {
		return ok;
	}

	public void setOk(boolean ok) {
		this.ok = ok;
	}
}
