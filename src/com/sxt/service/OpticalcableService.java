package com.sxt.service;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;

import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sxt.dao.BoxInfoDao;
import com.sxt.dao.DepartmentDao;
import com.sxt.dao.OpticalcableDao;
import com.sxt.dao.UserDao;
import com.sxt.po.BoxInfo;
import com.sxt.po.BoxInfoOper;
import com.sxt.po.BoxInfoSearch;
import com.sxt.po.BoxModule;
import com.sxt.po.BoxStates;
import com.sxt.po.BoxTerminal;
import com.sxt.po.BoxTerminalUsed;
import com.sxt.po.Core;
import com.sxt.po.CoreUsed;
import com.sxt.po.DTO_BoxStates_Values_Levels;
import com.sxt.po.DTO_Core;
import com.sxt.po.Department;
import com.sxt.po.Operators;
import com.sxt.po.Opticalcable;
import com.sxt.po.OpticalcableAnalysis;
import com.sxt.po.OpticalcableCoreTree;
import com.sxt.po.OpticalcableSearch;
import com.sxt.po.Pager;
import com.sxt.po.User;
import com.sxt.utils.ExportUtil;

@Service("opticalcableService")
public class OpticalcableService {
	
	private OpticalcableDao opticalcableDao;
	
	public void add(Opticalcable b){
		opticalcableDao.add(b);
	}
	
	public void getExcel(String hql, String[] titles, ServletOutputStream outputStream)
	{
		List<Opticalcable> os = this.opticalcableDao.findAll();
		// 创建一个workbook 对应一个excel应用文件
		XSSFWorkbook workBook = new XSSFWorkbook();
		// 在workbook中添加一个sheet,对应Excel文件中的sheet
		XSSFSheet sheet = workBook.createSheet("纤芯使用情况分析");
		ExportUtil exportUtil = new ExportUtil(workBook, sheet);
		XSSFCellStyle headStyle = exportUtil.getHeadStyle();
		XSSFCellStyle bodyStyle = exportUtil.getBodyStyle();
		// 构建表头
		XSSFRow headRow = sheet.createRow(0);
		XSSFCell cell = null;
		int i = 0;
		for (i = 0; i < titles.length; i++)
		{
			cell = headRow.createCell(i);
			cell.setCellStyle(headStyle);
			cell.setCellValue(titles[i]);
		}
		// 构建表体数据
		if (os != null && os.size() > 0)
		{
			int index = 0;
			List<OpticalcableAnalysis> oa = new ArrayList<OpticalcableAnalysis>();
			for (i = 0; i < os.size(); i ++)
			{
				OpticalcableAnalysis temp = new OpticalcableAnalysis();
				List<CoreUsed> cu = this.opticalcableDao.findAllCore(os.get(i).getId());

				int used = 0, j = 0;

				for (j = 0; j < cu.size(); j ++)
				{
					if (cu.get(j).getA_type() == 3 || cu.get(j).getZ_type() == 3)
					{
						used ++;
					}
					else if (cu.get(j).getA_type() == 2 || cu.get(j).getZ_type() == 2)
					{
						String ids = "";
						if (cu.get(j).getA_type() == 2 && cu.get(j).getA_terminal() != null) ids += (cu.get(j).getA_terminal().getId() + ",");
						if (cu.get(j).getZ_type() == 2 && cu.get(j).getZ_terminal() != null) ids += (cu.get(j).getZ_terminal().getId() + ",");
						if (ids.length() > 0)
						{
							ids = ids.substring(0, ids.length() - 1);
							List<BoxTerminalUsed> bts = this.opticalcableDao.checkJumped(ids);
							if (bts.size() > 0) used ++;
						}
					}
				}
				temp.setUsedCounts(used);
				double rate = (double)used / (double)os.get(i).getCoreCounts();
				BigDecimal df = new BigDecimal(rate);
		        rate = df.setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
				temp.setUsedPercent(rate);
				oa.add(temp);
				
				for (j = 0; j < cu.size(); j++)
				{
					XSSFRow bodyRow = sheet.createRow(index + 1);
					CoreUsed cud = cu.get(j);
					
					cell = bodyRow.createCell(0);
					cell.setCellStyle(bodyStyle);
					cell.setCellValue(os.get(i).getName());
					
					String cell2 = "";
					if (os.get(i).getStart_box() != null)
					{
						cell2 = os.get(i).getStart_box().getBox_name();
					}
					else
					{
						cell2 = os.get(i).getStartAddress();
					}
					
					cell = bodyRow.createCell(1);
					cell.setCellStyle(bodyStyle);
					cell.setCellValue(cell2);
					
					
					String cell3 = "";
					if (os.get(i).getEnd_box() != null)
					{
						cell3 = os.get(i).getEnd_box().getBox_name();
					}
					else
					{
						cell3 = os.get(i).getEndAddress();
					}
					
					cell = bodyRow.createCell(2);
					cell.setCellStyle(bodyStyle);
					cell.setCellValue(cell3);
					
					cell = bodyRow.createCell(3);
					cell.setCellStyle(bodyStyle);
					cell.setCellValue(os.get(i).getCoreCounts());
					
					cell = bodyRow.createCell(4);
					cell.setCellStyle(bodyStyle);
					cell.setCellValue(used);
					
					
					cell = bodyRow.createCell(5);
					cell.setCellStyle(bodyStyle);
					cell.setCellValue(rate);
					
					cell = bodyRow.createCell(6);
					cell.setCellStyle(bodyStyle);
					cell.setCellValue(cu.get(j).getCore().getSequence());
					
					String cell7 = "";
					
					if (cu.get(j).getA_type() == 1) cell7 = cu.get(j).getA_string();
					else if (cu.get(j).getA_type() == 2 && cu.get(j).getA_terminal() != null) cell7 = cu.get(j).getA_terminal().getName();
					else if (cu.get(j).getA_type() == 3 && cu.get(j).getA_core() != null) cell7 = cu.get(j).getA_core().getName();
					
					cell = bodyRow.createCell(7);
					cell.setCellStyle(bodyStyle);
					cell.setCellValue(cell7);
					
					String cell8 = "";
					
					if (cu.get(j).getZ_type() == 1) cell8 = cu.get(j).getZ_string();
					else if (cu.get(j).getZ_type() == 2 && cu.get(j).getZ_terminal() != null) cell8 = cu.get(j).getZ_terminal().getName();
					else if (cu.get(j).getZ_type() == 3 && cu.get(j).getZ_core() != null) cell8 = cu.get(j).getZ_core().getName();
					
					cell = bodyRow.createCell(8);
					cell.setCellStyle(bodyStyle);
					cell.setCellValue(cell8);
					
					index ++;
				}
			}
		}
		try
		{
			workBook.write(outputStream);
			outputStream.flush();
			outputStream.close();
		}
		catch (IOException e)
		{
			e.printStackTrace();
		}
		finally
		{
			try
			{
				outputStream.close();
			}
			catch (IOException e)
			{
				e.printStackTrace();
			}
		}

	}
	
