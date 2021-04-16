
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
    methods: {
        getDateRange: function () {
            var today = new Date();
            var numDays = new Date(today.getFullYear(), today.getMonth(), 0).getDate();

            return numDays;
        }
    },
    created() {
        var numDays = this.getDateRange();
        // TODO: filter by date
        axios.get('https://localhost:44378/api/Mongoose/LoadCollection/ScheduledEvents?properties=ScheduledEventId,Name,Banner,StartDate,EndDate,Venue&filter=&orderBy=StartDate')
            .then(response => {
                this.events = response.data.items;
                console.log(response.data);
                }
            )
            .catch(error => console.log('<activities-list>' + error))
    },
});