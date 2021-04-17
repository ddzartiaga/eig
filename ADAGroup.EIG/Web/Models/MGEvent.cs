using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Models
{
    public class MGEvent
    {
        public string ScheduledEventId { get; set; }

        public string GroupId { get; set; }

        public string Name { get; set; }

        public string Banner { get; set; }

        public string StartDate { get; set; }

        public string EndDate { get; set; }

        public string Venue { get; set; }
    }
}
