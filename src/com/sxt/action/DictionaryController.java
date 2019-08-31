package com.sxt.action;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.util.Date;
import java.util.List;
import java.util.Scanner;

import javax.annotation.Resource;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.multipart.commons.CommonsMultipartFile;
import org.springframework.web.servlet.ModelAndView;

import com.sxt.po.AjaxRetObjTemplate;
import com.sxt.po.Backup;
import com.sxt.po.BoxInfo;
import com.sxt.po.Department;
import com.sxt.po.DepartmentSearch;
import com.sxt.po.Dictionarys;
import com.sxt.po.GlobalSearch;
import com.sxt.po.ListInfoTemplate;
import com.sxt.po.Operators;
import com.sxt.po.StateKey;
import com.sxt.po.StateKeySearch;
import com.sxt.po.StateLevel;
import com.sxt.po.StateLevelSearch;
import com.sxt.po.StateValue;
import com.sxt.po.StateValueSearch;
import com.sxt.po.User;
import com.sxt.service.DepartmentService;
import com.sxt.service.DictionaryService;
import com.sxt.service.UserService;
import com.sxt.utils.PropertyMgr;

@Controller
@RequestMapping("/dictionary.do")
public class DictionaryController {

	private DictionaryService dictionaryService;

	public DictionaryService getDictionaryService() {
		return dictionaryService;
	}

	@Resource
	public void setDictionaryService(DictionaryService dictionaryService) {
		this.dictionaryService = dictionaryService;
	}
	
	// 获取备份分页列表，AJAX请求
	@RequestMapping(params = "method=listBackupPageByAjax")
	public @ResponseBody
	ListInfoTemplate listBackupPageByAjax(GlobalSearch sks) {
		if (sks.getPage() <= 0)
			sks.setPage(1);
		if (sks.getRows() <= 0)
			sks.setRows(10);
		ListInfoTemplate lit = new ListInfoTemplate();
		lit.setPage(sks.getPage());
		int counts = dictionaryService.findBackupCounts(sks);
		lit.setTotal(counts % sks.getRows() > 0 ? (counts / sks.getRows() + 1)
				: (counts / sks.getRows()));
		lit.setRecords(counts);
		lit.setRows(dictionaryService.findBackupPager(sks));
		return lit;
	}
	
	// 添加备份，AJAX请求
	@RequestMapping(params = "method=addBackup")
	public @ResponseBody
	AjaxRetObjTemplate addBackup(@RequestBody Backup b, HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		try {
			this.dictionaryService.addBackup(b, request);
			arot.setResultMark(1);
		} catch (Exception e) {
			e.printStackTrace();
			arot.setResultMark(0);
			arot.setErrMessage("添加失败，请重试");
		}
		return arot;
	}
	
	// 还原备份，AJAX请求
	@RequestMapping(params = "method=restoreBackup")
	public @ResponseBody
	AjaxRetObjTemplate restoreBackup(Integer id, HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		try 
		{
			if (this.dictionaryService.restoreBackup(id, request) == 1)
			{
				arot.setResultMark(1);
			}
			else 
			{
				arot.setResultMark(0);
				arot.setErrMessage("还原失败，请重试");
			}
		} catch (Exception e) {
			e.printStackTrace();
			arot.setResultMark(0);
			arot.setErrMessage("还原失败，请重试");
		}
		return arot;
	}
	
	// 删除备份，AJAX请求
	@RequestMapping(params = "method=deleteBackup")
	public @ResponseBody
	AjaxRetObjTemplate deleteBackup(@RequestBody int[] ids) {
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		try {
			
			this.dictionaryService.deleteBackup(ids);
			arot.setResultMark(1);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			arot.setResultMark(0);
			arot.setErrMessage("删除失败，请重试！");
		}
		return arot;
	}
	
	// 字典列表页面请求
	@RequestMapping(params = "method=list")
	public String list(HttpServletRequest request, ModelMap map) {
		return "dictionaryList";
	}

