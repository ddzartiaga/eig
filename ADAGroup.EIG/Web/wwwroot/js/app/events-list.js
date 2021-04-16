
let GroupEventsItemComponent = {
    template: '#group-events-item-template',
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
    el: '#page',
    components: {
        'group-events-item': GroupEventsItemComponent,
    },
    data: {
        events: [],
        groupKeyValue: [],
    },
    methods: {
        parseDateTime: function (input) {
            var year = input.substring(0, 4);
            var month = input.substring(4, 6);
            var day = input.substring(6, 8);

            var hour = input.substring(9, 11);
            var minute = input.substring(12, 14);

            return month + '/' + day + '/' + year + ' ' + hour + ':' + minute;
        },
    },
    created() {
        axios.get('https://localhost:44378/api/Mongoose/LoadCollection/InterestGroups?properties=GroupId,Name')
            .then(response => {
                    var grps = response.data.items;

                    // save the group id-name pair
                    for (i = 0; i < grps.length; i++) {
                        this.groupKeyValue.push({ id: grps[i].GroupId, name: grps[i].Name });
                    }

                    // load events after the groups
                axios.get('https://localhost:44378/api/Mongoose/LoadCollection/ScheduledEvents?properties=ScheduledEventId,GroupId,Name,StartDate,EndDate,Venue,Details,Banner&orderBy=StartDate')
                    .then(response => {
                            var rawEvents = response.data.items;
                            
                            for (e = 0; e < rawEvents.length; e++) {
                                    console.log(rawEvents[e].GroupId);
                                    var grpName = this.groupKeyValue.find( ({ id }) => id === rawEvents[e].GroupId ).name;   

                                    var sDate = this.parseDateTime( rawEvents[e].StartDate );
                                    var eDate = null;
                                    if(rawEvents[e].EndDate !== null) {
                                        eDate = this.parseDateTime( rawEvents[e].EndDate );
                                    }
                                
                                    var evt = { ...rawEvents[e], GroupName: grpName, StartDate: sDate, EndDate: eDate };  // deconstruct and add GroupName property
                                    this.events.push(evt);  // push to events array
                                }
                            }
                    )
                    .catch(error => console.log('<activities-list>' + error));
                }
            )
            .catch(error => console.log('home-groups', error.message));
    },
});