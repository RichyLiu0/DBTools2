using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
namespace GeneralModel
{
    public class DBIndexInfo
    {
        public string IndexName { get; set; }
        public string IndexDes { get; set; }
        public bool IsPrimaryKey { get; set; }
        public bool IsUnique { get; set; }
        private string _ColumnNames;
        public string ColumnNames { get { return _ColumnNames; } set { _ColumnNames = value.Trim(','); } }
    }


}
