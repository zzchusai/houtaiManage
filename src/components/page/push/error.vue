<template>
    <div class="main pr30">
        <div class="tc mr30 pr30">
            <img v-if="type == 1" style="margin-top: 100px; width:300px;height: 300px;" src="../../../../static/img/none-program.png" />
            <img v-else style="margin-top: 100px; width:300px;height: 300px;" src="../../../../static/img/none.png" />
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                type:0,//type为1该节目未上架
            }
        },
        created() {
            this.render();
        },
        components: {
        },
        methods: {
            render() {
                let self = this;
                if(window.navigator.onLine==false) {
                   this.$router.push('/outline')
                    return false;
                  }
                if(self.$route.query.type == 1){
                    self.type = self.$route.query.type;
                }

            }
        }
    }
</script>
