using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Services
{
    public interface IHttpService
    {
        public void SetBaseUrl(string url);

        public string GetToken();

        public string SendGetRequest(string url);
    }
}
