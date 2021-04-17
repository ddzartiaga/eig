
let InterestGroupItemComponent = {
    template: '#home-groups-item-template',
    props: ['group'],
    data() {
        return {
            detailUrl: '/Groups/Details/' + this.group.GroupId,
            logo: 'data:image/png;base64, ' + this.group.Logo,
            name: this.group.Name,
            description: this.group.Description
        }
    }
};

let GroupEventsItemComponent = {
    template: '#home-events-item-template',
    props: ['evt'],
    data() {
        return {
            detailsUrl: '/Activities/Details/' + this.evt.scheduledEventId,
            banner: 'data:image/jpg;base64, ' + this.evt.banner,
            venue: this.evt.Venue == null ? 'TBA' : this.evt.venue,
            duration: this.evt.startDate,
        }
    }
};


new Vue({
    el: '#page',
    components: {
        'home-groups-item': InterestGroupItemComponent,
        'home-events-item': GroupEventsItemComponent,
    },
    data: {
        groups: null,
        groupKeyValue: [],
        events: [],
    },
    methods: {
        getDateRange: function () {
            var today = new Date();
            var numDays = new Date(today.getFullYear(), today.getMonth(), 0).getDate();

            return numDays;
        },
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
        var baseUrl = 'http://phmavwifc.infor.com:5000/api/Mongoose/';
        axios.get(baseUrl + 'LoadCollection/InterestGroups?properties=GroupId,Name,Description,Logo')
        .then(response => {
                    this.groups = response.data.items;

                    // save the group id-name pair
                    for (i = 0; i < this.groups.length; i++) {
                        this.groupKeyValue.push({ id: this.groups[i].GroupId, name: this.groups[i].Name });
                    }

                    // load events after the groups
            axios.get(baseUrl + 'LoadMonthEvents/ScheduledEvents?properties=ScheduledEventId,GroupId,Name,Banner,StartDate,EndDate,Venue&filter=&orderBy=StartDate')
                        .then(response => {
                            var rawEvents = response.data.items;
                            
                            for (e = 0; e < rawEvents.length; e++) {
                                    var grpName = this.groupKeyValue.find( ({ id }) => id === rawEvents[e].groupId ).name;   

                                    var sDate = this.parseDateTime( rawEvents[e].startDate );
                                    var eDate = null;
                                    if(rawEvents[e].endDate !== null) {
                                        eDate = this.parseDateTime( rawEvents[e].endDate );
                                    }
                                
                                    var evt = { ...rawEvents[e], groupName: grpName, startDate: sDate, endDate: eDate };  // deconstruct and add GroupName property
                                    this.events.push(evt);  // push to events array
                            }
                            console.log(this.events);
                        }
                    )
                    .catch(error => console.log('home-events' + error.message));
                }
        )
        .catch(error => console.log('home-groups', error.message));
    },
});