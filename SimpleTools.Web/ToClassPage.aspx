<%@ Page Language="C#" AutoEventWireup="true" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>To Class</title>
</head>
<body>
    <textarea id="txtCode" style="width: 100%; height: 700px"><%=ToClass(this.TableInfo) %><%=ToNewClass(this.TableInfo) %><%=ToNewClass2(this.TableInfo) %>
    </textarea>
</body>
</html>
<script runat="server">
    protected TableDesInfo TableInfo;
    protected string TableName;
    protected string ServerName;
    protected string DbName;
    protected void Page_Load(object sender, EventArgs e)
    {
        InitData();
    }

    private void InitData()
    {
        ServerName = Request.QueryString["serverName"];
        DbName = Request.QueryString["dbName"];
        TableName = Request.QueryString["tbName"];
        if (string.IsNullOrWhiteSpace(ServerName) || string.IsNullOrWhiteSpace(DbName))
        {
            throw new Exception("参数不正确!");
        }
        var dbcontext = new DbContext(ServerName, DbName);
        TableInfo = dbcontext.FindTableInfo(TableName);
    }
    private string ToClass(TableDesInfo ti)
    {
        StringBuilder cBuilder = new StringBuilder();
        cBuilder.AppendLine("--【类定义】------------------------------------------");
        cBuilder.AppendLine("public class " + ti.TableName);
        cBuilder.AppendLine("{");
        foreach (ColumnInfo c in ti.Columns)
        {
            if (string.IsNullOrWhiteSpace(c.ColumnName) == false)
            {
                cBuilder.AppendLine("   public " + TypeMap.GetClassPropType(c.ColumnType) + " " + c.ColumnName + " { get;set; }");
            }
        }
        cBuilder.AppendLine("}");
        cBuilder.AppendLine("");
        return cBuilder.ToString();
    }

    private string ToNewClass(TableDesInfo ti)
    {
        StringBuilder cBuilder = new StringBuilder();
        cBuilder.AppendLine("--【类赋值】------------------------------------------");
        cBuilder.AppendLine("var newObj = new " + ti.TableName + " ()");
        cBuilder.AppendLine("{");
        foreach (ColumnInfo c in ti.Columns)
        {
            var propType = TypeMap.GetClassPropType(c.ColumnType);
            if (string.IsNullOrWhiteSpace(c.ColumnName) == false)
            {
                cBuilder.AppendLine("   " + c.ColumnName + " = " + TypeMap.GetPropDefaultVal(propType) + ",");
            }
        }
        cBuilder.AppendLine("}");
        cBuilder.AppendLine("");
        return cBuilder.ToString();
    }

    private string ToNewClass2(TableDesInfo ti)
    {
        StringBuilder cBuilder = new StringBuilder();
        cBuilder.AppendLine("--【类赋值2】------------------------------------------");
        cBuilder.AppendLine("var newObj = new " + ti.TableName + " ();");
        foreach (ColumnInfo c in ti.Columns)
        {
            var propType = TypeMap.GetClassPropType(c.ColumnType);
            if (string.IsNullOrWhiteSpace(c.ColumnName) == false)
            {
                cBuilder.AppendLine("newObj." + c.ColumnName + " = " + TypeMap.GetPropDefaultVal(propType) + ";");
            }
        }
        cBuilder.AppendLine("");
        return cBuilder.ToString();
    }

    public class TypeMap
    {
        public static string GetClassPropType(string key)
        {
            if (string.IsNullOrWhiteSpace(key))
                return "";
            var map = _Maps_PropType.FirstOrDefault(t => t.SourceType == key.Trim().ToLower());
            if (map == null)
                return key;
            return map.DestType;
        }
        public static string GetPropDefaultVal(string key)
        {
            if (string.IsNullOrWhiteSpace(key))
                return "";
            var map = _Maps_PropDefaultVal.FirstOrDefault(t => t.SourceType == key.Trim().ToLower());
            if (map == null)
                return key;
            return map.DestType;
        }

        public string SourceType { get; set; }
        public string DestType { get; set; }

        static IEnumerable<TypeMap> _Maps_PropType = new List<TypeMap>() {
            new TypeMap(){SourceType="int",DestType="int"},
            new TypeMap(){SourceType="text",DestType="string"},
            new TypeMap(){SourceType="bigint",DestType="long"},
            new TypeMap(){SourceType="binary",DestType="byte[]"},
            new TypeMap(){SourceType="bit",DestType="bool"},
            new TypeMap(){SourceType="char",DestType="string"},
            new TypeMap(){SourceType="datetime",DestType="DateTime"},
            new TypeMap(){SourceType="decimal",DestType="decimal"},
            new TypeMap(){SourceType="float",DestType="Double"},
            new TypeMap(){SourceType="image",DestType="byte[]"},
            new TypeMap(){SourceType="money",DestType="decimal"},
            new TypeMap(){SourceType="nchar",DestType="string"},
            new TypeMap(){SourceType="ntext",DestType="string"},
            new TypeMap(){SourceType="numeric",DestType="decimal"},
            new TypeMap(){SourceType="nvarchar",DestType="string"},
            new TypeMap(){SourceType="real",DestType="Single"},
            new TypeMap(){SourceType="smalldatetime",DestType="DateTime"},
            new TypeMap(){SourceType="smallint",DestType="Int16"},
            new TypeMap(){SourceType="smallmoney",DestType="decimal"},
            new TypeMap(){SourceType="timestamp",DestType="DateTime"},
            new TypeMap(){SourceType="tinyint",DestType="byte"},
            new TypeMap(){SourceType="uniqueidentifier",DestType="Guid"},
            new TypeMap(){SourceType="varbinary",DestType="byte[]"},
            new TypeMap(){SourceType="varchar",DestType="string"},
            new TypeMap(){SourceType="variant",DestType="object"},
        }.AsEnumerable();


        static IEnumerable<TypeMap> _Maps_PropDefaultVal = new List<TypeMap>() {
            new TypeMap(){SourceType="int",DestType="0"},
            new TypeMap(){SourceType="string",DestType="\"\""},
            new TypeMap(){SourceType="long",DestType="0"},
            new TypeMap(){SourceType="byte[]",DestType="null"},
            new TypeMap(){SourceType="bool",DestType="false"},
            new TypeMap(){SourceType="datetime",DestType="DateTime.Now"},
            new TypeMap(){SourceType="decimal",DestType="0"},
            new TypeMap(){SourceType="double",DestType="0"},
            new TypeMap(){SourceType="single",DestType="0"},
            new TypeMap(){SourceType="int16",DestType="0"},
            new TypeMap(){SourceType="byte",DestType="null"},
            new TypeMap(){SourceType="guid",DestType="null"},
            new TypeMap(){SourceType="object",DestType="null"},
        }.AsEnumerable();
    }
</script>
