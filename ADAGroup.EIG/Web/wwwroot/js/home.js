﻿
//TODO: add component for featured events
//let InterestGroupItemComponent = {
//    template: '#interest-group-item-template',
//    props: ['group'],
//    data() {
//        return {
//            detailUrl: '/Groups/Details/' + this.group.GroupId,
//        }
//    }
//};

let InterestGroupItemComponent = {
    template: '#interest-group-item-template',
    props: ['group'],
    data() {
        return {
            detailUrl: '/Groups/Details/' + this.group.GroupId,
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
        axios.get('https://localhost:44378/api/Mongoose/LoadCollection/InterestGroups?properties=GroupId,Name,Description')
            .then(response => {
                    this.groups = response.data.items;
                    console.log(this.groups);
                }
            )
            .catch(error => console.log('<interest-groups>' + error))

        //TODO: get featured events from server using axios
    },
});