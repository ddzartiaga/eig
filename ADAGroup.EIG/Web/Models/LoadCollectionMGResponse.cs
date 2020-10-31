using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Models
{
    public class LoadCollectionMGResponse
    {
        public List<object> Items { get; set; }

        public string Bookmark { get; set; }

        public string Success { get; set; }

        public string Message { get; set; }
    }
}