	// 判断字典项是否存在
	@RequestMapping(params = "method=isStateKeyValid")
	public void isStateKeyValid(String state_key, HttpServletRequest request,
			HttpServletResponse response, ModelMap map) throws IOException {
		int result = (state_key != null && !state_key.equals("")) ? this.dictionaryService
				.isStateKeyValid(state_key)
				: 1;
		String resultMark = result > 0 ? "false" : "true";
		response.setContentType("application/json; charset=UTF-8");
		response.getWriter().print(resultMark);
	}
	
	//获取状态字典状态项树
	@RequestMapping(params="method=listStateKeyValueTree")
	public void listStateKeyValueTree(HttpServletResponse response) throws IOException{
		String resultMark = "{\"resultMark\" : 1, \"tree\" : " + this.dictionaryService.findStateValueGroupByStateKey() + "}";
		response.setContentType("application/json; charset=UTF-8");
		response.getWriter().print(resultMark);
	}

	// 获取光交箱状态字典分页列表，AJAX请求
	@RequestMapping(params = "method=listPageByAjax")
	public @ResponseBody
	ListInfoTemplate listPageByAjax(StateKeySearch sks) {
		System.out.println("DepartmentController.listPageByAjax()");
		if (sks.getPage() <= 0)
			sks.setPage(1);
		if (sks.getRows() <= 0)
			sks.setRows(10);
		ListInfoTemplate lit = new ListInfoTemplate();
		lit.setPage(sks.getPage());
		int counts = dictionaryService.findCounts(sks);
		lit.setTotal(counts % sks.getRows() > 0 ? (counts / sks.getRows() + 1)
				: (counts / sks.getRows()));
		lit.setRecords(counts);
		lit.setRows(dictionaryService.findByPager(sks));
		return lit;
	}

	// 删除光交箱状态字典，AJAX请求
	@RequestMapping(params = "method=deleteStateKeyByAjax")
	public @ResponseBody
	AjaxRetObjTemplate deleteStateKeyByAjax(@RequestBody int[] sks) {
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		try {
			
			this.dictionaryService.deleteStateKey(sks);
			arot.setResultMark(1);
		}
		catch (Exception e)
		{
			e.printStackTrace();
			arot.setResultMark(0);
			arot.setErrMessage("删除失败，请重试！");
		}
		return arot;
	}

	// 获取所有光交箱状态字典列表，AJAX请求
	@RequestMapping(params = "method=listStateKeyAllByAjax")
	public @ResponseBody
	ListInfoTemplate listStateKeyAllByAjax() {
		System.out.println("DepartmentController.listPageByAjax()");
		ListInfoTemplate lit = new ListInfoTemplate();
		lit.setResultMark(1);
		lit.setRows(dictionaryService.findStateKeyAll());
		return lit;
	}

	// 获取光交箱状态字典项分页列表，AJAX请求
	@RequestMapping(params = "method=stateValueListPageByAjax")
	public @ResponseBody
	ListInfoTemplate stateValueListPageByAjax(StateValueSearch svs) {
		System.out.println("DictionaryController.stateValueListPageByAjax()");
		if (svs.getPage() <= 0)
			svs.setPage(1);
		if (svs.getRows() <= 0)
			svs.setRows(10);
		ListInfoTemplate lit = new ListInfoTemplate();
		lit.setPage(svs.getPage());
		int counts = dictionaryService.findStateValueCounts(svs);
		lit.setTotal(counts % svs.getRows() > 0 ? (counts / svs.getRows() + 1)
				: (counts / svs.getRows()));
		lit.setRecords(counts);
		lit.setRows(dictionaryService.findStateValueByPager(svs));
		return lit;
	}
	
