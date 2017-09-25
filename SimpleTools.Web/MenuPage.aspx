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
            <ul>
                <li>

                    <asp:DropDownList ID="ddlServerName" runat="server" OnSelectedIndexChanged="ddlServerName_SelectedIndexChanged" AutoPostBack="True">
                    </asp:DropDownList>
                    <asp:DropDownList ID="ddlDbName" runat="server" AutoPostBack="True" OnSelectedIndexChanged="ddlDbName_SelectedIndexChanged">
                    </asp:DropDownList>
                    <%-- <% if(!string.IsNullOrWhiteSpace(DbName)){ %>
                    <a target="Center" href="EditPage.aspx?serverName=<%=ServerName %>&dbName=<%=DbName %>">编辑所有</a>
                    <%} %>--%>
                </li>
                <li><span>库名</span>
                    <asp:TextBox ID="txtDbName" runat="server"></asp:TextBox>
                </li>
                <li><span>表名</span>
                    <asp:TextBox ID="txtKeyWord" runat="server"></asp:TextBox>
                    <asp:Button ID="btnSearceh" runat="server" Text="搜索" OnClick="btnSearceh_Click" />
                </li>
            </ul>
            <div style="margin-left:20px;">
                <%   if (TableList != null)
                     {
                         foreach (var table in TableList.OrderBy(s => s.Name))
                         { %>


                <table>
                    <tr>
                        <td style="min-width:200px"><a target="Center" href="EditPage.aspx?serverName=<%=ServerName %>&dbName=<%=DbName %>&tbName=<%=table.Name %>"><%=table.Name %></a></td>
                        <td><span style="color: #0b4503; font-size:12px"><%=table.DescText %></span></td>
                    </tr>
                </table>

                <%}
                 } %>
            </div>
        </div>
    </form>
</body>
</html>
<script runat="server">
        public List<TableInfo> TableList;
        public string DbName;
        public string ServerName;

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                InitData();
            }
        }

        private void InitData()
        {
            var serverNames = new List<string>();
            serverNames.Add("");
            foreach (ConnectionStringSettings item in ConfigurationManager.ConnectionStrings)
            {
                if (item.Name != "LocalSqlServer")
                {
                    serverNames.Add(item.Name);
                }
            }
            ddlServerName.DataSource = serverNames;
            ddlServerName.DataBind();

            //var sql ="SELECT Name FROM Master..SysDatabases ORDER BY Name";
        }



        protected void btnSearceh_Click(object sender, EventArgs e)
        {
            BindData();
        }

        protected void ddlServerName_SelectedIndexChanged(object sender, EventArgs e)
        {
            DbName = ddlServerName.SelectedValue;
            if (string.IsNullOrWhiteSpace(DbName))
            {
                return;
            }
            var dbcontext = new DbContext(DbName);
            this.ddlDbName.DataSource = dbcontext.FindAllDBName();
            this.ddlDbName.DataBind();
        }

        protected void ddlDbName_SelectedIndexChanged(object sender, EventArgs e)
        {
            this.txtDbName.Text = this.ddlDbName.SelectedValue;
            BindData();
        }

        private void BindData()
        {
            try
            {

                ServerName = ddlServerName.SelectedValue;
                DbName = this.txtDbName.Text;
                if (string.IsNullOrWhiteSpace(ServerName) || string.IsNullOrWhiteSpace(DbName))
                {
                    return;
                }

                var keyWord = txtKeyWord.Text;
                var dbcontext = new DbContext(ServerName, DbName);
                TableList = dbcontext.FindTableName(keyWord);
            }
            catch
            { }
        }


        

</script>