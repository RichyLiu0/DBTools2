using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using GeneralModel;
using GeneralDAO;
using Ucsmy.Framework;
using Ucsmy.Framework.Common;

namespace GeneralDAO
{
    public class TableDAO
    {

        public List<DBTableInfo> GetTableList(string Server, string DB)
        {
            List<DBTableInfo> list = new List<DBTableInfo>();
            string sql = @"  WITH  t AS ( SELECT   t.name AS TableName ,
                                                e.value AS DesText
                                       FROM     sys.tables t
                                                LEFT JOIN sys.extended_properties e ON t.object_id = e.major_id
                                                                                      AND e.minor_id = 0
                                       WHERE    ISNULL(e.class_desc, 'OBJECT_OR_COLUMN') = 'OBJECT_OR_COLUMN'
                                                AND ISNULL(e.name, 'MS_Description') = 'MS_Description'
                                     )
                            SELECT  *
                            FROM    t  order by TableName asc ";
            var dt = new DbContext(Server, DB).Query(sql);
            if (dt != null && dt.Rows != null)
            {
                foreach (DataRow row in dt.Rows)
                {
                    list.Add(
                     new DBTableInfo()
                     {
                         TableName = row["TableName"].ToString(),
                         TableDisplayName = row["DesText"].ToString()

                     });
                }
            }
            return list;
        }


        public DBTableInfo GetTable(string Server, string DB, string Table)
        {
            DBTableInfo tb = new DBTableInfo();
            FillTableName(tb, Server, DB, Table);
            FillCols(tb, Server, DB, Table);
            return tb;
        }


