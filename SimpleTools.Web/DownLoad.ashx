<%@ WebHandler Language="C#" Class="BAFileUploadActionHandler" %>
//using DbModel;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Web;
///// <summary>
///// DownLoad 的摘要说明
///// </summary>
//public class DownLoad : IHttpHandler
//{

//    public void ProcessRequest(HttpContext context)
//    {
//        context.Response.ContentType = "application/x-zip-compressed";

//        var ServerName = context.Request.QueryString["serverName"];
//        var DbName = context.Request.QueryString["dbName"];
//        var TableName = context.Request.QueryString["tbName"];

//        if (string.IsNullOrWhiteSpace(ServerName) || string.IsNullOrWhiteSpace(DbName))
//        {
//            throw new Exception("参数不正确!");
//        }

//        var FileName = DbName + "_";
//        if (!string.IsNullOrWhiteSpace(TableName))
//            FileName += TableName + "_";

//        context.Response.AddHeader("Content-Disposition", "attachment;filename=" + FileName + "Descition_" + DateTime.Now.ToString("yyyyMMddHHmmssSSS") + ".sql");


//        var dbcontext = new DbContext(ServerName, DbName);
//        var tableInfo = dbcontext.FindTableInfo(TableName);
//        context.Response.Write(tableInfo.GetToSql());
//        context.Response.End();
//    }

//    public bool IsReusable
//    {
//        get
//        {
//            return false;
//        }
//    }
//}
