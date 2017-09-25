<%@ Page Language="C#" AutoEventWireup="true" Inherits="ST.Manager.PageBase" %>

<%@ Import Namespace="ST.Model" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>$cfg.DisplayName</title>

    <ucs:commonresourse id="CommonResourse1" runat="server" />
    <script language="javascript" type="text/javascript">
        $(function () {
            InitSearch();
        }
        );

        function GoSearch() {
            $("#IsDoQuery").val("1");
            CheckRTip();
            DoQuery();
        }

        function IsShowSumChange(obj) {
            CheckRTip();
            DoQueryByUrl($(obj).attr("href"));
        }
    </script>
</head>
<body>
    <form id="form1" runat="server">
        <div class="inner_2">
            <div class="rightContent">
                <h3 class="bt">$cfg.DisplayName
                </h3>
                <!--搜索-->

                <div class="search">
                    <table>
                        #set($i =0)
                            #foreach($m in $cfg.QueryCfg)

                            #if($i%3==0)
                            <tr>
                                #end
                            <td class="std">$m.DisplayName：
                            </td>
                                <td class="ttd">#if($m.QueryType==5)
                                    <input search="Min$m.Name" type="text" class="searchInput" rtip="最小金额" maxlength="13"
                                        style="width: 100px;" />至
                                <input search="Max$m.Name" type="text" class="searchInput" rtip="最大金额" maxlength="13"
                                    style="width: 100px;" />
                                    #elseif($m.QueryType==6||$m.QueryType==8)
                                    <input search="$m.Name" type="text" class="Wdate" onclick="WdatePicker()"
                                        style="width: 88px">
                                    #elseif($m.QueryType==7||$m.QueryType==9)
                                    <input search="Min$m.Name" type="text" class="Wdate" onclick="WdatePicker()"
                                        style="width: 88px">
                                    至
                                <input search="Max$m.Name" type="text" class="Wdate" onclick="WdatePicker()"
                                    style="width: 88px">
                                    #else
                                <input search="$m.Name" type="text" style="width: 195px;" class="searchInput"
                                    rtip="$m.DisplayName" />
                                </td>
                                #end
                                  #if(($i+1)%3==0)
                            </tr>
                        #end
                         #set($i =$i+1)
                            #end
                               
                           
                            <td>
                                <span>
                                    <input type="hidden" id="IsDoQuery" search="IsDoQuery" />
                                    <input type="button" id="btnSearch" class="searchBtn" value="查询" onclick="GoSearch()" />
                                    <%if (Actions.btnExport)
                                        {%>
                                    <asp:Button ID="btnExport" runat="server" Text="导 出" CssClass="ButtonCss" OnClick="btnExport_Click"
                                        OnClientClick="return confirm('批量导出有数量限制，超出8000条部分请通过筛选条件分批指出，是否继续?');" />
                                    <%} %>
                                </span>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="content">
                    <asp:Repeater ID="rptList" runat="server">
                        <HeaderTemplate>
                            <table class="tableBD">
                                <tbody>

                                    <tr class="btTR" style="text-align: center">
                                        <th width="40">编号</th>
                                        #foreach($m in $cfg.ListCfg)
                                        <th>$m.DisplayName</th>
                                        #end
                                       <th align="center">操作</th>
                                    </tr>
                        </HeaderTemplate>
                        <ItemTemplate>
                            <tr>
                                <td align="center">
                                    <%#(Container.ItemIndex + 1) + (pager.PageIndex - 1) * pager.PageSize%>
                                </td>
                                #foreach($m in $cfg.ListCfg)
                                 
                                #if($m.ListType==2)

                                <td align="right">
                                    <%#Eval("$m.Name","{0:N2}")%>
                                </td>
                                #elseif($m.ListType==3)

                                  <td align="center">
                                      <%#Eval("$m.Name", "{0:yyyy-MM-dd}")%>
                                  </td>
                                #elseif($m.ListType==4)

                                  <td align="center">
                                      <%#Eval("$m.Name", "{0:yyyy-MM-dd HH:mm:ss}")%>
                                  </td>
                                #else 

                                        <td align="left">
                                            <%#Eval("$m.Name")%>
                                        </td>
                                #end
                                #end
                              

                                <td>
                                    <a class="aico" href="javascript:void(0)" onclick="ShowWin('<%=ViewUrl%>?$PrimaryKey=<%# Eval("$PrimaryKey") %>',null,null,'$m.DisplayName明细详情')">
                                        <span>查看详情</span>
                                    </a>
                                </td>

                            </tr>
                        </ItemTemplate>
                        <FooterTemplate>
                            <tr>
                                <td style="color: red">
                                    <b>合计</b>
                                </td>
                                #foreach($m in $cfg.ListCfg)
                                 <td align="right">#if($m.IsSum)
                                     <%=SumPage${m.Name}.ToString("N2")%>
                                     #end
                                 </td>

                                #end
                                <td></td>
                            </tr>
                            <% if ("IsShowSum".ValueOfQuery("false").TryBoolean().GetValueOrDefault(false))
                                { %>

                            <tr>
                                <td style="color: red">
                                    <b>总计</b>
                                </td>
                                #foreach($m in $cfg.ListCfg)
                                 <td align="right">#if($m.IsSum)
                                     <%=SumTotal${m.Name}.ToString("N2")%>
                                     #end
                                 </td>
                                #end
                                  <td></td>
                            </tr>
                            <% } %>
                            </tbody> </table>
                        </FooterTemplate>
                    </asp:Repeater>
                </div>
                <!--分页-->
                <div class="pagination" style="padding-top: -10px; margin-top: -5px;">
                    <div class="btnBox" style="float: left;">
                        <div class="cz_btn">
                            <span class="search">
                                <input type="checkbox" search="IsShowSum" id="ckbShowSum" onclick="IsShowSumChange(this)"
                                    href="<%=ListUrl%>?page=<%=pager.PageIndex%>" />
                                <label for="ckbShowSum">
                                    显示总计
                                </label>
                            </span>
                        </div>
                    </div>
                    <div style="padding-top: 10px;">
                        <ucs:urlpager id="pager" runat="server" pagesize="10" />
                    </div>
                </div>
                <!--分页结束-->
            </div>
        </div>
    </form>
