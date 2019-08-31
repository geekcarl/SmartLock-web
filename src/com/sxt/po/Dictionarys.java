package com.sxt.po;

import java.util.List;

public class Dictionarys {
	private List<ConnState> connState;
	private List<DoorState> doorState;
	private List<PoseState> poseState;
	private List<VoltageState> voltState;
	private List<TemperatureState> tempState;
	private List<WaterState> waterState;
	public List<ConnState> getConnState() {
		return connState;
	}
	public void setConnState(List<ConnState> connState) {
		this.connState = connState;
	}
	public List<DoorState> getDoorState() {
		return doorState;
	}
	public void setDoorState(List<DoorState> doorState) {
		this.doorState = doorState;
	}
	public List<PoseState> getPoseState() {
		return poseState;
	}
	public void setPoseState(List<PoseState> poseState) {
		this.poseState = poseState;
	}
	public List<VoltageState> getVoltState() {
		return voltState;
	}
	public void setVoltState(List<VoltageState> voltState) {
		this.voltState = voltState;
	}
	public List<TemperatureState> getTempState() {
		return tempState;
	}
	public void setTempState(List<TemperatureState> tempState) {
		this.tempState = tempState;
	}
	public List<WaterState> getWaterState() {
		return waterState;
	}
	public void setWaterState(List<WaterState> waterState) {
		this.waterState = waterState;
	}
	
}
