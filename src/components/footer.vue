<template>
  <div id="footer">
    <span>© 2023 zlxzs.xyz </span>
    <a target="_blank" href="https://beian.miit.gov.cn">浙ICP备2023020918号</a> 
    <span class="icon"><IconRabbit theme="outline" size="14" fill="#000000"/></span>
    <span>
      <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        viewBox="0 0 500 200" style="enable-background:new 0 0 500 200;" xml:space="preserve">
        <g>
          <polyline class="ekg" points="446.6,133.8 328.2,133.8 310.3,152.3 296,90.7 246.8,147.4 241.6,140.2 233.9,186.4 227,47.6 
            213.2,138.3 211.8,132.3 205.1,146.1 198.2,128.5 194.1,144.4 184.5,112.9 174.1,133 100.3,133 "/>
        </g>
      </svg>
    </span>
  </div>
</template>

<script>
import { Rabbit as IconRabbit } from '@icon-park/vue-next'

export default {
  name: "Footer",
  components: {
    IconRabbit
  }
}
</script>

<style lang="scss" scoped>
#footer {
  background-color: white;
  height: 50px;
  text-align: center;
  line-height: 50px;
}

a:link {
  text-decoration: none;
  color: black;
}

a:visited {
  text-decoration: none;
  color: black;
}

a:hover {
  text-decoration: underline;
  color: black;
}

a:active {
  text-decoration: underline;
  color: black;
}
.icon {
  margin-left: 5px;
}

svg {
  max-width: 50px;
}

svg .ekg {
  fill: none;
  stroke: #000;
  stroke-width: 16;
  stroke-linecap: round;
  stroke-linejoin: miter;
  opacity: 0;
  stroke-dashoffset: 1000;
  stroke-dasharray: 1000;
  animation: ekg 3s linear forwards infinite;
}

@keyframes ekg {
  0% {
    opacity: 0;
  }
  25% {
    opacity: 1;
  }
  50% {
    stroke-dashoffset: 2000;
  }
  99% {
    opacity: 0;
    stroke-dashoffset: 3000;
  }
  100% {
    stroke-dashoffset: 1000;
  }
}
</style>
