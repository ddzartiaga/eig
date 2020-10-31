using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web.Models;

namespace Web.Services
{
    public class MGHttpService : IHttpService
    {
        MongooseSettings _settings;
        RestClient _client;
        string _token;

        public MGHttpService(IOptions<MongooseSettings> settings)
        {
            _settings = settings.Value;
            _client = new RestClient(_settings.BaseUrl);
        }

        public void SetBaseUrl(string url)
        {
            _client = new RestClient(url);
            _token = string.Empty;
        }


        public string GetToken()
        {
            if(string.IsNullOrWhiteSpace(_token))
            {
                // acquire token from token generator service
                var request = new RestRequest(string.Format("token/{0}/{1}/{2}", _settings.Config, _settings.UserName, _settings.UserPass), DataFormat.Json);
                var response = _client.Get(request);

                _token = JObject.Parse(response.Content).Value<string>("Token");
            }

            return _token;
        }

        public string SendGetRequest(string url)
        {
            string token = GetToken();
            if (string.IsNullOrEmpty(token))
                throw new Exception("Problem with getting token");

            var req = new RestRequest(url, DataFormat.Json)
                .AddHeader("Authorization", token)
                .AddHeader("X-Infor-MongooseConfig", _settings.Config);

            return _client.Get(req).Content;
        }
    }
}
