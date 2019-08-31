package com.sxt.action;

import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.sxt.po.AjaxRetObjTemplate;
import com.sxt.po.BoxGlobals;
import com.sxt.po.BoxImages;
import com.sxt.po.BoxInfoOper;
import com.sxt.po.BoxInfoSearch;
import com.sxt.po.BoxModule;
import com.sxt.po.BoxSettings;
import com.sxt.po.BoxStatesAndStateValues;
import com.sxt.po.BoxStatesList;
import com.sxt.po.BoxTerminal;
import com.sxt.po.CoreUsed;
import com.sxt.po.Department;
import com.sxt.po.ListInfoTemplate;
import com.sxt.po.ModificationInfo;
import com.sxt.po.ModulesAndTerminals;
import com.sxt.po.PhoneOpenLog;
import com.sxt.po.SmsSettingOper;
import com.sxt.po.SmsSettingSearch;
import com.sxt.po.Test;
import com.sxt.po.User;
import com.sxt.po.UserNew;
import com.sxt.po.WorkOrder;
import com.sxt.po.WorkOrderImage;
import com.sxt.po.WorkOrderSearch;
import com.sxt.service.BoxInfoService;
import com.sxt.service.DepartmentService;
import com.sxt.service.DictionaryService;
import com.sxt.service.ExportExcelService;
import com.sxt.utils.DateUtil;
import com.sxt.utils.PrivilegeControl;

@Controller
@RequestMapping("/boxinfo.do")
public class BoxInfoController  {

	private BoxInfoService boxInfoService;
	private DictionaryService dictionaryService;
	private DepartmentService departmentService;
	private ExportExcelService exportExcelService;
	
	
	@InitBinder  
    public void initBinder(WebDataBinder binder) {  
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
        dateFormat.setLenient(false);  
        binder.registerCustomEditor(Date.class, new CustomDateEditor(dateFormat, true)); 
    }
	
	
	@RequestMapping(params = "method=opendoor")
	public @ResponseBody AjaxRetObjTemplate opendoor(Integer boxid,HttpServletRequest request) {
		
		if (boxid == null){
			
			AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
			arot.setObject(null);
			arot.setResultMark(0);
			arot.setErrMessage("boxid为空!");
			return arot;
		}
		
		  Integer userid = Integer.parseInt(request.getSession().getAttribute("user_id").toString());
		  String username = request.getSession().getAttribute("user_name").toString();
		
		  PhoneOpenLog p =  new PhoneOpenLog();
    	  p.setApplytime(new Date());
    	  p.setBoxid(boxid);
    	  p.setUserid(userid);
    	  p.setUsername(username);
    	  p.setType(1);
    	  this.boxInfoService.savephonelog(p);
    	  
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		
		arot.setResultMark(1);
		return arot;
		
	}
	
	@RequestMapping(params = "method=findWorkorder")
	public @ResponseBody AjaxRetObjTemplate findWorkorder(Integer id) {
		
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		arot.setObject(this.boxInfoService.findWorkorder(id));
		arot.setResultMark(1);
		return arot;
	}

	@RequestMapping(params = "method=findWorkorderNew")
	public @ResponseBody AjaxRetObjTemplate findWorkorderNew(Integer id) {
		
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		arot.setObject(this.boxInfoService.findWorkorderNew(id));
		arot.setResultMark(1);
		return arot;
	
	}
	
	
	@RequestMapping(params = "method=updateWorkorder")
	public @ResponseBody AjaxRetObjTemplate updateWorkorder(WorkOrder wo) {
		
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		this.boxInfoService.updateWorkorder(wo);
		arot.setResultMark(1);
		return arot;
	
	}
	
	//添加工单
	@RequestMapping(params = "method=addWorkorder")
	public @ResponseBody AjaxRetObjTemplate addWorkorder(HttpServletRequest request, WorkOrder order)
	{
		User user = new User();
		user.setId(Integer.parseInt(request.getSession().getAttribute("user_id").toString()));
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		order.setCreate_user(user);
		this.boxInfoService.addWorkorder(order);
		arot.setResultMark(1);
		return arot;
	}
	
	//更新工单
	@RequestMapping(params = "method=finishWorkorder")
	public @ResponseBody AjaxRetObjTemplate finishWorkorder(HttpServletRequest request, int id)
	{
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		this.boxInfoService.finishWorkOrder(id, Integer.parseInt(request.getSession().getAttribute("user_id").toString()));
		arot.setResultMark(1);
		return arot;
	}
	
	
	//查看工单详细信息eidt by ly  not finished  
	@RequestMapping(params="method=viewWorkOrder")
	public @ResponseBody AjaxRetObjTemplate viewOpticalcable(Integer id) {
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		arot.setObject(this.boxInfoService.viewWorkOrder(id));
		arot.setResultMark(1);
		return arot;
	}

	
	// 判断编号是否存在
	@RequestMapping(params = "method=isBoxNoValid")
	public void isBoxNoValid(BoxInfoOper bio, HttpServletRequest request,
			HttpServletResponse response, ModelMap map) throws IOException {
		int result = this.boxInfoService.validBoxNo(bio);
		String resultMark = result <= 0 ? "false" : "true";
		response.setContentType("application/json; charset=UTF-8");
		response.getWriter().print(resultMark);
	}
	
