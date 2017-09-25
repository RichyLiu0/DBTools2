using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
namespace GeneralModel
{



    public class DBColInfo
    {
        public string ColumnName { get; set; }
        public bool IsNullable { get; set; }
        public string DisplayName { get; set; }
        public string ColumnType { get; set; }
        public string ColumnLength { get; set; }
        public string ColumnLengthL { get; set; }
        public string ColumnLengthR { get; set; }
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



}
