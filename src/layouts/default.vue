<script setup lang="ts">
</script>

<template>
  <n-layout position="absolute">
    <n-loading-bar-provider>
      <n-layout-header inverted id="header">
        <n-space :size="0" justify="start" align="center">
          <n-h2>
            <n-text class="title">whalter's whisky's</n-text>
          </n-h2>
          <main-menu id="menu" />
        </n-space>
        <n-space justify="end" align="center">
          <!-- <n-button text>
              <n-icon>
                <carbon-refresh />
              </n-icon>
          </n-button>-->
        </n-space>
      </n-layout-header>
      <n-layout-content position="absolute" id="content">
        <n-message-provider>
          <router-view />
        </n-message-provider>
      </n-layout-content>
    </n-loading-bar-provider>
  </n-layout>
</template>

<style lang="scss">
$header: 48px;
$footer: 45px;

#header {
  $padding-y: 20px;
  height: $header;
  padding-top: 5px;
  padding-left: $padding-y;
  padding-right: $padding-y;
  // padding: 20px;
}

.title {
  align-self: center;
  justify-content: center;
  align-items: center;
  color: #fff;
}

#menu {
  justify-content: center;
  align-self: center;
  align-items: center;
  margin-bottom: 10px;
}

#content {
  top: $header;
  bottom: $footer;
  padding: 5px;
}

#footer {
  height: $footer;
}
</style>
