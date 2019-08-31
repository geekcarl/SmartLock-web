package com.sxt.po;

import java.util.List;

public class ListAlarmEventTemplate {
	private int page = 0;
	private int total = 0;
	private int records = 0;
	private List<AlarmEvent> rows;
	private int resultMark = 1;
	public int getTotal() {
		return total;
	}
	public void setTotal(int total) {
		this.total = total;
	}
	public int getResultMark() {
		return resultMark;
	}
	public void setResultMark(int resultMark) {
		this.resultMark = resultMark;
	}
	public int getPage() {
		return page;
	}
	public void setPage(int page) {
		this.page = page;
	}
	public int getRecords() {
		return records;
	}
	public void setRecords(int records) {
		this.records = records;
	}
	public List<AlarmEvent> getRows() {
		return rows;
	}
	public void setRows(List<AlarmEvent> rows) {
		this.rows = rows;
	}
	
	
}