	//铅芯分页
	public List<CoreUsed> findCoreByPager(Pager bis){
		return opticalcableDao.findCoreByPager(bis);
	}
	
	public Map<String, Object> viewOpticalcable(Integer id) {
		Map<String, Object> result = this.opticalcableDao.findOpticalcable(id);
		if (result != null) {
			List<CoreUsed> cu = this.opticalcableDao.findAllCore(Integer.parseInt(result.get("id").toString()));
			int used = 0;
			for (int j = 0; j < cu.size(); j ++)
			{
				if (cu.get(j).getA_type() == 3 || cu.get(j).getZ_type() == 3)
				{
					used ++;
				}
				else if (cu.get(j).getA_type() == 2 || cu.get(j).getZ_type() == 2)
				{
					String ids = "";
					if (cu.get(j).getA_type() == 2 && cu.get(j).getA_terminal() != null) ids += (cu.get(j).getA_terminal().getId() + ",");
					if (cu.get(j).getZ_type() == 2 && cu.get(j).getZ_terminal() != null) ids += (cu.get(j).getZ_terminal().getId() + ",");
					if (ids.length() > 0)
					{
						ids = ids.substring(0, ids.length() - 1);
						List<BoxTerminalUsed> bts = this.opticalcableDao.checkJumped(ids);
						if (bts.size() > 0) used ++;
					}
				}
			}
			result.put("usedCounts", used);
			double rate = (double)used / (double)Integer.parseInt(result.get("coreCounts").toString());
			BigDecimal df = new BigDecimal(rate);
	        rate = df.setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
			result.put("usedPercent", rate);
		}
		return result;
	}
	
