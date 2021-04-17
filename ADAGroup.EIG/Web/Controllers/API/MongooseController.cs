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

        [HttpGet]
        [Route("LoadUpcomingEvents/{ido}")]
        public IActionResult LoadUpcomingEvents(string ido)
        {
            var qs = ControllerContext.HttpContext.Request.QueryString;
            var url = string.Format("load/{0}{1}", ido, qs);

            try
            {
                var jresp = JsonConvert.DeserializeObject<LoadCollectionMGResponse>(_httpService.SendGetRequest(url));

                if (!bool.Parse(jresp.Success))
                    throw new Exception(jresp.Message);

                List<object> list = new List<object>();
                List<MGEvent> evts = new List<MGEvent>();

                foreach (var evt in jresp.Items)
                {
                    MGEvent e = (evt as JObject).ToObject<MGEvent>();

                    //"20210101 00:00:00.000"
                    var startDate = ParseDateTime(e.StartDate);
                    var endDate = e.EndDate == null ? ParseDateTime(e.StartDate) : ParseDateTime(e.EndDate);

                    if(startDate.Date > DateTime.Now.Date)
                    {
                        evts.Add(e);
                    }
                }

                evts.OrderBy(evts => evts.StartDate).ToList().ForEach(v => list.Add(v));
                jresp.Items = list;

                return Ok(jresp);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message.ToString() });
            }
        }

        [HttpGet]
        [Route("LoadPastEvents/{ido}")]
        public IActionResult LoadPastEvents(string ido)
        {
            var qs = ControllerContext.HttpContext.Request.QueryString;
            var url = string.Format("load/{0}{1}", ido, qs);

            try
            {
                var jresp = JsonConvert.DeserializeObject<LoadCollectionMGResponse>(_httpService.SendGetRequest(url));

                if (!bool.Parse(jresp.Success))
                    throw new Exception(jresp.Message);

                List<object> list = new List<object>();
                List<MGEvent> evts = new List<MGEvent>();
                foreach (var evt in jresp.Items)
                {
                    MGEvent e = (evt as JObject).ToObject<MGEvent>();

                    //"20210101 00:00:00.000"
                    var startDate = ParseDateTime(e.StartDate);
                    var endDate = e.EndDate == null ? ParseDateTime(e.StartDate) : ParseDateTime(e.EndDate);

                    if (startDate.Date < DateTime.Now.Date)
                    {
                        evts.Add(e);
                    }
                }

                evts.OrderByDescending(evts => evts.StartDate).ToList().ForEach(v => list.Add(v));
                jresp.Items = list;

                return Ok(jresp);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message.ToString() });
            }
        }

        [HttpGet]
        [Route("LoadMonthEvents/{ido}")]
        public IActionResult LoadMonthEvents(string ido)
        {
            var qs = ControllerContext.HttpContext.Request.QueryString;
            var url = string.Format("load/{0}{1}", ido, qs);

            try
            {
                var jresp = JsonConvert.DeserializeObject<LoadCollectionMGResponse>(_httpService.SendGetRequest(url));

                if (!bool.Parse(jresp.Success))
                    throw new Exception(jresp.Message);

                List<object> list = new List<object>();
                List<MGEvent> evts = new List<MGEvent>();

                foreach (var evt in jresp.Items)
                {
                    MGEvent e = (evt as JObject).ToObject<MGEvent>();

                    //"20210101 00:00:00.000"
                    var startDate = ParseDateTime(e.StartDate);
                    //var endDate = e.EndDate == null ? ParseDateTime(e.StartDate) : ParseDateTime(e.EndDate);

                    var monthStart = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
                    var monthEnd = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.DaysInMonth(DateTime.Now.Year, DateTime.Now.Month));

                    if (startDate.Date > monthStart.Date && startDate < monthEnd.Date)
                    {
                        evts.Add(e);
                    }
                }

                evts.OrderBy(evts => evts.StartDate).ToList().ForEach(v => list.Add(v));
                jresp.Items = list;

                return Ok(jresp);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message.ToString() });
            }
        }

        private DateTime ParseDateTime(string input)
        {
            //"20210101 00:00:00.000"
            var date = input.Split(" ")[0];
            var time = input.Split(" ")[1];

            int year = int.Parse(date.Substring(0, 4));
            int month = int.Parse(date.Substring(4, 2));
            int day = int.Parse(date.Substring(6, 2));

            int hr = int.Parse(time.Substring(0, 2));
            int min = int.Parse(date.Substring(3, 2));

            return new DateTime(year, month, day, hr, min, 0);
        }
    }

    
}
