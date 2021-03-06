﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Web.Controllers
{
    public class GroupsController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public GroupsController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View("Groups");
        }

        public IActionResult Details(string id)
        {
            ViewBag.GroupId = id;
            return View("GroupDetails");
        }
    }
}
