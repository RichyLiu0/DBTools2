<%@ Page Language="C#" AutoEventWireup="true" Inherits="ST.Manager.PageBase" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>$cfg.DisplayName</title>
    <ucs:commonresourse id="CommonResourse1" runat="server" />
    <script type="text/javascript">
        $(function () {
            InitSearch();
            InitListOrderBy();
        });
    </script>
</head>
<body>
    <div class="inner_2">
        <div class="rightContent">
            <h3 class="bt">$cfg.DisplayName
            </h3>
            <!--搜索-->
            <div class="search">
                <!--搜索-->
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
                                    <input type="button" id="btnSearch" class="searchBtn" value="查询" onclick="DoSearch(1)" />

                                    <input type="button" value="导 出" onclick="if (confirm('批量导出有数量限制，超出8000条部分请通过筛选条件分批指出，是否继续?')) { DoSearch(11); }" class="ButtonCss" />
                                </span>
                            </td>
                    </tr>
                </table>
            </div>
            <!--搜索结束-->
            <!--功能按钮-->
            <div class="btnBox">
                <div class="cz_btn">
                    <span class="search">
                        <input type="checkbox" search="IsShowSum" id="ckbShowSum" onclick="DoSearch(3, this)"
                            href="/ChannelAssetManager/OrderHoldList.aspx?page=<%=pager.PageIndex%>" />
                        <label for="ckbShowSum">
                            显示总计</label>
                    </span>
                </div>
            </div>
            <!--功能按钮结束-->
            <div class="content" style="overflow-y: hidden">
                <%if (vm.IsDoQuery == false)
                  { %>
                <div style="color: Red; text-align: center; font-size: 18px; font-weight: bold">
                    请筛选条件进行查询
                </div>
                <%}
                  else
                  { %>
                <table border="0" cellpadding="0" cellspacing="0" class="tableBD" 
                    #if($cfg.FreezeColIndex>0) fixtable="column:${cfg.FreezeColIndex}"
                    #end
                    >
                    <tbody>
                        <tr class="btTR" style="text-align: center">
                            <th width="40">编号</th>
                            #foreach($m in $cfg.ListCfg)
                                        <th  #if($m.IsSort) listorderby="${m.Name}"#end>$m.DisplayName</th>
                            #end
                                       <th align="center">操作</th>
                        </tr>
                        <%for(int i=0;i<vm.List.Count();i++){  
                                var item=vm.List[i];
                        %>
                        <tr>
                            <td align="center">
                                <%=(i + 1) + (pager.PageIndex - 1) * pager.PageSize%>
                            </td>
                            #foreach($m in $cfg.ListCfg)
                                 
                                #if($m.ListType==2)

                                <td align="right">
                                    <%=item.${m.Name}.ToString("N2")%>
                                </td>
                            #elseif($m.ListType==3)

                                  <td align="center">
                                      <%=item.${m.Name}.TryDateTime().Value.ToString("yyyy-MM-dd")%>
                                  </td>
                            #elseif($m.ListType==4)

                                  <td align="center">
                                      <%=item.${m.Name}.TryDateTime().Value.ToString("yyyy-MM-dd HH:mm:ss")%>
                                  </td>
                            #else 

                                        <td align="left">
                                            <%=item.${m.Name}%>
                                        </td>
                            #end
                                #end
                              

                                <td>
                                    <a class="aico" href="javascript:void(0)" onclick="ShowWin('?id=id,null,null,'${m.DisplayName}明细详情')">
                                        <span>查看详情</span>
                                    </a>
                                </td>

                        </tr>
                        <%} %>


                        <tr>
                            <td style="color: red">
                                <b>合计</b>
                            </td>
                            #foreach($m in $cfg.ListCfg)
                                 <td align="right">#if($m.IsSum)
                                     <%=vm.Sum_Page.Sum${m.Name}.ToString("N2")%>
                                     #end
                                 </td>

                            #end
                                <td></td>
                        </tr>
                        <%if (vm.IsSum)
                          {%>

                        <tr>
                            <td style="color: red">
                                <b>总计</b>
                            </td>
                            #foreach($m in $cfg.ListCfg)
                                 <td align="right">#if($m.IsSum)
                                     <%=vm.Sum.Sum${m.Name}.ToString("N2")%>
                                     #end
                                 </td>
                            #end
                                  <td></td>
                        </tr>
                        <%} %>
                    </tbody>
                </table>
                <%} %>
            </div>
            <div class="pagination">
                <ucs:urlpager id="pager" runat="server" pagesize="10" />
            </div>
        </div>
    </div>
