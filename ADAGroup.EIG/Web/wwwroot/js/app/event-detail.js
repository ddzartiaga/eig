new Vue({
    el: '#page',
    data: {
        eventId: null,
        eventInfo: null,
        eventBanner: null,
    },

    created() {
        this.eventId = document.getElementById('eId').value;

        axios.get('https://localhost:44378/api/Mongoose/LoadCollection/ScheduledEvents?readonly=true&properties=Name,Details,Banner,Venue,StartDate,EndDate,EventStatus&filter=ScheduledEventId = ' + this.eventId)
            .then(response => {
                this.eventInfo = response.data.items[0];
                this.eventBanner = 'data:image/png;base64, ' + response.data.items[0].Banner;
                console.log('logo: ' + this.eventBanner);
            }
            )
            .catch(error => console.log('<event-details>' + error))
    }
});