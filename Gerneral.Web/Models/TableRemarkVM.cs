using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Gerneral.Web.Models
{
    public class TableRemarkVM
    {
        public string Server { get; set; }
        public string DBName { get; set; }
        public string TableName { get; set; }
        public string TableDisplayName { get; set; }

        public List<ColInfo> Cols { get; set; }

        public class ColInfo
        {
            public string Name { get; set; }
            public string DisplayName { get; set; }
        }
    }


}