        public string GetRemarkSql(DBTableInfo tb)
        {
            var sb = new StringBuilder();
            if (tb.TableDisplayName.IsNullOrEmpty() == false)
            {
                sb.AppendFormat(@"
                 IF(EXISTS(	SELECT a.*  FROM sys.tables AS a 
	            INNER JOIN sys.extended_properties AS b ON a.object_id=b.major_id AND b.minor_id = 0
	            WHERE  ISNULL(b.class_desc, 'OBJECT_OR_COLUMN') = 'OBJECT_OR_COLUMN'  
	            AND ISNULL(b.name, 'MS_Description') = 'MS_Description'
                AND  a.name='{0}'))
                BEGIN 
                EXEC sys.sp_dropextendedproperty @name=N'MS_Description',  @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'{0}';
                End
                ", tb.TableName);
                sb.Append(Environment.NewLine + "GO" + Environment.NewLine);

                sb.AppendFormat("EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'{1}' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'{0}';", tb.TableName, tb.TableDisplayName);

                sb.Append(Environment.NewLine + "GO" + Environment.NewLine);

            }
            foreach (var col in tb.Cols)
            {
                if (col.DisplayName.IsNullOrEmpty() == false)
                {
                    sb.AppendFormat("EXEC sys.sp_dropextendedproperty @name=N'MS_Description',  @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'{0}', @level2type=N'COLUMN',@level2name=N'{1}';", tb.TableName, col.ColumnName);
                    sb.Append(Environment.NewLine + "GO" + Environment.NewLine);

                    sb.AppendFormat("EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'{2}' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'{0}', @level2type=N'COLUMN',@level2name=N'{1}';", tb.TableName, col.ColumnName, col.DisplayName);

                    sb.Append(Environment.NewLine + "GO" + Environment.NewLine);
                }
            }
            return sb.ToString();
        }



        public List<DBIndexInfo> GetIndexs(string Server, string DB, string Table)
        {
            var Indexs = new List<DBIndexInfo>();
            var sql = string.Format(@"SELECT  a.name AS IndexName ,a.type_desc AS IndexDes ,a.is_primary_key  AS IsPrimaryKey,a.Is_Unique as IsUnique,
        ( SELECT     d.name + ','
          FROM      sys.index_columns c
                    INNER JOIN sys.columns d ON c.object_id = d.object_id
                                                AND c.column_id = d.column_id
          WHERE     c.index_id = a.index_id
                    AND c.object_id = a.object_id
        FOR
          XML PATH('')
        ) AS ColumnNames
FROM    sys.indexes a
        INNER JOIN sys.tables b ON a.object_id = b.object_id
WHERE   b.name ='{0}'", Table);

            var dt = new DbContext(Server, DB).Query(sql);
            foreach (DataRow row in dt.Rows)
            {
                var indexInfo = new DBIndexInfo();
                indexInfo.IndexName = row["IndexName"].ToString();
                indexInfo.ColumnNames = row["ColumnNames"].ToString();
                indexInfo.IndexDes = row["IndexDes"].ToString();
                //  indexInfo.IsPrimaryKey = Convert.ToBoolean(row["IsPrimaryKey"]) ? "√" : "";
                indexInfo.IsPrimaryKey = Convert.ToBoolean(row["IsPrimaryKey"]) ? true : false;
                indexInfo.IsUnique = Convert.ToBoolean(row["IsUnique"]) ? true : false;
                Indexs.Add(indexInfo);
            }
            return Indexs;
        }


        public bool SaveTableRemark(string Server, string db, string tb, string remark)
        {

            string strSql = @"
              IF(EXISTS(	SELECT a.*  FROM sys.tables AS a 
	        INNER JOIN sys.extended_properties AS b ON a.object_id=b.major_id AND b.minor_id = 0
	        WHERE  ISNULL(b.class_desc, 'OBJECT_OR_COLUMN') = 'OBJECT_OR_COLUMN'  
	        AND ISNULL(b.name, 'MS_Description') = 'MS_Description'
            AND  a.name='{0}'))
           BEGIN 
            EXEC sys.sp_dropextendedproperty @name=N'MS_Description',  @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'{0}';
            End
".FormatWith(tb);

            strSql += "EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'{1}' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'{0}';".FormatWith(tb, remark);
            DbContext dbContext = new DbContext(Server, db);
            dbContext.ExecuteNonQuery(strSql);
            return true;
        }

        public bool SaveColRemark(string Server, string db, string tb, string col, string remark)
        {

            string strSql = @"

  IF(EXISTS(
  SELECT   a.name AS TableName ,
                        b.name AS ColumnName ,
                        b.is_nullable AS IsNullable ,
                        ISNULL(c.value, '') AS DesText 
                       
               FROM     sys.tables a
                        INNER JOIN sys.columns b ON a.object_id = b.object_id
                        INNER JOIN sys.extended_properties c ON a.object_id = c.major_id
                                                              AND c.minor_id = b.column_id
                        
               WHERE    ISNULL(c.class_desc, 'OBJECT_OR_COLUMN') = 'OBJECT_OR_COLUMN'
                        AND ISNULL(c.name, 'MS_Description') = 'MS_Description'
                 AND a.name='{0}'  AND b.name='{1}'      
  ))
Begin
EXEC sys.sp_dropextendedproperty @name=N'MS_Description',  @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'{0}', @level2type=N'COLUMN',@level2name=N'{1}';
End
".FormatWith(tb, col);

            strSql += "EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'{2}' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'{0}', @level2type=N'COLUMN',@level2name=N'{1}';".FormatWith(tb, col, remark);
            DbContext dbContext = new DbContext(Server, db);
            dbContext.ExecuteNonQuery(strSql);
            return true;
        }

        #region 私有方法
        private void FillTableName(DBTableInfo TableInfo, string Server, string DB, string Table)
        {
            string sql = @"  WITH  t AS ( SELECT   t.name AS TableName ,
                                                e.value AS DesText
                                       FROM     sys.tables t
                                                LEFT JOIN sys.extended_properties e ON t.object_id = e.major_id
                                                                                      AND e.minor_id = 0
                                       WHERE    ISNULL(e.class_desc, 'OBJECT_OR_COLUMN') = 'OBJECT_OR_COLUMN'
                                                AND ISNULL(e.name, 'MS_Description') = 'MS_Description'
                                     )
                            SELECT  *
                            FROM    t WHERE t.TableName='{0}'".FormatWith(Table);
            var dt = new DbContext(Server, DB).Query(sql);
            if (dt != null && dt.Rows != null)
            {
                var row = dt.Rows[0];
                TableInfo.TableName = row["TableName"].ToString();
                TableInfo.TableDisplayName = row["DesText"].ToString();

            }
        }

        private void FillCols(DBTableInfo TableInfo, string Server, string DB, string Table)
        {
            string sql = @"WITH t AS (
                            SELECT  t.name AS TableName ,
                                    c.name AS ColumnName ,
									c.column_id AS ColumnId,
                                    c.is_nullable AS IsNullable ,
                                    ISNULL( e.value,'') AS DesText ,
                                    s.name AS ColumnType ,
                                    c2.length AS ColumnLength ,
                                    CAST(c2.xprec AS INT) AS ColumnLengthL ,
                                    CAST(c2.xscale AS INT) AS ColumnLengthR 
									
                            FROM    sys.tables t
                                    inner JOIN sys.columns c ON t.object_id = c.object_id
                                    LEFT JOIN sys.extended_properties e ON t.object_id = e.major_id
                                                                           AND e.minor_id = c.column_id
                                    JOIN syscolumns c2 ON c.column_id = c2.colid
                                                          AND c.object_id = c2.id
                                    JOIN systypes s ON c2.xtype = s.xtype
                                                       AND ( ( s.status = 0 )
                                                             OR ( s.status = 1
                                                                  AND s.name = 'timestamp'
                                                                )
                                                           )
                            WHERE   ISNULL(e.class_desc, 'OBJECT_OR_COLUMN') = 'OBJECT_OR_COLUMN'
                                    AND ISNULL(e.name, 'MS_Description') = 'MS_Description'
		                            )
		                            SELECT * FROM t WHERE t.TableName='{0}' ORDER BY t.ColumnId asc ".FormatWith(Table);
            var dt = new DbContext(Server, DB).Query(sql);
            foreach (DataRow row in dt.Rows)
            {
                var col = new DBColInfo();
                col.ColumnName = row["ColumnName"].ToString();
                col.ColumnType = row["ColumnType"].ToString();
                col.ColumnLength = row["ColumnLength"].ToString();
                if (col.ColumnType == "nvarchar" || col.ColumnType == "nchar")
                {
                    int len = 0;
                    if (int.TryParse(col.ColumnLength, out len))
                    {
                        col.ColumnLength = (len / 2).ToString();
                    }
                }
                col.ColumnLengthL = row["ColumnLengthL"].ToString();
                col.ColumnLengthR = row["ColumnLengthR"].ToString();
                col.IsNullable = row["IsNullable"].TryBoolean().Value;
                if (row["DesText"] != DBNull.Value)
                {
                    col.DisplayName = row["DesText"].ToString();
                }
                TableInfo.Cols.Add(col);
            }
        }

        #endregion
    }
}
