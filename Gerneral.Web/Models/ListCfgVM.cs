using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;


public class ListCfgVM
{

    public int SourceType { get; set; }
    public string Name { get; set; }
    public string DisplayName { get; set; }
    public string Sql { get; set; }
    public string TableName { get; set; }
    public string ColKey { get; set; }

    public ListCfgVM()
    {
        Cols = new List<Col>();
    }
    public List<Col> Cols;

    public class Col
    {
        public string Name { get; set; }
        public string DisplayName { get; set; }
        public string DataType { get; set; }
        public Boolean IsNullable { get; set; }
        public Boolean IsCondition { get; set; }
        public Boolean IsList { get; set; }
    }



}