	// 判断控制器是否存在
	@RequestMapping(params = "method=isControllerIdValid")
	public void isControllerIdValid(BoxInfoOper bio, HttpServletRequest request,
			HttpServletResponse response, ModelMap map) throws IOException {
		int result = this.boxInfoService.validControllerId(bio);
		String resultMark = result <= 0 ? "false" : "true";
		response.setContentType("application/json; charset=UTF-8");
		response.getWriter().print(resultMark);
	}
	
	//修改端子业务信息
	@RequestMapping(params="method=updateLabelInfo")
	public @ResponseBody AjaxRetObjTemplate updateLabelInfo(int id, String info)
	{
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		if (this.boxInfoService.updateLabelInfo(id, info) > 0) arot.setResultMark(1);
		else arot.setResultMark(0);
		return arot;
	}
	
	//删除面板
	@RequestMapping(params="method=deleteModule")
	public @ResponseBody AjaxRetObjTemplate deleteModule(int id)
	{
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		if (this.boxInfoService.deleteModule(id) > 0) arot.setResultMark(1);
		else arot.setResultMark(0);
		return arot;
	}
	
	//删除面板一行
	@RequestMapping(params="method=deleteRow")
	public @ResponseBody AjaxRetObjTemplate deleteRow(int id, int row)
	{
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		if (this.boxInfoService.deleteRow(id, row) > 0) arot.setResultMark(1);
		else arot.setResultMark(0);
		return arot;
	}
	
	//添加面板一行
	@RequestMapping(params="method=addRow")
	public @ResponseBody AjaxRetObjTemplate addRow(int id, int row)
	{
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		if (this.boxInfoService.addRow(id, row) > 0) arot.setResultMark(1);
		else arot.setResultMark(0);
		return arot;
	}
	
	@RequestMapping(params="method=addBoxModule")
	public @ResponseBody AjaxRetObjTemplate addBoxModule(BoxModule bm, HttpServletRequest request)
	{
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		if (this.boxInfoService.addModule(bm) > 0)
		{
			arot.setResultMark(1);
		}
		else
		{
			arot.setResultMark(0);
			arot.setErrMessage("添加光交箱面板失败，请重试！");
		}
		return arot;
	}
	
	@RequestMapping(params="method=exportBoxinfo")
	public String exportExcel(HttpServletRequest request, HttpServletResponse response, BoxInfoSearch bs)
	{
		response.setContentType("application/binary;charset=utf-8");
		try
		{
			String fileName = new String(("boxinfo").getBytes(), "utf-8") + DateUtil.dateToString(new Date());
			
			response.setHeader("Content-disposition", "attachment; filename=" + fileName + ".xlsx");// 组装附件名称和格式
			String hql = "";
			String[] titles = { "光交箱编号", "控制器ID", "光交箱名称", "光交箱位置", "所属业务区", "SIM卡号", "gps经度", "gps纬度", "所属部门", "K码", "型号", "百度地图经度", "百度地图纬度", "维护部门", "备注" };
			exportExcelService.getExcel(request, hql, bs, titles, response.getOutputStream());
		}
		catch (IOException e)
		{
			e.printStackTrace();
		}
		return null;
	}

