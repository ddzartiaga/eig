new Vue({
    el: '#page',
    data: {
        eventId: null,
        eventInfo: null,
        eventBanner: null,
    },
    methods: {
        parseDateTime: function (input) {
            var year = input.substring(0, 4);
            var month = input.substring(4, 6);
            var day = input.substring(6, 8);

            var hour = input.substring(9, 11);
            var minute = input.substring(12, 14);

            return month + '/' + day + '/' + year + ' ' + hour + ':' + minute;
        }
    },
    created() {
        this.eventId = document.getElementById('eId').value;

        axios.get('https://localhost:44378/api/Mongoose/LoadCollection/ScheduledEvents?readonly=true&properties=Name,Details,Banner,Venue,StartDate,EndDate,EventStatus,JoinLink&filter=ScheduledEventId = ' + this.eventId)
            .then(response => {
                this.eventBanner = 'data:image/png;base64, ' + response.data.items[0].Banner;

                var rawEvent = response.data.items[0];

                var sDate = this.parseDateTime(rawEvent.StartDate);
                    var eDate = null;
                    if (rawEvent.EndDate !== null) {
                        eDate = this.parseDateTime(rawEvent.EndDate);
                    }

                    var evt = { ...rawEvent, StartDate: sDate, EndDate: eDate };  // deconstruct and add GroupName property

                    this.eventInfo = evt;
                }
            )
            .catch(error => console.log('<event-details>' + error))
    }
});