using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ucsmy.Framework;
using Ucsmy.Framework.Common;
using GeneralModel;
namespace GeneralService
{
    public class GenerlPrintHelper
    {

        public static string ExportColPrint(GeneralModel.ListGeneralCfg.ListCol col)
        {
            //          if(m.ListType==2)
            //    if(item.@m.Name!=null)
            //    cellsInvest.Add(t, $i, ((Decimal)item.${m.Name}).ToString("N2"));    
            //    #elseif($m.ListType==3)
            //if(item.${m.Name}!=null)
            //    cellsInvest.Add(t, $i, ((Date)item.${m.Name}).ToString("yyyy-MM-dd"));    
            //#elseif($m.ListType==4)
            //    if(item.${m.Name}!=null)
            //    cellsInvest.Add(t, $i, ((DateTime)item.${m.Name}).ToString("yyyy-MM-dd HH:mm:ss"));    
            //else 
            //    if(item.${m.Name}!=null)
            //    cellsInvest.Add(t, $i, item.${m.Name});  


            if (col.ListType == (int)EnumType.ListType.Decimal)
            {
                return "((Decimal)item.{0}).ToString(\"N2\")".FormatWith(col.Name);
            }
            else if (col.ListType == (int)EnumType.ListType.Date)
            {
                return "((DateTime)item.{0}).ToString(\"yyyy-MM-dd\")".FormatWith(col.Name);
            }
            else if (col.ListType == (int)EnumType.ListType.DateTime)
            {
                return "((DateTime)item.{0}).ToString(\"yyyy-MM-dd HH:mm:ss\")".FormatWith(col.Name);
            }
            else
            {
                return "item.{0}".FormatWith(col.Name);
            }
        }


        public static string ListColAlignPrint(GeneralModel.ListGeneralCfg.ListCol col)
        {

            if (col.ListType == (int)EnumType.ListType.Decimal)
            {
                return "right";
            }
            else if (col.ListType == (int)EnumType.ListType.Date || col.ListType == (int)EnumType.ListType.DateTime)
            {
                return "center";
            }
            else
            {
                return "left";
            }
        }

        public static string ListColPrint(GeneralModel.ListGeneralCfg.ListCol col)
        {
            // <%=item.@(m.Name).TryDateTime().Value.ToString("yyyy-MM-dd")%>
            if (col.ListType == (int)EnumType.ListType.Decimal)
            {
                return "((Decimal)item.{0}).ToString(\"N2\")".FormatWith(col.Name);
            }
            else if (col.ListType == (int)EnumType.ListType.Date)
            {
                return "((DateTime)item.{0}).ToString(\"yyyy-MM-dd\")".FormatWith(col.Name);
            }
            else if (col.ListType == (int)EnumType.ListType.DateTime)
            {
                return "((DateTime)item.{0}).ToString(\"yyyy-MM-dd HH:mm:ss\")".FormatWith(col.Name);
            }
            else
            {
                return "item.{0}".FormatWith(col.Name);
            }
        }

        public static string ClassPrint(string server, string db, string tb)
        {
            var ti = new GeneralDAO.TableDAO().GetTable(server,db, tb);
            var strReturn = "";
            strReturn += ToClass(ti);
            strReturn += ToNewClass(ti);
            strReturn += ToNewClass2(ti);
            return strReturn;
        }

        public static string GetCSharpType(string dbDateType)
        {
            //   if(m.DataType=="datetime")
            //{
            //public DateTime @m.Name { get; set; }

            //   else 
            //   public @m.DataType @m.Name { get; set; }
            //   }
            return TypeMap.GetCShartType(dbDateType);

        }

        public class TypeMap
        {
            public static string GetCShartType(string dbType)
            {
                if (string.IsNullOrWhiteSpace(dbType))
                    return "";
                var map = _TypeMaps.FirstOrDefault(t => t.DBType == dbType.Trim().ToLower());
                if (map == null)
                    return dbType;
                return map.CSharpType;
            }
            public static string GetCSharpDefaultVal(string dbType)
            {
                if (string.IsNullOrWhiteSpace(dbType))
                    return "";
                var map = _Maps_PropDefaultVal.FirstOrDefault(t => t.DBType == dbType.Trim().ToLower());
                if (map == null)
                    return dbType;
                return map.CSharpType;
            }

            public string DBType { get; set; }
            public string CSharpType { get; set; }

