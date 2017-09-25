<%@ Page Language="C#" AutoEventWireup="true" %>

<%@ Import Namespace="NVelocity" %>
<%@ Import Namespace="NVelocity.Runtime" %>
<%@ Import Namespace="NVelocity.App" %>
<%@ Import Namespace="Ucsmy.Framework.Common" %>
<%@ Import Namespace="Ucsmy.Framework" %>

<script runat="server">
   

    protected void Page_Load(object sender, EventArgs e)
    {
        GeneralResponse();
    }
    private void GeneralResponse()
    {

        try
        {
            var cfg = Request.Form["cfg"].ToString().ToObject<GeneralListCfg>();

            var temple = Request.Form["template"].TryString("ListBySql");
            VelocityEngine vltEngine = new VelocityEngine();
            vltEngine.SetProperty(RuntimeConstants.RESOURCE_LOADER, "file");
            vltEngine.SetProperty(RuntimeConstants.FILE_RESOURCE_LOADER_PATH, System.Web.Hosting.HostingEnvironment.MapPath("~/PageGeneralTools/Templates"));
            //模板文件所在的文件夹，例如我的模板为templates文件夹下的TestNV.html  
            vltEngine.Init();

            VelocityContext vltContext = new VelocityContext();
            vltContext.Put("cfg", cfg);
            var  PrimaryKey=cfg.DBCfg.FieldList.Where(t => t.IsPrimaryKey).FirstOrDefault();
            if(PrimaryKey!=null)
            vltContext.Put("PrimaryKey", PrimaryKey.Name);

            Template vltTemplate = vltEngine.GetTemplate("{0}.aspx".FormatWith(temple));//设定模板  
            System.IO.StringWriter vltWriter = new System.IO.StringWriter();
            vltTemplate.Merge(vltContext, vltWriter);

            string html = vltWriter.GetStringBuilder().ToString();

            Response.Write(html);
           // Response.Write(cfg.ToJson());
        }
        catch (Exception ex)
        {
            Response.Write(ex.Message);
           
        }

    }

    
    
</script>
