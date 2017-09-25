using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DbModel
{
    public class ListUICfg
    {
        public string Name { get; set; }
        public string DisplayName { get; set; }
        public int SourceType { get; set; }
        public string Sql { get; set; }
        public string TableName { get; set; }
        public string PrimaryKey { get; set; }
        public ListUICfg()
        {
            cfg = new List<Col>();
        }
        public List<Col> cfg;
        public class Col
        {
            public string Name { get; set; }
            public string DisplayName { get; set; }
            public Boolean IsPrimaryKey { get; set; }
            public string DataType { get; set; }
            public Boolean IsAllowNullable { get; set; }
            public Boolean IsCondition { get; set; }
            public Boolean IsCol { get; set; }

        }
    }
}
