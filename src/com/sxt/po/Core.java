package com.sxt.po;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.smartcardio.TerminalFactory;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

@Entity
@JsonIgnoreProperties(value={"opticalcable", "coreused"})
public class Core {
	private int id;
	private Opticalcable opticalcable;
	private int sequence;
	private String name;
	private CoreUsed coreused;
	@Id
	@GeneratedValue
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	@ManyToOne
	@JoinColumn(name="opticalcable_id")
	public Opticalcable getOpticalcable() {
		return opticalcable;
	}
	public void setOpticalcable(Opticalcable opticalcable) {
		this.opticalcable = opticalcable;
	}
	public int getSequence() {
		return sequence;
	}
	public void setSequence(int sequence) {
		this.sequence = sequence;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}

	@OneToOne(cascade={CascadeType.REFRESH, CascadeType.REMOVE}, fetch=FetchType.LAZY, mappedBy="core")
	public CoreUsed getCoreused() {
		return coreused;
	}
	public void setCoreused(CoreUsed coreused) {
		this.coreused = coreused;
	}
}
