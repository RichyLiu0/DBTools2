<%@ Page Language="C#" AutoEventWireup="true" %>

<%@ Import Namespace="Ucsmy.Framework.Common" %>
<%@ Import Namespace="Ucsmy.Framework" %>

<%@ Import Namespace="DbModel" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
    <script src="/Scripts/jquery-1.8.2.min.js" type="text/javascript"></script>
    <script src="/Scripts/layer/layer.js" type="text/javascript"></script>
    <script src="/Scripts/common.js" type="text/javascript"></script>
    <script src="/Scripts/JSFormat/jquery-Formatextend.js"></script>
    <script type="text/javascript">

        $(document).ready(function () {
            $("#drpSourceType").trigger("onchange");
        });

        function OnSourceTypeChange(o) {
            if ($(o).val() == "1") {
                $(".ReferTableInfo").hide();
                $(".TableInfo").show();
                $(".SqlInfo").hide();
            }
            else {
                $(".TableInfo").hide();
                $(".SqlInfo").show();
                $(".ReferTableInfo").show();
            }
        }



        function CheckAll(o, type) {
            var isCheck = $(o).attr("checked");
            $("." + type + "").each(function () {
                if (isCheck) {
                    $(this).attr("checked", isCheck);
                }
                else {
                    $(this).removeAttr("checked");
                }
            });
        }


        function GeneralCfg() {
            var data = {};
            data.Name = $("#txtName").val();
            data.DisplayName = $("#txtDisplayName").val();

            var sourceType = parseInt($("#drpSourceType").val());
            data.SourceType = sourceType;
            if (sourceType == 1) {
                data.TableName = $("#txtTable").val();
            }
            else {
                data.Sql = $("#txtSql").val();
            }
            data.cfg = [];
            $(".DataRow").each(function () {
                var row = {};
                row.Name = $(this).find(".Name").html();
                row.DataType = $(this).find(".DataType").html();
                row.DisplayName = $(this).find(".DisplayName").val();
                row.IsAllowNullable = $(this).find(".IsAllowNullable").attr("checked") == "checked" ? true : false;
                row.IsCondition = $(this).find(".IsCondition").attr("checked") == "checked" ? true : false;
                row.IsCol = $(this).find(".IsCol").attr("checked") == "checked" ? true : false;
                data.cfg.push(row);

            });
            $.post("./hander/CfgHander.aspx", { ActionType: 1, Data: JSON.stringify(data) }, function (data) {
                $("#txtCfg").val(data);
            });

            ShowGenderalWindow();
        }

        function ShowGenderalWindow() {

            layer.open({
                type: 1,
                //skin: 'layui-layer-lan',
                title: "代码生成",
                fix: true,
                shadeClose: false,
                maxmin: true,
                area: ['820px', '700px'],
                content: $(".GeneralPage"),
                end: null
            });
        }

        function GeneralHtmlCode() {
            $.post("./hander/CodeGeneralHander.aspx", { cfg: $("#txtCfg").val(), template: $("#drpGeneralTemplate").val() }, function (data) {
                $("#txtGeneral").val(data);
            });
        }

    </script>
