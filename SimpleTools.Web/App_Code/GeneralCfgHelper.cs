using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using DbModel;
using Ucsmy.Framework;
using Ucsmy.Framework.Common;
using System.Data;


public class GeneralListCfgHelper
{

    public static GeneralListCfg Create(ListUICfg uData)
    {
        GeneralListCfg cfg = new DbModel.GeneralListCfg();

        cfg.Name = uData.Name;
        cfg.DisplayName = uData.DisplayName;
        cfg.IsSupporExport = true;
        cfg.IsSupportAdd = true;
        cfg.IsSupportEdit = true;
        cfg.IsSupportView = true;

        //BDCfg初始化

        cfg.DBCfg.TableName = uData.TableName;
        cfg.DBCfg.SourceType = uData.SourceType;
        cfg.DBCfg.SQL = uData.Sql;
        uData.cfg.ForEach(t =>
        {


            cfg.DBCfg.FieldList.Add(new DbModel.GeneralListCfg.DbFile()
            {
                Name = t.Name,
                DisplayName = string.IsNullOrEmpty(t.DisplayName) ? t.Name : t.DisplayName,
                DataType = t.DataType,
                IsPrimaryKey = t.IsPrimaryKey,
                IsNullable = t.IsAllowNullable
            });

        });


        //QueryCfg初始化
        if (uData.cfg.Where(t => t.IsCondition).Count() > 0)
        {
            var queryMaxCol = 3;
            var queryRowInx = 0;

            var queryFields = uData.cfg.Where(t => t.IsCondition).ToList();

            for (var i = 0; i < queryFields.Count(); i++)
            {

                var item = queryFields[i];
                cfg.QueryCfg.Add(new DbModel.GeneralListCfg.QueryField()
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
        if (uData.cfg.Where(t => t.IsCol).Count() > 0)
        {
            var listFields = uData.cfg.Where(t => t.IsCol).ToList();
            for (var i = 0; i < listFields.Count(); i++)
            {
                var item = listFields[i];
                cfg.ListCfg.Add(new DbModel.GeneralListCfg.ListField()
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


    /// <summary>
    /// 根据sql表达式/data获取字段信息
    /// </summary>
    /// <param name="dbContext"></param>
    /// <param name="sourceType"></param>
    /// <param name="sourceContent"></param>
    /// <returns></returns>
    public static List<DBField> GetFieldInfoList(DbContext dbContext, int sourceType, string sourceContent)
    {
        if (sourceType == 1)
        {
            return GetFieldInfoListByTable(dbContext, sourceContent);
        }

        return GetFieldInfoListBySql(dbContext, sourceContent);

    }

    private static List<DBField> GetFieldInfoListBySql(DbContext dbContext, string sql)
    {
        string strSql = string.Format(";with t as ({0}) select top 1 * from t", sql);
        var dt = dbContext.Query(strSql);
        if (dt == null && dt.Columns == null && dt.Columns.Count <= 0) return null;


        var list = new List<DBField>();

        foreach (DataColumn col in dt.Columns)
        {

            var field = new DBField()
            {
                DataType = GetColType(col.DataType),
                Name = col.ColumnName,
                DisplayName = col.ColumnName,
                IsNullable = col.AllowDBNull,
                IsPrimaryKey = false,
            };
            list.Add(field);

        }
        return list;
    }

    private static List<DBField> GetFieldInfoListByTable(DbContext dbContext, string table)
    {
        TableDesInfo info = new TableDesInfo(dbContext, table);
        var list = new List<DBField>();
        foreach (var col in info.Columns)
        {
            if (col == null || col.ColumnName.IsNullOrEmpty()) continue;
            var field = new DBField()
            {
                DataType = col.ColumnType.Replace("nvarchar", "string"),
                Name = col.ColumnName,
                DisplayName = col.ColumnName,
                IsNullable = col.IsNullable,
                IsPrimaryKey = false,
            };
            list.Add(field);

        }
        return list;
    }




    #region 内部方法

    private static int GetQueryType(string dbtype)
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


    private static int GetListType(string dbtype)
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
        return "string";


    }


    #endregion

}