	//光缆分页
	public List<Map<String, Object>> findByPager(OpticalcableSearch bis,HttpServletRequest request){
		List<Map<String, Object>> os = this.opticalcableDao.findByPager(bis,request);
		/*for (int i = 0; i < os.size(); i ++)
		{
			OpticalcableAnalysis temp = new OpticalcableAnalysis();
			temp.setId(Integer.parseInt(os.get(i).get("id").toString()));
			temp.setCoreCounts(Integer.parseInt(os.get(i).get("coreCounts").toString()));
			temp.setEnd_box(os.get(i).get("end_box") != null ? os.get(i).get("end_box").toString() : "");
			temp.setEndAddress(os.get(i).get("endAddress") != null ? os.get(i).get("endAddress").toString() : "");
			temp.setName(os.get(i).get("name") != null ? os.get(i).get("name").toString() : "");
			temp.setRemarks(os.get(i).get("remarks") != null ? os.get(i).get("remarks").toString() : "");
			temp.setStart_box(os.get(i).get("start_box").toString());
			temp.setStartAddress(os.get(i).get("startAddress").toString());
			temp.setType(os.get(i).get("type").toString());
			List<CoreUsed> cu = this.opticalcableDao.findAllCore(Integer.parseInt(os.get(i).get("id").toString()));
			int used = 0;
			for (int j = 0; j < cu.size(); j ++)
			{
				if (cu.get(j).getA_type() == 3 || cu.get(j).getZ_type() == 3)
				{
					used ++;
				}
				else if (cu.get(j).getA_type() == 2 || cu.get(j).getZ_type() == 2)
				{
					String ids = "";
					if (cu.get(j).getA_type() == 2 && cu.get(j).getA_terminal() != null) ids += (cu.get(j).getA_terminal().getId() + ",");
					if (cu.get(j).getZ_type() == 2 && cu.get(j).getZ_terminal() != null) ids += (cu.get(j).getZ_terminal().getId() + ",");
					if (ids.length() > 0)
					{
						ids = ids.substring(0, ids.length() - 1);
						List<BoxTerminalUsed> bts = this.opticalcableDao.checkJumped(ids);
						if (bts.size() > 0) used ++;
					}
				}
			}
			os.get(i).put("usedCounts", used);
			double rate = (double)used / (double)Integer.parseInt(os.get(i).get("coreCounts").toString());
			BigDecimal df = new BigDecimal(rate);
	        rate = df.setScale(2, BigDecimal.ROUND_HALF_UP).doubleValue();
			os.get(i).put("usedPercent", rate);
		}*/
		return os;
	}
	
	public Opticalcable find(int id)
	{
		return opticalcableDao.find(id);
	}
	
	public void update(Opticalcable b)
	{
		opticalcableDao.update(b);
	}
	
	public int delete(int[] ids) {
		return opticalcableDao.delete(ids);
	}
	
	//获取光缆数量
	public int findCounts(OpticalcableSearch bis,HttpServletRequest request)
	{
		return opticalcableDao.findCounts(bis,request);
	}
	
	//获取铅芯分页数量
	public int findCoreCounts(Pager bis)
	{
		return opticalcableDao.findCoreCounts(bis);
	}
	
	//获取全部光缆
	public List<Opticalcable> findAll(){
		return this.opticalcableDao.findAll();
	}
	
	//获取全部光缆
	public List<Opticalcable> findAllByBoxId(int id){
		return this.opticalcableDao.findAllByBoxId(id);
	}
	
	//获取全部光缆和纤芯
	public List<OpticalcableCoreTree> findAllTreeByBoxId(int id){
		return this.opticalcableDao.findAllTreeByBoxId(id);
	}
	
	//获取光缆全部纤芯
	public List<CoreUsed> findAllCore(int id){
		return this.opticalcableDao.findAllCore(id);
	}

	//获取光缆全部可用纤芯
	public List<CoreUsed> findAllCoreByBoxId(int boxid, int optiid){
		return this.opticalcableDao.findAllCoreByBoxId(boxid, optiid);
	}
	
	public OpticalcableDao getOpticalcableDao() {
		return opticalcableDao;
	}

	@Resource
	public void setOpticalcableDao(OpticalcableDao opticalcableDao) {
		this.opticalcableDao = opticalcableDao;
	}

	
}
