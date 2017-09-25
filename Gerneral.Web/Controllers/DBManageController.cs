using GeneralDAO;
using GeneralModel;
using Gerneral.Web.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Ucsmy.Framework;
using Ucsmy.Framework.Common;

namespace Gerneral.Web.Controllers
{
    public class DBManageController : Controller
    {
        //
        // GET: /DBManage/
        public ActionResult Index()
        {
            return View("~/Views/DBManage/Index.cshtml");
        }


        public ActionResult MenuPage()
        {
            try
            {
                //填充dbList
                DBDAO dbDao = new DBDAO();
                List<string> dbList = dbDao.GetDBName();
                this.ViewBag.DBList = dbList;

                ListCfgVM vm = new ListCfgVM();
                this.ViewBag.VM = vm;
                return View("~/Views/DBManage/MenuPage.cshtml");
            }
            catch (Exception ex)
            {
                Response.Write(ex.GetInnerMessage());
                return View("~/Views/Shared/ErrorHander.cshtml");
            }

        }


        public ActionResult ToSqlPage()
        {
            var DbName = Request.QueryString["dbName"];
            var TableName = Request.QueryString["tbName"];
            var printSql = GeneralService.SqlPrintHelper.PrintTableSql(DbName, TableName);
            ViewBag.PrintMsg = printSql;
            return View("~/Views/DBManage/PrintPage.cshtml");
        }

        public ActionResult ToClassPage()
        {
            var DbName = Request.QueryString["dbName"];
            var TableName = Request.QueryString["tbName"];
            var printSql = GeneralService.GenerlPrintHelper.ClassPrint(DbName, TableName);
            ViewBag.PrintMsg = printSql;
            return View("~/Views/DBManage/PrintPage.cshtml");
        }


        [HttpPost]
        public ActionResult GetTableList()
        {
            string dbName = "DBName".ValueOfForm();
            string tbName = "TableName".ValueOfForm();
            TableDAO tableDao = new TableDAO();
            var tbList = tableDao.GetTableList(dbName);
            if (tbList != null && tbList.Count() > 0 && tbName.IsNullOrEmpty() == false)
            {
                tbList = tbList.Where(t => t.TableName.Contains( tbName)).DefaultIfEmpty().ToList();
            }
            ViewBag.DBList = tbList;
            return View("~/Views/DBManage/MenuPage_PartTableList.cshtml");
        }

        public ActionResult TableInfoEdit()
        {

            var dbName = "DBName".ValueOfQuery();
            var tbName = "TableName".ValueOfQuery();

            try
            {
                //填充dbList
                TableDAO tbDao = new TableDAO();
                DBTableInfo tb = tbDao.GetTable(dbName, tbName);
                this.ViewBag.TableInfo = tb;


                this.ViewBag.Indexs = tbDao.GetIndexs(dbName, tbName);

                return View("~/Views/DBManage/TableInfoEdit.cshtml");
            }
            catch (Exception ex)
            {
                Response.Write(ex.GetInnerMessage());
                return View("~/Views/Shared/ErrorHander.cshtml");
            }
        }

        [HttpPost]
        public ActionResult SaveTableRemark()
        {
            try
            {
                var vmStr = "vm".ValueOfForm();
                var vm = vmStr.ToObject<TableRemarkVM>();

                TableDAO tableDao = new TableDAO();
                tableDao.SaveTableRemark(vm.DBName, vm.TableName, vm.TableDisplayName);

                foreach (var col in vm.Cols)
                {
                    tableDao.SaveColRemark(vm.DBName, vm.TableName, col.Name, col.DisplayName);
                }

                Response.Write("保存成功!");
                return View("~/Views/Shared/ResponseHandle.cshtml");

            }
            catch (Exception ex)
            {
                Response.Write(ex.GetInnerMessage());
                return View("~/Views/Shared/ErrorHander.cshtml");
            }

        }


    }
}
