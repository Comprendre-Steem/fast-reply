<template>
  <div class="columns" id="inbox">
    <MessageFeed></MessageFeed>
    <MessagePane></MessagePane>
  </div>
</template>

<script>
import MessageFeed from '@/components/inbox/MessageFeed'
import MessagePane from '@/components/inbox/MessagePane'
export default {
  name: 'inbox',
  components: { MessageFeed, MessagePane }
}
</script>

<style scoped>

</style>
