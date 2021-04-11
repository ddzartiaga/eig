
let InterestGroupItemComponent = {
    template: '#interest-group-logo-template',
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


new Vue({
    el: '#home-groups',
    components: {
        'interest-group-item': InterestGroupItemComponent,
    },
    data: {
        groups: null,
    },
    created() {
        axios.get('https://localhost:44378/api/Mongoose/LoadCollection/InterestGroups?properties=GroupId,Name,Description,Logo')
            .then(response => {
                this.groups = response.data.items;
                console.log(this.groups);
            }
            )
            .catch(error => console.log('home.js', error.message));
    },
});