	// 获取光交箱状态字典等级分页列表，AJAX请求
	@RequestMapping(params = "method=stateLevelListPageByAjax")
	public @ResponseBody
	ListInfoTemplate stateLevelListPageByAjax(StateLevelSearch sls) {
		System.out.println("DictionaryController.stateValueListPageByAjax()");
		if (sls.getPage() <= 0)
			sls.setPage(1);
		if (sls.getRows() <= 0)
			sls.setRows(10);
		ListInfoTemplate lit = new ListInfoTemplate();
		lit.setPage(sls.getPage());
		int counts = dictionaryService.findStateLevelCounts();
		lit.setTotal(counts % sls.getRows() > 0 ? (counts / sls.getRows() + 1)
				: (counts / sls.getRows()));
		lit.setRecords(counts);
		lit.setRows(dictionaryService.findStateLevelByPager(sls));
		return lit;
	}

	// 添加一个状态字典，AJAX请求
	@RequestMapping(params = "method=addStatekey")
	public @ResponseBody
	AjaxRetObjTemplate addStateKey(StateKey sk, HttpServletResponse response)
			throws IOException {
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		try {
			dictionaryService.addStateKey(sk);
			arot.setResultMark(1);
		} catch (Exception e) {
			arot.setResultMark(0);
			arot.setErrMessage("添加失败，请重试");
			e.printStackTrace();
		}
		return arot;
	}
	
	// 添加一个状态字典项，AJAX请求
	@RequestMapping(params = "method=addStateValue",consumes="application/json")
	public @ResponseBody
	AjaxRetObjTemplate addStateValue(@RequestBody StateValue sv, HttpServletResponse response)
			throws IOException {
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		try {
			dictionaryService.addStateValue(sv);
			arot.setResultMark(1);
		} catch (Exception e) {
			arot.setResultMark(0);
			arot.setErrMessage("添加失败，请重试");
			e.printStackTrace();
		}
		return arot;
	}

	// 获取所有光交箱状态等级字典列表，AJAX请求
	@RequestMapping(params = "method=listStateLevelAllByAjax")
	public @ResponseBody
	ListInfoTemplate listStateLevelAllByAjax() {
		System.out.println("DepartmentController.listPageByAjax()");
		ListInfoTemplate lit = new ListInfoTemplate();
		lit.setResultMark(1);
		lit.setRows(dictionaryService.findStateLevelAll());
		return lit;
	}

	// 添加一个状态字典等级，AJAX请求
	@RequestMapping(params="method=addStateLevel")
	public void addStateLevel(StateLevel sl,
			@RequestParam(value="add_statelevel_state_image",required=false) CommonsMultipartFile file,
			HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		try {
			System.out.println(sl.getLevel() + "/" + sl.getRemarks() + "/" + file.getOriginalFilename());
			if (!file.isEmpty()) {
				String path = request.getSession().getServletContext()
						.getRealPath("../gjx_uploadfile/state_level/");
				String fileName = file.getOriginalFilename();
				String fileType = fileName.substring(fileName.lastIndexOf("."));
				String newName = new Date().getTime() + fileType;
				File file2 = new File(path, newName); // 创建文件
				file.getFileItem().write(file2); // 写入文件
				sl.setState_image("gjx_uploadfile/state_level/" + newName);
				dictionaryService.addStateLevel(sl);
				response.setContentType("text/plain; charset=UTF-8");
				response.getWriter().print("1");
			} else {
				response.setContentType("text/plain; charset=UTF-8");
				response.getWriter().print("0");
			}
		} catch (Exception e) {
			response.setContentType("text/plain; charset=UTF-8");
			response.getWriter().print("0");
			e.printStackTrace();
		}
	}
	
	// 修改一个状态字典等级，AJAX请求
	@RequestMapping(params="method=updateStateLevel")
	public void updateStateLevel(StateLevel sl,
			@RequestParam(value="update_statelevel_state_image",required=false) CommonsMultipartFile file,
			HttpServletRequest request, HttpServletResponse response)
			throws IOException {
		try {
			if (file != null && !file.isEmpty()) {
				String path = request.getSession().getServletContext()
						.getRealPath("../gjx_uploadfile/state_level/");
				String fileName = file.getOriginalFilename();
				String fileType = fileName.substring(fileName.lastIndexOf("."));
				String newName = new Date().getTime() + fileType;
				File file2 = new File(path, newName); // �½�һ���ļ�
				file.getFileItem().write(file2); // 写入文件
				sl.setState_image("gjx_uploadfile/state_level/" + newName);
			}
			dictionaryService.updateStateLevel(sl);
			response.setContentType("text/plain; charset=UTF-8");
			response.getWriter().print("1");
		} catch (Exception e) {
			response.setContentType("text/plain; charset=UTF-8");
			response.getWriter().print("0");
			e.printStackTrace();
		}
	}
	