</body>
</html>
<script runat="server">    
        public class VModel
        {
            public bool IsDoQuery { get { return "IsDoQuery".ValueOfQuery() == "1"; } }
            public bool IsExport { get { return "IsExport".ValueOfQuery() == "1"; } }
            public bool IsSum { get { return "IsShowSum".ValueOfQuery("false").TryBoolean().Value; } }
            public IList<iListItem> List = new List<iListItem>();
            public int ListTotalCount = 0;
            public iSum Sum = new iSum();
            public iSum Sum_Page = new iSum();

            #region 内部类
            public class iListItem
            {
                public Int64 Rn { get; set; }
                public Int64 TotalCount { get; set; }

# foreach($m in $cfg.DBCfg.FieldList)
#if ($m.DataType=="datetime")
             public DateTime $m.Name { get; set; }
#else
                public $m.DataType $m.Name { get; set; }
# end
# end
        }
        public class iSum
        {
            #foreach($m in $cfg.ListCfg)
            #if($m.IsSum)
               public decimal Sum${m.Name} { get; set; }
            #end

            #end
        }
        #endregion
    }
    VModel vm = new VModel();
    protected void Page_Load(object sender, EventArgs e)
    {
        if (vm.IsDoQuery)
        {
            if (vm.IsExport)
                DoExport();
            else
                BindData();
        }
    }
    protected void BindData()
    {
        var response = GetPageResult(pager.PageIndex - 1, pager.PageSize);
        vm.List = response.ResultList;
        vm.ListTotalCount = response.TotalCount;
        pager.RecordCount = response.TotalCount;//pager赋值

        if (response.ResultList.HasAny())
        {
            foreach (var item in response.ResultList)
            {
                #foreach($m in $cfg.ListCfg)
            #if($m.IsSum)
                  
                 vm.Sum_Page.Sum$m.Name+=item.$m.Name; 
            #end
            #end    
            }
        }

    }
    protected PagerResponse<VModel.iListItem> GetPageResult(int pageIndex, int pageSize)
    {
        var orderByStr = "ORDER BY CreateTime DESC";
        var qOrderBy = "orderby".ValueOfQuery();
        var qDirect = "direct".ValueOfQuery();
        if (qOrderBy.NotNullOrWhiteSpace())
        {
            orderByStr = "ORDER BY {0} {1}".FormatWith(qOrderBy, qDirect);
        }
#if($cfg.DBCfg.SourceType==1)
        
        var sql = @"select * from ${cfg.DBCfg.TableName}";
#else 
         var sql = @"${cfg.DBCfg.SQL}";

#end 

        var cmd = new UcsSqlCmd()
        {
            TSql = @"select *, ROW_NUMBER() OVER ( {0} ) Rn from 
                    (select * from ({1}) t)
                    as t  where 1=1 ".FormatWith(orderByStr, sql),
            TParam = new UcsParameters()
        }.P("PageIndex", pageIndex).P("PageSize", pageSize);

        Filter(cmd);

        var pagingList = CTBConn.QueryService.ST.DSqlQuery<VModel.iListItem>(
            cmd.TSql.WrapperToPaging(), cmd.TParam.ToDynamicParameters());

        var response = pagingList.ToPagerResponse();
        if (response.TotalCount > 0)
        {
            if (vm.IsSum)
            {
                var tsql_Sum = @"
                                ;with SumCTE as(
                                --------------------
                                {0}
                                --------------------
                                )
                                SELECT
                                ISNULL(SUM(HoldAmout), 0) SumHoldAmount ,
                                ISNULL(SUM(InterestAmount), 0) SumInterestAmount ,
                                ISNULL(SUM(YMInterestAmount), 0) SumYMAmount
          #foreach($m in $cfg.ListCfg)
                                #if($m.IsSum)
                                ISNULL(SUM($m.Name), 0) Sum$m.Name ,
                                #end
                                #end    
                                0 as Total0
                                from SumCTE
                                ".FormatWith(cmd.TSql);

                vm.Sum = CTBConn.QueryService.ST.DSqlSingleQuery<VModel.iSum>(tsql_Sum, cmd.TParam.ToDynamicParameters());
            }
        }
        return response;
    }
  
        
     void Filter(UcsSqlCmd cmd)
    {
        
        #foreach($m in $cfg.QueryCfg)
       /*
       $m.DisplayName
       */
 #if($m.QueryType==0)
        
      var $m.Name = "$m.Name".ValueOfQuery("").TryInt(0).Value;
        if ($m.Name != 0)
        {
            
            cmd.F(" AND $m.Name = @$m.Name").P("$m.Name", $m.Name);
        }  
#elseif($m.QueryType==1)
        
        var  min$m.Name= "min$m.Name".ValueOfQuery().TryInt().GetValueOrDefault(0);
        if (min$m.Name != 0)
        {
            cmd.F(" AND $m.Name >= @min$m.Name").P("min$m.Name", min$m.Name);
        }
        var max$m.Name = "max$m.Name".ValueOfQuery().TryInt().GetValueOrDefault(0);
     
        if (max$m.Name != 0)
        {
            cmd.F(" AND $m.Name <= @max$m.Name").P("max$m.Name", max$m.Name);
        }
#elseif($m.QueryType==2)
        var $m.Name = "$m.Name".ValueOfQuery("");
        if ($m.Name != "")
        {
           cmd.F(" AND $m.Name =@$m.Name").P("$m.Name",$m.Name);
        }     
#elseif($m.QueryType==3)
        var $m.Name = "$m.Name".ValueOfQuery("");
        if ($m.Name != "")
        { 
           cmd.F(" AND $m.Name like @$m.Name").P("$m.Name",$m.Name);
        }
#elseif($m.QueryType==4)
        var $m.Name = "$m.Name".ValueOfQuery().TryDecimal().GetValueOrDefault(0);
        if ("$m.Name".ValueOfQuery() != "")
        {
            cmd.F(" AND $m.Name =@$m.Name").P("$m.Name",$m.Name);
        }                                     
#elseif($m.QueryType==5)
        
        var  min$m.Name= "min$m.Name".ValueOfQuery().TryDecimal().GetValueOrDefault(0);
        if (min$m.Name != 0)
        {
             cmd.F(" AND $m.Name >=@min$m.Name").P("min$m.Name",min$m.Name);
        }
        var max$m.Name = "max$m.Name".ValueOfQuery().TryDecimal().GetValueOrDefault(0);
        if (max$m.Name != 0)
        {
        cmd.F(" AND $m.Name <=@max$m.Name").P("max$m.Name",max$m.Name);
        }
#elseif($m.QueryType==6 ||$m.QueryType==8)
        var $m.Name= "$m.Name".ValueOfQuery();
        if ($m.Name != "")
        {
            var d=$m.Name.TryDateTime().Value;
        }            
#elseif($m.QueryType==7 ||$m.QueryType==9)
         var ${m.Name}Range = DateRange.GetValidatedRange("Min$m.Name".ValueOfQuery(""),"Max$m.Name".ValueOfQuery(""));
        if (${m.Name}Range != null)
        {
               cmd.F(" and ${m.Name} between @${m.Name}Begin and @${m.Name}End ")
                .P("${m.Name}Begin", ${m.Name}Range.Begin.Value)
                .P("${m.Name}End", ${m.Name}Range.End.Value);
        }
#end
#end     
    }    

        
    #region 导出
    protected void DoExport()
    {
        var projectData = GetPageResult(0, 8000);
        AppLibrary.WriteExcel.XlsDocument doc = new AppLibrary.WriteExcel.XlsDocument();
        if (Context.Request.UserAgent != null)
        {
            string browser = Context.Request.UserAgent.ToUpper();
            string fileName = "$cfg.DisplayName";
            if (!browser.Contains("FIREFOX") &&
                !browser.Contains("SAFARI"))
            {
                fileName = HttpUtility.UrlEncode(fileName);
            }

            doc.FileName = fileName + DateTime.Now.Date.ToString("yyyyMMdd") + ".xls";
        }
        string SheetNameInvest = "$cfg.DisplayName";
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
    #endregion
</script>
