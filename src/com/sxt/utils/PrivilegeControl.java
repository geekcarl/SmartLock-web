package com.sxt.utils;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.sxt.po.BoxPrivilege;
import com.sxt.po.Department;
import com.sxt.po.Role;

public class PrivilegeControl {
	
	
	
	public static boolean exist(HttpServletRequest request, String controller, String method) {
		boolean exist = false;
		Role role = (Role)request.getSession().getAttribute("role");
		if (role != null && role.getRps().size() > 0)
		{
			for (int i = 0; i < role.getRps().size(); i ++)
			{
				if (controller.equals(role.getRps().get(i).getPrivilege().getPrivilege()) &&
						method.equals(role.getRps().get(i).getPrivilege().getMethod()))
				{
					exist = true;
					break;
				}
			}
		}
		return exist;
	}
	
	public static String getBoxes(HttpServletRequest request) {
		StringBuffer sb = new StringBuffer();
		List<BoxPrivilege> bps = (List<BoxPrivilege>)request.getSession().getAttribute("boxprivilege");
		sb.append("(");
		if (bps != null && bps.size() > 0)
		{
			for (int i = 0; i < bps.size(); i ++)
			{
				sb.append(bps.get(i).getBoxinfo().getId() + ",");
			}
			return sb.toString().substring(0, sb.toString().length() - 1) + ")";
		}
		return "(-1)";
	}
	
	public static String getDepartments(HttpServletRequest request) {
		StringBuffer sb = new StringBuffer();
		List<Department> deps = (List<Department>)request.getSession().getAttribute("department_query");
		sb.append("(");
		if (deps != null && deps.size() > 0)
		{
			for (int i = 0; i < deps.size(); i ++)
			{
				sb.append(deps.get(i).getId() + ",");
			}
			return sb.toString().substring(0, sb.toString().length() - 1) + ")";
		}
		return "(-1)";
	}
}
