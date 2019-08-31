package com.sxt.service;

import java.io.IOException;
import java.text.SimpleDateFormat;
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
import org.springframework.stereotype.Service;

import com.sxt.dao.BoxEventAndWarnDao;
import com.sxt.dao.BoxInfoDao;
import com.sxt.po.AlarmEvent;
import com.sxt.po.AlarmEventSearch;
import com.sxt.po.BoxInfo;
import com.sxt.po.BoxInfoOper;
import com.sxt.po.BoxInfoSearch;
import com.sxt.po.DoorEvent;
import com.sxt.po.DoorEventSearch;
import com.sxt.utils.ExportUtil;


@Service("exportExcelService")
public class ExportExcelService
{
	@Resource
	private BoxInfoDao boxinfoDao;
	
	@Resource
	private BoxEventAndWarnDao boxEventAndWarnDao;
	
	public void getExcel(HttpServletRequest request, String hql, BoxInfoSearch bs, String[] titles, ServletOutputStream outputStream)
	{
		List<Map<String, Object>> bis = this.boxinfoDao.findAll(request, bs);
		
		System.out.println("biscount="+bis.size());
		// 创建一个workbook 对应一个excel应用文件
		XSSFWorkbook workBook = new XSSFWorkbook();
		// 在workbook中添加一个sheet,对应Excel文件中的sheet
		XSSFSheet sheet = workBook.createSheet("光交箱");
		ExportUtil exportUtil = new ExportUtil(workBook, sheet);
		XSSFCellStyle headStyle = exportUtil.getHeadStyle();
		XSSFCellStyle bodyStyle = exportUtil.getBodyStyle();
		// 构建表头
		XSSFRow headRow = sheet.createRow(0);
		XSSFCell cell = null;
		for (int i = 0; i < titles.length; i++)
		{
			cell = headRow.createCell(i);
			cell.setCellStyle(headStyle);
			cell.setCellValue(titles[i]);
		}
		// 构建表体数据
		if (bis != null && bis.size() > 0)
		{
			for (int j = 0; j < bis.size(); j++)
			{
				XSSFRow bodyRow = sheet.createRow(j + 1);
				Map<String, Object> bio = bis.get(j);

				cell = bodyRow.createCell(0);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(bio.get("box_no") != null ? bio.get("box_no").toString() : "");

				cell = bodyRow.createCell(1);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(bio.get("controller_id") != null ? bio.get("controller_id").toString() : "");
				

				cell = bodyRow.createCell(2);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(bio.get("box_name") != null ? bio.get("box_name").toString() : "");

				cell = bodyRow.createCell(3);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(bio.get("address") != null ? bio.get("address").toString() : "");

				cell = bodyRow.createCell(4);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(bio.get("business_area") != null ? bio.get("business_area").toString() : "");
				

				cell = bodyRow.createCell(5);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(bio.get("sim_phone_no") != null ? bio.get("sim_phone_no").toString() : "");
				
				cell = bodyRow.createCell(6);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(bio.get("longitude") != null ? bio.get("longitude").toString() : "");

				cell = bodyRow.createCell(7);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(bio.get("latitude") != null ? bio.get("latitude").toString() : "");

				cell = bodyRow.createCell(8);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(bio.get("dep_name") != null ? bio.get("dep_name").toString() : "");

				cell = bodyRow.createCell(9);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(bio.get("k_code") != null ? bio.get("k_code").toString() : "");

				cell = bodyRow.createCell(10);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(bio.get("box_type") != null ? bio.get("box_type").toString() : "");

				cell = bodyRow.createCell(11);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(bio.get("b_longitude") != null ? bio.get("b_longitude").toString() : "");

				cell = bodyRow.createCell(12);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(bio.get("b_latitude") != null ? bio.get("b_latitude").toString() : "");

				cell = bodyRow.createCell(13);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(bio.get("workorder_department") != null ? bio.get("workorder_department").toString() : "");

				cell = bodyRow.createCell(14);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(bio.get("remarks") != null ? bio.get("remarks").toString() : "");
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
	
	public void getBoxEvent(HttpServletRequest request, DoorEventSearch ds, String[] titles, ServletOutputStream outputStream)
	{
		List<DoorEvent> des = this.boxEventAndWarnDao.findDoorEventByPager(request, ds);
		// 创建一个workbook 对应一个excel应用文件
		XSSFWorkbook workBook = new XSSFWorkbook();
		// 在workbook中添加一个sheet,对应Excel文件中的sheet
		XSSFSheet sheet = workBook.createSheet("开关门记录");
		ExportUtil exportUtil = new ExportUtil(workBook, sheet);
		XSSFCellStyle headStyle = exportUtil.getHeadStyle();
		XSSFCellStyle bodyStyle = exportUtil.getBodyStyle();
		// 构建表头
		XSSFRow headRow = sheet.createRow(0);
		XSSFCell cell = null;
		for (int i = 0; i < titles.length; i++)
		{
			cell = headRow.createCell(i);
			cell.setCellStyle(headStyle);
			cell.setCellValue(titles[i]);
		}
		// 构建表体数据
		if (des != null && des.size() > 0)
		{
			SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			for (int j = 0; j < des.size(); j++)
			{
				XSSFRow bodyRow = sheet.createRow(j + 1);
				DoorEvent de = des.get(j);

				cell = bodyRow.createCell(0);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(de.getBoxinfo() != null ? de.getBoxinfo().getBox_no() : "");

				cell = bodyRow.createCell(1);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(de.getBoxinfo() != null ? "" + de.getBoxinfo().getController_id() : "");

				cell = bodyRow.createCell(2);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(de.getOpen_time() != null ? format.format(de.getOpen_time()) : "");

				cell = bodyRow.createCell(3);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(de.getOpen_keys());

				cell = bodyRow.createCell(4);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(de.getOpen_operators());
				

				cell = bodyRow.createCell(5);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(de.getOpen_rfids());
				
				cell = bodyRow.createCell(6);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(de.getClose_time() != null ? format.format(de.getClose_time()) : "");

				cell = bodyRow.createCell(7);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(de.getClose_keys());

				cell = bodyRow.createCell(8);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(de.getClose_operators());

				cell = bodyRow.createCell(9);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(de.getClose_rfids());

				cell = bodyRow.createCell(10);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(de.getRemarks());
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
	

	public void getBoxWarn(HttpServletRequest request, AlarmEventSearch ds, String[] titles, ServletOutputStream outputStream)
	{
		List<Map<String, Object>> aes = this.boxEventAndWarnDao.findAlarmEventByPager(request, ds);
		// 创建一个workbook 对应一个excel应用文件
		XSSFWorkbook workBook = new XSSFWorkbook();
		// 在workbook中添加一个sheet,对应Excel文件中的sheet
		XSSFSheet sheet = workBook.createSheet("告警记录");
		ExportUtil exportUtil = new ExportUtil(workBook, sheet);
		XSSFCellStyle headStyle = exportUtil.getHeadStyle();
		XSSFCellStyle bodyStyle = exportUtil.getBodyStyle();
		// 构建表头
		XSSFRow headRow = sheet.createRow(0);
		XSSFCell cell = null;
		for (int i = 0; i < titles.length; i++)
		{
			cell = headRow.createCell(i);
			cell.setCellStyle(headStyle);
			cell.setCellValue(titles[i]);
		}
		// 构建表体数据
		if (aes != null && aes.size() > 0)
		{
			SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			for (int j = 0; j < aes.size(); j++)
			{
				XSSFRow bodyRow = sheet.createRow(j + 1);
				Map<String, Object> ae = aes.get(j);

				cell = bodyRow.createCell(0);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(ae.get("box_no") != null ? ae.get("box_no").toString() : "");

				cell = bodyRow.createCell(1);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(ae.get("controller_id") != null ? ae.get("controller_id").toString() : "");

				cell = bodyRow.createCell(2);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(ae.get("alarm_type") != null ? ae.get("alarm_type").toString() : "");

				cell = bodyRow.createCell(3);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(ae.get("alarm_time") != null ? ae.get("alarm_time").toString().substring(0, 19) : "");

				cell = bodyRow.createCell(4);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(ae.get("alarm_keys") != null ? ae.get("alarm_keys").toString() : "");
				

				cell = bodyRow.createCell(5);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(ae.get("alarm_operators") != null ? ae.get("alarm_operators").toString() : "");
				
				cell = bodyRow.createCell(6);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(ae.get("alarm_rfids") != null ? ae.get("alarm_rfids").toString() : "");

				cell = bodyRow.createCell(7);
				cell.setCellStyle(bodyStyle);
				cell.setCellValue(ae.get("remarks") != null ? ae.get("remarks").toString() : "");

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

}
