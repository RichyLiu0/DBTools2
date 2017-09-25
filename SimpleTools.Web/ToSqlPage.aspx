<%@ Page Language="C#" AutoEventWireup="true" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
        <div>
            <%--<a href="DownLoad.ashx?serverName=<%= ServerName  %>&dbName=<%= DbName %>&tbName=<%= TableName %>" target="_blank">下载</a>--%>
            <textarea id="txtCode" style="width: 100%; height: 700px"><%=ToTable(this.TableInfo) %><%=ToIndex(this.TableInfo) %><%=ToAnnotation(this.TableInfo) %><%=ToInsert(this.TableInfo) %><%=ToSelect(this.TableInfo) %></textarea>
        </div>
    </form>
</body>
</html>
<script runat="server">
    protected TableDesInfo TableInfo;
    public string ServerName = "";
    public string DbName = "";
    public string TableName = "";

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

    private string ToTable(TableDesInfo ti)
    {
        StringBuilder cBuilder = new StringBuilder();
        cBuilder.AppendLine("--【表结构】------------------------------------------");
        cBuilder.AppendLine("CREATE TABLE [dbo].[" + ti.TableName + "](");
        var idx = 0;
        var primaryColumn = ti.Indexs.FirstOrDefault(t => t.IsPrimaryKey);
        foreach (ColumnInfo c in ti.Columns)
        {
            idx++;
            if (string.IsNullOrWhiteSpace(c.ColumnName))
                continue;
            var scriptPrimaryKey = "";
            if (primaryColumn != null)
            {
                scriptPrimaryKey = c.ColumnName == primaryColumn.ColumnNames ? "primary key" : "";
            }
            var scriptEnd = idx == ti.Columns.Count ? "" : ",";
            var scriptNullable = c.IsNullable ? "null" : "not null";


            cBuilder.AppendLine(string.Format("   [{0}] [{1}]{2} {3} {4} {5} --{6}"
                , c.ColumnName, c.ColumnType, c.ColumnLengthStr, scriptNullable, scriptPrimaryKey, scriptEnd, c.DesText));
        }
        cBuilder.AppendLine(")");
        cBuilder.AppendLine("GO");
        cBuilder.AppendLine("");
        return cBuilder.ToString();
    }
    private string ToIndex(TableDesInfo ti)
    {
        StringBuilder cBuilder = new StringBuilder();
        cBuilder.AppendLine("--【索引】------------------------------------------");
        foreach (IndexInfo idx in ti.Indexs)
        {
            //if (idx.IsPrimaryKey == "√")
            //    continue;
            cBuilder.AppendLine("CREATE " + idx.IndexDes + " INDEX " + idx.IndexName);
            cBuilder.AppendLine("ON [dbo]." + ti.TableName + " (" + idx.ColumnNames + ")");
            cBuilder.AppendLine("GO");
        }
        cBuilder.AppendLine("");
        return cBuilder.ToString();
    }

    private string ToAnnotation(TableDesInfo ti)
    {
        StringBuilder cBuilder = new StringBuilder();
        cBuilder.AppendLine("--【注释】------------------------------------------");
        cBuilder.Append(ti.GetToSql());
        cBuilder.AppendLine("");
        return cBuilder.ToString();
    }

    private string ToInsert(TableDesInfo ti)
    {
        StringBuilder cBuilder = new StringBuilder();
        cBuilder.AppendLine("--【Insert】------------------------------------------");
        cBuilder.AppendLine("INSERT INTO [dbo].[" + ti.TableName + "](");
        var idx = 0;
        foreach (ColumnInfo c in ti.Columns)
        {
            idx++;
            if (string.IsNullOrWhiteSpace(c.ColumnName))
                continue;
            var scriptEnd = idx == ti.Columns.Count ? "" : ",";
            cBuilder.AppendLine(string.Format(" [{0}]{1}", c.ColumnName, scriptEnd));
        }
        /////////////////////////////////
        cBuilder.AppendLine(")VALUES(");
        idx = 0;
        foreach (ColumnInfo c in ti.Columns)
        {
            idx++;
            if (string.IsNullOrWhiteSpace(c.ColumnName))
                continue;
            var scriptEnd = idx == ti.Columns.Count ? "" : ",";
            var scriptNullable = c.IsNullable ? "null" : "not null";
            cBuilder.AppendLine(string.Format(" 'xxxxxx'{4}--<{0},{1}{2},{3}>", c.ColumnName, c.ColumnType, c.ColumnLengthStr, scriptNullable, scriptEnd));
        }
        cBuilder.AppendLine(")");
        cBuilder.AppendLine("");
        return cBuilder.ToString();
    }

    private string ToSelect(TableDesInfo ti)
    {
        StringBuilder cBuilder = new StringBuilder();
        cBuilder.AppendLine("--【Select】------------------------------------------");
        cBuilder.AppendLine("SELECT");
        var idx = 0;
        foreach (ColumnInfo c in ti.Columns)
        {
            idx++;
            if (string.IsNullOrWhiteSpace(c.ColumnName))
                continue;
            var scriptEnd = idx == ti.Columns.Count ? "" : ",";
            cBuilder.AppendLine(string.Format(" a.[{0}]{1}", c.ColumnName, scriptEnd));
        }
        cBuilder.AppendLine(string.Format("FROM dbo.[{0}] as a", ti.TableName));
        cBuilder.AppendLine("");
        return cBuilder.ToString();
    }
</script>
