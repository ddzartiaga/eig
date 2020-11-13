new Vue({
    el: '#page',
    data: {
        groupId: null,
        info: null,
        faqs: null,
        galleries: null,
        logo: null,
    },

    created() {
        this.groupId = document.getElementById('gId').value;
        
        axios.get('https://localhost:44378/api/Mongoose/LoadCollection/InterestGroups?readonly=true&properties=Name,Description,Logo&filter=GroupId = ' + this.groupId)
            .then(response => {
                this.info = response.data.items[0];
                this.logo = 'data:image/jpg;base64, ' + response.data.items[0].Logo;
                console.log( 'logo: ' +  this.logo );
                }
            )
            .catch(error => console.log('<interest-group-details>' + error))
    }
});