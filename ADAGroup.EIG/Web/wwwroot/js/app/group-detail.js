
let GroupInfoComponent = {
    template: '#interest-group-item-template',
    props: ['group'],
    data() {
        console.log(this.group);
        return {};
    },
    

}

let GroupFAQsComponent = {
    template: '#interest-group-faq-item-template',
    props: ['faq'],
    data() {
        return {
            question: this.faq.Question,
            answer: this.faq.Answer,
        }
    }
}

let GroupEventsItemComponent = {
    template: '#group-events-item-template',
    props: ['evt'],
    data() {
        return {
            name: this.evt.Name,
            detailsUrl: '/Activities/Details/' + this.evt.ScheduledEventId,
            banner: 'data:image/jpg;base64, ' + this.evt.Banner,
            venue: this.evt.Venue == null ? 'TBA' : this.evt.Venue,
            duration: this.evt.StartDate,
            details: this.evt.Details,
        }
    }
};

let GroupOfficersItemComponent = {
    template: '#interest-group-officers-template',
    props: ['officer'],
    data() {
        return {
            picture: 'data:image/jpg;base64, ' ,
            name: this.officer.Name,
            role: this.officer.Role,
            email: this.officer.Email,
        }
    }
};


new Vue({
    el: '#page',
    components: {
        'interest-group-item': GroupInfoComponent,
        'interest-group-faq-item': GroupFAQsComponent,
        'group-events-item': GroupEventsItemComponent,
        'group-officers-item': GroupOfficersItemComponent,
    },
    data: {
        groupId: null,
        details: null,
        logo: null,
        banner: null,
        faqs: null,
        officers: [],
        events: [],
        galleries: null,
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
        this.groupId = document.getElementById('gId').value;

        var baseUrl = 'http://phmavwifc.infor.com:5000/api/Mongoose/LoadCollection/';
        var filterById = '&filter=GroupId = ' + this.groupId;

        // group information
        axios.get(baseUrl + 'InterestGroups?readonly=true&properties=Logo,Banner,Name,Description,MIssion,GoalAndPurpose,JoinLink,Details' + filterById)
            .then(response => {
                    this.details = response.data.items[0];
                    this.logo = 'data:image/jpg;base64, ' + this.details.Logo;
                    this.banner = 'data:image/jpg;base64, ' + this.details.Banner;
                }
            )
            .catch(error => console.log('group-detail.js - [GroupInfo]' + error));


        // officers
        axios.get(baseUrl + 'EIGOfficers?readonly=true&properties=Name,ProfilePic,Role,Email&filter=GroupID = ' + this.groupId)
            .then(response => {
                    var rawOffcr = response.data.items;
                            
                    for (e = 0; e < rawOffcr.length; e++) {
                            var pic = null;
                            if(rawOffcr[e].ProfilePic !== null) {
                                pic = 'data:image/jpg;base64, ' + rawOffcr[e].ProfilePic;
                            } else {
                                pic = '/images/profile-picture.jpg';
                            }
                                
                            var officer = { ...rawOffcr[e], ProfilePic: pic };  // deconstruct and add ProfilePic property
                            this.officers.push(officer);  // push to events array
                        }
                    }
            )
            .catch(error => console.log('group-detail.js - [GroupOfficers]' + error));


        // group events
        axios.get(baseUrl + 'ScheduledEvents?readonly=true&properties=ScheduledEventId,Banner,Name,StartDate,EndDate,Venue,Details&orderBy=StartDate' + filterById)
            .then(response => {
                    var rawEvents = response.data.items;
                            
                    for (e = 0; e < rawEvents.length; e++) {

                            var sDate = this.parseDateTime( rawEvents[e].StartDate );
                            var eDate = null;
                            if(rawEvents[e].EndDate !== null) {
                                eDate = this.parseDateTime( rawEvents[e].EndDate );
                            }
                                
                            var evt = { ...rawEvents[e], StartDate: sDate, EndDate: eDate };  // deconstruct and add GroupName property
                            this.events.push(evt);  // push to events array
                        }
                    }
            )
            .catch(error => console.log('group-detail.js - [GroupEvents]' + error));
    }
});