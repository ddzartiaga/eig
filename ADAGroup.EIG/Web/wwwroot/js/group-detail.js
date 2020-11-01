


new Vue({
    el: '#page',
    data: {
        groupId: null,
        info: null,
        faqs: null,
        galleries: null,
    },

    created() {
        this.groupId = document.getElementById('gId').value;

        //TODO
        axios.get('https://localhost:44378/api/Mongoose/LoadCollection/InterestGroups?properties=GroupId,Name,Description')
            .then(response => {
                    // TODO, assign value to info
                }
            )
            .catch(error => console.log('<interest-group-details>' + error))
    }
});