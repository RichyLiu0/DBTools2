using GeneralDAO;
using GeneralModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Ucsmy.Framework;
using Ucsmy.Framework.Common;

namespace Gerneral.Web.Controllers
{
    public class ListCfgController : Controller
    {
        //
        // GET: /ListCfg/
        [HttpGet]
        public ActionResult Index(string DBName)
        {

            try
            {
                //填充dbList
                DBDAO dbDao = new DBDAO();
                List<string> dbList = dbDao.GetDBName();
                this.ViewBag.DBList = dbList;

                ListCfgVM vm = new ListCfgVM();
                this.ViewBag.VM = vm;
                return View("~/Views/General/ListCfg.cshtml");
            }
            catch (Exception ex)
            {
                Response.Write(ex.GetInnerMessage());
                return View("~/Views/Shared/ErrorHander.cshtml");
            }
        }


        [HttpPost]
        public ActionResult GetCols()
        {
            try
            {
                string DBName = Request.Form["DBName"].TryString();
                int SourceType = Request.Form["SourceType"].TryInt(1).Value;
                string Sql = Request.Form["Sql"].TryString();
                string TableName = Request.Form["TableName"].TryString();
                string ReferTables = Request.Form["ReferTables"].TryString();
                string DisplayName = Request.Form["DisplayName"].TryString();

                ///填充vm
                ListCfgVM vm = new ListCfgVM();
                vm.Sql = Sql;
                vm.DisplayName = DisplayName;
                vm.Name = TableName;
                vm.SourceType = SourceType;

                List<DBColInfo> dbCols;

                if (SourceType == 1)
                {
                    dbCols = GeneralService.GeneralCfgService.GetColsByTable(DBName, TableName);

                }
                else
                {
                    dbCols = GeneralService.GeneralCfgService.GetColsBySql(DBName, Sql, ReferTables);
                }
                if (dbCols != null && dbCols.Count() > 0)
                {
                    foreach (var dbCol in dbCols)
                    {
                        vm.Cols.Add(new ListCfgVM.Col()
                        {
                            DisplayName = dbCol.DisplayName,
                            IsCondition = false,
                            IsList = false,
                            DataType = dbCol.ColumnType,
                            Name = dbCol.ColumnName,
                            IsNullable = dbCol.IsNullable,


                        });
                    }
                }
                this.ViewBag.VM = vm;
                return View("~/Views/General/ListCfg_PartCol.cshtml");
            }
            catch (Exception ex)
            {
                Response.Write(ex.GetInnerMessage());
                return View("~/Views/Shared/ErrorHander.cshtml");
            }


        }


        [HttpPost]
        public ActionResult GetCfg()
        {
            try
            {
                var data = "Data".ValueOfForm().ToObject<ListCfgVM>();
                var cfg = CreateListGeneralCfg(data);
                ViewBag.Cfg = cfg.ToJson();
                return View("~/Views/General/ListCfg_PartCfg.cshtml");
            }
            catch (Exception ex)
            {
                Response.Write(ex.GetInnerMessage());
                return View("~/Views/Shared/ErrorHander.cshtml");
            }
        }


        [HttpPost]
        public ActionResult GetGeneralCode()
        {
            try
            {
                string template = "template".ValueOfForm();
                ListGeneralCfg cfg = "cfg".ValueOfForm().ToObject<ListGeneralCfg>();
                ViewBag.cfg = cfg;
                return View("~/Views/General/Template/{0}.cshtml".FormatWith(template));
            }
            catch (Exception ex)
            {
                Response.Write(ex.GetInnerMessage());
                return View("~/Views/Shared/ErrorHander.cshtml");
            }
        }

        #region 私有方法
        private ListGeneralCfg CreateListGeneralCfg(ListCfgVM cfgVM)
        {
           
            ListGeneralCfg cfg = new ListGeneralCfg();

            cfg.Name = cfgVM.Name;
            cfg.DisplayName = cfgVM.DisplayName;
            cfg.IsSupporExport = true;
            cfg.IsSupportAdd = true;
            cfg.IsSupportEdit = true;
            cfg.IsSupportView = true;

            //BDCfg初始化

            cfg.DataSource.TableName = cfgVM.TableName;
            cfg.DataSource.SourceType = cfgVM.SourceType;
            cfg.DataSource.SQL = cfgVM.Sql;
            cfgVM.Cols.ForEach(t =>
            {


                cfg.DataSource.DBCols.Add(new ListGeneralCfg.DbCol()
                {
                    ColumnName = t.Name,
                    DisplayName = string.IsNullOrEmpty(t.DisplayName) ? t.Name : t.DisplayName,
                    DataType = t.DataType,
                    IsNullable = t.IsNullable
                });

            });


            //QueryCfg初始化
            if (cfgVM.Cols.Where(t => t.IsCondition).Count() > 0)
            {
                var queryMaxCol = 3;
                var queryRowInx = 0;

                var queryFields = cfgVM.Cols.Where(t => t.IsCondition).ToList();

                for (var i = 0; i < queryFields.Count(); i++)
                {

                    var item = queryFields[i];
                    cfg.QueryCols.Add(new ListGeneralCfg.QueryCol()
                    {
                        Name = item.Name,
                        DisplayName = string.IsNullOrEmpty(item.DisplayName) ? item.Name : item.DisplayName,
                        ColumnIdx = queryRowInx,
                        QueryType = GetQueryType(item.DataType),
                        RowIdx = queryRowInx % queryMaxCol

                    });
                    if (i % queryMaxCol == 0 && i > 0)
                    {
                        queryRowInx++;
                    }

                }
            }

            //ListCfg初始化
            if (cfgVM.Cols.Where(t => t.IsList).Count() > 0)
            {
                var listFields = cfgVM.Cols.Where(t => t.IsList).ToList();
                for (var i = 0; i < listFields.Count(); i++)
                {
                    var item = listFields[i];
                    cfg.ListCols.Add(new ListGeneralCfg.ListCol()
                    {
                        ColumnIdx = i,
                        DisplayName = string.IsNullOrEmpty(item.DisplayName) ? item.Name : item.DisplayName,
                        Name = item.Name,
                        IsSort = false,
                        IsSum = false,
                        ListType = GetListType(item.DataType),

                    });
                }
            }
            return cfg;

        }

        private int GetQueryType(string dbtype)
        {
            if (dbtype.ToLower() == "int")
            {
                return (int)EnumType.QueryType.Int;
            }
            else if (dbtype.ToLower() == "decimal")
            {
                return (int)EnumType.QueryType.DecimalRange;
            }
            else if (dbtype.ToLower() == "date")
            {
                return (int)EnumType.QueryType.DateRange;
            }
            else if (dbtype.ToLower() == "datetime")
            {
                return (int)EnumType.QueryType.DateTimeRange;
            }
            else
            {
                return (int)EnumType.QueryType.String;
            }
        }

        private int GetListType(string dbtype)
        {
            if (dbtype.ToLower() == "int")
            {
                return (int)EnumType.ListType.Int;
            }
            else if (dbtype.ToLower() == "decimal")
            {
                return (int)EnumType.ListType.Decimal;
            }
            else if (dbtype.ToLower() == "date")
            {
                return (int)EnumType.ListType.Date;
            }
            else if (dbtype.ToLower() == "datetime")
            {
                return (int)EnumType.ListType.DateTime;
            }
            else
            {
                return (int)EnumType.ListType.String;
            }
        }

        #endregion
    }
}