            static IEnumerable<TypeMap> _TypeMaps = new List<TypeMap>() {
            new TypeMap(){DBType="int",CSharpType="int"},
            new TypeMap(){DBType="text",CSharpType="string"},
            new TypeMap(){DBType="bigint",CSharpType="long"},
            new TypeMap(){DBType="binary",CSharpType="byte[]"},
            new TypeMap(){DBType="bit",CSharpType="bool"},
            new TypeMap(){DBType="char",CSharpType="string"},
            new TypeMap(){DBType="datetime",CSharpType="DateTime"},
            new TypeMap(){DBType="decimal",CSharpType="decimal"},
            new TypeMap(){DBType="float",CSharpType="Double"},
            new TypeMap(){DBType="image",CSharpType="byte[]"},
            new TypeMap(){DBType="money",CSharpType="decimal"},
            new TypeMap(){DBType="nchar",CSharpType="string"},
            new TypeMap(){DBType="ntext",CSharpType="string"},
            new TypeMap(){DBType="numeric",CSharpType="decimal"},
            new TypeMap(){DBType="nvarchar",CSharpType="string"},
            new TypeMap(){DBType="real",CSharpType="Single"},
            new TypeMap(){DBType="smalldatetime",CSharpType="DateTime"},
            new TypeMap(){DBType="smallint",CSharpType="Int16"},
            new TypeMap(){DBType="smallmoney",CSharpType="decimal"},
            new TypeMap(){DBType="timestamp",CSharpType="DateTime"},
            new TypeMap(){DBType="tinyint",CSharpType="byte"},
            new TypeMap(){DBType="uniqueidentifier",CSharpType="Guid"},
            new TypeMap(){DBType="varbinary",CSharpType="byte[]"},
            new TypeMap(){DBType="varchar",CSharpType="string"},
            new TypeMap(){DBType="variant",CSharpType="object"},
        }.AsEnumerable();


            static IEnumerable<TypeMap> _Maps_PropDefaultVal = new List<TypeMap>() {
            new TypeMap(){DBType="int",CSharpType="0"},
            new TypeMap(){DBType="string",CSharpType="\"\""},
            new TypeMap(){DBType="long",CSharpType="0"},
            new TypeMap(){DBType="byte[]",CSharpType="null"},
            new TypeMap(){DBType="bool",CSharpType="false"},
            new TypeMap(){DBType="datetime",CSharpType="DateTime.Now"},
            new TypeMap(){DBType="decimal",CSharpType="0"},
            new TypeMap(){DBType="double",CSharpType="0"},
            new TypeMap(){DBType="single",CSharpType="0"},
            new TypeMap(){DBType="int16",CSharpType="0"},
            new TypeMap(){DBType="byte",CSharpType="null"},
            new TypeMap(){DBType="guid",CSharpType="null"},
            new TypeMap(){DBType="object",CSharpType="null"},
        }.AsEnumerable();
        }



        private static string ToClass(DBTableInfo ti)
        {
            StringBuilder cBuilder = new StringBuilder();
            cBuilder.AppendLine("--【类定义】------------------------------------------");
            cBuilder.AppendLine("public class " + ti.TableName);
            cBuilder.AppendLine("{");
            foreach (DBColInfo c in ti.Cols)
            {
                if (string.IsNullOrWhiteSpace(c.ColumnName) == false)
                {
                    cBuilder.AppendLine("   public " + TypeMap.GetCShartType(c.ColumnType) + " " + c.ColumnName + " { get;set; }");
                }
            }
            cBuilder.AppendLine("}");
            cBuilder.AppendLine("");
            return cBuilder.ToString();
        }

        private static string ToNewClass(DBTableInfo ti)
        {
            StringBuilder cBuilder = new StringBuilder();
            cBuilder.AppendLine("--【类赋值】------------------------------------------");
            cBuilder.AppendLine("var newObj = new " + ti.TableName + " ()");
            cBuilder.AppendLine("{");
            foreach (DBColInfo c in ti.Cols)
            {
                var propType = TypeMap.GetCShartType(c.ColumnType);
                if (string.IsNullOrWhiteSpace(c.ColumnName) == false)
                {
                    cBuilder.AppendLine("   " + c.ColumnName + " = " + TypeMap.GetCSharpDefaultVal(propType) + ",");
                }
            }
            cBuilder.AppendLine("}");
            cBuilder.AppendLine("");
            return cBuilder.ToString();
        }

        private static string ToNewClass2(DBTableInfo ti)
        {
            StringBuilder cBuilder = new StringBuilder();
            cBuilder.AppendLine("--【类赋值2】------------------------------------------");
            cBuilder.AppendLine("var newObj = new " + ti.TableName + " ();");
            foreach (DBColInfo c in ti.Cols)
            {
                var propType = TypeMap.GetCShartType(c.ColumnType);
                if (string.IsNullOrWhiteSpace(c.ColumnName) == false)
                {
                    cBuilder.AppendLine("newObj." + c.ColumnName + " = " + TypeMap.GetCSharpDefaultVal(propType) + ";");
                }
            }
            cBuilder.AppendLine("");
            return cBuilder.ToString();
        }
    }
}
