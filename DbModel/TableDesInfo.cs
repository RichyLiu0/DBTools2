using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
namespace DbModel
{
    public class TableDesInfo
    {
        private readonly string queryTemp =
@"
;WITH T
AS
(
SELECT  t.name AS TableName ,
       c.name AS ColumnName,
	   c.is_nullable AS IsNullable,
       e.value AS DesText,
	   s.name  as ColumnType,
	   c2.length as ColumnLength,
	   cast(c2.xprec as int) AS ColumnLengthL,
	   cast(c2.xscale as int) AS ColumnLengthR,
	   0 AS IsTable
        FROM sys.tables t 
        LEFT JOIN sys.columns c ON t.object_id=c.object_id 
        LEFT JOIN sys.extended_properties e ON t.object_id=e.major_id AND e. minor_id=c.column_id
	    JOIN syscolumns c2 ON c.column_id=c2.colid and c.object_id=c2.id
		JOIN systypes s ON c2.xtype=s.xtype and ((s.status=0) OR (s.status=1 and s.name='timestamp'))
WHERE ISNULL( e.class_desc,'OBJECT_OR_COLUMN')='OBJECT_OR_COLUMN' and ISNULL(e. name,'MS_Description')='MS_Description'
 UNION 
    SELECT  t.name AS TableName ,
       '' AS ColumnName,
	   0 AS IsNullable,
       e.value AS DesText,
	   '' as ColumnType,
	   0 as ColumnLength,
	   0 AS ColumnLengthL,
	   0 AS ColumnLengthR,
	   1 AS IsTable
        FROM sys.tables t 
        LEFT JOIN sys.extended_properties e ON t.object_id=e.major_id AND  e.minor_id=0
WHERE ISNULL( e.class_desc,'OBJECT_OR_COLUMN')='OBJECT_OR_COLUMN' and ISNULL(e. name,'MS_Description')='MS_Description'
)
SELECT * FROM T WHERE 1=1
";


        private DbContext _dbContext;
        public string TableName { get; private set; }

        public string TableDescText
        {
            get
            {

                if (this.Columns != null && this.Columns.Count() > 0)
                {

                    var info = this.Columns.Find(t => t.IsTable == true);
                    if (info != null) return info.DesText;
                }

                return "";
            }
        }


        public List<ColumnInfo> Columns { get; set; }

        public List<IndexInfo> Indexs { get; set; }

        public TableDesInfo(DbContext dbContext, string tableName = "")
        {
            this._dbContext = dbContext;
            if (!string.IsNullOrWhiteSpace(tableName))
            {
                this.TableName = tableName;
            }

            Columns = new List<ColumnInfo>();
            fillData();
        }

        public void SaveChange()
        {

            var sql = getExecCode();
            if (!string.IsNullOrWhiteSpace(sql))
            {
                _dbContext.ExecuteNonQuery(sql);
            }
        }


        private void fillData()
        {
            string sql = queryTemp;
            if (!string.IsNullOrWhiteSpace(this.TableName))
            {
                sql += string.Format(" and  TableName='{0}'", TableName);
            }
            var dt = _dbContext.Query(sql);


            foreach (DataRow row in dt.Rows)
            {
                var column = new ColumnInfo();
                column.TableName = row["TableName"].ToString();
                column.ColumnName = row["ColumnName"].ToString();
                column.ColumnType = row["ColumnType"].ToString();
                if (column.ColumnType == "timestamp")
                {
                    column.ColumnType = "rowversion";
                }
                column.ColumnLength = row["ColumnLength"].ToString();
                if (column.ColumnType == "nvarchar" || column.ColumnType == "nchar")
                {
                    int len = 0;
                    if (int.TryParse(column.ColumnLength, out len))
                    {
                        column.ColumnLength = (len / 2).ToString();
                    }
                }
                column.ColumnLengthL = row["ColumnLengthL"].ToString();
                column.ColumnLengthR = row["ColumnLengthR"].ToString();
                column.IsNullable = (int)row["IsNullable"] == 1 ? true : false;
                column.IsTable = Convert.ToBoolean(row["IsTable"]);
                if (row["DesText"] != DBNull.Value)
                {
                    column.DesText = row["DesText"].ToString();
                }
                Columns.Add(column);

            }
            fillIndex();
        }

