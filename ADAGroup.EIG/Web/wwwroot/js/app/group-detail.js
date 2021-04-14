
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
        faqs: null,
        officers: null,
        events: null,
        galleries: null,
    },

    created() {
        this.groupId = document.getElementById('gId').value;

        var baseUrl = 'https://localhost:44378/api/Mongoose/LoadCollection/';
        var filterById = '&filter=GroupId = ' + this.groupId;

        // group information
        axios.get(baseUrl + 'InterestGroups?readonly=true&properties=Name,Description,MIssion,GoalAndPurpose,Logo' + filterById)
            .then(response => {
                    this.details = response.data.items[0];
                    this.logo = 'data:image/jpg;base64, ' + this.details.Logo;
                }
            )
            .catch(error => console.log('group-detail.js - [GroupInfo]' + error));

        // faqs
        axios.get(baseUrl + 'GroupFAQs?readonly=true&properties=Question,Answer' + filterById)
            .then(response => {
                this.faqs = response.data.items;

                setTimeout(() => {
                    $(document).ready(function () {

                        const Accordion = {
                            settings: {
                                // Expand the first item by default
                                first_expanded: false,
                                // Allow items to be toggled independently
                                toggle: false
                            },

                            openAccordion: function (toggle, content) {
                                if (content.children.length) {
                                    toggle.classList.add("is-open");
                                    let final_height = Math.floor(content.children[0].offsetHeight);
                                    content.style.height = final_height + "px";
                                }
                            },

                            closeAccordion: function (toggle, content) {
                                toggle.classList.remove("is-open");
                                content.style.height = 0;
                            },

                            init: function (el) {
                                const _this = this;

                                // Override default settings with classes
                                let is_first_expanded = _this.settings.first_expanded;
                                if (el.classList.contains("is-first-expanded")) is_first_expanded = true;
                                let is_toggle = _this.settings.toggle;
                                if (el.classList.contains("is-toggle")) is_toggle = true;

                                // Loop through the accordion's sections and set up the click behavior
                                const sections = el.getElementsByClassName("accordion");
                                const all_toggles = el.getElementsByClassName("accordion-head");
                                const all_contents = el.getElementsByClassName("accordion-body");
                                for (let i = 0; i < sections.length; i++) {
                                    const section = sections[i];
                                    const toggle = all_toggles[i];
                                    const content = all_contents[i];

                                    // Click behavior
                                    toggle.addEventListener("click", function (e) {
                                        if (!is_toggle) {
                                            // Hide all content areas first
                                            for (let a = 0; a < all_contents.length; a++) {
                                                _this.closeAccordion(all_toggles[a], all_contents[a]);
                                            }

                                            // Expand the clicked item
                                            _this.openAccordion(toggle, content);
                                        } else {
                                            // Toggle the clicked item
                                            if (toggle.classList.contains("is-open")) {
                                                _this.closeAccordion(toggle, content);
                                            } else {
                                                _this.openAccordion(toggle, content);
                                            }
                                        }
                                    });

                                    // Expand the first item
                                    if (i === 0 && is_first_expanded) {
                                        _this.openAccordion(toggle, content);
                                    }
                                }
                            }
                        };

                        (function () {
                            // Initiate all instances on the page
                            const accordions = document.getElementsByClassName("accordions");
                            for (let i = 0; i < accordions.length; i++) {
                                Accordion.init(accordions[i]);
                            }
                        })();


                    });

                }, 2000);
                
            }
            )
            .catch(error => console.log('group-detail.js - [GroupFAQs]' + error));

        // officers
        axios.get(baseUrl + 'EIGOfficers?readonly=true&properties=Name,Role,Email&filter=GroupID = ' + this.groupId)
            .then(response => {
                this.officers = response.data.items;
            }
            )
            .catch(error => console.log('group-detail.js - [GroupOfficers]' + error));


        // group events
        axios.get(baseUrl + 'ScheduledEvents?readonly=true&properties=ScheduledEventId,Banner,Name,StartDate,EndDate,Venue,Details&filter=&orderBy=StartDate' + filterById)
            .then(response => {
                this.events = response.data.items;
            }
            )
            .catch(error => console.log('group-detail.js - [GroupEvents]' + error));


        
    }
});