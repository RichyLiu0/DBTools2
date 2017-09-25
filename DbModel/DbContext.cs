using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Data.SqlClient;

namespace DbModel
{
    public class DbContext
    {
        private string _ConnString;
        public DbContext(string ServerName, string DbName = "")
        {
            string strDb = "";
            if (!string.IsNullOrWhiteSpace(DbName))
                strDb = "Initial Catalog=" + DbName;
            _ConnString = System.Configuration.ConfigurationManager.ConnectionStrings[ServerName].ConnectionString + strDb;
        }

        public List<string> FindAllDBName()
        {
            string sql = @"SELECT * FROM Master..SysDatabases where name not in ('master','tempdb','model','msdb') ORDER BY Name ";
            var dt = Query(sql);
            var list = new List<string>();
            foreach (DataRow row in dt.Rows)
            {
                list.Add(row[0].ToString());
            }
            return list;
        }

        public List<TableInfo> FindTableName(string keyWord = "")
        {
            string sql = @"SELECT  name ,
        ( SELECT    value
          FROM      sys.extended_properties
          WHERE     major_id = a.object_id
                    AND minor_id = 0
        ) AS desctext
FROM    sys.tables a";
            if (!string.IsNullOrWhiteSpace(keyWord))
            {
                sql += string.Format(" where name like '%{0}%'", keyWord);
            }
            var dt = Query(sql);
            var list = new List<TableInfo>();
            foreach (DataRow row in dt.Rows)
            {
                var item = new TableInfo()
                {
                    Name = row["name"].ToString(),
                    DescText = row["desctext"] == null ? "" : row["desctext"].ToString()
                };
                list.Add(item);
            }
            return list;
        }

        public TableDesInfo FindTableInfo(string tableName)
        {
            return new TableDesInfo(this, tableName);
        }


        public DataTable Query(string sql)
        {
            var sda = new SqlDataAdapter(sql, _ConnString);
            var ds = new DataSet();
            sda.Fill(ds);
            return ds.Tables[0];
        }
        public int ExecuteNonQuery(string sql)
        {
            using (var conn = new SqlConnection(_ConnString))
            {
                conn.Open();
                var cmd = new SqlCommand(sql, conn);
                return cmd.ExecuteNonQuery();
            }
        }
    }
}
