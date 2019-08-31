package com.sxt.action;

import java.io.IOException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.ServletRequestDataBinder;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.servlet.ModelAndView;

import com.sxt.po.AjaxRetObjTemplate;
import com.sxt.po.BoxInfo;
import com.sxt.po.BoxInfoSearch;
import com.sxt.po.BoxInfoWithDictionarys;
import com.sxt.po.BoxModule;
import com.sxt.po.BoxStates;
import com.sxt.po.BoxStatesAndStateValues;
import com.sxt.po.BoxStatesList;
import com.sxt.po.BoxTerminal;
import com.sxt.po.BoxVarInfo;
import com.sxt.po.Department;
import com.sxt.po.Dictionarys;
import com.sxt.po.ListInfoTemplate;
import com.sxt.po.ModulesAndTerminals;
import com.sxt.po.Operators;
import com.sxt.po.Opticalcable;
import com.sxt.po.OpticalcableSearch;
import com.sxt.po.Pager;
import com.sxt.po.StateKey;
import com.sxt.po.StateLevel;
import com.sxt.po.StateValue;
import com.sxt.po.Test;
import com.sxt.po.User;
import com.sxt.service.BoxInfoService;
import com.sxt.service.DepartmentService;
import com.sxt.service.DictionaryService;
import com.sxt.service.OpticalcableService;
import com.sxt.service.UserService;
import com.sxt.utils.DateUtil;
import com.sxt.utils.PrivilegeControl;

@Controller
@RequestMapping("/opticalcable.do")
public class OpticalcableController  {

	private BoxInfoService boxInfoService;
	
	private OpticalcableService opticalcableService; 
	
	@InitBinder  
    public void initBinder(WebDataBinder binder) {  
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
        dateFormat.setLenient(false);  
        binder.registerCustomEditor(Date.class, new CustomDateEditor(dateFormat, true));  
    } 
	
	@RequestMapping(params="method=exportOpticalcable")
	public String exportExcel(HttpServletResponse response)
	{
		response.setContentType("application/binary;charset=ISO8859_1");
		try
		{
			String fileName = new String(("纤芯使用情况分析").getBytes(), "ISO8859_1") + DateUtil.dateToString(new Date());
			response.setHeader("Content-disposition", "attachment; filename=" + fileName + ".xlsx");// 组装附件名称和格式
			String hql = "";
			String[] titles = { "光缆段名称", "起点交接点名称", "终点交接点名称", "光缆段纤芯数", "占用纤芯数", "纤芯占用比例", "纤芯编号", "A点设备名称", "Z点设备名称"};
			this.opticalcableService.getExcel(hql, titles, response.getOutputStream());
		}
		catch (IOException e)
		{
			e.printStackTrace();
		}
		return null;
	}
	
