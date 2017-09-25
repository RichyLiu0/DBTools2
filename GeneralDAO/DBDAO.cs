using GeneralModel;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ucsmy.Framework;
using Ucsmy.Framework.Common;

namespace GeneralDAO
{
    public class DBDAO
    {
        DbContext dbContext;


        public DBDAO()
        {
            dbContext = new DbContext();
        }
        public List<string> GetDBName()
        {

            string sql = @"SELECT * FROM Master..SysDatabases where name not in ('master','tempdb','model','msdb') ORDER BY Name ";
            var dt = dbContext.Query(sql);
            var list = new List<string>();
            var arrFillter = "DBFilter".ValueOfAppSettings().Split(',');
            foreach (DataRow row in dt.Rows)
            {
                var db = row[0].ToString();
                if (arrFillter != null && arrFillter.Count() > 0)
                {
                    if (arrFillter.Where(t => db.StartsWith(t)).Count() == 0)
                    {
                        continue;
                    }
                }
                list.Add(db);

            }
            return list;
        }

        public List<DBTableInfo> GetTableName(string keyWord = "")
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
            var dt = dbContext.Query(sql);
            var list = new List<DBTableInfo>();
            foreach (DataRow row in dt.Rows)
            {
                var item = new DBTableInfo()
                {
                    TableName = row["name"].ToString(),
                    TableDisplayName = row["desctext"] == null ? "" : row["desctext"].ToString()
                };
                list.Add(item);
            }
            return list;
        }

    }
}
