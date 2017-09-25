using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DbModel
{
    public class DBField
    {
        public string Name { get; set; }
        public string DisplayName { get; set; }
        public string DataType { get; set; }
        public Boolean IsPrimaryKey { get; set; }
        public Boolean IsNullable { get; set; }
    }
}
