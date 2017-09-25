<%@ Page Language="C#" AutoEventWireup="true" %>

<%@ Import Namespace="NVelocity" %>
<%@ Import Namespace="NVelocity.Runtime" %>
<%@ Import Namespace="Ucsmy.Framework" %>
<%@ Import Namespace="Ucsmy.Framework.Common" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <script src="../../Scripts/jquery-1.8.2.min.js"></script>
    <script src="../../Scripts/JSFormat/jquery-Formatextend.js"></script>
    <script type="text/javascript">

        function GeneralHtmlCode() {
            $.post("./hander/CodeGeneralHander.aspx", { cfg: $("#txtCfg").val(), template: $("#drpGeneralTemplate").val() }, function (data) {
                $("#txtGeneral").val(data);
            });
        }


    </script>
    <title></title>

</head>
<body>
    <form id="form1" runat="server">
        <div class="GeneralPage">
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

     
    protected void Page_Load(object sender, EventArgs e)
    {
        InitData();
    }
    private void InitData()
    {


    }

   
    
</script>