	//光缆列表页面请求
	@RequestMapping(params="method=list")
	public String list(HttpServletRequest request, ModelMap map){
		if (PrivilegeControl.exist(request, "opticalcable", "export"))
		{
			map.put("opticalcable_export", true);
		}
		if (PrivilegeControl.exist(request, "opticalcable", "add"))
		{
			map.put("opticalcable_add", true);
		}
		if (PrivilegeControl.exist(request, "opticalcable", "update"))
		{
			map.put("opticalcable_update", true);
		}
		if (PrivilegeControl.exist(request, "opticalcable", "view"))
		{
			map.put("opticalcable_view", true);
		}
		if (PrivilegeControl.exist(request, "opticalcable", "delete"))
		{
			map.put("opticalcable_delete", true);
		}
		return "opticalcableList";
	}
	
	
	//获取光缆分页数据，AJAX方式
	@RequestMapping(params="method=listPageByAjax")
	public @ResponseBody ListInfoTemplate listPageByAjax(OpticalcableSearch bis,HttpServletRequest request){
		if (bis != null && bis.getRows() <= 0) {
			bis.setRows(10);
		}
		ListInfoTemplate lit = new ListInfoTemplate();
		try{
			lit.setPage(bis.getPage());
			int counts = opticalcableService.findCounts(bis,request);
			lit.setTotal(counts % bis.getRows() > 0 ? (counts / bis.getRows() + 1) : (counts / bis.getRows()));
			lit.setRecords(counts);
			lit.setRows(opticalcableService.findByPager(bis,request));
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		return lit;
	}
	
	@RequestMapping(params="method=viewOpticalcable")
	public @ResponseBody AjaxRetObjTemplate viewOpticalcable(Integer id) {
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		arot.setObject(this.opticalcableService.viewOpticalcable(id));
		arot.setResultMark(1);
		return arot;
	}
	//获取纤芯分页数据，AJAX方式
	@RequestMapping(params="method=listCorePageByAjax")
	public @ResponseBody ListInfoTemplate listCorePageByAjax(Pager bis){
		if (bis != null && bis.getRows() <= 0) {
			bis.setRows(10);
		}
		ListInfoTemplate lit = new ListInfoTemplate();
		try{
			lit.setPage(bis.getPage());
			int counts = opticalcableService.findCoreCounts(bis);
			lit.setTotal(counts % bis.getRows() > 0 ? (counts / bis.getRows() + 1) : (counts / bis.getRows()));
			lit.setRecords(counts);
			lit.setRows(opticalcableService.findCoreByPager(bis));
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		return lit;
	}
	
	//获取所有光缆，AJAX方式
	@RequestMapping(params="method=findAllByAjax")
	public @ResponseBody ListInfoTemplate findAllByAjax(){
		ListInfoTemplate lit = new ListInfoTemplate();
		lit.setRows(this.opticalcableService.findAll());
		lit.setResultMark(1);
		return lit;
	}
	
	//获取某光交箱下所有光缆，AJAX方式
	@RequestMapping(params="method=findAllByBoxId")
	public @ResponseBody ListInfoTemplate findAllByBoxId(int id){
		ListInfoTemplate lit = new ListInfoTemplate();
		lit.setRows(this.opticalcableService.findAllByBoxId(id));
		lit.setResultMark(1);
		return lit;
	}
	
	//获取某光交箱下所有光缆以及纤芯，AJAX方式
	@RequestMapping(params="method=findAllTreeByBoxId")
	public @ResponseBody ListInfoTemplate findAllTreeByBoxId(int id){
		ListInfoTemplate lit = new ListInfoTemplate();
		lit.setRows(this.opticalcableService.findAllTreeByBoxId(id));
		lit.setResultMark(1);
		return lit;
	}
	
	//获取所有纤芯，AJAX方式
	@RequestMapping(params="method=findAllCoreByAjax")
	public @ResponseBody ListInfoTemplate findAllCoreByAjax(int id){
		ListInfoTemplate lit = new ListInfoTemplate();
		lit.setRows(this.opticalcableService.findAllCore(id));
		lit.setResultMark(1);
		return lit;
	}
	
	//获取所有可用纤芯，AJAX方式
	@RequestMapping(params="method=findAllCoreByBoxId")
	public @ResponseBody ListInfoTemplate findAllCoreByBoxId(int boxid, int optiid){
		ListInfoTemplate lit = new ListInfoTemplate();
		lit.setRows(this.opticalcableService.findAllCoreByBoxId(boxid, optiid));
		lit.setResultMark(1);
		return lit;
	}
	
	//获取光缆，AJAX方式
	@RequestMapping(params="method=findOpticalcableByAjax")
	public @ResponseBody AjaxRetObjTemplate findOpticalcableByAjax(int id){
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		arot.setObject(this.opticalcableService.find(id));
		arot.setResultMark(1);
		return arot;
	}
	
	//修改光缆，AJAX方式
	@RequestMapping(params="method=updateOpticalcableByAjax")
	public @ResponseBody AjaxRetObjTemplate updateOpticalcableByAjax(Opticalcable o){
		this.opticalcableService.update(o);
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		arot.setResultMark(1);
		return arot;
	}
	
	//添加光缆
	@RequestMapping(params="method=add")
	public void add(Opticalcable o, HttpServletResponse response) throws IOException{
		opticalcableService.add(o);
		String resultMark = "{\"resultMark\" : 1}";
		response.setContentType("application/json; charset=UTF-8");
		response.getWriter().print(resultMark);
	}
	
	//删除光缆
	@RequestMapping(params="method=delete")
	public @ResponseBody AjaxRetObjTemplate  delete(@RequestBody int[] ids, HttpServletResponse response) throws IOException{
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		if (this.opticalcableService.delete(ids) > 0)
		{
			arot.setResultMark(1);
		}
		else
		{
			arot.setResultMark(0);
		}
		return arot;
	}

	public BoxInfoService getBoxInfoService() {
		return boxInfoService;
	}

	@Resource
	public void setBoxInfoService(BoxInfoService boxInfoService) {
		this.boxInfoService = boxInfoService;
	}

	public OpticalcableService getOpticalcableService() {
		return opticalcableService;
	}

	@Resource
	public void setOpticalcableService(OpticalcableService opticalcableService) {
		this.opticalcableService = opticalcableService;
	}
	
	
	

	
}