</head>
<body>
    <form id="form1" runat="server">
        <div style="margin-bottom: 200px;">
            <table>


                <tr>
                    <td>DB: </td>


                    <td>
                        <select name="dbName">
                            <%foreach (string dbItem in _DBList)
                              {
                                  var isShow = false;
                                  foreach (var fillter in _DBFillter)
                                  {
                                      if (dbItem.Contains(fillter))
                                          isShow = true;
                                  }
                                  if (isShow)
                                  {
                            %>

                            <option <%=dbItem==_DbName? "selected=\"selected\"":""  %> value="<%=dbItem %>"><%=dbItem %></option>

                            <%} %>>
                            <%} %>>
                        </select>
                    </td>



                    <td>数据源类型</td>
                    <td>

                        <select runat="server" id="drpSourceType" name="drpSourceType" onchange="OnSourceTypeChange(this)" style="width: 150px;">

                            <option value="1">表</option>
                            <option value="2">SQl</option>
                        </select>

                    </td>

                </tr>


                <tr class="TableInfo">
                    <td>表名：</td>

                    <td>
                        <input type="text" runat="server" id="txtTable" />

                    </td>
                </tr>
                <tr class="SqlInfo">
                    <td>SQL表达式：</td>

                    <td colspan="3">
                        <textarea id="txtSql" name="txtSql" style="height: 200px; width: 380px"><%=_Sql %></textarea>

                    </td>
                </tr>


                <tr class="ReferTableInfo">

                    <td><span style="font-size: 20px; font-weight: bold; color: blue">字段信息<br />
                        参考表： </span></td>
                    <td>
                        <input type="text" id="txtTables" name="txtTables" runat="server" value="" title="逗号分隔" /></td>
                </tr>
                <tr>

                    <td><span style="font-size: 20px; font-weight: bold; color: blue">名称： </span></td>
                    <td>
                        <input type="text" id="txtName" runat="server" name="txtName" value="Name" /></td>

                    <td><span style="font-size: 20px; font-weight: bold; color: blue">显示名称： </span></td>
                    <td>
                        <input type="text" id="txtDisplayName" runat="server" name="txtDisplayName" value="DisplayName" /></td>
                </tr>
            </table>

            <input id="btnSave" type="submit" value="获取字段信息" onclick="return confirm('是否获取页面信息?当前页面字段信息将丢失.');" />
            &nbsp; &nbsp;
             <input id="btnGeneral" type="button" value="代码生成" onclick="GeneralCfg()" /><br />

            <table>



                <tr style="color: #0094ff; text-align: center;">
                    <td>字段名</td>
                    <td style="text-align: center; width: 150px;">类型</td>
                    <td style="text-align: center; width: 150px;">允许空 
                        <input type="checkbox" onclick="CheckAll(this, 'IsAllowNullable')" /></td>
                    <td>显示名称</td>
                    <td style="text-align: center; width: 150px;">条件 
                        <input type="checkbox" onclick="CheckAll(this, 'IsCondition')" />
                    </td>
                    <td style="text-align: center; width: 150px;">列
                         <input type="checkbox" onclick="CheckAll(this, 'IsCol')" />
                    </td>
                </tr>
                <% 
                    if (_dbFileds != null)
                    {

                        foreach (var p in this._dbFileds)
                        { %>
                <tr class="DataRow">
                    <td class="Name"><%=p.Name %></td>
                    <td class="DataType"><%=p.DataType %></td>
                    <td style="text-align: center;">
                        <input class="IsAllowNullable" value="<%=p.Name %>" type="checkbox"
                            <%=GetReferNullable(p.Name)?"checked=\"checked\"":"" %> />
                    </td>
                    <td>
                        <input type="text" class="DisplayName" value="<%=GetReferDisplayName(p.Name) %>" />
                    </td>

                    <td style="width: 80px; text-align: center">
                        <input class="IsCondition" value="<%=p.Name %>" type="checkbox" /></td>

                    <td style="width: 80px; text-align: center">
                        <input class="IsCol" value="<%=p.Name %>" type="checkbox" /></td>
                </tr>
                <%}
                    }
                %>
            </table>

        </div>

        <div class="GeneralPage" style="display: none">
            <textarea id="txtCfg" style="width: 100%; height: 300px">
            </textarea>

            <input type="button" value="格式化" onclick="$('#txtCfg').format({ method: 'json' })" />
            <input type="button" value="压缩" onclick="$('#txtCfg').format({ method: 'jsonmin' })" />
            <input type="button" value="页面生成" onclick="GeneralHtmlCode()" />
            &nbsp;&nbsp;代码模板：
            <select id="drpGeneralTemplate" runat="server" name="drpGeneralTemplate">
                <option value="ListBySql">基于SQL的列表</option>
                <option value="ListByTable">基于EF的列表（不支持SQL）</option>
                <option value="ListTest">测试模板</option>

            </select>
            <textarea id="txtGeneral" style="width: 100%; height: 300px">
            </textarea>


        </div>
    </form>
</body>
</html>
<script runat="server">
    protected List<DBField> _dbFileds;
    List<string> _DBFillter = new List<string>() { "ST", "TA", "BA", "CTB" };
    protected string _DbName;
    protected List<string> _DBList;


    protected int _sourceType = 1;
    protected string _Sql = "";
    protected string _tableName = "";

    protected List<ColumnInfo> _referCol;

    protected void Page_Load(object sender, EventArgs e)
    {
        try
        {
            var dbcontext = new DbContext("Developer", "");
            _DBList = dbcontext.FindAllDBName();

            if (IsPostBack)
            {
                InitData();
                FillReferColDisplayName();
            }
        }
        catch (Exception ex)
        {
            Response.Write(ex.GetInnerMessage());
        }

    }
    private void InitData()
    {

        _DbName = Request.Form["dbName"];
        _sourceType = Request.Form["drpSourceType"].TryInt(1).Value;
        _Sql = Request.Form["txtSql"];
        _tableName = Request.Form["txtTable"];
        var dbcontext = new DbContext("Developer", _DbName);

        if (InvilidateData() == false) return;

        _dbFileds = GeneralListCfgHelper.GetFieldInfoList(dbcontext, _sourceType, _sourceType == 1 ? _tableName : _Sql);

    }


    private Boolean InvilidateData()
    {
        if (_sourceType == 1 && _tableName.IsNullOrEmpty())
        {

            Response.Write(string.Format("<font color=\"red\">{0}</font>", "表名参数不正确!"));
            return false;
        }
        if (_sourceType == 2 && _Sql.IsNullOrEmpty())
        {

            Response.Write(string.Format("<font color=\"red\">{0}</font>", "SQL表达式不正确!"));
            return false;
        }
        return true;
    }


    private void FillReferColDisplayName()
    {
        var strTables = Request.Form["txtTables"].TryString("");
        if (strTables.IsNullOrEmpty()) return;
        var dbcontext = new DbContext("Developer", _DbName);
        var tableArry = strTables.Split(',');


        _referCol = new List<ColumnInfo>();
        foreach (var ta in tableArry)
        {
            TableDesInfo tableInfo = new TableDesInfo(dbcontext, ta);
            tableInfo.Columns.ForEach(t => _referCol.Add(t));
        }

    }


    protected Boolean GetReferNullable(string strName)
    {
        if (_referCol == null || _referCol.Count <= 0) return false;

        var col = _referCol.Where(t => t.ColumnName == strName).FirstOrDefault();

        if (col == null || col.DesText.IsNullOrEmpty()) return false;

        return col.IsNullable;


    }

    protected string GetReferDisplayName(string strName)
    {
        if (_referCol == null || _referCol.Count <= 0) return strName;

        var col = _referCol.Where(t => t.ColumnName == strName).FirstOrDefault();

        if (col == null || col.DesText.IsNullOrEmpty()) return strName;

        return col.DesText;
    }

</script>
