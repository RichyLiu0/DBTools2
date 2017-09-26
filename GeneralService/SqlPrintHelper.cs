using GeneralModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GeneralService
{
    public class SqlPrintHelper
    {

        public static string PrintTableSql(string server, string db, string tb)
        {
            // @ToTable(this.TableInfo) @ToIndex(this.TableInfo)@ToAnnotation(this.TableInfo) @ToInsert(this.TableInfo) @ToSelect(this.TableInfo)

            string strReturn = "";

            DBTableInfo tbInfo = new GeneralDAO.TableDAO().GetTable(server, db, tb);
            strReturn += ToTable(server,db, tbInfo);
            strReturn += ToIndex(server,db, tb);
            strReturn += ToAnnotation(tbInfo);
            strReturn += ToInsert(tbInfo);
            strReturn += ToSelect(tbInfo);

            return strReturn;

        }


        private static string ToTable(string server, string db, DBTableInfo tb)
        {
            StringBuilder cBuilder = new StringBuilder();
            cBuilder.AppendLine("--【表结构】------------------------------------------");
            cBuilder.AppendLine("CREATE TABLE [dbo].[" + tb.TableName + "](");

            var idx = 0;
            var tableDao = new GeneralDAO.TableDAO();
            var Indexs = tableDao.GetIndexs(server,db, tb.TableName);
            var primaryColumn = Indexs.FirstOrDefault(t => t.IsPrimaryKey);
            foreach (DBColInfo c in tb.Cols)
            {
                idx++;
                if (string.IsNullOrWhiteSpace(c.ColumnName))
                    continue;
                var scriptPrimaryKey = "";
                if (primaryColumn != null)
                {
                    scriptPrimaryKey = c.ColumnName == primaryColumn.ColumnNames ? "primary key" : "";
                }
                var scriptEnd = idx == tb.Cols.Count ? "" : ",";
                var scriptNullable = c.IsNullable ? "null" : "not null";


                cBuilder.AppendLine(string.Format("   [{0}] [{1}]{2} {3} {4} {5} --{6}"
                    , c.ColumnName, c.ColumnType, c.ColumnLengthStr, scriptNullable, scriptPrimaryKey, scriptEnd, c.DisplayName));
            }
            cBuilder.AppendLine(")");
            cBuilder.AppendLine("GO");
            cBuilder.AppendLine("");
            return cBuilder.ToString();
        }

        private static string ToIndex(string server, string db, string tb)
        {
            StringBuilder cBuilder = new StringBuilder();

            var tableDao = new GeneralDAO.TableDAO();
            var Indexs = tableDao.GetIndexs(server,db, tb);
            cBuilder.AppendLine("--【索引】------------------------------------------");
            foreach (DBIndexInfo idx in Indexs)
            {
                if (idx.IsPrimaryKey)//忽略主键
                    continue;

                cBuilder.AppendLine("CREATE " + (idx.IsUnique ? " UNIQUE " : "") + idx.IndexDes + " INDEX " + idx.IndexName);
                cBuilder.AppendLine("ON [dbo]." + tb + " (" + idx.ColumnNames + ")");
                cBuilder.AppendLine("GO");
            }
            cBuilder.AppendLine("");
            return cBuilder.ToString();
        }

        private static string ToAnnotation(DBTableInfo tb)
        {

            StringBuilder cBuilder = new StringBuilder();
            cBuilder.AppendLine("--【注释】------------------------------------------");
            cBuilder.Append(new GeneralDAO.TableDAO().GetRemarkSql(tb));
            cBuilder.AppendLine("");
            return cBuilder.ToString();
        }

        private static string ToInsert(DBTableInfo tb)
        {
            StringBuilder cBuilder = new StringBuilder();
            cBuilder.AppendLine("--【Insert】------------------------------------------");
            cBuilder.AppendLine("INSERT INTO [dbo].[" + tb.TableName + "](");
            var idx = 0;
            foreach (DBColInfo c in tb.Cols)
            {
                idx++;
                if (string.IsNullOrWhiteSpace(c.ColumnName))
                    continue;
                var scriptEnd = idx == tb.Cols.Count ? "" : ",";
                cBuilder.AppendLine(string.Format(" [{0}]{1}", c.ColumnName, scriptEnd));
            }
            /////////////////////////////////
            cBuilder.AppendLine(")VALUES(");
            idx = 0;
            foreach (DBColInfo c in tb.Cols)
            {
                idx++;
                if (string.IsNullOrWhiteSpace(c.ColumnName))
                    continue;
                var scriptEnd = idx == tb.Cols.Count ? "" : ",";
                var scriptNullable = c.IsNullable ? "null" : "not null";
                cBuilder.AppendLine(string.Format(" 'xxxxxx'{4}--<{0},{1}{2},{3}>", c.ColumnName, c.ColumnType, c.ColumnLengthStr, scriptNullable, scriptEnd));
            }
            cBuilder.AppendLine(")");
            cBuilder.AppendLine("");
            return cBuilder.ToString();
        }

        private static string ToSelect(DBTableInfo tb)
        {
            StringBuilder cBuilder = new StringBuilder();
            cBuilder.AppendLine("--【Select】------------------------------------------");
            cBuilder.AppendLine("SELECT");
            var idx = 0;
            foreach (DBColInfo c in tb.Cols)
            {
                idx++;
                if (string.IsNullOrWhiteSpace(c.ColumnName))
                    continue;
                var scriptEnd = idx == tb.Cols.Count ? "" : ",";
                cBuilder.AppendLine(string.Format(" a.[{0}]{1}", c.ColumnName, scriptEnd));
            }
            cBuilder.AppendLine(string.Format("FROM dbo.[{0}] as a", tb.TableName));
            cBuilder.AppendLine("");
            return cBuilder.ToString();
        }
    }
}
