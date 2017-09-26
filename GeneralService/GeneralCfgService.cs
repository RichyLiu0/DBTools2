using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using GeneralModel;
using Ucsmy.Framework;
using Ucsmy.Framework.Common;
using System.Data;
using GeneralDAO;

namespace GeneralService
{



    public class GeneralCfgService
    {


        public static List<DBColInfo> GetColsBySql(string Server,string DB, string Sql, string ReferTables)
        {
            string strSql = string.Format(";with t as ({0}) select top 1 * from t", Sql);
            var dt = new DbContext(Server,DB).Query(strSql);
            if (dt == null && dt.Columns == null && dt.Columns.Count <= 0) return null;
            var list = new List<DBColInfo>();
            foreach (DataColumn col in dt.Columns)
            {
                var dateType = GetColType(col.DataType);
                if (dateType == "byte[]") continue;

                var field = new DBColInfo()
                {
                    ColumnType = dateType,
                    ColumnName = col.ColumnName,
                    DisplayName = col.ColumnName,
                    IsNullable = col.AllowDBNull,
                };
                list.Add(field);

            }

            ///填充关联表的显示名称
            List<DBColInfo> ReferCols = new List<DBColInfo>();
            if (list.Count() > 0 && ReferTables.IsNullOrEmpty() == false)
            {
                var arrRef = ReferTables.Split(',');

                foreach (var tb in arrRef)
                {
                    var tempCols = GetColsByTable(Server,DB, tb);
                    if (tempCols != null)
                        ReferCols.AddRange(tempCols);
                }
                if (ReferCols != null && ReferCols.Count() > 0)
                {
                    list.ForEach(u =>
                    {
                        var dpCol=ReferCols.Find(u1 => u1.ColumnName == u.ColumnName);
                        if(dpCol!=null )
                        u.DisplayName = dpCol.DisplayName;
                    });
                }
            }

            return list;
        }

        public static List<DBColInfo> GetColsByTable(string Server, string DB, string Table)
        {
            var tableDao = new TableDAO();
            var list = new List<DBColInfo>();
            return tableDao.GetTable(Server ,DB, Table).Cols;
        }

        #region 内部方法

        private static string GetColType(Type t)
        {
            if (t == typeof(decimal) || t == typeof(double))
            {
                return "decimal";
            }
            else if (t == typeof(int))
            {
                return "int";
            }
            else if (t == typeof(DateTime))
            {
                return "datetime";
            }

            else if (t == typeof(byte[]))
            {
                return "byte[]";

            }
            return "string";


        }

        #endregion

    }

}