	// 删除字典状态等级（数组），AJAX请求
	@RequestMapping(params = "method=delStateLevelByAjax")
	public @ResponseBody
	AjaxRetObjTemplate delStateLevelByAjax(@RequestBody int[] levels) {
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		try {
			
			this.dictionaryService.deleteStateLevel(levels);
			arot.setResultMark(1);
		}
		catch (Exception e)
		{
			arot.setResultMark(0);
			arot.setErrMessage("删除失败，请重试！");
		}
		return arot;
	}
	
	// 删除字典状态项（数组），AJAX请求
	@RequestMapping(params = "method=delStateValueByAjax")
	public @ResponseBody
	AjaxRetObjTemplate delStateValueByAjax(@RequestBody int[] svs) {
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		try {
			
			this.dictionaryService.deleteStateValue(svs);
			arot.setResultMark(1);
		}
		catch (Exception e)
		{
			arot.setResultMark(0);
			arot.setErrMessage("删除失败，请重试！");
		}
		return arot;
	}
	
	// 获取所有字典状态等级，AJAX请求
	@RequestMapping(params = "method=findStateLevelByAjax")
	public @ResponseBody
	AjaxRetObjTemplate findStateLevelByAjax(int id) {
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		try {
			arot.setObject(this.dictionaryService.findStateLevel(id));
			arot.setResultMark(1);
		}
		catch (Exception e)
		{
			arot.setResultMark(0);
			arot.setErrMessage("获取失败，请重试！");
		}
		return arot;
	}
	
	// 获取所有字典状态项，AJAX请求
	@RequestMapping(params = "method=findStateValueByAjax")
	public @ResponseBody
	AjaxRetObjTemplate findStateValueByAjax(int id) {
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		try {
			arot.setObject(this.dictionaryService.findStateValue(id));
			arot.setResultMark(1);
		}
		catch (Exception e)
		{
			arot.setResultMark(0);
			arot.setErrMessage("获取失败，请重试！");
		}
		return arot;
	}

	// 修改字典状态项，AJAX请求
	@RequestMapping(params = "method=updateStateValueByAjax",consumes="application/json")
	public @ResponseBody
	AjaxRetObjTemplate updateStateValueByAjax(@RequestBody StateValue sv) {
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		try {
			this.dictionaryService.updateStateValue(sv);
			arot.setResultMark(1);
		}
		catch (Exception e)
		{
			arot.setResultMark(0);
			arot.setErrMessage("修改失败，请重试！");
		}
		return arot;
	}
	
	// 获取字典状态，AJAX请求
	@RequestMapping(params = "method=findStateKeyByAjax")
	public @ResponseBody
	AjaxRetObjTemplate findStateKeyByAjax(int id) {
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		try {
			arot.setObject(this.dictionaryService.findStateKey(id));
			arot.setResultMark(1);
		}
		catch (Exception e)
		{
			arot.setResultMark(0);
			arot.setErrMessage("获取失败，请重试！");
		}
		return arot;
	}
	
	
	// 修改字典状态，AJAX请求
	@RequestMapping(params = "method=updateStateKeyByAjax")
	public @ResponseBody
	AjaxRetObjTemplate updateStateKeyByAjax(StateKey sk) {
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		try {
			this.dictionaryService.updateStateKey(sk);
			arot.setResultMark(1);
		}
		catch (Exception e)
		{
			arot.setResultMark(0);
			arot.setErrMessage("修改失败，请重试！");
		}
		return arot;
	}
}
