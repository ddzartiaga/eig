using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RestSharp;
using Web.Models;
using Web.Services;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Web.Controllers.API
{
    [Route("api/[controller]")]
    [ApiController]
    public class MongooseController : ControllerBase
    {
        IHttpService _httpService;

        public MongooseController(IHttpService httpService)
        {
            _httpService = httpService;
        }

        [HttpGet]
        [Route("Test")]
        public IActionResult Test()
        {
            return Ok("It works!");
        }

        [HttpGet]
        [Route("LoadCollection/{ido}")]
        public IActionResult LoadCollection(string ido)
        {
            var qs = ControllerContext.HttpContext.Request.QueryString;
            var url = string.Format("load/{0}{1}", ido, qs);

            try
            {
                var jresp = JsonConvert.DeserializeObject<LoadCollectionMGResponse>(_httpService.SendGetRequest(url));

                if (!bool.Parse(jresp.Success))
                    throw new Exception(jresp.Message);

                return Ok(jresp);
            }
            catch(Exception ex)
            {
                return StatusCode(500, new { message = ex.Message.ToString() });
            }
        }

    }
}
