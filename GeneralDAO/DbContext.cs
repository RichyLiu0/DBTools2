using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Data.SqlClient;
using GeneralModel;
namespace GeneralDAO
{
    public class DbContext
    {
        private string _ConnString;

        public DbContext()
        {
            string strDb = "";
           
                strDb = "Initial Catalog=" + "ST";
                _ConnString = System.Configuration.ConfigurationManager.ConnectionStrings["Developer"].ConnectionString + strDb;
        }
        public DbContext(string DbName = "")
        {
            string strDb = "";
            if (!string.IsNullOrWhiteSpace(DbName))
                strDb = "Initial Catalog=" + DbName;
            _ConnString = System.Configuration.ConfigurationManager.ConnectionStrings["Developer"].ConnectionString + strDb;
        }

        public DataTable Query(string sql)
        {
            var sda = new SqlDataAdapter(sql, _ConnString);
            var ds = new DataSet();
            sda.Fill(ds);
            return ds.Tables[0];
        }
        public int ExecuteNonQuery(string sql)
        {
            using (var conn = new SqlConnection(_ConnString))
            {
                conn.Open();
                var cmd = new SqlCommand(sql, conn);
                return cmd.ExecuteNonQuery();
            }
        }
    }
}
