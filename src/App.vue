<template>
  <hbox :ratio="['30%', '30%','40%']">
    <vbox :ratio="['30%', '70%']">
      <box background="#111" color="white">
        {{ text }} 1
      </box>
      <box background="#222" color="white">
        {{ text }} 2
      </box>
    </vbox>
    <vbox :ratio="['60%', '40%']">
      <hbox :ratio="['70%', '30%']">
        <box background="#333" color="white" font="40px arial">
          {{ text }} 3
        </box>
        <box background="#444" color="white" font="20px arial">
          {{ text }} 4
        </box>
      </hbox>
      <box background="#555" color="white">
        {{ text }} 5
      </box>
    </vbox>
    <box background="#666" color="white">
      {{ text }} 6
    </box>
  </hbox>
</template>

<script>
/* eslint-disable no-console */
// import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'app',
  components: {
    // HelloWorld
  },
  data () {
    return {
      text: 'test',
      onLoad () {
        console.log(this, arguments)
      }
    }
  },
  mounted () {
    console.log('Hello Vue!')
    let id = 0
    setInterval(() => {
      this.text = 'text ' + (id++)
    }, 500)
  }
}
</script>

<style>
</style>