        private void fillIndex()
        {
            Indexs = new List<IndexInfo>();
            var sql = string.Format(@"SELECT  a.name AS IndexName ,a.type_desc AS IndexDes ,a.is_primary_key  AS IsPrimaryKey,
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
WHERE   b.name ='{0}'", this.TableName);

            var dt = _dbContext.Query(sql);
            foreach (DataRow row in dt.Rows)
            {
                var indexInfo = new IndexInfo();
                indexInfo.IndexName = row["IndexName"].ToString();
                indexInfo.ColumnNames = row["ColumnNames"].ToString();
                indexInfo.IndexDes = row["IndexDes"].ToString();
                //  indexInfo.IsPrimaryKey = Convert.ToBoolean(row["IsPrimaryKey"]) ? "√" : "";
                indexInfo.IsPrimaryKey = Convert.ToBoolean(row["IsPrimaryKey"]) ? true : false;
                Indexs.Add(indexInfo);
            }
        }


        private string getExecCode()
        {
            var sb = new StringBuilder();

            foreach (var col in Columns)
            {
                if (!string.IsNullOrWhiteSpace(col.DesText))
                {
                    if (col.IsTable)
                    {
                        sb.AppendFormat("EXEC sys.sp_dropextendedproperty @name=N'MS_Description',  @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'{0}';", col.TableName);
                        sb.AppendLine();
                    }
                    else
                    {
                        sb.AppendFormat("EXEC sys.sp_dropextendedproperty @name=N'MS_Description',  @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'{0}', @level2type=N'COLUMN',@level2name=N'{1}';", col.TableName, col.ColumnName);
                        sb.AppendLine();
                    }
                }
                if (!string.IsNullOrWhiteSpace(col.NewDesText))
                {
                    if (col.IsTable)
                    {
                        sb.AppendFormat("EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'{1}' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'{0}';", col.TableName, col.NewDesText);
                        sb.AppendLine();
                    }
                    else
                    {
                        sb.AppendFormat("EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'{2}' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'{0}', @level2type=N'COLUMN',@level2name=N'{1}';", col.TableName, col.ColumnName, col.NewDesText);
                        sb.AppendLine();
                    }
                    col.DesText = col.NewDesText;
                }
            }



            return sb.ToString();
        }

        public string GetToSql()
        {
            var sb = new StringBuilder();

            foreach (var col in Columns)
            {
                if (col.IsTable)
                {
                    sb.AppendFormat("EXEC sys.sp_dropextendedproperty @name=N'MS_Description',  @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'{0}';", col.TableName);
                    sb.Append(Environment.NewLine + "GO" + Environment.NewLine);
                }
                else
                {
                    sb.AppendFormat("EXEC sys.sp_dropextendedproperty @name=N'MS_Description',  @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'{0}', @level2type=N'COLUMN',@level2name=N'{1}';", col.TableName, col.ColumnName);
                    sb.Append(Environment.NewLine + "GO" + Environment.NewLine);
                }
                if (string.IsNullOrWhiteSpace(col.DesText))
                {
                    continue;
                }
                if (col.IsTable)
                {
                    sb.AppendFormat("EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'{1}' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'{0}';", col.TableName, col.DesText);
                }
                else
                {
                    sb.AppendFormat("EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'{2}' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'{0}', @level2type=N'COLUMN',@level2name=N'{1}';", col.TableName, col.ColumnName, col.DesText);
                }
                sb.Append(Environment.NewLine + "GO" + Environment.NewLine);
            }
            return sb.ToString();
        }

    }

    public class ColumnInfo
    {
        public string TableName { get; set; }
        public string ColumnName { get; set; }
        public bool IsNullable { get; set; }
        public string DesText { get; set; }
        public string ColumnType { get; set; }
        public string ColumnLength { get; set; }
        public string ColumnLengthL { get; set; }
        public string ColumnLengthR { get; set; }
        private string _NewDesText;
        public string NewDesText
        {
            get { return _NewDesText; }
            set { _NewDesText = value.Trim(); }
        }
        public bool IsTable { get; set; }
        public string ColumnLengthStr
        {
            get
            {
                var str = "";
                switch (ColumnType)
                {

                    case "decimal":
                    case "float":
                    case "numeric":
                        {
                            str = string.Format("({0},{1})", this.ColumnLengthL, this.ColumnLengthR);
                            break;
                        }
                    case "varchar":
                    case "nvarchar":
                    case "char":
                    case "nchar":
                        {
                            str = string.Format("({0})", this.ColumnLength);
                            break;
                        }
                    default:
                        {
                            str = "";
                            break;
                        };
                }
                return str;
            }
        }
    }

    public class IndexInfo
    {
        public string IndexName { get; set; }
        public string IndexDes { get; set; }
        public bool IsPrimaryKey { get; set; }
        private string _ColumnNames;
        public string ColumnNames { get { return _ColumnNames; } set { _ColumnNames = value.Trim(','); } }
    }

    public class TableInfo
    {
        public string Name { get; set; }
        public string DescText { get; set; }
    }

}