	@RequestMapping(params="method=importBoxinfo")
	public void upload(HttpServletRequest request, HttpServletResponse response)
	{
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		MultipartHttpServletRequest mulRequest = (MultipartHttpServletRequest) request;
		MultipartFile file = mulRequest.getFile("uploadexcel");
		String filename = file.getOriginalFilename();
		
		if (filename == null || "".equals(filename))
		{
			response.setContentType("text/plain; charset=UTF-8");
			try {
				response.getWriter().print("0");
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
		try
		{
			StringBuffer error = new StringBuffer();
			InputStream input = file.getInputStream();
			XSSFWorkbook workBook = new XSSFWorkbook(input);
			XSSFSheet sheet = workBook.getSheetAt(0);
			if (sheet != null)
			{
				User u = new User();
				u.setId(Integer.parseInt(request.getSession().getAttribute("user_id").toString()));
				for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++)
				{
					XSSFRow row = sheet.getRow(i);
					BoxInfoOper import_temp = new BoxInfoOper();
					
					import_temp.setLastedituser(u);
					int oper = 0; //0增加1编号存在10控制器存在11编号和控制器都存在2跳过
					if (row.getPhysicalNumberOfCells() != 15)
					{
						error.append("第" + (i + 1) + "行: 列数不对\n");
						oper = 2;
						break;
					}
					for (int j = 0; j < row.getPhysicalNumberOfCells(); j++)
					{
						XSSFCell cell = row.getCell(j);
						switch (j)
						{
							case 0:  //编号
								if (cell.getCellType() == XSSFCell.CELL_TYPE_BLANK)
								{
									error.append("第" + (i + 1) + "行: 光交箱编号不能为空\n");
									oper = 2;
									j = row.getPhysicalNumberOfCells();
								}
								else
								{
									BoxInfoSearch bis = new BoxInfoSearch();
									bis.setBox_no(cell.toString());
									List<Map<String, Object>> bios = this.boxInfoService.findAll(request, bis);
									if (bios.size() > 0)
									{
										oper += 1;
									}
									import_temp.setBox_no(cell.toString());
								}
								break;
							case 1:  //控制器ID
								if (! (cell.getCellType() == XSSFCell.CELL_TYPE_BLANK || cell.getCellType() == XSSFCell.CELL_TYPE_NUMERIC))
								{
									error.append("第" + (i + 1) + "行: 光交箱控制器ID只能为整数\n");
									oper = 2;
									j = row.getPhysicalNumberOfCells();
								}
								else
								{
									if (cell.getCellType() != XSSFCell.CELL_TYPE_BLANK)
									{
										BoxInfoSearch bis = new BoxInfoSearch();
										double temp_d = Double.parseDouble(cell.toString());
										
										bis.setController_id((long)temp_d);
										List<Map<String, Object>> bios = this.boxInfoService.findAll(request, bis);
										if (bios.size() > 0)
										{
											oper += 10;
										}
										import_temp.setController_id((long)temp_d);
									}
								}
								break;
							case 2:  //光交箱名称
								import_temp.setBox_name(cell.toString());
								break;
							case 3:  //光交箱位置
								import_temp.setAddress(cell.toString());
								break;
							case 4:  //光交箱所属业务区域
								import_temp.setBusiness_area(cell.toString());
								break;
							case 5:  //光交箱SIM
								System.out.println(cell.toString());
								import_temp.setSim_phone_no(cell.toString());
								break;
							case 6:  //gps经度
								if (! (cell.getCellType() == XSSFCell.CELL_TYPE_BLANK || cell.getCellType() == XSSFCell.CELL_TYPE_NUMERIC))
								{
									error.append("第" + (i + 1) + "行: 光交箱gps经度只能为数字\n");
									oper = 2;
									j = row.getPhysicalNumberOfCells();
								}
								else
								{
									if (cell.getCellType() != XSSFCell.CELL_TYPE_BLANK)
									{										
										import_temp.setLongitude(Double.parseDouble(cell.toString()));
									}
								}
								break;
							case 7:  //gps维度
								if (! (cell.getCellType() == XSSFCell.CELL_TYPE_BLANK || cell.getCellType() == XSSFCell.CELL_TYPE_NUMERIC))
								{
									error.append("第" + (i + 1) + "行: 光交箱gps维度只能为数字\n");
									oper = 2;
									j = row.getPhysicalNumberOfCells();
								}
								else
								{
									if (cell.getCellType() != XSSFCell.CELL_TYPE_BLANK)
									{										
										import_temp.setLatitude(Double.parseDouble(cell.toString()));
									}
								}
								break;
							case 8:  //所属部门
								if (cell.getCellType() != XSSFCell.CELL_TYPE_BLANK && ! cell.toString().equals(""))
								{
									List<Department> departs = this.departmentService.findByName(cell.toString());
									if (departs.size() <= 0)
									{
										error.append("第" + (i + 1) + "行: 所属部门不存在\n");
										oper = 2;
										j = row.getPhysicalNumberOfCells();
									}
									else
									{
										import_temp.setDepartment(departs.get(0));
									}
								}
								break;
							case 9:  //K码
								import_temp.setK_code(cell.toString());
								break;
							case 10:  //型号
								import_temp.setBox_type(cell.toString());
								break;
							case 11:  //gps经度
								if (! (cell.getCellType() == XSSFCell.CELL_TYPE_BLANK || cell.getCellType() == XSSFCell.CELL_TYPE_NUMERIC))
								{
									error.append("第" + (i + 1) + "行: 百度地图经度只能为数字\n");
									oper = 2;
									j = row.getPhysicalNumberOfCells();
								}
								else
								{
									if (cell.getCellType() != XSSFCell.CELL_TYPE_BLANK)
									{										
										import_temp.setB_longitude(Double.parseDouble(cell.toString()));
									}
								}
								break;
							case 12:  //gps维度
								if (! (cell.getCellType() == XSSFCell.CELL_TYPE_BLANK || cell.getCellType() == XSSFCell.CELL_TYPE_NUMERIC))
								{
									error.append("第" + (i + 1) + "行: 百度地图维度只能为数字\n");
									oper = 2;
									j = row.getPhysicalNumberOfCells();
								}
								else
								{
									if (cell.getCellType() != XSSFCell.CELL_TYPE_BLANK)
									{										
										import_temp.setB_latitude(Double.parseDouble(cell.toString()));
									}
								}
								break;
							case 13:  //维护部门
								if (cell.getCellType() != XSSFCell.CELL_TYPE_BLANK && ! cell.toString().equals(""))
								{
									List<Department> departs = this.departmentService.findByName(cell.toString());
									if (departs.size() <= 0)
									{
										error.append("第" + (i + 1) + "行: 维护部门不存在\n");
										oper = 2;
										j = row.getPhysicalNumberOfCells();
									}
									else
									{
										import_temp.setWorkorder_department(departs.get(0));
									}
								}
								break;
							case 14:  //备注
								import_temp.setRemarks(cell.toString());
								break;
							default:
								break;
						}
					}
					if (oper == 0)//0增加1编号存在10控制器存在11编号和控制器都存在2跳过
					{
						this.boxInfoService.add(import_temp, request);
					}
					else if (oper == 1)
					{
						BoxInfoSearch bis = new BoxInfoSearch();
						bis.setBox_no(import_temp.getBox_no());
						List<Map<String, Object>> bios = this.boxInfoService.findAll(request, bis);
						if (bios.size() > 0)
						{
							import_temp.setId(Integer.parseInt(bios.get(0).get("id").toString()));
							import_temp.setIs_deleted(0);
							this.boxInfoService.update(import_temp);
						}
					}
					else if (oper == 10)
					{
						BoxInfoSearch bis = new BoxInfoSearch();
						bis.setController_id(import_temp.getController_id());
						List<Map<String, Object>> bios = this.boxInfoService.findAll(request, bis);
						if (bios.size() > 0)
						{
							import_temp.setId(Integer.parseInt(bios.get(0).get("id").toString()));
							this.boxInfoService.update(import_temp);
						}
					}
					else if (oper == 11)
					{
						BoxInfoSearch bis = new BoxInfoSearch();
						bis.setBox_no(import_temp.getBox_no());
						bis.setController_id(import_temp.getController_id());
						List<Map<String, Object>> bios = this.boxInfoService.findAll(request, bis);
						if (bios.size() > 0)
						{
							import_temp.setId(Integer.parseInt(bios.get(0).get("id").toString()));
							this.boxInfoService.update(import_temp);
						}
					}
				}

			}
			response.setContentType("text/plain; charset=UTF-8");
			response.getWriter().print("1," + error.toString());
		}
		catch (Exception e)
		{
			response.setContentType("text/plain; charset=UTF-8");
			try {
				response.getWriter().print("0");
			} catch (IOException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
	}
	
	//光交箱短信设置页面
	@RequestMapping(params="method=smsSetting")
	public String smsSetting(HttpServletRequest request, ModelMap map) {
		
		if (PrivilegeControl.exist(request, "smssetting", "add"))
		{
			map.put("smssetting_add", true);
		}
		
		if (PrivilegeControl.exist(request, "smssetting", "delete"))
		{
			map.put("smssetting_delete", true);
		}
		
		return "smsSetting";
	
	}
	
	//短信设置列表
	@RequestMapping(params="method=smsSettingList")
	public @ResponseBody ListInfoTemplate smsSettingList(HttpServletRequest request, SmsSettingSearch bis)
	{
		if (bis != null && bis.getPage() <= 0) bis.setPage(1);
		if (bis != null && bis.getRows() <= 0) bis.setRows(10);
		ListInfoTemplate lit = new ListInfoTemplate();
		lit.setPage(bis.getPage());
		int counts = boxInfoService.findSmsSettingCounts(request, bis);
		lit.setTotal(counts % bis.getRows() > 0 ? (counts / bis.getRows() + 1) : (counts / bis.getRows()));
		lit.setRecords(counts);
		lit.setRows(boxInfoService.findSmsSettingByPager(request, bis));
		return lit;
	}
	
	//短信告警设置
	@RequestMapping(params="method=smsset")
	public @ResponseBody AjaxRetObjTemplate smsset(SmsSettingOper sso)
	{
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		this.boxInfoService.smsset(sso);
		arot.setResultMark(1);
		return arot;
	}
	
	//删除短信告警
	@RequestMapping(params="method=deleteSmsset")
	public @ResponseBody AjaxRetObjTemplate deleteSmsset(@RequestBody int[] ss)
	{
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		this.boxInfoService.deleteSmsSetting(ss);
		arot.setResultMark(1);
		return arot;
	}
	
	//系统设置页面
	@RequestMapping(params="method=boxglobalsetting")
	public String boxglobalsetting(HttpServletRequest request, ModelMap map){
		return "boxglobalsetting";
	}
	
	//获取系统设置，AJAX方式
	@RequestMapping(params="method=getBoxGlobals")
	public @ResponseBody AjaxRetObjTemplate getBoxGlobals(){
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		arot.setObject(this.boxInfoService.getBoxGlobals());
		arot.setResultMark(1);
		return arot;
	}
	
	//获取具体设置，AJAX方式
	@RequestMapping(params="method=getBoxSettings")
	public @ResponseBody AjaxRetObjTemplate getBoxSettings(int id){
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		arot.setObject(this.boxInfoService.getBoxSettings(id));
		arot.setResultMark(1);
		BoxSettings bs = (BoxSettings)arot.getObject();
		
		return arot;
	}
	
	//获取具体下发，AJAX方式
	@RequestMapping(params="method=getBoxModifi")
	public @ResponseBody AjaxRetObjTemplate getBoxModifi(int id){
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		arot.setObject(this.boxInfoService.getBoxModifi(id));
		arot.setResultMark(1);
		return arot;
	}
	
	//修改具体设置，AJAX方式
	@RequestMapping(params="method=updateBoxSettings")
	public @ResponseBody AjaxRetObjTemplate updateBoxSettings(HttpServletRequest request, BoxSettings bs){
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		User u = new User();
		u.setId(Integer.parseInt(request.getSession().getAttribute("user_id").toString()));
		bs.setUser(u);
		this.boxInfoService.updateBoxSettings(bs);
		arot.setResultMark(1);
		return arot;
	}
	
	//修改具体下发，AJAX方式
	@RequestMapping(params="method=updateBoxModifi")
	public @ResponseBody AjaxRetObjTemplate updateBoxModifi(HttpServletRequest request, ModificationInfo mi){
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		User u = new User();
		u.setId(Integer.parseInt(request.getSession().getAttribute("user_id").toString()));
		mi.setUser(u);
		this.boxInfoService.updateBoxModifi(mi);
		arot.setResultMark(1);
		return arot;
	}
	
	//获取光交箱的图片，AJAX方式
	@RequestMapping(params="method=getBoxImages")
	public void getBoxImages(int id, HttpServletResponse response) throws IOException{
		List<BoxImages> bi = this.boxInfoService.getBoxImages(id);
		StringBuffer sb = new StringBuffer("[");
		for (int i = 0; i < bi.size(); i ++)
		{
			sb.append("{");
			sb.append("\"image_path\" : \"" + bi.get(i).getImage_path() + "\", \"remarks\" : \"" + bi.get(i).getRemarks() + "\", \"imid\" : \"" + bi.get(i).getId() + "\"");
			sb.append("},");
		}
		if (bi.size() > 0) sb = sb.deleteCharAt(sb.length() - 1);
		sb.append("]");
		String resultMark = "{\"resultMark\" : 1, \"rows\" : " + sb.toString() + "}";
		response.setContentType("application/json; charset=UTF-8");
		response.getWriter().print(resultMark);
	}
	
	//获取光交箱的图片，AJAX方式
    public void deleteimage(String ids, HttpServletResponse response) throws IOException{

			String[] array = ids.split(",");
			if(array.length >0){
				
				for (int i = 0; i < array.length; i ++){
                  
					this.boxInfoService.deleteimage(Integer.parseInt(array[i]));

				}
				
			}

			String resultMark = "{\"resultMark\" : 1}";
			response.setContentType("application/json; charset=UTF-8");
			response.getWriter().print(resultMark);
		}
		
	
	//获取工单的图片，AJAX方式
	@RequestMapping(params="method=getOrderImages")
	public void getOrderImages(int id, HttpServletResponse response) throws IOException{
		
		List<WorkOrderImage> bi = this.boxInfoService.getOrderImages(id);
		StringBuffer sb = new StringBuffer("[");
		
		for (int i = 0; i < bi.size(); i ++)
		{
			sb.append("{");
			sb.append("\"image_path\" : \"" + bi.get(i).getImage_path() + "\", \"remarks\" : \"" + bi.get(i).getRemarks() + "\"");
			sb.append("},");
		}
		
		if (bi.size() > 0) sb = sb.deleteCharAt(sb.length() - 1);
		sb.append("]");
		String resultMark = "{\"resultMark\" : 1, \"rows\" : " + sb.toString() + "}";
		response.setContentType("application/json; charset=UTF-8");
		response.getWriter().print(resultMark);
	}
	
	//修改系统设置，AJAX方式
	@RequestMapping(params="method=updateBoxGlobals")
	public @ResponseBody AjaxRetObjTemplate updateBoxGlobals(BoxGlobals bg, HttpServletRequest request){
		UserNew user = new UserNew();
		user.setId(Integer.parseInt(request.getSession().getAttribute("user_id").toString()));
		bg.setUser(user);
		bg.setLastedittime(new Date());
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		this.boxInfoService.updateBoxGlobals(bg);
		arot.setResultMark(1);
		return arot;
	}
	
	//光交箱监控页面请求
	@RequestMapping(params="method=mapcontrol")
	public String mapcontrol(HttpServletRequest request, ModelMap map){
		List<Department> departs = departmentService.findAll(request);
		if (departs.size() > 0) map.put("departments", DepartmentController.departs2json(departs, 1));
		if (PrivilegeControl.exist(request, "boxevent", "delete"))
		{
			map.put("boxevent_delete", true);
		}
		if (PrivilegeControl.exist(request, "boxwarn", "delete"))
		{
			map.put("boxwarn_delete", true);
		}
		if (PrivilegeControl.exist(request, "boxeventandwarn", "boxeventList"))
		{
			map.put("boxevent_list", true);
		}
		if (PrivilegeControl.exist(request, "boxeventandwarn", "boxwarnList"))
		{
			map.put("boxwarn_list", true);
		}
		return "mapcontrol";
	}
	
	//光交箱列表页面请求
	@RequestMapping(params="method=list")
	public String list(HttpServletRequest request, ModelMap map){
		List<Department> departs = departmentService.findAll(request);
		if (departs.size() > 0) map.put("departments", DepartmentController.departs2json(departs, 1));
		if (PrivilegeControl.exist(request, "boxinfo", "import"))
		{
			map.put("boxinfo_import", true);
		}
		if (PrivilegeControl.exist(request, "boxinfo", "export"))
		{
			map.put("boxinfo_export", true);
		}
		if (PrivilegeControl.exist(request, "boxinfo", "opendoor"))
		{
			map.put("boxinfo_opendoor", true);
		}
		if (PrivilegeControl.exist(request, "boxinfo", "add"))
		{
			map.put("boxinfo_add", true);
		}
		if (PrivilegeControl.exist(request, "boxinfo", "update"))
		{
			map.put("boxinfo_update", true);
		}
		if (PrivilegeControl.exist(request, "boxinfo", "delete"))
		{
			map.put("boxinfo_delete", true);
		}
		if (PrivilegeControl.exist(request, "boxinfo", "showpics"))
		{
			map.put("boxinfo_showpics", true);
		}
		if (PrivilegeControl.exist(request, "boxinfo", "boxsetting"))
		{
			map.put("boxinfo_boxsetting", true);
		}
		if (PrivilegeControl.exist(request, "boxinfo", "modify"))
		{
			map.put("boxinfo_modify", true);
		}
		if (PrivilegeControl.exist(request, "boxinfo", "showmodules"))
		{
			map.put("boxinfo_showmodules", true);
		}
		if (PrivilegeControl.exist(request, "boxinfo", "showterminals"))
		{
			map.put("boxinfo_showterminals", true);
		}
		if (PrivilegeControl.exist(request, "boxinfo", "showlocks"))
		{
			map.put("boxinfo_showlocks", true);
		}
		if (PrivilegeControl.exist(request, "boxinfo", "jumpterminal"))
		{
			map.put("boxinfo_jumpterminal", true);
		}
		if (PrivilegeControl.exist(request, "boxinfo", "coretoterminal"))
		{
			map.put("boxinfo_coretoterminal", true);
		}
		if (PrivilegeControl.exist(request, "boxinfo", "coretocore"))
		{
			map.put("boxinfo_coretocore", true);
		}
		return "boxinfoList";
	}
	
	//工单页面请求
	@RequestMapping(params="method=orderlist")
	public String orderlist(HttpServletRequest request, ModelMap map){
		List<Department> departs = departmentService.findAll(request);
		if (departs.size() > 0) map.put("departments", DepartmentController.departs2json(departs, 1));
		if (PrivilegeControl.exist(request, "workorder", "add"))
		{
			map.put("workorder_add", true);
		}
		if (PrivilegeControl.exist(request, "workorder", "update"))
		{
			map.put("workorder_update", true);
		}
		if (PrivilegeControl.exist(request, "workorder", "delete"))
		{
			map.put("workorder_delete", true);
		}
		return "workorderList";
	}
	
	
	//获取光交箱分页数据，AJAX方式
	@RequestMapping(params="method=listPageByAjax")
	public @ResponseBody ListInfoTemplate listPageByAjax(HttpServletRequest request, BoxInfoSearch bis){
		ListInfoTemplate lit = new ListInfoTemplate();
		if (bis != null && bis.getRows() <= 0) {
			bis.setRows(10);
		}
		lit.setPage(bis.getPage());
		int counts = boxInfoService.findCounts(request, bis);
		lit.setTotal(counts % bis.getRows() > 0 ? (counts / bis.getRows() + 1) : (counts / bis.getRows()));
		lit.setRecords(counts);
		lit.setRows(boxInfoService.findByPager(request, bis));
		return lit;
	}
	
	@RequestMapping(params="method=findOrderTypeAlarmCounts")
	public @ResponseBody AjaxRetObjTemplate findOrderTypeAlarmCounts(HttpServletRequest request) {
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		arot.setObject(this.boxInfoService.findOrderTypeAlarmCounts(request));
		arot.setResultMark(1);
		return arot;
	}
	
	//获取工单分页数据，AJAX方式
	@RequestMapping(params="method=listWorkOrderByAjax")
	public @ResponseBody ListInfoTemplate listWorkOrderByAjax(WorkOrderSearch bis,HttpServletRequest request){
		
		if (bis != null && bis.getRows() <= 0) {
			bis.setRows(10);
		}
		ListInfoTemplate lit = new ListInfoTemplate();
		lit.setPage(bis.getPage());
		int counts = boxInfoService.findWorkOrderCounts(bis,request);
		lit.setTotal(counts % bis.getRows() > 0 ? (counts / bis.getRows() + 1) : (counts / bis.getRows()));
		lit.setRecords(counts);
		lit.setRows(boxInfoService.findAllWorkOrder(bis, request));
		System.out.println(lit.getRows().size());
		return lit;
	}
	
	//获取所有的光交箱信息，AJAX
	@RequestMapping(params="method=listByAjax")
	public @ResponseBody List<Map<String, Object>> listByAjax(HttpServletRequest request, BoxInfoSearch bis){
		List<Map<String, Object>> bs = boxInfoService.findAll(request, bis);
		return bs;
	}
	
	//根据部门id获取光交箱
	@RequestMapping(params="method=listByDepartmentId")
	public @ResponseBody BoxStatesAndStateValues listByDepartmentId(HttpServletRequest request, Integer id, String box_no, Long controller_id){
		BoxStatesAndStateValues bs = new BoxStatesAndStateValues();
		bs.setBis(this.boxInfoService.findByDepartmentId(request, id, box_no, controller_id));
		bs.setBss(this.boxInfoService.findAllBoxStatesByDepartmentId(request, id, box_no, controller_id));
		return bs;
	}
	
	//获取部门光交箱树
	@RequestMapping(params="method=listDepartmentBoxTree")
	public void listDepartmentBoxTree(HttpServletRequest request, HttpServletResponse response) throws IOException{
		String resultMark = "{\"resultMark\" : 1, \"tree\" : " + this.boxInfoService.findTreeByDepartment(request) + "}";
		response.setContentType("application/json; charset=UTF-8");
		response.getWriter().print(resultMark);
	}
	
	//获取所有的光交箱状态和字典状态项，AJAX
	@RequestMapping(params="method=getAllBoxesAndStates")
	public @ResponseBody BoxStatesAndStateValues getAllBoxesAndStates(HttpServletRequest request){
		long starTime=System.currentTimeMillis();
		BoxStatesAndStateValues bs = new BoxStatesAndStateValues();
		bs.setBis(this.boxInfoService.findAll(request, null));
		long endTime=System.currentTimeMillis();
		long starTime2=System.currentTimeMillis();
		bs.setBss(this.boxInfoService.findAllBoxStatesByAjax(request));
		long endTime2=System.currentTimeMillis();
		long Time=endTime-starTime;
		long Time2=endTime2-starTime2;
		  System.out.println("time1======="+Time+"time2======="+Time2);
		
		return bs;
	}
	
	//获取光交箱面板和端子，AJAX
	@RequestMapping(params="method=findBoxModulesAndTerminalsByAjax")
	public @ResponseBody ModulesAndTerminals findBoxModulesAndTerminalsByAjax(HttpServletRequest request, int id){
		ModulesAndTerminals mat = new ModulesAndTerminals();
		mat.setBms(this.boxInfoService.findBoxModuleById(request, id));
		mat.setBts(this.boxInfoService.findBoxTerminalById(id));
		return mat;
	}
	
	//获取所有的光交箱状态信息，AJAX
	@RequestMapping(params="method=findAllBoxStatesByAjax")
	public @ResponseBody BoxStatesList findAllBoxStatesByAjax(){
		BoxStatesList bsl = new BoxStatesList();
		bsl.setSks(this.dictionaryService.findStateKeyAll());
		bsl.setSvs(this.dictionaryService.findStateValueAll());
		bsl.setResultMark(1);
		return bsl;
	}
	
	//获取端子名称
	@RequestMapping(params="method=getTerminalName")
	public @ResponseBody AjaxRetObjTemplate getTerminalName(String  terminalid){
		
		if (terminalid == null || terminalid.equals(""))
			{
			
			AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
			arot.setObject(null);
			arot.setResultMark(1);
			return arot;
			
			}
		
		String[] array = terminalid.split(",");
		StringBuffer sb = new StringBuffer(""); 
			
		    for (int i = 0; i < array.length; i ++) {
				
				sb.append(boxInfoService.findTerminalName(Integer.parseInt(array[i]))+ ",");
			}
        
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		arot.setObject(sb.substring(0, sb.length()-1));
		arot.setResultMark(1);
		return arot;
		
	}
	
	//获取纤芯名称
	@RequestMapping(params="method=getCoreName")
	public @ResponseBody AjaxRetObjTemplate getCoreName(String  coreid){
		
		if (coreid == null || coreid.equals(""))
			{
			
			AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
			arot.setObject(null);
			arot.setResultMark(1);
			return arot;
			
			}
		
		Integer core_id  =  Integer.parseInt(coreid);
		
		String core_name  = boxInfoService.findCoreName(core_id);
		
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		arot.setObject(core_name);
		arot.setResultMark(1);
		return arot;
		
	}
	
	//获取光交箱信息，AJAX方式
	@RequestMapping(params="method=findByAjax")
	public @ResponseBody AjaxRetObjTemplate findByAjax(int id){
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		arot.setObject(boxInfoService.find(id));
		arot.setResultMark(1);
		return arot;
	}
	
	//解除跳纤
	@RequestMapping(params="method=relieveJumpTerminal")
	public @ResponseBody AjaxRetObjTemplate relieveJumpTerminal(int id1, int id2){
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		arot.setObject(this.boxInfoService.relieveJumpTerminal(id1, id2));
		arot.setResultMark(1);
		return arot;
	}
	
	//获取跳纤
	@RequestMapping(params="method=findJumpTerminal")
	public @ResponseBody AjaxRetObjTemplate findJumpTerminal(int id, int type) {
		BoxTerminal bt = this.boxInfoService.findTerminal(id);
		List<BoxTerminal> jts = this.boxInfoService.findJumpTerminal(id);
		List<BoxTerminal> ors = this.boxInfoService.findRespectTerminal(id);
		StringBuffer sb  = new StringBuffer();
		if (jts != null && ! jts.isEmpty()) {
			sb.append("跳纤：<br/>");
			for (int i = 0; i < jts.size(); i ++)
			{
				if (type == 1)
				{
					sb.append(bt.getName() + "-" + jts.get(i).getName() + " &nbsp;<a href='javascript:void(0);' style='color:red;' onclick=\"relieveJumpTerminal(" + bt.getId() + ", " + jts.get(i).getId() + ")\" title='解除跳纤'><i class='icon-remove'></i></a><br/>");
				}
				else
				{
					sb.append(bt.getName() + "-" + jts.get(i).getName() + " <br/>");
				}
			}
		}
		if (ors != null && ! ors.isEmpty()) {
			sb.append("工单任务：<br/>");
			for (int i = 0; i < ors.size(); i ++)
			{
				sb.append(bt.getName() + "-" + ors.get(i).getName() + "<br/>");
			}
		}
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		arot.setResultMark(1);
		arot.setObject(sb.toString().length() > 0 ? sb.toString() : "没有查到任何结果");
		return arot;
	}
	
	//跳纤
	@RequestMapping(params="method=jumpTerminal")
	public @ResponseBody AjaxRetObjTemplate jumpTerminal(int a, int b){
		this.boxInfoService.jumpTerminal(a, b);
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		arot.setResultMark(1);
		return arot;
	}
	
	
	//解除纤芯成端
	@RequestMapping(params="method=relieveCoreToTerminal")
	public @ResponseBody AjaxRetObjTemplate relieveCoreToTerminal(int id){
		this.boxInfoService.relieveCoreToTerminal(id);
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		arot.setResultMark(1);
		return arot;
	}
	
	//获取纤芯成端
	@RequestMapping(params="method=findCoreToTerminal")
	public @ResponseBody AjaxRetObjTemplate findCoreToTerminal(int id) {
		CoreUsed jc = this.boxInfoService.findCoreToTerminal(id);
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		arot.setResultMark(1);
		arot.setObject(jc);
		return arot;
	}
	
	//纤芯成端
	@RequestMapping(params="method=coreToTerminal")
	public @ResponseBody AjaxRetObjTemplate coreToTerminal(int tid, int oid, int cid, int bid){
		this.boxInfoService.coreToTerminal(tid, oid, cid, bid);
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		arot.setResultMark(1);
		return arot;
	}
	
	//纤芯直熔
	@RequestMapping(params="method=coreToCore")
	public @ResponseBody AjaxRetObjTemplate coreToCore(int bid, int sid, int eid){
		this.boxInfoService.coreToCore(bid, sid, eid);
		AjaxRetObjTemplate arot = new AjaxRetObjTemplate();
		arot.setResultMark(1);
		return arot;
	}
	
	//添加光交箱
	@RequestMapping(params="method=add")
	public void add(BoxInfoOper boxInfo, HttpServletRequest request, HttpServletResponse response) throws IOException{
		User u = new User();
		u.setId(Integer.parseInt(request.getSession().getAttribute("user_id").toString()));
		boxInfo.setLastedituser(u);
		String resultMark = "";
		boxInfoService.add(boxInfo, request);
		resultMark = "{\"resultMark\" : 1}";
		response.setContentType("application/json; charset=UTF-8");
		response.getWriter().print(resultMark);
	}
	
	//����ʱ���
	@RequestMapping(params="method=ts")
	public void ts(Test date, int id, HttpServletResponse response) throws IOException{
		System.out.println("boxInfoController.ts()");
		String resultMark = "{\"resultMark\" : 1}";
		response.setContentType("application/json; charset=UTF-8");
		response.getWriter().print(resultMark);
	}
	
	//修改光交箱
	@RequestMapping(params="method=update")
	public void update(BoxInfoOper boxInfo,HttpServletRequest request, HttpServletResponse response) throws IOException{
		User u = new User();
		u.setId(Integer.parseInt(request.getSession().getAttribute("user_id").toString()));
		boxInfo.setLastedituser(u);
		String resultMark = "";
		if (boxInfoService.update(boxInfo) != 0)
		{
			resultMark = "{\"resultMark\" : 1}";
		}
		else
		{
			resultMark = "{\"resultMark\" : 0}";
		}
		response.setContentType("application/json; charset=UTF-8");
		response.getWriter().print(resultMark);
	}
	
	//删除光交箱
	@RequestMapping(params="method=delete")
	public void delete(@RequestBody int[] ids, HttpServletRequest request, HttpServletResponse response) throws IOException{
		boxInfoService.delete(ids);
		/*//赋予所有光交箱权限
		request.getSession().removeAttribute("boxprivilege");
		List<Map<String, Object>> bis = this.boxInfoService.findAllBoxInfo();
		List<BoxPrivilege> bps = new ArrayList<BoxPrivilege>();
		for (int i = 0; i < bis.size(); i ++)
		{
			BoxPrivilege temp = new BoxPrivilege();
			BoxInfo bi = new BoxInfo();
			bi.setId(Integer.parseInt(bis.get(i).get("id").toString()));
			temp.setBoxinfo(bi);
			bps.add(temp);
		}
		request.getSession().setAttribute("boxprivilege", bps);*/
		String resultMark = "{\"resultMark\" : 1}";
		response.setContentType("application/json; charset=UTF-8");
		response.getWriter().print(resultMark);
	}
	
	
	

	public BoxInfoService getBoxInfoService() {
		return boxInfoService;
	}

	@Resource
	public void setBoxInfoService(BoxInfoService boxInfoService) {
		this.boxInfoService = boxInfoService;
	}


	public DictionaryService getDictionaryService() {
		return dictionaryService;
	}


	@Resource
	public void setDictionaryService(DictionaryService dictionaryService) {
		this.dictionaryService = dictionaryService;
	}

	public DepartmentService getDepartmentService() {
		return departmentService;
	}

	@Resource
	public void setDepartmentService(DepartmentService departmentService) {
		this.departmentService = departmentService;
	}

	public ExportExcelService getExportExcelService() {
		return exportExcelService;
	}

	@Resource
	public void setExportExcelService(ExportExcelService exportExcelService) {
		this.exportExcelService = exportExcelService;
	}
	
	
	

	
}
