﻿
let InterestGroupItemComponent = {
    template: '#interest-group-logo-template',
    props: ['group'],
    data() {
        return {
            detailUrl: '/Groups/Details/' + this.group.GroupId,
            logo: 'data:image/png;base64, ' + this.group.Logo,
            name: this.group.Name
        }
    }
};


new Vue({
    el: '#page',
    components: {
        'interest-group-item': InterestGroupItemComponent,
    },
    data: {
        groups: null,
    },
    created() {
        axios.get('https://localhost:44378/api/Mongoose/LoadCollection/InterestGroups?properties=GroupId,Name,Logo')
            .then(response => {
                    this.groups = response.data.items;
                }
            )
            .catch(error => console.log('home.js', error.message))

        //TODO: get featured events from server using axios
    },
});