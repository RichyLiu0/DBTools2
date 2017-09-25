using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GeneralModel
{
    public class EnumType
    {

        public enum DataSourceType
        {
            Table = 1,
            SqlExpress = 2
        }


        public enum QueryType
        {
            Int = 0,
            IntRange = 1,
            String = 2,
            StringLike = 3,
            Decimal = 4,
            DecimalRange = 5,
            Date = 6,
            DateRange = 7,
            DateTime = 8,
            DateTimeRange = 9

        }
        public enum ListType
        {
            Int = 0,
            String = 1,
            Decimal = 2,
            Date = 3,
            DateTime = 4,
        }
    }
}
