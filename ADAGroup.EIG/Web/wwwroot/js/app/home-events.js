
let GroupEventsItemComponent = {
    template: '#home-events-item-template',
    props: ['evt'],
    data() {
        return {
            detailsUrl: '/Activities/Details/' + this.evt.ScheduledEventId,
            banner: 'data:image/jpg;base64, ' + this.evt.Banner,
            venue: this.evt.Venue == null ? 'TBA' : this.evt.Venue,
            duration: this.evt.StartDate,
        }
    }
};


new Vue({
    el: '#home-events',
    components: {
        'home-events-item': GroupEventsItemComponent,
    },
    data: {
        events: null,
    },
    created() {
        axios.get('https://localhost:44378/api/Mongoose/LoadCollection/ScheduledEvents?properties=ScheduledEventId,Name,StartDate,EndDate,Venue,Details,Banner')
            .then(response => {
                    this.events = response.data.items;
                }
            )
            .catch(error => console.log('<activities-list>' + error))

        //TODO: get featured events from server using axios
    },
});