
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
        var baseUrl = 'http://phmavwifc.infor.com:5000/api/Mongoose/';
        axios.get(baseUrl + 'LoadCollection/InterestGroups?properties=GroupId,Name')
            .then(response => {
                    var grps = response.data.items;

                    // save the group id-name pair
                    for (i = 0; i < grps.length; i++) {
                        this.groupKeyValue.push({ id: grps[i].GroupId, name: grps[i].Name });
                    }

                // load events after the groups. filtering and sorting is done in api level for now (workaround) since MG does not support filter by date yet
                axios.get(baseUrl + 'LoadUpcomingEvents/ScheduledEvents?properties=ScheduledEventId,GroupId,Name,StartDate,EndDate,Venue,Details,Banner')
                    .then(response => {
                            var rawEvents = response.data.items;
                            
                            for (e = 0; e < rawEvents.length; e++) {
                                    var grpName = this.groupKeyValue.find( ({ id }) => id === rawEvents[e].groupId ).name;   

                                    var sDate = this.parseDateTime( rawEvents[e].startDate );
                                    var eDate = null;
                                    if(rawEvents[e].endDate !== null) {
                                        eDate = this.parseDateTime( rawEvents[e].endDate );
                                    }

                                    var eBanner = null;
                                    if (rawEvents[e].banner !== null) {
                                        eBanner = 'data:image/jpg;base64, ' + rawEvents[e].banner;
                                    }
                                
                                    var evt = { ...rawEvents[e], banner: eBanner, groupName: grpName, startDate: sDate, endDate: eDate };  // deconstruct and add GroupName property
                                    this.events.push(evt);  // push to events array
                                }
                            }
                    )
                    .catch(error => console.log('event-list.js upcoming events' + error));
                }
            )
            .catch(error => console.log('event-list.js group', error.message));
    },
});