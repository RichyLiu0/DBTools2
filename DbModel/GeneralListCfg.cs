using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DbModel
{
    public class GeneralListCfg
    {

        /// <summary>
        ///可于保存文件（避免中文）
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// 显示名称 
        /// </summary>
        public string DisplayName { get; set; }

        /// <summary>
        /// 是否支持导出
        /// </summary>
        public bool IsSupporExport { get; set; }

        public bool IsSupportAdd { get; set; }

        public bool IsSupportEdit { get; set; }

        public bool IsSupportView { get; set; }


        public DBTable DBCfg { get; set; }

        public List<QueryField> QueryCfg { get; set; }

        public int FreezeColIndex { get; set; }

        public List<ListField> ListCfg { get; set; }

        public GeneralListCfg()
        {
            DBCfg = new DBTable();
            QueryCfg = new List<QueryField>();
            ListCfg = new List<ListField>();
        }



        #region 内部类

        public class DBTable
        {

            public int SourceType { get; set; }

            public string TableName { get; set; }

            public string SQL { get; set; }

            public List<DbFile> FieldList { get; set; }

            public DBTable()
            {
                FieldList = new List<DbFile>();
            }

        }

        public class DbFile
        {
            public string Name { get; set; }
            public string DisplayName { get; set; }
            public string DataType { get; set; }
            public Boolean IsPrimaryKey { get; set; }

            public Boolean IsNullable { get; set; }
        }

        public class QueryField
        {
            public string Name { get; set; }
            public string DisplayName { get; set; }
            public int QueryType { get; set; }
            public int RowIdx { get; set; }
            public int ColumnIdx { get; set; }
        }

        public class ListField
        {
            public string Name { get; set; }
            public string DisplayName { get; set; }
            public int ListType { get; set; }
            public int ColumnIdx { get; set; }
            public Boolean IsSort { get; set; }
            public Boolean IsSum { get; set; }

        }

        #endregion
 
    }

    public class EnumType
    {

        public enum DataSourceType
        {
            Table = 1,
            SqlExpress = 2
        }


        public enum QueryType
        {
            Int = 0,
            IntRange = 1,
            String = 2,
            StringLike = 3,
            Decimal = 4,
            DecimalRange = 5,
            Date = 6,
            DateRange = 7,
            DateTime = 8,
            DateTimeRange = 9

        }
        public enum ListType
        {
            Int = 0,
            String = 1,
            Decimal = 2,
            Date = 3,
            DateTime = 4,
        }
    }

}
