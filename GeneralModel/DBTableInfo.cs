using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
namespace GeneralModel
{


    public class DBTableInfo
    {
        public DBTableInfo()
        {
            TableName = "";
            TableDisplayName = "";
            Cols = new List<DBColInfo>();
        }
        public string TableName { get; set; }
        public string TableDisplayName { get; set; }
        public List<DBColInfo> Cols { get; set; }
    }

}
