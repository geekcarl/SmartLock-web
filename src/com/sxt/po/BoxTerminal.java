package com.sxt.po;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.codehaus.jackson.annotate.JsonBackReference;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

@Entity
@Table(name="box_terminal")
@JsonIgnoreProperties(value={"boxInfo", "boxterminalused"})
public class BoxTerminal {

	private int id;
	private BoxInfoNew boxInfo;
	private BoxModule boxModule;
	private int row;
	private int col;
	private String name;
	private String sideName;
	private String label_info;
	private int status;
	private String remarks;
	private BoxTerminalUsed boxterminalused;
	
	@Id
	@GeneratedValue
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="box_id")
	public BoxInfoNew getBoxInfo() {
		return boxInfo;
	}
	public void setBoxInfo(BoxInfoNew boxInfo) {
		this.boxInfo = boxInfo;
	}
	
	@ManyToOne
	@JoinColumn(name="box_module_id")
	public BoxModule getBoxModule() {
		return boxModule;
	}
	public void setBoxModule(BoxModule boxModule) {
		this.boxModule = boxModule;
	}
	public int getRow() {
		return row;
	}
	public void setRow(int row) {
		this.row = row;
	}
	public int getCol() {
		return col;
	}
	public void setCol(int col) {
		this.col = col;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getSideName() {
		return sideName;
	}
	public void setSideName(String sideName) {
		this.sideName = sideName;
	}

	public String getLabel_info() {
		return label_info;
	}
	public void setLabel_info(String labelInfo) {
		label_info = labelInfo;
	}
	public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
		this.status = status;
	}
	public String getRemarks() {
		return remarks;
	}
	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
	@OneToOne(cascade={CascadeType.REFRESH, CascadeType.REMOVE}, fetch=FetchType.LAZY, mappedBy="boxTerminal")
	public BoxTerminalUsed getBoxterminalused() {
		return boxterminalused;
	}
	public void setBoxterminalused(BoxTerminalUsed boxterminalused) {
		this.boxterminalused = boxterminalused;
	}
}