</body>
</html>
<script runat="server">

    private static class Actions
    {
        private static string _url = "/$TableInfo.TableName/Detail.aspx";

        public static bool btnExport
        {
            get { 
              //需要做权限验证是开放
            //return UCSBizContext.Current.HasPermission(_url, "btnExport"); 
                return true;
            }
               
        }
    }
    bool IsDoQuery { get { return "IsDoQuery".ValueOfQuery() == "1"; } }
    string ListUrl { get { return this.Page.Request.Url.AbsolutePath; } }
    string ViewUrl { get { return "./view.aspx"; } }


///统计汇总金额变量定义
#foreach($m in $cfg.ListCfg)
#if($m.IsSum)
     protected decimal SumTotal$m.Name { get; set; }
      protected decimal SumPage$m.Name { get; set; }
#end
#end

    protected void Page_Load(object sender, EventArgs e)
    {
        if (IsDoQuery)
        {
            BindRptList();
        }
    }

    private void BindRptList()
    {
        var pagerResponse = GetList(false);
        rptList.DataSource = pagerResponse.ResultList;
        rptList.DataBind();
        pager.RecordCount = pagerResponse.TotalCount;

    }

    protected PagerResponse<$cfg.DBCfg.TableName> GetList(bool isExport)
    {
        int pageSize = isExport ? 8000 : pager.PageSize;
        int pageIndex = isExport ? 0 : "page".ValueOfQuery().TryInt().GetValueOrDefault(1) - 1;
        var query = new DynamicPageRequest<$cfg.DBCfg.TableName>()
        {
            PageIndex = pageIndex,
            PageSize = pageSize,
            OrderBy = t => t.OrderByDescending(tt => tt.$PrimaryKey)
        };
        
#foreach($m in $cfg.QueryCfg)
       /*
       $m.DisplayName
       */
 #if($m.QueryType==0)
        
      var $m.Name = "$m.Name".ValueOfQuery("").TryInt(0).Value;
        if ($m.Name != 0)
        {
            query.AddFilter(t => t.$m.Name==$m.Name);
        }  
#elseif($m.QueryType==1)
        
        var  min$m.Name= "min$m.Name".ValueOfQuery().TryInt().GetValueOrDefault(0);
        if (min$m.Name != 0)
        {
            query.AddFilter(t => t.$m.Name >= min$m.Name );
        }
        var max$m.Name = "max$m.Name".ValueOfQuery().TryInt().GetValueOrDefault(0);
     
        if (max$m.Name != 0)
        {
            query.AddFilter(t => t.$m.Name <= max$m.Name);
        }
#elseif($m.QueryType==2)
        var $m.Name = "$m.Name".ValueOfQuery("");
        if ($m.Name != "")
        {
            query.AddFilter(t => t.$m.Name==$m.Name);
        }     
#elseif($m.QueryType==3)
        var $m.Name = "$m.Name".ValueOfQuery("");
        if ($m.Name != "")
        {
            query.AddFilter(t => t.$m.Name.Contains($m.Name));
        }
#elseif($m.QueryType==4)
        var $m.Name = "$m.Name".ValueOfQuery().TryDecimal().GetValueOrDefault(0);
        if ($m.Name != "")
        {
            query.AddFilter(t => t.$m.Name==$m.Name);
        }                                     
#elseif($m.QueryType==5)
        
        var  min$m.Name= "min$m.Name".ValueOfQuery().TryDecimal().GetValueOrDefault(0);
        if (min$m.Name != 0)
        {
            query.AddFilter(t => t.$m.Name >= min$m.Name );
        }
        var max$m.Name = "max$m.Name".ValueOfQuery().TryDecimal().GetValueOrDefault(0);
     
        if (max$m.Name != 0)
        {
            query.AddFilter(t => t.$m.Name <= max$m.Name);
        }
#elseif($m.QueryType==6 ||$m.QueryType==8)
        var $m.Name= "$m.Name".ValueOfQuery();
        if ($m.Name != "")
        {
            var d=$m.Name.TryDateTime().Value;
            query.AddFilter(t => t.$m.Name==d);
        }            
#elseif($m.QueryType==7 ||$m.QueryType==9)
         var ${m.Name}Range = DateRange.GetValidatedRange("Min$m.Name".ValueOfQuery(""),
            "Max$m.Name".ValueOfQuery(""));
        if (${m.Name}Range != null)
        {
            query.AddFilter(t => t. ${m.Name} >= ${m.Name}Range.Begin.Value && t. ${m.Name} <= ${m.Name}Range.End.Value);
        }
#end
#end        
     
        
///统计汇总金额
        var response = CTBConn.QueryService.ST.PageList(query);
#foreach($m in $ColList)
#if($m.ColumnType=="decimal")
        SumTotal$m.ColumnName  = CTBConn.QueryService.ST.SumDecimal(query.WhereFilters, t => t.$m.ColumnName);
        SumPage$m.ColumnName = response.ResultList.Sum(c => c.$m.ColumnName);
#end
#end
      
       
       
      
        return response;
    }

    protected void btnExport_Click(object sender, EventArgs e)
    {
        var projectData = GetList(true);
        AppLibrary.WriteExcel.XlsDocument doc = new AppLibrary.WriteExcel.XlsDocument();
        if (Context.Request.UserAgent != null)
        {
            string browser = Context.Request.UserAgent.ToUpper();
            string fileName = "$TableInfo.TableName";
            if (!browser.Contains("FIREFOX") &&
                !browser.Contains("SAFARI"))
            {
                fileName = HttpUtility.UrlEncode(fileName);
            }

            doc.FileName = fileName + DateTime.Now.Date.ToString("yyyyMMdd") + ".xls";
        }
        string SheetNameInvest = "cfg.DisplayName";
        AppLibrary.WriteExcel.Worksheet sheetInvest = doc.Workbook.Worksheets.Add(SheetNameInvest);
        AppLibrary.WriteExcel.Cells cellsInvest = sheetInvest.Cells;
        cellsInvest.Add(1, 1, "编号");
        
 
        
        #set($i =1)

        #foreach($m in $cfg.ListCfg)
         #set($i =$i+1)
                cellsInvest.Add(1, $i, "$m.DisplayName");
        #end
        
        int t = 1;
        foreach (var item in projectData.ResultList)
        {
            t++;
            cellsInvest.Add(t, 1, t - 1);
        #set($i =1)
        #foreach($m in  $cfg.ListCfg)
        #set($i =$i+1)
        #if($m.ListType==2)
            if(item.${m.Name}!=null)
            cellsInvest.Add(t, $i, ((Decimal)item.${m.Name}).ToString("N2"));    
            #elseif($m.ListType==3)
        if(item.${m.Name}!=null)
            cellsInvest.Add(t, $i, ((Date)item.${m.Name}).ToString("yyyy-MM-dd"));    
        #elseif($m.ListType==4)
            if(item.${m.Name}!=null)
            cellsInvest.Add(t, $i, ((DateTime)item.${m.Name}).ToString("yyyy-MM-dd HH:mm:ss"));    
        #else 
            if(item.${m.Name}!=null)
            cellsInvest.Add(t, $i, item.${m.Name});                     
        #end
        #end
      
        }
      
        doc.Send();
        Response.Flush();
        Response.End();
    }
</script>
