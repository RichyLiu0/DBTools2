<%@ Page Language="C#" AutoEventWireup="true" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
    <style type="text/css">
        .test_box {
            width: 250px;
            min-height: 20px;
            max-height: 300px;
            _height: 120px;
            margin-left: auto;
            margin-right: auto;
            padding: 3px;
            outline: 0;
            border: 1px solid #a0b3d6;
            font-size: 12px;
            word-wrap: break-word;
            overflow-x: hidden;
            overflow-y: auto;
            _overflow-y: visible;
        }
    </style>
    <script type="text/javascript">
        function setValue(key, txt) {
            var text = document.getElementById(txt).innerText;;
            var input = document.getElementsByName(key);
            input[0].value = text
        }

    </script>
</head>
<body>
    <form id="form1" runat="server">
        <div style="margin-bottom: 200px;">
            <table>
                <tr>
                    <td>
                        <input id="btnSave" type="submit" value="保存" />&nbsp;&nbsp;&nbsp;&nbsp;
                        <input type="button" value="刷新" onclick="window.location.href = window.location.href;" />
                    </td>
                    <td>&nbsp;&nbsp;&nbsp;&nbsp;<a href="ToSqlPage.aspx?serverName=<%= ServerName  %>&dbName=<%= DbName %>&tbName=<%= TableName %>" target="_blank">导出(脚本)</a>&nbsp;&nbsp;&nbsp;&nbsp;
                        <a href="ToClassPage.aspx?serverName=<%= ServerName  %>&dbName=<%= DbName %>&tbName=<%= TableName %>" target="_blank">导出(实体类)</a>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <a href="./PageGeneralTools/List/ListCodeGeneral.aspx" target="_blank">代码生成</a>
                    </td>
                </tr>
            </table>
            <table cellpadding="2">
                <%
                    if (!string.IsNullOrWhiteSpace(TableName))
                    { %>
                <tr>
                    <td><span>表：</span><span style="font-size: 24px; font-weight: bold; color: blue"><%= TableName %></span></td>
                    <%  var tableInfo = TableInfo.Columns.Find(t => t.IsTable == true);
                        if (tableInfo != null)
                        {%>
                    <td colspan="3">
                        <input type="hidden" name="<%=tableInfo.TableName %>" value="<%=tableInfo.DesText%>" />
                        <div id="txt<%=tableInfo.TableName %>" class="test_box" contenteditable="true" onblur="setValue('<%=tableInfo.TableName %>','txt<%=tableInfo.TableName %>')">
                            <%=tableInfo.DesText??""%>
                        </div>
                    </td>
                    <%} %>
                </tr>
                <% }
                %>
                <tr style="color: #0094ff; text-align: center;">
                    <td>字段名</td>
                    <td>类型</td>
                    <td style="text-align: center; width: 50px;">允许空</td>
                    <td>备注</td>
                </tr>
                <% foreach (var p in TableInfo.Columns.Where(t => t.IsTable == false))
                   { %>
                <tr>
                    <td><span><%=p.ColumnName %></span></td>
                    <td><span><%=p.ColumnType %><%=p.ColumnLengthStr %></span></td>
                    <td style="text-align: center;">
                        <%if (p.IsNullable)
                          { %>
                        <span style="color: green; font-weight: bold">√</span>
                        <%}
                          else
                          { %>
                        <span style="color: red; font-weight: bold">X</span>
                        <%} %>
                    </td>
                    <td>
                        <input type="hidden" name="<%=p.TableName+"."+ p.ColumnName %>" value="<%=p.DesText  %>" />
                        <div id='txt<%=p.TableName+"."+ p.ColumnName%>' class="test_box" contenteditable="true" onblur="setValue('<%=p.TableName+"."+ p.ColumnName %>','txt<%=p.TableName+"."+ p.ColumnName %>')">
                            <%=p.DesText??""%>
                        </div>
                    </td>
                </tr>
                <%} %>
            </table>
            <table>
                <% if (TableInfo.Indexs.Any())
                   { %>
                <tr>
                    <td><span>索引：</span></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr style="color: #0094ff; text-align: center">
                    <td>索引名称</td>
                    <td>类型</td>
                    <td>主键</td>
                    <td>字段集合</td>
                </tr>
                <% foreach (var item in TableInfo.Indexs)
                   { %>
                <tr>
                    <td style="width: 250px"><%=item.IndexName %></td>
                    <td><%=item.IndexDes %></td>
                    <td style="color: green; font-weight: bold"><%=item.IsPrimaryKey?"√":"" %></td>
                    <td><%=item.ColumnNames %></td>
                </tr>
                <%} %>
                <%} %>
            </table>
        </div>
    </form>
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
        if (IsPostBack)
        {
            Save();
            Response.Write("<span style='color:red'>保存成功！</span>");
        }
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
    private void Save()
    {
        var dic = TableInfo.Columns.ToDictionary<ColumnInfo, string>(t => (t.TableName + "." + t.ColumnName).TrimEnd('.'));
        foreach (var item in Request.Form)
        {
            string key = item.ToString();
            if (dic.ContainsKey(key))
            {
                dic[key].NewDesText = Server.UrlDecode(Request.Form[key]);
            }
        }

        TableInfo.SaveChange();
    }
</script>
