<%@ Page Language="C#" AutoEventWireup="true" %>

<%@ Import Namespace="NVelocity" %>
<%@ Import Namespace="NVelocity.Runtime" %>
<%@ Import Namespace="NVelocity.App" %>
<%@ Import Namespace="Ucsmy.Framework.Common" %>
<%@ Import Namespace="Ucsmy.Framework" %>

<script runat="server">
   

    protected void Page_Load(object sender, EventArgs e)
    {
        ResponseData();
    }
    private void ResponseData()
    {


        var actionType = Request.Form["ActionType"].TryInt(0);

        if (actionType == (int)ActionType.GetListCfg)
        {
            ResponseLigCfg();
        }


    }

    public void ResponseLigCfg()
    {
        try
        {
            var data = Request.Form["Data"].ToString().ToObject<ListUICfg>();
            var cfg = GeneralListCfgHelper.Create(data);
            Response.Write(cfg.ToJson());
           // Response.Write(Request.Form["Data"].ToString());
        }
        catch (Exception ex)
        {
            Response.Write(ex.Message);

        }
    }



    public enum ActionType
    {
        GetListCfg = 1,
    }



   

    
    
</script>
