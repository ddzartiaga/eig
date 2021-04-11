using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Web.Controllers
{
    public class ActivitiesController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public ActivitiesController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View("Activities");
        }

        public IActionResult Details(string id)
        {
            ViewBag.EventId = id;
            return View("ActivityDetails");
        }
    }
}
