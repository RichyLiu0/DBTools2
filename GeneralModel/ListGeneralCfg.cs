using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace GeneralModel
{
    public class ListGeneralCfg
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


        public DataSourceCfg DataSource { get; set; }

        public List<QueryCol> QueryCols { get; set; }

        public int FreezeColIndex { get; set; }

        public List<ListCol> ListCols { get; set; }

        public ListGeneralCfg()
        {
            DataSource = new DataSourceCfg();
            QueryCols = new List<QueryCol>();
            ListCols = new List<ListCol>();
        }
        #region 内部类

        public class DataSourceCfg
        {

            public int SourceType { get; set; }


            public string TableName { get; set; }

            public string SQL { get; set; }


            public List<DbCol> DBCols { get; set; }

            public DataSourceCfg()
            {
                DBCols = new List<DbCol>();
            }

        }

        public class DbCol
        {
            public string ColumnName { get; set; }
            public string DisplayName { get; set; }
            public string DataType { get; set; }
            public Boolean IsNullable { get; set; }
        }

        public class QueryCol
        {
            public string Name { get; set; }
            public string DisplayName { get; set; }
            public int QueryType { get; set; }
            public int RowIdx { get; set; }
            public int ColumnIdx { get; set; }
        }

        public class ListCol
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

   

}
